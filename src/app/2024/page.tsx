type KeyStatisticItem = {
	CLASS_NAME: string;
	CYCLE: string;
	DATA_VALUE: string;
	KEYSTAT_NAME: string;
	UNIT_NAME: string;
};

type KeyStatisticResponse = {
	KeyStatisticList: {
		list_total_count: number;
		row: KeyStatisticItem[];
		row_count: number;
	};
};

async function fetchKeyStatistics(): Promise<KeyStatisticItem[]> {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;

	if (!apiKey) {
		console.error('BOK_API_KEY 환경 변수가 설정되어 있지 않습니다.');
		return [];
	}

	const url = `https://ecos.bok.or.kr/api/KeyStatisticList/${apiKey}/json/kr/1/10`;

	const res = await fetch(url, { cache: 'no-store' });

	if (!res.ok) {
		console.error('한국은행 Open API 호출 실패', res.status, res.statusText);
		return [];
	}

	const data = (await res.json()) as KeyStatisticResponse;
	console.log('❤️ data', data);

	if (!data.KeyStatisticList?.row) {
		return [];
	}

	return data.KeyStatisticList.row ?? [];
}

const Page = async () => {
	const statistics = await fetchKeyStatistics();

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-zinc-50">
			<main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
				<header className="flex flex-col gap-2">
					<h1 className="text-2xl font-semibold tracking-tight">2024년 100대 통계지표</h1>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						한국은행 ECOS Open API의 100대 통계지표(`KeyStatisticList`)를 불러온 예시입니다.
					</p>
				</header>

				<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
					{statistics.length === 0 ? (
						<p className="text-sm text-zinc-600 dark:text-zinc-400">
							표시할 통계지표가 없습니다. 인증키나 네트워크 상태를 확인해 주세요.
						</p>
					) : (
						<ul className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
							{statistics.map((item) => (
								<li
									key={`${item.CLASS_NAME}-${item.KEYSTAT_NAME}`}
									className="flex flex-col gap-1 py-3"
								>
									<div className="flex items-center justify-between gap-2">
										<div className="font-medium">{item.KEYSTAT_NAME}</div>
										<span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
											{item.DATA_VALUE} {item.UNIT_NAME}
										</span>
									</div>
									<div className="text-xs text-zinc-500 dark:text-zinc-400">
										지표코드: {item.CLASS_NAME}/{item.CYCLE} · 통계명: {item.KEYSTAT_NAME}
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

export default Page;
