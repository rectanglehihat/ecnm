import { ItemNode } from '@/lib/buildItemTree';

export function findItemAndChildren(treeMap: Record<string, ItemNode>, rootCode: string): string[] {
	const root = treeMap[rootCode];
	if (!root) return [];

	const collected: string[] = [];

	function dfs(node: ItemNode) {
		collected.push(node.item.ITEM_CODE);

		node.children.forEach((child) => dfs(child));
	}

	dfs(root);
	return collected;
}
