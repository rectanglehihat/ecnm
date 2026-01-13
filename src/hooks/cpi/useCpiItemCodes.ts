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
	children: Record<string, CpiItemHierarchy>;
};

/**
 * 소비자물가지수의 통계항목 코드를 계층구조로 재귀적으로 추출합니다.
 * CYCLE이 'A'인 항목만 필터링하며, 한번에 10개씩 호출합니다.
 * rootItemCode(예: 'A', 'B', 'C')의 하위 항목을 모두 가져오면 중단합니다.
 * @param statCode 통계표 코드 (기본값: '901Y009')
 * @param rootItemCode 최상위 항목 코드 (기본값: 'A')
 * @returns 계층구조 객체 (최상위 항목 rootItemCode)
 */
export const useCpiItemCodes = async (statCode = '901Y009', rootItemCode = 'A'): Promise<CpiItemHierarchy | null> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	if (!apiKey || !baseUrl) {
		console.error('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.');
		return null;
	}

	const rootCode = rootItemCode.trim();
	if (!rootCode) {
		console.error('rootItemCode가 비어있습니다.');
		return null;
	}

	const BATCH_SIZE = 10; // 한번에 10개씩 호출
	const allItems: StatisticItem[] = [];
	let start = 1;
	let hasMore = true;
	let totalCount = 0;

	// 페이지네이션을 통해 모든 항목을 가져옴 (rootCode의 하위 항목까지)
	while (hasMore) {
		try {
			const end = start + BATCH_SIZE - 1;
			const url = `${baseUrl}/StatisticItemList/${apiKey}/json/kr/${start}/${end}/${statCode}`;
			const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });

			if (!res.ok) {
				console.error(`한국은행(ECOS) 통계항목 호출 실패 (${start}-${end})`, res.status, res.statusText);
				break;
			}

			const data = (await res.json()) as StatisticItemListResponse;
			const rows = data?.StatisticItemList?.row ?? [];
			totalCount = data?.StatisticItemList?.list_total_count ?? 0;

			allItems.push(...rows);

			// CYCLE이 'A'이고 ITEM_CODE가 rootCode로 시작하는 항목만 필터링하여 확인
			const rootItems = allItems.filter((item) => item.CYCLE === 'A' && item.ITEM_CODE.startsWith(rootCode));

			// 더 이상 가져올 데이터가 없거나, A의 모든 하위 항목을 가져왔으면 중단
			if (rows.length < BATCH_SIZE || end >= totalCount) {
				hasMore = false;
			} else {
				start = end + 1;
			}

			// CYCLE이 'A'이고 rootCode로 시작하는 항목이 더 이상 없으면 중단
			const currentBatchRootItems = rows.filter((item) => item.CYCLE === 'A' && item.ITEM_CODE.startsWith(rootCode));
			if (currentBatchRootItems.length === 0 && rootItems.length > 0) {
				hasMore = false;
			}
		} catch (error) {
			console.error(`한국은행(ECOS) 통계항목 호출 중 오류 발생 (${start}):`, error);
			hasMore = false;
		}
	}

	// CYCLE이 'A'이고 rootCode로 시작하는 항목만 필터링
	const rootItems = allItems.filter((item) => item.CYCLE === 'A' && item.ITEM_CODE.startsWith(rootCode));

	// 계층구조를 메모리에서 구성
	const buildHierarchy = (parentCode: string | null): CpiItemHierarchy | null => {
		// 최상위 항목(rootCode) 찾기
		if (parentCode === null) {
			const topItem = rootItems.find((item) => item.ITEM_CODE === rootCode);
			if (!topItem) {
				return null;
			}

			// rootCode의 직접적인 하위 항목들 찾기 (P_ITEM_CODE가 rootCode인 항목들)
			const directChildren = rootItems.filter((item) => item.P_ITEM_CODE === rootCode);
			const childHierarchy: Record<string, CpiItemHierarchy> = {};

			// 각 하위 항목에 대해 재귀적으로 구성
			for (const item of directChildren) {
				const child = buildHierarchy(item.ITEM_CODE);
				if (child) {
					childHierarchy[item.ITEM_CODE] = child;
				}
			}

			return {
				code: topItem.ITEM_CODE,
				name: topItem.ITEM_NAME,
				children: childHierarchy,
			};
		}

		// 현재 부모의 직접적인 하위 항목 찾기
		const children = rootItems.filter((item) => item.P_ITEM_CODE === parentCode);

		// 하위 항목이 없으면 재귀 중단 (리프 노드)
		if (children.length === 0) {
			// 현재 항목 자체를 반환 (하위 항목이 없는 경우)
			const currentItem = rootItems.find((item) => item.ITEM_CODE === parentCode);
			if (!currentItem) {
				return null;
			}
			return {
				code: currentItem.ITEM_CODE,
				name: currentItem.ITEM_NAME,
				children: {},
			};
		}

		// 하위 항목들을 객체로 구성
		const childHierarchy: Record<string, CpiItemHierarchy> = {};
		for (const item of children) {
			const child = buildHierarchy(item.ITEM_CODE);
			if (child) {
				childHierarchy[item.ITEM_CODE] = child;
			}
		}

		// 현재 항목 정보 찾기
		const currentItem = rootItems.find((item) => item.ITEM_CODE === parentCode);
		if (!currentItem) {
			return null;
		}

		return {
			code: currentItem.ITEM_CODE,
			name: currentItem.ITEM_NAME,
			children: childHierarchy,
		};
	};

	return buildHierarchy(null);
};
