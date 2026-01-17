'use client';

import { useMemo } from 'react';
import { LineChart } from '@/components/charts';
import type { LineConfig, ChartDataPoint } from '@/components/charts';
import { CHART_COLORS } from '@/const/CHART_COLORS';

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
	// itemCode를 기반으로 일관된 색상 인덱스 생성
	const getColorIndex = (code: string) => {
		return code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % CHART_COLORS.length;
	};

	// 모든 연도를 수집 및 정렬
	const sortedYears = useMemo(() => {
		const allYears = new Set<string>();
		Object.values(data).forEach((dataset) => {
			dataset.forEach((item) => allYears.add(item.TIME));
		});
		return Array.from(allYears).sort();
	}, [data]);

	// 차트 데이터 생성
	const chartData: ChartDataPoint[] = useMemo(() => {
		return sortedYears.map((year) => {
			const yearData: any = { year };

			Object.entries(data).forEach(([itemCode, dataset]) => {
				const item = dataset.find((d) => d.TIME === year);
				yearData[itemCode] = item ? parseFloat(item.DATA_VALUE) || 0 : null;
			});

			return yearData;
		});
	}, [data, sortedYears]);

	// 라인 구성 설정
	const lines: LineConfig[] = useMemo(() => {
		const result: LineConfig[] = [];
		Object.entries(data).forEach(([itemCode, dataset]) => {
			if (dataset.length === 0) return;
			result.push({
				dataKey: itemCode,
				name: dataset[0]?.ITEM_NAME1 || '',
				color: CHART_COLORS[getColorIndex(itemCode)],
			});
		});
		return result;
	}, [data, getColorIndex]);

	// 단위명 추출
	const unitName = useMemo(() => {
		return Object.values(data).find((dataset) => dataset.length > 0)?.[0]?.UNIT_NAME || '';
	}, [data]);

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

CpiChart.displayName = 'CpiChart';
export default CpiChart;
