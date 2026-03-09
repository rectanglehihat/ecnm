import { handleError } from '@/lib/errors';
import { CODE_PPI_2021_06, CODE_PPI_2025_03 } from '@/const/BOK_CODE';
import PpiHierarchyButtons from '@/components/ppi/PpiHierarchyButtons';
import fetchPpiStatisticTableList from '@/lib/ppi/fetchPpiStatisticTableList';

export default async function PpiPage() {
	let topPpiCode_2021;
	let topPpiCode_2025;

	try {
		topPpiCode_2021 = await fetchPpiStatisticTableList(CODE_PPI_2021_06);
		topPpiCode_2025 = await fetchPpiStatisticTableList(CODE_PPI_2025_03);
	} catch (error) {
		handleError(error, 'PpiPage');
	}

	if (!topPpiCode_2021 || !topPpiCode_2025) {
		return <div className="text-red-500">❌ 데이터 조회 실패</div>;
	}

	return (
		<main className="space-y-8">
			<h1 className="text-xl font-bold sm:text-2xl m-0 pb-10">부동산가격지수(PPI)</h1>

			<section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
				<PpiHierarchyButtons data={topPpiCode_2021} />
				<PpiHierarchyButtons data={topPpiCode_2025} />
			</section>
		</main>
	);
}

PpiPage.displayName = 'PpiPage';
