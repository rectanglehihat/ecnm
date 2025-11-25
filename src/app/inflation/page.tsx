import useInflationStatistics from '@/app/inflation/hooks/useInflationStatistics';
import GrainChart from '@/app/inflation/components/GrainChart';

const InflationPage = async () => {
	const riceStats = await useInflationStatistics('A01101');
	const brownRiceStats = await useInflationStatistics('A01102');
	const glutinousRiceStats = await useInflationStatistics('A01103');
	const barleyRiceStats = await useInflationStatistics('A01104');
	const beanStats = await useInflationStatistics('A01105');
	const peanutStats = await useInflationStatistics('A01106');
	const flourStats = await useInflationStatistics('A01108');

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-zinc-50">
			<main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
				<header className="flex flex-col gap-4">
					<h1 className="text-2xl font-semibold tracking-tight">소비자물가지수(CPI)</h1>
					<section className="text-sm text-zinc-700 flex flex-col gap-2">
						<p className="font-semibold">🍎 2020=100 이란?</p>
						<ul>
							<li>기준연도: 2020년</li>
							<li>지수: 기준연도의 가격 수준을 100으로 고정</li>
							<li>다른 시점의 CPI가 100보다 높으면 기준연도보다 평균 물가가 높다는 뜻</li>
							<li>다른 시점의 CPI가 100보다 낮으면 기준연도보다 평균 물가가 낮다는 뜻</li>
						</ul>
					</section>
				</header>

				{riceStats.length > 0 && (
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">곡물</h2>
						<GrainChart
							data={riceStats}
							brownRiceData={brownRiceStats}
							glutinousRiceData={glutinousRiceStats}
							barleyRiceData={barleyRiceStats}
							beanData={beanStats}
							peanutData={peanutStats}
							flourData={flourStats}
						/>
					</section>
				)}
			</main>
		</div>
	);
};

export default InflationPage;
