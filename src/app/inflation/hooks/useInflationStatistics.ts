type StatisticItem = {
	CYCLE: string;
	DATA_CNT: number;
	END_TIME: string;
	GRP_CODE: string;
	GRP_NAME: string;
	ITEM_CODE: string;
	ITEM_NAME: string;
	P_ITEM_CODE: string | null;
	P_ITEM_NAME: string | null;
	START_TIME: string;
	STAT_CODE: string;
	STAT_NAME: string;
	UNIT_NAME: string | null;
	WEIGHT: string | null;
};

type StatisticItemResponse = {
	StatisticItemList: {
		list_total_count: number;
		row: StatisticItem[];
	};
};

/**
 * 한국은행 Open API의 통계 세부항목 목록을 조회합니다.
 * @param statCode 통계코드 (예: 901Y009 - 소비자물가지수)
 */
const useInflationStatistics = async (statCode: string = '901Y009'): Promise<StatisticItem[]> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	if (!apiKey || !baseUrl) {
		console.error('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.');
		return [];
	}

	const url = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/1/100/${statCode}`;
	const res = await fetch(url, { cache: 'no-store' });

	if (!res.ok) {
		console.error('한국은행 Open API 호출 실패', res.status, res.statusText);
		return [];
	}

	const data = (await res.json()) as StatisticItemResponse;
	console.log('🌼 data', data);

	if (!data.StatisticItemList?.row) {
		return [];
	}

	return data.StatisticItemList.row ?? [];
};

export default useInflationStatistics;
