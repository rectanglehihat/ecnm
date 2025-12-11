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

const DEFAULT_STAT_CODE = '901Y009';

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

export const fetchAllStatisticItems = async (statCode = DEFAULT_STAT_CODE, pageSize = 100) => {
	const all: StatisticItem[] = [];

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

export const buildParentMap = (items: StatisticItem[]) => {
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
 * Collect all descendant ITEM_CODEs for the node identified by `startCode` following an optional `path`.
 * - If `path` is provided, it navigates through children matching each path segment.
 * - Example: path=['A01','A011'] will find A01 under root, then A011 under A01, then collect all leaves under A011.
 */
export const collectLeafCodesForPath = (
	childrenMap: Record<string, StatisticItem[]>,
	startCode: string,
	path: string[] = [],
) => {
	// navigate from startCode through the path (if provided)
	let currentCode = startCode;
	for (const segment of path) {
		const children = childrenMap[currentCode] ?? [];
		const found = children.find((c) => c.ITEM_CODE === segment);
		if (!found) return [];
		currentCode = found.ITEM_CODE;
	}

	// now collect leaf ITEM_CODEs under currentCode
	const leaves: string[] = [];
	const stack = [currentCode];
	while (stack.length) {
		const code = stack.pop()!;
		const children = childrenMap[code] ?? [];
		if (children.length === 0) {
			leaves.push(code);
		} else {
			for (const ch of children) stack.push(ch.ITEM_CODE);
		}
	}

	// remove the node itself if it was included and it matches the final path segment
	if (path.length > 0) {
		const final = path[path.length - 1];
		return leaves.filter((c) => c !== final);
	}

	// if no path provided, remove the startCode itself
	return leaves.filter((c) => c !== startCode);
};

/**
 * High-level helper that returns leaf codes for a path under the top-level root.
 * - `path` should specify hierarchy segments relative to the root (e.g. ['A01','A011']).
 */
export const getLeafCodesForPath = async (path: string[], statCode = DEFAULT_STAT_CODE, pageSize = 100) => {
	const items = await fetchAllStatisticItems(statCode, pageSize);
	const { childrenMap } = buildParentMap(items);

	// start from root
	return collectLeafCodesForPath(childrenMap, '__ROOT__', path);
};

/**
 * High-level helper that fetches statistics for leaf codes found by `path`.
 * - If no leaf codes are found, returns empty object.
 */
export const fetchStatsForPath = async (path: string[], statCode = DEFAULT_STAT_CODE) => {
	const leafCodes = await getLeafCodesForPath(path, statCode);
	if (leafCodes.length === 0) return {} as Record<string, any[]>;
	return await useCpiStatistics(leafCodes);
};

export default {
	fetchAllStatisticItems,
	buildParentMap,
	collectLeafCodesForPath,
	getLeafCodesForPath,
	fetchStatsForPath,
};
