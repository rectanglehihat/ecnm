import ChartSkeleton from '@/components/charts/ChartSkeleton';
import HierarchyButtons from '@/components/cpi/HierarchyButtons';
import PpiDynamicSection from '@/components/ppi/PpiDynamicSection';
import { handleError, ValidationError } from '@/lib/errors';
import { fetchPpiItemCodes } from '@/lib/ppi/fetchPpiItemCodes';
import { Suspense } from 'react';

interface PageProps {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ code?: string; name?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
	const { code } = await params;
	let hierarchy;

	try {
		hierarchy = await fetchPpiItemCodes('901Y113');
	} catch (error) {
		// 에러가 발생하면 Next.js의 error.tsx로 전파
		throw handleError(error, 'DynamicCodePage');
	}

	if (!hierarchy) {
		throw new ValidationError('데이터 조회 실패', {
			location: 'DynamicCodePage',
			userMessage: '요청한 PPI 데이터를 찾을 수 없습니다.',
			metadata: { code },
		});
	}

	const queryParams = await searchParams;

	return (
		<main className="space-y-6">
			<h1 className="text-xl font-bold sm:text-2xl">{queryParams.name}</h1>
			<HierarchyButtons>{hierarchy}</HierarchyButtons>

			{hierarchy?.map((childItem) => {
				const childItemCodes = childItem.children
					? Object.values(childItem.children).map((item) => item.ITEM_CODE)
					: [];

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
						<PpiDynamicSection
							itemCodes={childItemCodes}
							name={childItem.name}
							parentCode={code}
						/>
					</Suspense>
				);
			})}
		</main>
	);
}
