import DynamicSection from '@/components/cpi/DynamicSection';
import ChartSkeleton from '@/components/charts/ChartSkeleton';
import { Suspense } from 'react';
import { useCpiItemCodes } from '@/hooks/cpi/useCpiItemCodes';
import HierarchyButtons from '@/components/cpi/HierarchyButtons';

interface PageProps {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ code?: string; name?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
	const { code } = await params;
	const hierarchy = await useCpiItemCodes('901Y009', code);
	const queryParams = await searchParams;

	if (!hierarchy) return <div className="text-red-500">❌ 데이터 조회 실패</div>;
	if (!('children' in hierarchy) || !hierarchy.children || typeof hierarchy.children !== 'object') return <div className="text-red-500">❌ 계층 데이터 구조 오류</div>;
	
	const childKeys = Object.keys(hierarchy.children);
	const parentCode = queryParams.code && queryParams.code in hierarchy.children ? queryParams.code : childKeys[0];
	const parentItem = hierarchy.children[parentCode];

	if (!parentItem) return <div className="text-red-500">❌ 카테고리 데이터 조회 실패</div>;

	return (
		<>
			<h1 className="text-2xl font-bold">{hierarchy.name}</h1>
			<HierarchyButtons children={hierarchy.children} />

			{Object.values(parentItem.children).map((childItem) => {
				const childItemCodes = childItem.children ? Object.values(childItem.children).map((item) => item.code) : [];

				if (childItemCodes.length === 0) return null;

				return (
					<Suspense
						key={childItem.code}
						fallback={
							<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
								<h2 className="text-lg font-semibold mb-4">{childItem.name}</h2>
								<ChartSkeleton />
							</section>
						}
					>
						<DynamicSection
							itemCodes={childItemCodes}
							name={childItem.name}
						/>
					</Suspense>
				);
			})}
		</>
	);
}

Page.displayName = 'DynamicCodePage';
