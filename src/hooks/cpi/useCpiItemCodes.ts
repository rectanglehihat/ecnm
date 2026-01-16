interface StatisticItem {
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
}

interface StatisticItemListResponse {
	StatisticItemList: {
		list_total_count: number;
		row: StatisticItem[];
	};
}

export interface CpiItemHierarchy {
	code: string;
	name: string;
	children: Record<string, CpiItemHierarchy>;
}

export const useCpiItemCodes = async (
	statCode: string,
	rootItemCode?: string,
): Promise<CpiItemHierarchy | CpiItemHierarchy[] | null> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	if (!apiKey || !baseUrl) {
		console.error('API key or base URL is missing.');
		return null;
	}

	const BATCH_SIZE = 100;
	let totalCount = 0;

	try {
		// 첫 요청
		const firstUrl = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/1/${BATCH_SIZE}/${statCode}`;
		const firstRes = await fetch(firstUrl, { next: { revalidate: 60 * 60 * 24 * 30 } });
		if (!firstRes.ok) throw new Error('Failed to fetch initial data');

		const firstData = (await firstRes.json()) as StatisticItemListResponse;
		const allItems: StatisticItem[] = firstData?.StatisticItemList?.row ?? [];
		totalCount = firstData?.StatisticItemList?.list_total_count ?? 0;

		// 나머지 요청
		const remainingRequests: Promise<Response>[] = [];
		for (let start = BATCH_SIZE + 1; start <= totalCount; start += BATCH_SIZE) {
			const end = Math.min(start + BATCH_SIZE - 1, totalCount);
			const url = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/${start}/${end}/${statCode}`;
			remainingRequests.push(fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } }));
		}

		const responses = await Promise.all(remainingRequests);
		for (const res of responses) {
			if (!res.ok) continue;
			const data = (await res.json()) as StatisticItemListResponse;
			const rows = data?.StatisticItemList?.row ?? [];
			allItems.push(...rows);
		}

		const filteredItems = allItems.filter((item) => item.CYCLE === 'A');

		// 계층 구조 생성 함수
		const buildHierarchy = (parentCode: string): CpiItemHierarchy | null => {
			const currentItem = filteredItems.find((item) => item.ITEM_CODE === parentCode);
			if (!currentItem) return null;

			const children = filteredItems.filter((item) => item.P_ITEM_CODE === parentCode);
			const childHierarchy: Record<string, CpiItemHierarchy> = {};

			for (const child of children) {
				const childNode = buildHierarchy(child.ITEM_CODE);
				if (childNode) {
					childHierarchy[child.ITEM_CODE] = childNode;
				}
			}

			return {
				code: currentItem.ITEM_CODE,
				name: currentItem.ITEM_NAME,
				children: childHierarchy,
			};
		};

		// rootItemCode가 제공된 경우
		if (rootItemCode) {
			const rootCode = rootItemCode.trim();
			const root = buildHierarchy(rootCode);
			return root;
		}

		// rootItemCode가 없는 경우: 최상위 노드들을 모두 계층 구조로 리턴
		const topLevelItems = filteredItems.filter((item) => item.P_ITEM_CODE === null);
		const hierarchies: CpiItemHierarchy[] = [];

		for (const item of topLevelItems) {
			const root = buildHierarchy(item.ITEM_CODE);
			if (root) hierarchies.push(root);
		}

		return hierarchies;
	} catch (error) {
		console.error('Error while fetching CPI item codes:', error);
		return null;
	}
};
