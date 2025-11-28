'use client';

import { LineChart } from '@/components/charts';
import type { LineConfig, ChartDataPoint } from '@/components/charts';
import { ITEM_CODE_MAPPING } from '@/const/chartColors';

type StatisticItem = {
	DATA_VALUE: string;
	TIME: string;
	ITEM_NAME1: string;
	UNIT_NAME: string;
};

type CpiChartProps = {
	data: Record<string, StatisticItem[]>;
	emptyMessage?: string;
	height?: string;
};

const CpiChart = ({ data, emptyMessage = '표시할 데이터가 없습니다.', height = '24rem' }: CpiChartProps) => {
	// 모든 연도를 수집
	const allYears = new Set<string>();
	Object.values(data).forEach((dataset) => {
		dataset.forEach((item) => allYears.add(item.TIME));
	});
	const sortedYears = Array.from(allYears).sort();

	// 차트 데이터 생성
	const chartData: ChartDataPoint[] = sortedYears.map((year) => {
		const yearData: any = { year };

		Object.entries(data).forEach(([itemCode, dataset]) => {
			const mapping = ITEM_CODE_MAPPING[itemCode as keyof typeof ITEM_CODE_MAPPING];
			if (mapping) {
				const item = dataset.find((d) => d.TIME === year);
				yearData[mapping.key] = item ? parseFloat(item.DATA_VALUE) || 0 : null;
			}
		});

		return yearData;
	});

	// 라인 구성 설정
	const lines: LineConfig[] = [];
	Object.entries(data).forEach(([itemCode, dataset]) => {
		const mapping = ITEM_CODE_MAPPING[itemCode as keyof typeof ITEM_CODE_MAPPING];
		if (mapping && dataset.length > 0) {
			lines.push({
				dataKey: mapping.key,
				name: dataset[0]?.ITEM_NAME1 || '',
				color: mapping.color,
			});
		}
	});

	// 단위명 추출 (첫 번째 데이터셋에서)
	const unitName = Object.values(data).find((dataset) => dataset.length > 0)?.[0]?.UNIT_NAME || '';

	return (
		<LineChart
			data={chartData}
			lines={lines}
			xAxisKey="year"
			yAxisLabel={unitName}
			height={height}
			emptyMessage={emptyMessage}
		/>
	);
};

export default CpiChart;
