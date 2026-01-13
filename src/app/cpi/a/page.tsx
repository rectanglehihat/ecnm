import DynamicSection from '@/components/cpi/DynamicSection';
import ChartSkeleton from '@/components/charts/ChartSkeleton';
import { Suspense } from 'react';
import { useCpiItemCodes } from '@/hooks/cpi/useCpiItemCodes';
import HierarchyButtons from '@/components/cpi/HierarchyButtons';

interface APageProps {
	searchParams: Promise<{ code?: string; name?: string }>;
}

const APage = async ({ searchParams }: APageProps) => {
	const aHierarchy = await useCpiItemCodes('901Y009', 'A');
	const params = await searchParams;

	console.log('❤️ aHierarchy', aHierarchy);
	console.log('🍑 params', params);

	if (!aHierarchy) return <div className="text-red-500">❌ 데이터 조회 실패</div>;

	// 첫 번째 레벨: params.code가 있으면 해당 항목, 없으면 첫 번째 자식 사용
	const parentCode = params.code || Object.keys(aHierarchy.children)[0];
	const parentItem = aHierarchy.children[parentCode];

	if (!parentItem) {
		return <div className="text-red-500">❌ 카테고리 데이터 조회 실패</div>;
	}

	console.log('!!!!!! parentCode', parentCode);
	console.log('!!!!!! parentItem', parentItem);

	return (
		<>
			<h1 className="text-2xl font-bold">{aHierarchy.name}</h1>
			<HierarchyButtons children={aHierarchy.children} />

			{Object.values(parentItem.children).map((childItem) => {
				const childItemCodes = childItem.children ? Object.values(childItem.children).map((item) => item.code) : [];

				if (childItemCodes.length === 0) {
					return null;
				}

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
};

export default APage;
