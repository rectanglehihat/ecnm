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
	const baseUrl = process.env.NEXT_PUBLIC_BOK_BASE_URL;

	if (!apiKey || !baseUrl) {
		console.error('한국은행 Open API 키 또는 기본 URL이 설정되지 않았습니다.');
		return [];
	}

	const url = `${baseUrl}/KeyStatisticList/${apiKey}/json/kr/1/10`;
	const res = await fetch(url, { cache: 'no-store' });

	if (!res.ok) {
		console.error('한국은행 Open API 호출 실패', res.status, res.statusText);
		return [];
	}

	const data = (await res.json()) as KeyStatisticResponse;
	// console.log('❤️ 100', data);

	if (!data.KeyStatisticList?.row) {
		return [];
	}

	return data.KeyStatisticList.row ?? [];
};

export default useHundredKeyStatistics;
