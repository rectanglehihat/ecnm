import { fetchStatisticItemList } from '@/lib/fetchStatisticItemList';
import { buildItemTree } from '@/lib/buildItemTree';
import { findItemAndChildren } from '@/lib/findItemAndChildren';
import useCpiStatistics from '@/app/cpi/hooks/useCpiStatistics';

export async function GET() {
	// Step 1: 전체 항목 호출
	const items = await fetchStatisticItemList();

	// Step 2: 트리 구성
	const tree = buildItemTree(items);

	// Step 3: A01 → A011 → A01101~ 하위 아이템 전체 가져오기
	const GRAIN_ITEM_CODES = findItemAndChildren(tree, 'A011');

	// Step 4: CPI 조회
	const grainStats = await useCpiStatistics(GRAIN_ITEM_CODES);

	console.log('GRAIN_ITEM_CODES', GRAIN_ITEM_CODES);
	console.log('grainStats', grainStats);

	return Response.json({
		GRAIN_ITEM_CODES,
		grainStats,
	});
}
