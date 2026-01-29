import DynamicSection from '@/components/cpi/DynamicSection';
import ChartSkeleton from '@/components/charts/ChartSkeleton';
import { Suspense } from 'react';
import { fetchCpiItemCodes } from '@/lib/cpi/fetchCpiItemCodes';
import HierarchyButtons from '@/components/cpi/HierarchyButtons';
import { handleError, ValidationError } from '@/lib/errors';

interface PageProps {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ code?: string; name?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
	const { code } = await params;
	let hierarchy;

	try {
		hierarchy = await fetchCpiItemCodes('901Y009', code);
	} catch (error) {
		// 에러가 발생하면 Next.js의 error.tsx로 전파
		throw handleError(error, 'DynamicCodePage');
	}

	const queryParams = await searchParams;

	if (!hierarchy) {
		throw new ValidationError('데이터 조회 실패', {
			location: 'DynamicCodePage',
			userMessage: '요청한 CPI 데이터를 찾을 수 없습니다.',
			metadata: { code },
		});
	}

	if (!('children' in hierarchy) || !hierarchy.children || typeof hierarchy.children !== 'object') {
		throw new ValidationError('계층 데이터 구조 오류', {
			location: 'DynamicCodePage',
			userMessage: 'CPI 데이터 구조가 올바르지 않습니다.',
			metadata: { code, hasChildren: 'children' in hierarchy },
		});
	}

	const childKeys = Object.keys(hierarchy.children);
	const parentCode = queryParams.code && queryParams.code in hierarchy.children ? queryParams.code : childKeys[0];
	const parentItem = hierarchy.children[parentCode];

	if (!parentItem) {
		throw new ValidationError('카테고리 데이터 조회 실패', {
			location: 'DynamicCodePage',
			userMessage: '요청한 카테고리를 찾을 수 없습니다.',
			metadata: { code, parentCode },
		});
	}

	return (
		<main className="space-y-6">
			<h1 className="text-xl font-bold sm:text-2xl">{hierarchy.name}</h1>
			<HierarchyButtons>{hierarchy.children}</HierarchyButtons>

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
		</main>
	);
}

Page.displayName = 'DynamicCodePage';
