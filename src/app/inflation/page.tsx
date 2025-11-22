import useInflationStatistics from '@/app/inflation/hooks/useInflationStatistics';

const InflationPage = async () => {
	const statistics = await useInflationStatistics();

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-zinc-50">
			<main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
				<header className="flex flex-col gap-2">
					<h1 className="text-2xl font-semibold tracking-tight">물가</h1>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						한국은행 ECOS Open API의 통계 세부항목 목록을 불러온 예시입니다.
					</p>
				</header>

				<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
					{statistics.length === 0 ? (
						<p className="text-sm text-zinc-600 dark:text-zinc-400">
							표시할 통계 세부항목이 없습니다. 인증키나 네트워크 상태를 확인해 주세요.
						</p>
					) : (
						<ul className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
							{statistics.map((item) => (
								<li
									key={`${item.CYCLE}-${item.ITEM_CODE}`}
									className="flex flex-col gap-1 py-3"
								>
									<div className="flex items-center justify-between gap-2">
										<div className="font-medium">{item.ITEM_NAME}</div>
										<span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
											{item.DATA_CNT}건
										</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="text-xs text-zinc-500 dark:text-zinc-400">항목코드: {item.ITEM_CODE}</div>
										{item.ITEM_NAME && (
											<>
												<span className="text-zinc-400 dark:text-zinc-600">·</span>
												<div className="text-xs text-zinc-500 dark:text-zinc-400">{item.ITEM_CODE}</div>
											</>
										)}
									</div>
								</li>
							))}
						</ul>
					)}
				</section>
			</main>
		</div>
	);
};

export default InflationPage;
