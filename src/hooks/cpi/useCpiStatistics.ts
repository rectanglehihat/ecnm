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
 * @param itemCodes 통계항목코드 배열 또는 단일 코드
 */
const useCpiStatistics = async (itemCodes: string[] = ['A01101']): Promise<Record<string, StatisticSearchItem[]>> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	const statCode = '901Y009';
	const cycle = 'A';
	const startTime = '1950';
	const endTime = '2024';

	if (!apiKey || !baseUrl) {
		console.error('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.');
		return {};
	}

	const result: Record<string, StatisticSearchItem[]> = {};

	// Promise.allSettled를 사용하여 모든 API를 병렬로 호출
	const promises = itemCodes.map(async (itemCode) => {
		try {
			const url = `${baseUrl}/StatisticSearch/${apiKey}/json/kr/1/100/${statCode}/${cycle}/${startTime}/${endTime}/${itemCode}`;
			const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } });

			if (!res.ok) {
				console.error(`한국은행 Open API 호출 실패 (${itemCode})`, res.status, res.statusText);
				return { itemCode, data: [] };
			}

			const data = (await res.json()) as StatisticSearchResponse;
			console.log(`🌼 StatisticSearch data for ${itemCode}`, data);

			return { itemCode, data: data.StatisticSearch?.row ?? [] };
		} catch (error) {
			console.error(`API 호출 중 오류 발생 (${itemCode}):`, error);
			return { itemCode, data: [] };
		}
	});

	// 모든 요청이 완료될 때까지 대기
	const results = await Promise.allSettled(promises);

	// 결과를 처리하여 result 객체에 저장
	results.forEach((promiseResult, index) => {
		const itemCode = itemCodes[index];

		if (promiseResult.status === 'fulfilled') {
			result[itemCode] = promiseResult.value.data;
		} else {
			console.error(`Promise rejected for ${itemCode}:`, promiseResult.reason);
			result[itemCode] = [];
		}
	});

	return result;
};

export default useCpiStatistics;
