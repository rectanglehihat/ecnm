import { handleError } from '@/lib/errors';
import {
	CODE_PPI_Buying_2021_06,
	CODE_PPI_Buying_2025_03,
	CODE_PPI_Jeonse_2021_06,
	CODE_PPI_Jeonse_2025_03,
	CODE_PPI_monthly_rent_2021_06,
	CODE_PPI_monthly_rent_2025_03,
} from '@/const/BOK_CODE';
import PpiHierarchyButtons from '@/components/ppi/PpiHierarchyButtons';
import { fetchPpiStatisticTableLists, PpiStatisticTableListType } from '@/lib/ppi/fetchPpiStatisticTableList';

const PPI_MAIN_CODES = [
	CODE_PPI_Buying_2021_06,
	CODE_PPI_Buying_2025_03,
	CODE_PPI_Jeonse_2021_06,
	CODE_PPI_Jeonse_2025_03,
	CODE_PPI_monthly_rent_2021_06,
	CODE_PPI_monthly_rent_2025_03,
];

export default async function PpiPage() {
	let ppiItems: (PpiStatisticTableListType | null)[] = [];

	try {
		ppiItems = await fetchPpiStatisticTableLists(PPI_MAIN_CODES);
	} catch (error) {
		handleError(error, 'PpiPage');
		return <div className="text-red-500">❌ 데이터 조회 실패</div>;
	}

	const validItems = ppiItems.filter((item): item is PpiStatisticTableListType => Boolean(item));

	if (validItems.length !== PPI_MAIN_CODES.length) {
		return <div className="text-red-500">❌ 일부 데이터 조회 실패</div>;
	}

	return (
		<main className="space-y-8">
			<h1 className="text-xl font-bold sm:text-2xl m-0 pb-10">부동산가격지수(PPI)</h1>

			<section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
				{validItems.map((item) => (
					<PpiHierarchyButtons
						key={item.STAT_CODE}
						data={item}
					/>
				))}
			</section>
		</main>
	);
}

PpiPage.displayName = 'PpiPage';
