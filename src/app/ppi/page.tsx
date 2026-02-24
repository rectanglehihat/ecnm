import PpiTopLevelButtons from '@/components/ppi/PpiTopLevelButtons';
import { CODE_PPI } from '@/const/BOK_CODE';
import { fetchCpiItemCodes } from '@/lib/cpi/fetchCpiItemCodes';
import { handleError } from '@/lib/errors';
import { fetchPpiItemCodes } from '@/lib/ppi/fetchPpiItemCodes';
import fetchPpiStatisticTableList from '@/lib/ppi/fetchPpiStatisticTableList';

export default async function PpiPage() {
	let hierarchy;
	let topPpiCode;

	try {
		hierarchy = await fetchPpiItemCodes(CODE_PPI);
	} catch (error) {
		// 에러가 발생하면 Next.js의 error.tsx로 전파
		throw handleError(error, 'PpiPage');
	}

	try {
		topPpiCode = await fetchPpiStatisticTableList(CODE_PPI);
	} catch (error) {
		handleError(error, 'PpiPage');
		topPpiCode = null;
	}

	if (!hierarchy || !topPpiCode) {
		return <div className="text-red-500">❌ 데이터 조회 실패</div>;
	}

	return (
		<main className="space-y-8">
			<h1 className="text-xl font-bold sm:text-2xl m-0 pb-10">부동산가격지수(PPI)</h1>

			<section>
				{/* <PpiTopLevelButtons data={hierarchy} /> */}
				<PpiTopLevelButtons data={topPpiCode} />
			</section>
		</main>
	);
}

PpiPage.displayName = 'PpiPage';
