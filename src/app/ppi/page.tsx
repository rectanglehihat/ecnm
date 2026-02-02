import CpiTopLevelButtons from '@/components/cpi/CpiTopLevelButtons';
import { fetchCpiItemCodes } from '@/lib/cpi/fetchCpiItemCodes';
import { handleError } from '@/lib/errors';

export default async function PpiPage() {
	let hierarchy;

	try {
		hierarchy = await fetchCpiItemCodes('901Y113');
	} catch (error) {
		// 에러가 발생하면 Next.js의 error.tsx로 전파
		throw handleError(error, 'PpiPage');
	}

	if (!hierarchy) {
		return <div className="text-red-500">❌ 데이터 조회 실패</div>;
	}
	console.log('222 hierarchy', hierarchy);

	return (
		<main className="space-y-8">
			<h1 className="text-xl font-bold sm:text-2xl m-0">부동산가격지수(PPI)</h1>
			<section className="py-6 sm:py-10">
				<div className="flex flex-col gap-2 rounded-lg bg-gray-200 p-4 text-sm text-gray-600 sm:p-5 sm:text-base">
					종합
				</div>
			</section>

			<section>
				<CpiTopLevelButtons data={hierarchy} />
			</section>
		</main>
	);
}

PpiPage.displayName = 'PpiPage';
