// export type StatisticItem = {
// 	STAT_CODE: string;
// 	STAT_NAME: string;
// 	GRP_CODE: string;
// 	GRP_NAME: string;
// 	ITEM_CODE: string;
// 	ITEM_NAME: string;
// 	P_ITEM_CODE: string | null;
// 	P_ITEM_NAME: string | null;
// 	CYCLE: string;
// 	START_TIME: string;
// 	END_TIME: string;
// 	DATA_CNT: number;
// 	UNIT_NAME: string;
// 	WEIGHT: string;
// };

// export type StatisticItemListResponse = {
// 	StatisticItemList: {
// 		list_total_count: number;
// 		row: StatisticItem[];
// 	};
// };

// import useCpiStatistics from './useCpiStatistics';

// const DEFAULT_STAT_CODE = '901Y009';

// // Simple in-memory cache and retry logic
// const _itemsCache: Map<string, { ts: number; items: StatisticItem[] }> = new Map();
// const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

// const fetchStatisticItemListBatch = async (statCode: string, start: number, end: number) => {
// 	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
// 	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

// 	if (!apiKey || !baseUrl) {
// 		throw new Error('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.');
// 	}

// 	const url = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/${start}/${end}/${statCode}`;

// 	// Retry with exponential backoff
// 	const maxAttempts = 3;
// 	let attempt = 0;
// 	let lastErr: any = null;

// 	while (attempt < maxAttempts) {
// 		try {
// 			console.debug('[useCpiItemHierarchy] fetch batch', { url, attempt });
// 			const res = await fetch(url, { cache: 'no-store', next: { revalidate: 3600 } });
// 			if (!res.ok) {
// 				throw new Error(`StatisticItemList 호출 실패: ${res.status} ${res.statusText}`);
// 			}

// 			const data = (await res.json()) as StatisticItemListResponse;
// 			const list = data?.StatisticItemList;
// 			return {
// 				total: list?.list_total_count ?? 0,
// 				rows: list?.row ?? [],
// 			};
// 		} catch (err) {
// 			lastErr = err;
// 			attempt += 1;
// 			const backoff = 100 * 2 ** attempt;
// 			console.debug('[useCpiItemHierarchy] fetch error, will retry', { url, attempt, err: String(err) });
// 			// small delay
// 			await new Promise((r) => setTimeout(r, backoff));
// 		}
// 	}

// 	throw lastErr;
// };

// export const fetchAllStatisticItems = async (statCode = DEFAULT_STAT_CODE, pageSize = 100) => {
// 	const cacheKey = `${statCode}:${pageSize}`;
// 	const cached = _itemsCache.get(cacheKey);
// 	if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
// 		console.debug('[useCpiItemHierarchy] cache hit', { cacheKey, count: cached.items.length });
// 		return cached.items;
// 	}

// 	const all: StatisticItem[] = [];

// 	const first = await fetchStatisticItemListBatch(statCode, 1, pageSize);
// 	all.push(...first.rows);
// 	const total = first.total;

// 	console.debug('[useCpiItemHierarchy] first batch', { statCode, pageSize, fetched: first.rows.length, total });

// 	let fetched = first.rows.length;
// 	while (fetched < total) {
// 		const start = fetched + 1;
// 		const end = Math.min(fetched + pageSize, total);
// 		const batch = await fetchStatisticItemListBatch(statCode, start, end);
// 		all.push(...batch.rows);
// 		fetched = all.length;
// 	}

// 	// store cache
// 	try {
// 		_itemsCache.set(cacheKey, { ts: Date.now(), items: all });
// 	} catch (e) {
// 		// ignore cache set errors
// 	}

// 	return all;
// };

// export const buildParentMap = (items: StatisticItem[]) => {
// 	const childrenMap: Record<string, StatisticItem[]> = {};
// 	const itemByCode: Record<string, StatisticItem> = {};

// 	// Helper to normalize ITEM_CODE/P_ITEM_CODE coming from ECOS which can be compound like
// 	// `A-A01_A011-A01101`. Normalize to the last token (e.g. `A01101`).
// 	const normalize = (raw?: string | null) => {
// 		if (!raw) return null;
// 		// replace dashes with underscores, then split by underscore and take last segment
// 		const transformed = raw.replace(/-/g, '_');
// 		const parts = transformed.split('_').filter(Boolean);
// 		return parts.length ? parts[parts.length - 1] : null;
// 	};

