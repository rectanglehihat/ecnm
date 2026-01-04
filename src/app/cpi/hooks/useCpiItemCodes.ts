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

export type CpiItemHierarchy = {
	code: string;
	name: string;
	children: CpiItemHierarchy[];
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

/**
 * 소비자물가지수의 통계항목 코드를 계층구조로 재귀적으로 추출합니다.
 * CYCLE이 'A'인 항목만 필터링하며, 한번에 10개씩 호출합니다.
 * A의 하위 항목을 모두 가져오면 중단합니다.
 * @param statCode 통계표 코드 (기본값: '901Y009')
 * @returns 계층구조 트리
 */
export const fetchCpiItemHierarchy = async (statCode = '901Y009'): Promise<CpiItemHierarchy[]> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	if (!apiKey || !baseUrl) {
		console.error('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.');
		return [];
	}

	const BATCH_SIZE = 10; // 한번에 10개씩 호출
	const allItems: StatisticItem[] = [];
	let start = 1;
	let hasMore = true;
	let totalCount = 0;

	// 페이지네이션을 통해 모든 항목을 가져옴 (A의 하위 항목까지)
	while (hasMore) {
		try {
			const end = start + BATCH_SIZE - 1;
			const url = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/${start}/${end}/${statCode}`;
			const res = await fetch(url, { cache: 'no-store', next: { revalidate: 60 * 60 * 24 } });

			if (!res.ok) {
				console.error(`한국은행(ECOS) 통계항목 호출 실패 (${start}-${end})`, res.status, res.statusText);
				break;
			}

			const data = (await res.json()) as StatisticItemListResponse;
			const rows = data?.StatisticItemList?.row ?? [];
			totalCount = data?.StatisticItemList?.list_total_count ?? 0;

			allItems.push(...rows);

			// CYCLE이 'A'이고 ITEM_CODE가 'A'로 시작하는 항목만 필터링하여 확인
			const aItems = allItems.filter((item) => item.CYCLE === 'A' && item.ITEM_CODE.startsWith('A'));

			// 더 이상 가져올 데이터가 없거나, A의 모든 하위 항목을 가져왔으면 중단
			if (rows.length < BATCH_SIZE || end >= totalCount) {
				hasMore = false;
			} else {
				start = end + 1;
			}

			// CYCLE이 'A'이고 A로 시작하는 항목이 더 이상 없으면 중단
			const currentBatchAItems = rows.filter((item) => item.CYCLE === 'A' && item.ITEM_CODE.startsWith('A'));
			if (currentBatchAItems.length === 0 && aItems.length > 0) {
				hasMore = false;
			}
		} catch (error) {
			console.error(`한국은행(ECOS) 통계항목 호출 중 오류 발생 (${start}):`, error);
			hasMore = false;
		}
	}

	// CYCLE이 'A'이고 A로 시작하는 항목만 필터링
	const aItems = allItems.filter((item) => item.CYCLE === 'A' && item.ITEM_CODE.startsWith('A'));

	// 계층구조를 메모리에서 구성
	const buildHierarchy = (parentCode: string | null): CpiItemHierarchy[] => {
		// 현재 부모의 직접적인 하위 항목 찾기
		const children = aItems.filter((item) => {
			if (parentCode === null) {
				// 최상위: ITEM_CODE가 'A'인 항목
				return item.ITEM_CODE === 'A';
			}
			// 하위 항목: P_ITEM_CODE가 부모 코드와 일치하는 항목
			return item.P_ITEM_CODE === parentCode;
		});

		// 하위 항목이 없으면 재귀 중단
		if (children.length === 0) {
			return [];
		}

		// 각 하위 항목에 대해 재귀적으로 하위 항목을 탐색
		return children.map((item) => ({
			code: item.ITEM_CODE,
			name: item.ITEM_NAME,
			children: buildHierarchy(item.ITEM_CODE),
		}));
	};

	return buildHierarchy(null);
};

export default useCpiItemCodes;
