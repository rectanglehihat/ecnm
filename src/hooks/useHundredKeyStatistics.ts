type KeyStatisticItem = {
	CLASS_NAME: string;
	CYCLE: string;
	DATA_VALUE: string;
	KEYSTAT_NAME: string;
	UNIT_NAME: string;
};

type KeyStatisticResponse = {
	KeyStatisticList: {
		list_total_count: number;
		row: KeyStatisticItem[];
		row_count: number;
	};
};

const useHundredKeyStatistics = async (): Promise<KeyStatisticItem[]> => {
	const apiKey = process.env.NEXT_PUBLIC_BOK_API_KEY;

	if (!apiKey) {
		console.error('BOK_API_KEY 환경 변수가 설정되어 있지 않습니다.');
		return [];
	}

	const url = `https://ecos.bok.or.kr/api/KeyStatisticList/${apiKey}/json/kr/1/10`;
	const res = await fetch(url, { cache: 'no-store' });

	if (!res.ok) {
		console.error('한국은행 Open API 호출 실패', res.status, res.statusText);
		return [];
	}

	const data = (await res.json()) as KeyStatisticResponse;
	// console.log('❤️ data', data);

	if (!data.KeyStatisticList?.row) {
		return [];
	}

	return data.KeyStatisticList.row ?? [];
};

export default useHundredKeyStatistics;
