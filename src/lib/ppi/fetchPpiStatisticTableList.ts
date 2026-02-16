import { CODE_PPI } from '@/const/BOK_CODE';
import { StatisticSearchItem, StatisticSearchResponse } from '@/lib/cpi/fetchCpiStatistics';
import { ApiError, DataError, handleError } from '@/lib/errors';

/**
 * 한국은행 Open API의 통계조회 조건 설정 API를 사용하여 서비스 통계 목록을 검색합니다.
 */
const fetchPpiStatisticTableList = async (itemCode: string): Promise<StatisticSearchItem | null> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	const statCode = CODE_PPI;

	if (!apiKey || !baseUrl) {
		throw new DataError('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.', {
			location: 'fetchPpiStatistics',
			userMessage: 'API 설정이 올바르지 않습니다. 관리자에게 문의하세요.',
			retryable: false,
			metadata: { missingKey: !apiKey, missingUrl: !baseUrl },
		});
	}

	const url = `${baseUrl}/StatisticTableList/${apiKey}/json/kr/1/10/${statCode}`;
	const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } });

	if (!res.ok) {
		const error = new ApiError(`한국은행 Open API 호출 실패 (${statCode})`, res.status, {
			location: 'fetchPpiStatistics',
			userMessage: 'PPI 통계 데이터를 불러올 수 없습니다.',
			retryable: res.status >= 500,
			metadata: { statCode, url, status: res.status, statusText: res.statusText },
		});
		handleError(error, 'fetchPpiStatistics');
		throw error;
	}

	const data = (await res.json()) as StatisticSearchResponse;

	let result: StatisticSearchItem | null = null;
	const rows = (data as any)?.StatisticTableList?.row as StatisticSearchItem[] | undefined;

	if (Array.isArray(rows)) {
		const matched = rows.find((row) => row.STAT_CODE === itemCode);
		result = matched ?? null;
	}

	return result;
};

export default fetchPpiStatisticTableList;
