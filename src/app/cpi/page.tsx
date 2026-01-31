import CpiTopLevelButtons from '@/components/cpi/CpiTopLevelButtons';
import { fetchCpiItemCodes } from '@/lib/cpi/fetchCpiItemCodes';
import { handleError } from '@/lib/errors';

export default async function CpiPage() {
	let hierarchy;

	try {
		hierarchy = await fetchCpiItemCodes('901Y009');
	} catch (error) {
		// 에러가 발생하면 Next.js의 error.tsx로 전파
		throw handleError(error, 'CpiPage');
	}

	if (!hierarchy) {
		return <div className="text-red-500">❌ 데이터 조회 실패</div>;
	}

	return (
		<main className="space-y-8">
			<h1 className="text-xl font-bold sm:text-2xl m-0">소비자물가지수(CPI)</h1>
			<section className="py-6 sm:py-10">
				<div className="flex flex-col gap-2 rounded-lg bg-gray-200 p-4 text-sm text-gray-600 sm:p-5 sm:text-base">
					<p className="font-semibold">🍎 2020=100</p>
					<ul className="list-disc list-inside">
						<li>기준연도: 2020년</li>
						<li>지수: 기준연도의 가격 수준을 100으로 고정</li>
						<li>다른 시점의 CPI가 100보다 높으면 기준연도보다 평균 물가가 높다는 뜻</li>
						<li>다른 시점의 CPI가 100보다 낮으면 기준연도보다 평균 물가가 낮다는 뜻</li>
					</ul>
				</div>
			</section>

			<section>
				<CpiTopLevelButtons data={hierarchy} />
			</section>
		</main>
	);
}

CpiPage.displayName = 'CpiPage';
