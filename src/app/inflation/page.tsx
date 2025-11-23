import useInflationStatistics from '@/app/inflation/hooks/useInflationStatistics';
import InflationChart from '@/app/hundred-key-statistics/components/InflationChart';

const InflationPage = async () => {
	const riceStats = await useInflationStatistics();

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-zinc-50">
			<main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
				<header className="flex flex-col gap-2">
					<h1 className="text-2xl font-semibold tracking-tight">물가</h1>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						한국은행 ECOS Open API의 통계조회 조건 설정을 사용하여 소비자물가지수의 쌀 항목을 검색한 결과입니다.
					</p>
				</header>

				{riceStats.length > 0 && (
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">차트</h2>
						<InflationChart data={riceStats} />
					</section>
				)}
			</main>
		</div>
	);
};

export default InflationPage;
