type StatisticSearchItem = {
	DATA_VALUE: string;
	ITEM_CODE1: string;
	ITEM_CODE2: string | null;
	ITEM_CODE3: string | null;
	ITEM_CODE4: string | null;
	ITEM_NAME1: string;
	ITEM_NAME2: string | null;
	ITEM_NAME3: string | null;
	ITEM_NAME4: string | null;
	STAT_CODE: string;
	STAT_NAME: string;
	TIME: string;
	UNIT_NAME: string;
	WGT: string;
};

type StatisticSearchResponse = {
	StatisticSearch: {
		list_total_count: number;
		row: StatisticSearchItem[];
	};
};

/**
 * 한국은행 Open API의 통계조회 조건 설정 API를 사용하여 통계 항목을 검색합니다.
 * @param statCode 통계코드 (예: 901Y009 - 소비자물가지수)
 * @param cycle 주기 (년:A, 반년:S, 분기:Q, 월:M, 반월:SM, 일: D)
 * @param startTime 시작일 (예: 202201)
 * @param endTime 종료일 (예: 202412)
 * @param itemCode1 아이템코드1 (예: A01101 - 쌀)
 */
const useInflationStatistics = async (
	itemCode1: string = 'A01101',
	statCode: string = '901Y009',
	cycle: string = 'A',
	startTime: string = '1950',
	endTime: string = '2024',
): Promise<StatisticSearchItem[]> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	if (!apiKey || !baseUrl) {
		console.error('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.');
		return [];
	}

	const url = `${baseUrl}/StatisticSearch/${apiKey}/json/kr/1/100/${statCode}/${cycle}/${startTime}/${endTime}/${itemCode1}`;
	const res = await fetch(url, { cache: 'no-store' });

	if (!res.ok) {
		console.error('한국은행 Open API 호출 실패', res.status, res.statusText);
		return [];
	}

	const data = (await res.json()) as StatisticSearchResponse;
	console.log('🌼 StatisticSearch data', data);

	if (!data.StatisticSearch?.row) {
		return [];
	}

	return data.StatisticSearch.row ?? [];
};

export default useInflationStatistics;
