import { StatisticItem, StatisticItemListResponse } from '@/lib/cpi/fetchCpiItemCodes';
import { ApiError, DataError, handleError } from '@/lib/errors';

export interface PpiItemHierarchy {
	code: string;
	name: string;
	children: StatisticItem[];
}

export const fetchPpiItemCodes = async (
	statCode: string,
	rootItemCode?: string,
): Promise<PpiItemHierarchy[] | null> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	if (!apiKey || !baseUrl) {
		throw new DataError('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.', {
			location: 'fetchPpiItemCodes',
			userMessage: 'API 설정이 올바르지 않습니다. 관리자에게 문의하세요.',
			retryable: false,
			metadata: { missingKey: !apiKey, missingUrl: !baseUrl },
		});
	}

	const BATCH_SIZE = 10;
	let totalCount = 0;

	try {
		// 첫 요청
		const firstUrl = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/1/${BATCH_SIZE}/${statCode}`;
		const firstRes = await fetch(firstUrl, { next: { revalidate: 60 * 60 * 24 * 30 } });

		if (!firstRes.ok) {
			throw new ApiError('CPI 항목 코드 초기 데이터 조회 실패', firstRes.status, {
				location: 'fetchPpiItemCodes',
				userMessage: 'PPI 항목 데이터를 불러올 수 없습니다.',
				retryable: firstRes.status >= 500,
				metadata: { url: firstUrl, status: firstRes.status },
			});
		}

		const firstData = (await firstRes.json()) as StatisticItemListResponse;

		if (!firstData?.StatisticItemList?.row) {
			throw new DataError('응답 데이터 형식이 올바르지 않습니다.', {
				location: 'fetchPpiItemCodes',
				userMessage: '데이터 형식이 올바르지 않습니다.',
				metadata: { url: firstUrl },
			});
		}

		const allItems: StatisticItem[] = firstData.StatisticItemList.row;
		totalCount = firstData.StatisticItemList.list_total_count ?? 0;

		// 나머지 요청
		const remainingRequests: Promise<Response>[] = [];
		for (let start = BATCH_SIZE + 1; start <= totalCount; start += BATCH_SIZE) {
			const end = Math.min(start + BATCH_SIZE - 1, totalCount);
			const url = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/${start}/${end}/${statCode}`;
			remainingRequests.push(fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } }));
		}

		const responses = await Promise.all(remainingRequests);
		for (const res of responses) {
			if (!res.ok) {
				handleError(
					new ApiError('PPI 항목 코드 추가 데이터 조회 실패', res.status, {
						location: 'fetchPpiItemCodes',
						userMessage: '일부 PPI 항목 데이터를 불러올 수 없습니다.',
						retryable: res.status >= 500,
						metadata: { url: res.url, status: res.status },
					}),
					'fetchPpiItemCodes',
				);
				continue;
			}

			try {
				const data = (await res.json()) as StatisticItemListResponse;
				const rows = data?.StatisticItemList?.row ?? [];
				allItems.push(...rows);
			} catch (error) {
				handleError(error, 'fetchPpiItemCodes:parseResponse');
			}
		}

		const filteredItems = allItems.filter((item) => item.CYCLE === 'M');

		const buildPpiHierarchy = (items: StatisticItem[]): PpiItemHierarchy[] => {
			const acc = items.reduce<{ parents: PpiItemHierarchy[]; children: StatisticItem[] }>(
				(acc, item) => {
					if (item.ITEM_CODE.startsWith('R')) {
						acc.children.push(item);
					}

					if (item.ITEM_CODE.startsWith('H')) {
						acc.parents.push({
							code: item.ITEM_CODE,
							name: item.ITEM_NAME,
							children: acc.children,
						});
					}

					return acc;
				},
				{ parents: [], children: [] },
			);

			return acc.parents;
		};

		const hierarchies = buildPpiHierarchy(filteredItems);

		return hierarchies;
	} catch (error) {
		// 에러 처리 및 재throw
		throw handleError(error, 'fetchPpiItemCodes');
	}
};
