import { cache } from 'react';
import { fetchStatisticItemList } from './fetchStatisticItemList';
import { buildItemTree } from './buildItemTree';
import { findItemAndChildren } from './findItemAndChildren';

export const getGrainStats = cache(async () => {
	// 1. ITEM 목록 (하루 캐시)
	const items = await fetchStatisticItemList();

	// 2. 트리 구성 (메모리 캐시)
	const tree = buildItemTree(items);

	// 3. 곡물 코드 (A011)
	const GRAIN_ITEM_CODES = findItemAndChildren(tree, 'A011');

	// 4. CPI 데이터 (1시간 캐시)
	// const grainStats = await fetchCpiStatistics(GRAIN_ITEM_CODES);

	return {
		GRAIN_ITEM_CODES,
		// grainStats,
	};
});
