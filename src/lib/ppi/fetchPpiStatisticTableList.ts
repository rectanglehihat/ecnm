import { BOK_BASE_URL } from '@/const/BOK_CODE';
import { ApiError, DataError, handleError } from '@/lib/errors';

export interface PpiStatisticTableListType {
	P_STAT_CODE: string;
	STAT_CODE: string;
	STAT_NAME: string;
	CYCLE: string;
	SRCH_YN: string;
	ORG_NAME: string;
}

interface StatisticTableListResponse {
	StatisticTableList: {
		list_total_count: number;
		row: PpiStatisticTableListType[];
	};
}

/**
 * 한국은행 Open API의 통계조회 조건 설정 API를 사용하여 서비스 통계 목록을 검색합니다.
 */

const fetchPpiStatisticTableList = async (itemCode: string): Promise<PpiStatisticTableListType | null> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = BOK_BASE_URL;

	if (!apiKey) {
		throw new DataError('한국은행 Open API 키가 설정되지 않았습니다.', {
			location: 'fetchPpiStatisticTableList',
			userMessage: 'API 설정이 올바르지 않습니다. 관리자에게 문의하세요.',
			retryable: false,
			metadata: { missingKey: !apiKey },
		});
	}

	const url = `${baseUrl}/StatisticTableList/${apiKey}/json/kr/1/10/${itemCode}`;
	const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } });

	if (!res.ok) {
		const error = new ApiError(`한국은행 Open API 호출 실패 (${itemCode})`, res.status, {
			location: 'fetchPpiStatisticTableList',
			userMessage: 'PPI 통계 데이터를 불러올 수 없습니다.',
			retryable: res.status >= 500,
			metadata: { itemCode, url, status: res.status, statusText: res.statusText },
		});
		handleError(error, 'fetchPpiStatisticTableList');
		throw error;
	}

	const data = (await res.json()) as StatisticTableListResponse;

	let result: PpiStatisticTableListType | null = null;
	const rows = data?.StatisticTableList?.row;

	if (Array.isArray(rows)) {
		const matched = rows.find((row) => row.STAT_CODE === itemCode);
		result = matched ?? null;
	}

	return result;
};

const fetchPpiStatisticTableLists = async (itemCodes: string[]): Promise<(PpiStatisticTableListType | null)[]> => {
	if (!Array.isArray(itemCodes) || itemCodes.length === 0) {
		return [];
	}

	const results = await Promise.allSettled(
		itemCodes.map((code) =>
			fetchPpiStatisticTableList(code).catch((error) => {
				handleError(error, 'fetchPpiStatisticTableLists');
				return null;
			}),
		),
	);

	return results.map((result, idx) => {
		if (result.status === 'fulfilled') {
			return result.value;
		}

		handleError(result.reason, `fetchPpiStatisticTableLists:${itemCodes[idx]}`);
		return null;
	});
};

export { fetchPpiStatisticTableList, fetchPpiStatisticTableLists };
