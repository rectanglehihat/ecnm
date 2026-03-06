import { CODE_PPI_2021_06 } from '@/const/BOK_CODE';
import { StatisticSearchItem, StatisticSearchResponse } from '@/lib/cpi/fetchCpiStatistics';
import { ApiError, DataError, handleError } from '@/lib/errors';

/**
 * 한국은행 Open API의 통계조회 조건 설정 API를 사용하여 통계 항목을 검색합니다.
 * @param itemCodes 통계항목코드 배열 또는 단일 코드
 */
const fetchPpiStatistics = async (
	itemCodes: string[] = ['R69A'],
	parentCode?: string,
): Promise<Record<string, StatisticSearchItem[]>> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	const statCode = CODE_PPI_2021_06;
	const cycle = 'M';
	const startTime = '195001';
	const endTime = '202512';

	if (!apiKey || !baseUrl) {
		throw new DataError('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.', {
			location: 'fetchPpiStatistics',
			userMessage: 'API 설정이 올바르지 않습니다. 관리자에게 문의하세요.',
			retryable: false,
			metadata: { missingKey: !apiKey, missingUrl: !baseUrl },
		});
	}

	const result: Record<string, StatisticSearchItem[]> = {};

	const pageSize = 100;

	const fetchPage = async (itemCode: string, start: number, end: number): Promise<StatisticSearchResponse> => {
		const tail = parentCode ? `/${parentCode}/${itemCode}` : `/${itemCode}`;
		const url = `${baseUrl}/StatisticSearch/${apiKey}/json/kr/${start}/${end}/${statCode}/${cycle}/${startTime}/${endTime}${tail}`;
		const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } });

		if (!res.ok) {
			const error = new ApiError(`한국은행 Open API 호출 실패 (${itemCode})`, res.status, {
				location: 'fetchPpiStatistics',
				userMessage: 'PPI 통계 데이터를 불러올 수 없습니다.',
				retryable: res.status >= 500,
				metadata: { itemCode, url, status: res.status, statusText: res.statusText },
			});
			handleError(error, 'fetchPpiStatistics');
			throw error;
		}

		return (await res.json()) as StatisticSearchResponse;
	};

	// Promise.allSettled를 사용하여 모든 API를 병렬로 호출
	const promises = itemCodes.map(async (itemCode) => {
		try {
			const firstPage = await fetchPage(itemCode, 1, pageSize);

			if (!firstPage.StatisticSearch?.row) {
				const error = new DataError(`응답 데이터 형식이 올바르지 않습니다 (${itemCode})`, {
					location: 'fetchPpiStatistics',
					userMessage: '데이터 형식이 올바르지 않습니다.',
					metadata: { itemCode },
				});
				handleError(error, 'fetchPpiStatistics');
				return { itemCode, data: [] };
			}

			const totalCount = firstPage.StatisticSearch.list_total_count ?? 0;
			const allRows: StatisticSearchItem[] = [...firstPage.StatisticSearch.row];

			if (totalCount > allRows.length) {
				const pagePromises: Promise<StatisticSearchResponse>[] = [];
				for (let start = pageSize + 1; start <= totalCount; start += pageSize) {
					const end = Math.min(start + pageSize - 1, totalCount);
					pagePromises.push(fetchPage(itemCode, start, end));
				}

				const pages = await Promise.allSettled(pagePromises);
				pages.forEach((pageResult) => {
					if (pageResult.status === 'fulfilled') {
						const rows = pageResult.value.StatisticSearch?.row ?? [];
						allRows.push(...rows);
					} else {
						handleError(pageResult.reason, `fetchPpiStatistics:${itemCode}`);
					}
				});
			}

			return { itemCode, data: allRows };
		} catch (error) {
			handleError(error, `fetchPpiStatistics:${itemCode}`);
			// 에러가 발생해도 빈 배열을 반환하여 다른 항목들은 계속 처리
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
			const error = handleError(promiseResult.reason, `fetchPpiStatistics:${itemCode}`);
			result[itemCode] = [];
		}
	});

	return result;
};

export default fetchPpiStatistics;
