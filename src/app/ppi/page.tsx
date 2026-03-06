import { handleError } from '@/lib/errors';
import { CODE_PPI_2021_06 } from '@/const/BOK_CODE';
import PpiHierarchyButtons from '@/components/ppi/PpiHierarchyButtons';
import fetchPpiStatisticTableList from '@/lib/ppi/fetchPpiStatisticTableList';

export default async function PpiPage() {
	let topPpiCode;

	try {
		topPpiCode = await fetchPpiStatisticTableList(CODE_PPI_2021_06);
	} catch (error) {
		handleError(error, 'PpiPage');
	}

	if (!topPpiCode) {
		return <div className="text-red-500">❌ 데이터 조회 실패</div>;
	}

	return (
		<main className="space-y-8">
			<h1 className="text-xl font-bold sm:text-2xl m-0 pb-10">부동산가격지수(PPI)</h1>

			<section>
				<PpiHierarchyButtons data={topPpiCode} />
			</section>
		</main>
	);
}

PpiPage.displayName = 'PpiPage';
