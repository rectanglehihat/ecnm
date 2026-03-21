import ChartSkeleton from '@/components/charts/ChartSkeleton';
import PpiDynamicSection from '@/components/ppi/PpiDynamicSection';
import { handleError } from '@/lib/errors';
import { fetchPpiItemCodes } from '@/lib/ppi/fetchPpiItemCodes';
import { fetchPpiStatisticTableList } from '@/lib/ppi/fetchPpiStatisticTableList';
import { Suspense } from 'react';

interface PageProps {
	params: Promise<{ code: string }>;
}

export default async function Page({ params }: PageProps) {
	const { code } = await params;

	const [hierarchy, tableInfo] = await Promise.allSettled([
		fetchPpiItemCodes(code),
		fetchPpiStatisticTableList(code),
	]);

	if (hierarchy.status === 'rejected') {
		throw handleError(hierarchy.reason, 'DynamicPpiPage');
	}

	if (!hierarchy.value) {
		return <div className="text-red-500">❌ 데이터 조회 실패</div>;
	}

	const pageTitle =
		tableInfo.status === 'fulfilled' && tableInfo.value?.STAT_NAME
			? tableInfo.value.STAT_NAME
			: code;

	return (
		<main className="space-y-6">
			<h1 className="text-xl font-bold sm:text-2xl">{pageTitle}</h1>

			{hierarchy.value.map((childItem) => {
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
							parentCode={childItem.code}
						/>
					</Suspense>
				);
			})}
		</main>
	);
}
