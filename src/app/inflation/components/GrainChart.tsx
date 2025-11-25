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
	data: StatisticItem[];
	brownRiceData?: StatisticItem[];
	glutinousRiceData?: StatisticItem[];
	barleyRiceData?: StatisticItem[];
	beanData?: StatisticItem[];
	peanutData?: StatisticItem[];
	flourData?: StatisticItem[];
};

const GrainChart = ({
	data,
	brownRiceData,
	glutinousRiceData,
	barleyRiceData,
	beanData,
	peanutData,
	flourData,
}: GrainChartProps) => {
	// 모든 데이터셋을 처리하는 함수
	const processDataset = (dataset: StatisticItem[], key: string) => {
		return dataset
			.map((item) => ({
				year: item.TIME,
				[key]: parseFloat(item.DATA_VALUE) || 0,
			}))
			.sort((a, b) => a.year.localeCompare(b.year));
	};

	// 각 데이터셋 변환
	const riceChartData = processDataset(data, 'rice');
	const brownRiceChartData = brownRiceData ? processDataset(brownRiceData, 'brownRice') : [];
	const glutinousRiceChartData = glutinousRiceData ? processDataset(glutinousRiceData, 'glutinousRice') : [];
	const barleyRiceChartData = barleyRiceData ? processDataset(barleyRiceData, 'barleyRice') : [];
	const beanChartData = beanData ? processDataset(beanData, 'bean') : [];
	const peanutChartData = peanutData ? processDataset(peanutData, 'peanut') : [];
	const flourChartData = flourData ? processDataset(flourData, 'flour') : [];

	// 모든 데이터셋을 병합
	const chartData: ChartDataPoint[] = riceChartData.map((riceItem) => {
		const brownRiceItem = brownRiceChartData.find((item) => item.year === riceItem.year);
		const glutinousRiceItem = glutinousRiceChartData.find((item) => item.year === riceItem.year);
		const barleyRiceItem = barleyRiceChartData.find((item) => item.year === riceItem.year);
		const beanItem = beanChartData.find((item) => item.year === riceItem.year);
		const peanutItem = peanutChartData.find((item) => item.year === riceItem.year);
		const flourItem = flourChartData.find((item) => item.year === riceItem.year);

		return {
			year: riceItem.year,
			rice: riceItem.rice,
			brownRice: brownRiceItem?.brownRice || null,
			glutinousRice: glutinousRiceItem?.glutinousRice || null,
			barleyRice: barleyRiceItem?.barleyRice || null,
			bean: beanItem?.bean || null,
			peanut: peanutItem?.peanut || null,
			flour: flourItem?.flour || null,
		};
	});

	// 라인 구성 설정
	const lines: LineConfig[] = [
		{
			dataKey: 'rice',
			name: data[0]?.ITEM_NAME1 || '',
			color: 'rgb(59, 130, 246)', // blue
		},
	];

	// 조건부로 라인 추가
	if (brownRiceData && brownRiceData.length > 0) {
		lines.push({
			dataKey: 'brownRice',
			name: brownRiceData[0]?.ITEM_NAME1 || '',
			color: 'rgb(34, 197, 94)', // green
		});
	}

	if (glutinousRiceData && glutinousRiceData.length > 0) {
		lines.push({
			dataKey: 'glutinousRice',
			name: glutinousRiceData[0]?.ITEM_NAME1 || '',
			color: 'rgb(168, 85, 247)', // purple
		});
	}

	if (barleyRiceData && barleyRiceData.length > 0) {
		lines.push({
			dataKey: 'barleyRice',
			name: barleyRiceData[0]?.ITEM_NAME1 || '',
			color: 'rgb(245, 101, 101)', // red
		});
	}

	if (beanData && beanData.length > 0) {
		lines.push({
			dataKey: 'bean',
			name: beanData[0]?.ITEM_NAME1 || '',
			color: 'rgb(251, 191, 36)', // amber
		});
	}

	if (peanutData && peanutData.length > 0) {
		lines.push({
			dataKey: 'peanut',
			name: peanutData[0]?.ITEM_NAME1 || '',
			color: 'rgb(14, 165, 233)', // sky
		});
	}

	if (flourData && flourData.length > 0) {
		lines.push({
			dataKey: 'flour',
			name: flourData[0]?.ITEM_NAME1 || '',
			color: 'rgb(139, 69, 19)', // brown
		});
	}

	const unitName = data[0]?.UNIT_NAME || '';

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
