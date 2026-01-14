type StatisticItem = {
	STAT_CODE: string;
	STAT_NAME: string;
	GRP_CODE: string;
	GRP_NAME: string;
	ITEM_CODE: string;
	ITEM_NAME: string;
	P_ITEM_CODE: string | null;
	P_ITEM_NAME: string | null;
	CYCLE: string;
	START_TIME: string;
	END_TIME: string;
	DATA_CNT: number;
	UNIT_NAME: string;
	WEIGHT: string;
};

type StatisticItemListResponse = {
	StatisticItemList: {
		list_total_count: number;
		row: StatisticItem[];
	};
};

export type CpiItemHierarchy = {
	code: string;
	name: string;
	children: Record<string, CpiItemHierarchy>;
};

export const useCpiItemCodes = async (statCode = '901Y009', rootItemCode = 'A'): Promise<CpiItemHierarchy | null> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	if (!apiKey || !baseUrl) {
		console.error('API key or base URL is missing.');
		return null;
	}

	const rootCode = rootItemCode.trim();
	if (!rootCode) {
		console.error('rootItemCode is empty.');
		return null;
	}

	const BATCH_SIZE = 100; // 더 큰 단위로
	let totalCount = 0;

	try {
		// 먼저 첫 페이지 요청해서 전체 개수 확인
		const firstUrl = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/1/${BATCH_SIZE}/${statCode}`;
		const firstRes = await fetch(firstUrl, { next: { revalidate: 60 * 60 * 24 } });

		if (!firstRes.ok) throw new Error('Failed to fetch initial data');

		const firstData = (await firstRes.json()) as StatisticItemListResponse;
		const allItems: StatisticItem[] = firstData?.StatisticItemList?.row ?? [];
		totalCount = firstData?.StatisticItemList?.list_total_count ?? 0;

		// 병렬 요청할 나머지 페이지 구성
		const remainingRequests: Promise<Response>[] = [];
		for (let start = BATCH_SIZE + 1; start <= totalCount; start += BATCH_SIZE) {
			const end = Math.min(start + BATCH_SIZE - 1, totalCount);
			const url = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/${start}/${end}/${statCode}`;
			remainingRequests.push(fetch(url, { next: { revalidate: 60 * 60 * 24 } }));
		}

		// 병렬 요청 실행
		const responses = await Promise.all(remainingRequests);
		for (const res of responses) {
			if (!res.ok) continue;
			const data = (await res.json()) as StatisticItemListResponse;
			const rows = data?.StatisticItemList?.row ?? [];
			allItems.push(...rows);
		}

		// 필터: CYCLE === 'A' && ITEM_CODE 시작이 rootCode
		const rootItems = allItems.filter((item) => item.CYCLE === 'A' && item.ITEM_CODE.startsWith(rootCode));

		// 계층 구조 생성
		const buildHierarchy = (parentCode: string | null): CpiItemHierarchy | null => {
			if (parentCode === null) {
				const topItem = rootItems.find((item) => item.ITEM_CODE === rootCode);
				if (!topItem) return null;

				const directChildren = rootItems.filter((item) => item.P_ITEM_CODE === rootCode);
				const childHierarchy: Record<string, CpiItemHierarchy> = {};

				for (const item of directChildren) {
					const child = buildHierarchy(item.ITEM_CODE);
					if (child) {
						childHierarchy[item.ITEM_CODE] = child;
					}
				}

				return {
					code: topItem.ITEM_CODE,
					name: topItem.ITEM_NAME,
					children: childHierarchy,
				};
			}

			const children = rootItems.filter((item) => item.P_ITEM_CODE === parentCode);
			if (children.length === 0) {
				const currentItem = rootItems.find((item) => item.ITEM_CODE === parentCode);
				if (!currentItem) return null;
				return {
					code: currentItem.ITEM_CODE,
					name: currentItem.ITEM_NAME,
					children: {},
				};
			}

			const childHierarchy: Record<string, CpiItemHierarchy> = {};
			for (const item of children) {
				const child = buildHierarchy(item.ITEM_CODE);
				if (child) {
					childHierarchy[item.ITEM_CODE] = child;
				}
			}

			const currentItem = rootItems.find((item) => item.ITEM_CODE === parentCode);
			if (!currentItem) return null;

			return {
				code: currentItem.ITEM_CODE,
				name: currentItem.ITEM_NAME,
				children: childHierarchy,
			};
		};

		return buildHierarchy(null);
	} catch (error) {
		console.error('Error while fetching CPI item codes:', error);
		return null;
	}
};
