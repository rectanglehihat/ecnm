import CpiTopLevelButtons from '@/components/cpi/CpiTopLevelButtons';
import { useCpiItemCodes } from '@/hooks/cpi/useCpiItemCodes';

export default async function CpiPage() {
	const hierarchy = await useCpiItemCodes('901Y009');

	if (!hierarchy) return <div className="text-red-500">❌ 데이터 조회 실패</div>;

	return (
		<main>
			<h1 className="text-2xl font-bold">소비자물가지수(CPI)</h1>
			<section className="py-10">
				<div className="p-5 text-sm text-gray-600 flex flex-col gap-2 bg-gray-200 rounded-lg">
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
