export type StatisticItem = {
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

const BASE_URL = process.env.NEXT_PUBLIC_BOK_BASE_URL;

export async function fetchStatisticItemList(): Promise<StatisticItem[]> {
	let start = 1;
	const pageSize = 10;
	let results: StatisticItem[] = [];
	let totalCount = Infinity;

	while (start <= totalCount) {
		const end = start + pageSize - 1;
		const url = `${BASE_URL}/${start}/${end}/901Y009`;

		const res = await fetch(url);
		if (!res.ok) throw new Error('Failed to fetch StatisticItemList');

		const data: StatisticItemListResponse = await res.json();
		const { list_total_count, row } = data.StatisticItemList;

		results = results.concat(row);
		totalCount = list_total_count;

		start += pageSize;
	}

	return results;
}
