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

const useCpiItemCodes = async (statCode = '901Y009', start = 1, end = 100): Promise<StatisticItem[]> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	if (!apiKey || !baseUrl) {
		console.error('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.');
		return [];
	}

	try {
		const url = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/${start}/${end}/${statCode}`;
		const res = await fetch(url, { cache: 'no-store', next: { revalidate: 60 * 60 * 24 } });

		if (!res.ok) {
			console.error('한국은행(ECOS) 통계항목 호출 실패', res.status, res.statusText, url);
			return [];
		}

		const data = (await res.json()) as StatisticItemListResponse;

		const rows = data?.StatisticItemList?.row ?? [];

		console.log(`🌱 StatisticItemList (${statCode}) loaded:`, rows.length);

		return rows;
	} catch (error) {
		console.error('한국은행(ECOS) 통계항목 호출 중 오류 발생:', error, statCode);
		return [];
	}
};

export default useCpiItemCodes;