// 	items.forEach((it) => {
// 		const normCode = normalize(it.ITEM_CODE) ?? it.ITEM_CODE;
// 		const normParent = normalize(it.P_ITEM_CODE) ?? '__ROOT__';

// 		// attach normalized codes as metadata for debugging
// 		(it as any).__normCode = normCode;
// 		(it as any).__normParent = normParent;

// 		itemByCode[normCode] = it;
// 		if (!childrenMap[normParent]) childrenMap[normParent] = [];
// 		// store item under normalized parent key
// 		childrenMap[normParent].push(it);
// 		// ensure there's an entry for this code (may be parent for others)
// 		if (!childrenMap[normCode]) childrenMap[normCode] = childrenMap[normCode] ?? [];
// 	});

// 	// debug: log top-level root children count and sample
// 	const rootChildren = childrenMap['__ROOT__'] ?? [];
// 	console.debug('[useCpiItemHierarchy] buildParentMap', { totalItems: items.length, rootChildrenCount: rootChildren.length, sampleRootCodes: rootChildren.slice(0, 10).map((c) => ({ item: c.ITEM_CODE, norm: (c as any).__normCode })) });

// 	return { childrenMap, itemByCode };
// };

// /**
//  * Collect all descendant ITEM_CODEs for the node identified by `startCode` following an optional `path`.
//  * - If `path` is provided, it navigates through children matching each path segment.
//  * - Example: path=['A01','A011'] will find A01 under root, then A011 under A01, then collect all leaves under A011.
//  */
// export const collectLeafCodesForPath = (
// 	childrenMap: Record<string, StatisticItem[]>,
// 	startCode: string,
// 	path: string[] = [],
// ) => {
// 	// navigate from startCode through the path (if provided)
// 	let currentCode = startCode;
// 	const navSegments: string[] = [];
// 	for (const segment of path) {
// 		const children = childrenMap[currentCode] ?? [];
// 		const found = children.find((c) => c.ITEM_CODE === segment);
// 		if (!found) return [];
// 		currentCode = found.ITEM_CODE;
// 		navSegments.push(currentCode);
// 	}

// 	// now collect leaf ITEM_CODEs under currentCode
// 	const leaves: string[] = [];
// 	const stack = [currentCode];
// 	while (stack.length) {
// 		const code = stack.pop()!;
// 		const children = childrenMap[code] ?? [];
// 		if (children.length === 0) {
// 			leaves.push(code);
// 		} else {
// 			for (const ch of children) stack.push(ch.ITEM_CODE);
// 		}
// 	}

// 	// remove the node itself if it was included and it matches the final path segment
// 	if (path.length > 0) {
// 		const final = path[path.length - 1];
// 		const filtered = leaves.filter((c) => c !== final);
// 		console.debug('[useCpiItemHierarchy] collectLeafCodesForPath', { path, navSegments, leafCount: filtered.length, leafSample: filtered.slice(0, 10) });
// 		return filtered;
// 	}

// 	const filtered = leaves.filter((c) => c !== startCode);
// 	console.debug('[useCpiItemHierarchy] collectLeafCodesForPath (no path)', { startCode, leafCount: filtered.length, leafSample: filtered.slice(0, 10) });
// 	return filtered;
// };

// /**
//  * High-level helper that returns leaf codes for a path under the top-level root.
//  * - `path` should specify hierarchy segments relative to the root (e.g. ['A01','A011']).
//  */
// export const getLeafCodesForPath = async (path: string[], statCode = DEFAULT_STAT_CODE, pageSize = 100) => {
// 	const items = await fetchAllStatisticItems(statCode, pageSize);
// 	const { childrenMap } = buildParentMap(items);

// 	// start from root
// 	return collectLeafCodesForPath(childrenMap, '__ROOT__', path);
// };

// /**
//  * High-level helper that fetches statistics for leaf codes found by `path`.
//  * - If no leaf codes are found, returns empty object.
//  */
// export const fetchStatsForPath = async (path: string[], statCode = DEFAULT_STAT_CODE) => {
// 	const leafCodes = await getLeafCodesForPath(path, statCode);
// 	if (leafCodes.length === 0) return {} as Record<string, any[]>;
// 	return await useCpiStatistics(leafCodes);
// };

// export default {
// 	fetchAllStatisticItems,
// 	buildParentMap,
// 	collectLeafCodesForPath,
// 	getLeafCodesForPath,
// 	fetchStatsForPath,
// };
