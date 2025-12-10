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

import useCpiStatistics from './useCpiStatistics';

/**
 * Fetch a single batch from StatisticItemList API and return parsed result
 */
const fetchStatisticItemListBatch = async (statCode: string, start: number, end: number) => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	if (!apiKey || !baseUrl) {
		throw new Error('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.');
	}

	const url = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/${start}/${end}/${statCode}`;
	const res = await fetch(url, { cache: 'no-store', next: { revalidate: 3600 } });
	if (!res.ok) {
		throw new Error(`StatisticItemList 호출 실패: ${res.status} ${res.statusText}`);
	}

	const data = (await res.json()) as StatisticItemListResponse;
	const list = data?.StatisticItemList;
	return {
		total: list?.list_total_count ?? 0,
		rows: list?.row ?? [],
	};
};

/**
 * Fetch all StatisticItem rows for a given stat code by paging in batches of `pageSize`.
 */
const fetchAllStatisticItems = async (statCode = '901Y009', pageSize = 100) => {
	const all: StatisticItem[] = [];

	// first batch to get total
	const first = await fetchStatisticItemListBatch(statCode, 1, pageSize);
	all.push(...first.rows);
	const total = first.total;

	let fetched = first.rows.length;
	while (fetched < total) {
		const start = fetched + 1;
		const end = Math.min(fetched + pageSize, total);
		const batch = await fetchStatisticItemListBatch(statCode, start, end);
		all.push(...batch.rows);
		fetched = all.length;
	}

	return all;
};

/**
 * Build a parent->children map from list of StatisticItem
 */
const buildParentMap = (items: StatisticItem[]) => {
	const childrenMap: Record<string, StatisticItem[]> = {};
	const itemByCode: Record<string, StatisticItem> = {};

	items.forEach((it) => {
		itemByCode[it.ITEM_CODE] = it;
		const parent = it.P_ITEM_CODE ?? '__ROOT__';
		if (!childrenMap[parent]) childrenMap[parent] = [];
		childrenMap[parent].push(it);
	});

	return { childrenMap, itemByCode };
};

/**
 * Given a starting item code ('A01'), find a child 'A011', then collect all leaf descendants under it.
 * Returns array of leaf ITEM_CODEs like ['A01101','A01102']
 */
const getLeafDescendants = (
	childrenMap: Record<string, StatisticItem[]>,
	startCode: string,
	intermediateCode: string,
) => {
	// find A011 under A01
	const childrenOfStart = childrenMap[startCode] ?? [];
	const intermediate = childrenOfStart.find((c) => c.ITEM_CODE === intermediateCode);
	if (!intermediate) return [];

	// traverse descendants under intermediate and collect leaves
	const leaves: string[] = [];
	const stack = [intermediate.ITEM_CODE];

	while (stack.length) {
		const code = stack.pop()!;
		const children = childrenMap[code] ?? [];
		if (children.length === 0) {
			leaves.push(code);
		} else {
			for (const ch of children) stack.push(ch.ITEM_CODE);
		}
	}

	// we probably don't want the intermediate itself (e.g., 'A011'), only deeper leaf codes
	return leaves.filter((c) => c !== intermediateCode);
};

/**
 * Public helper: fetch grain-related item codes and then fetch their CPI statistics.
 * - finds `ITEM_CODE === 'A01'`, inside it finds `A011`, then returns the leaf codes under `A011`.
 * - calls `useCpiStatistics` on the leaf codes and returns the statistics map.
 */
const getGrainStats = async () => {
	const statCode = '901Y009';

	try {
		const items = await fetchAllStatisticItems(statCode, 100);

		const { childrenMap } = buildParentMap(items);

		// find top-level 'A01' entry's ITEM_CODE value
		// There are multiple ways to find it; use childrenMap['__ROOT__'] to find top-level items
		const topLevel = childrenMap['__ROOT__'] ?? [];
		const a01 = topLevel.find((it) => it.ITEM_CODE === 'A01');
		if (!a01) {
			console.warn('A01 항목을 찾을 수 없습니다.');
			return {} as Record<string, any[]>;
		}

		// find A011 under A01 and collect leaf descendants (A01101, A01102...)
		const leafCodes = getLeafDescendants(childrenMap, a01.ITEM_CODE, 'A011');

		if (leafCodes.length === 0) {
			console.warn('A011 하위의 leaf 코드를 찾을 수 없습니다.');
			return {} as Record<string, any[]>;
		}

		// call existing statistics API helper with the codes
		const stats = await useCpiStatistics(leafCodes);
		return stats;
	} catch (error) {
		console.error('getGrainStats 실패:', error);
		return {} as Record<string, any[]>;
	}
};

export default getGrainStats;

/**
 * Example usage (server-side / async context):
 *
 * import getGrainStats from './useCpiGrainItemCodes';
 *
 * const grainStats = await getGrainStats();
 * // grainStats is a Record<string, StatisticSearchItem[]> keyed by ITEM_CODE (A01101, A01102...)
 */
