'use client';

import { LineChart } from '@/components/charts';
import type { LineConfig, ChartDataPoint } from '@/components/charts';

type StatisticItem = {
	DATA_VALUE: string;
	TIME: string;
	ITEM_NAME1: string;
	UNIT_NAME: string;
};

type GrainChartProps = {
	data: Record<string, StatisticItem[]>;
};

const GrainChart = ({ data }: GrainChartProps) => {
	// 아이템 코드와 키 매핑
	const itemCodeMapping: Record<string, { key: string; color: string }> = {
		A01101: { key: 'rice', color: 'rgb(59, 130, 246)' },
		A01102: { key: 'brownRice', color: 'rgb(34, 197, 94)' },
		A01103: { key: 'glutinousRice', color: 'rgb(168, 85, 247)' },
		A01104: { key: 'barleyRice', color: 'rgb(245, 101, 101)' },
		A01105: { key: 'bean', color: 'rgb(251, 191, 36)' },
		A01106: { key: 'peanut', color: 'rgb(14, 165, 233)' },
		A01108: { key: 'flour', color: 'rgb(139, 69, 19)' },
	};

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
			const mapping = itemCodeMapping[itemCode];
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
		const mapping = itemCodeMapping[itemCode];
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
			height="24rem"
			emptyMessage="표시할 데이터가 없습니다."
		/>
	);
};

export default GrainChart;
