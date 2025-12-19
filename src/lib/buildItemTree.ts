import { StatisticItem } from '@/lib/fetchStatisticItemList';

export type ItemNode = {
	item: StatisticItem;
	children: ItemNode[];
};

export function buildItemTree(items: StatisticItem[]): Record<string, ItemNode> {
	const map: Record<string, ItemNode> = {};

	items.forEach((item) => {
		map[item.ITEM_CODE] = { item, children: [] };
	});

	items.forEach((item) => {
		if (item.P_ITEM_CODE && map[item.P_ITEM_CODE]) {
			map[item.P_ITEM_CODE].children.push(map[item.ITEM_CODE]);
		}
	});

	return map;
}
