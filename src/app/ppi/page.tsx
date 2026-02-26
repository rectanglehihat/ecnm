import PpiTopLevelButtons from '@/components/ppi/PpiTopLevelButtons';
import { fetchPpiItemCodes } from '@/lib/ppi/fetchPpiItemCodes';
import { handleError } from '@/lib/errors';
import { CODE_PPI } from '@/const/BOK_CODE';

export default async function PpiPage() {
	let hierarchy;

	try {
		hierarchy = await fetchPpiItemCodes(CODE_PPI);
	} catch (error) {
		// 에러가 발생하면 Next.js의 error.tsx로 전파
		throw handleError(error, 'PpiPage');
	}

	if (!hierarchy) {
		return <div className="text-red-500">❌ 데이터 조회 실패</div>;
	}

	return (
		<main className="space-y-8">
			<h1 className="text-xl font-bold sm:text-2xl m-0">부동산가격지수(PPI)</h1>

			<section>
				<PpiTopLevelButtons data={hierarchy} />
			</section>
		</main>
	);
}

PpiPage.displayName = 'PpiPage';
