'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type StatisticItem = {
	DATA_VALUE: string;
	TIME: string;
	ITEM_NAME1: string;
	UNIT_NAME: string;
};

type InflationChartProps = {
	data: StatisticItem[];
	brownRiceData?: StatisticItem[];
	glutinousRiceData?: StatisticItem[];
	barleyRiceData?: StatisticItem[];
	beanData?: StatisticItem[];
	peanutData?: StatisticItem[];
	flourData?: StatisticItem[];
};

const InflationChart = ({
	data,
	brownRiceData,
	glutinousRiceData,
	barleyRiceData,
	beanData,
	peanutData,
	flourData,
}: InflationChartProps) => {
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
	const chartData = riceChartData.map((riceItem) => {
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

	if (chartData.length === 0) {
		return (
			<div className="flex items-center justify-center h-64 text-sm text-zinc-600 dark:text-zinc-400">
				표시할 데이터가 없습니다.
			</div>
		);
	}

	const unitName = data[0]?.UNIT_NAME || '';
	const itemName = data[0]?.ITEM_NAME1 || '';
	const brownRiceItemName = brownRiceData?.[0]?.ITEM_NAME1 || '';
	const glutinousRiceItemName = glutinousRiceData?.[0]?.ITEM_NAME1 || '';
	const barleyRiceItemName = barleyRiceData?.[0]?.ITEM_NAME1 || '';
	const beanItemName = beanData?.[0]?.ITEM_NAME1 || '';
	const peanutItemName = peanutData?.[0]?.ITEM_NAME1 || '';
	const flourItemName = flourData?.[0]?.ITEM_NAME1 || '';

	const colors = [
		'rgb(59, 130, 246)', // blue - 쌀
		'rgb(34, 197, 94)', // green - 현미
		'rgb(168, 85, 247)', // purple - 찹쌀
		'rgb(245, 101, 101)', // red - 보리
		'rgb(251, 191, 36)', // amber - 콩
		'rgb(14, 165, 233)', // sky - 땅콩
		'rgb(139, 69, 19)', // brown - 밀가루
	];

	return (
		<div className="w-full h-96">
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<LineChart
					data={chartData}
					margin={{
						top: 20,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						className="stroke-zinc-200 dark:stroke-zinc-800"
					/>
					<XAxis
						dataKey="year"
						className="text-xs"
						tick={{ fill: 'currentColor' }}
						stroke="currentColor"
					/>
					<YAxis
						className="text-xs"
						tick={{ fill: 'currentColor' }}
						stroke="currentColor"
						label={{ value: unitName, angle: -90, position: 'insideLeft' }}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: 'var(--tw-color-zinc-900)',
							border: '1px solid var(--tw-color-zinc-800)',
							borderRadius: '0.5rem',
						}}
						labelStyle={{ color: 'var(--tw-color-zinc-50)' }}
					/>
					<Legend />
					<Line
						type="monotone"
						dataKey="rice"
						stroke={colors[0]}
						strokeWidth={2}
						dot={{ r: 4 }}
						activeDot={{ r: 6 }}
						name={itemName}
					/>
					{brownRiceData && brownRiceData.length > 0 && (
						<Line
							type="monotone"
							dataKey="brownRice"
							stroke={colors[1]}
							strokeWidth={2}
							dot={{ r: 4 }}
							activeDot={{ r: 6 }}
							name={brownRiceItemName}
						/>
					)}
					{glutinousRiceData && glutinousRiceData.length > 0 && (
						<Line
							type="monotone"
							dataKey="glutinousRice"
							stroke={colors[2]}
							strokeWidth={2}
							dot={{ r: 4 }}
							activeDot={{ r: 6 }}
							name={glutinousRiceItemName}
						/>
					)}
					{barleyRiceData && barleyRiceData.length > 0 && (
						<Line
							type="monotone"
							dataKey="barleyRice"
							stroke={colors[3]}
							strokeWidth={2}
							dot={{ r: 4 }}
							activeDot={{ r: 6 }}
							name={barleyRiceItemName}
						/>
					)}
					{beanData && beanData.length > 0 && (
						<Line
							type="monotone"
							dataKey="bean"
							stroke={colors[4]}
							strokeWidth={2}
							dot={{ r: 4 }}
							activeDot={{ r: 6 }}
							name={beanItemName}
						/>
					)}
					{peanutData && peanutData.length > 0 && (
						<Line
							type="monotone"
							dataKey="peanut"
							stroke={colors[5]}
							strokeWidth={2}
							dot={{ r: 4 }}
							activeDot={{ r: 6 }}
							name={peanutItemName}
						/>
					)}
					{flourData && flourData.length > 0 && (
						<Line
							type="monotone"
							dataKey="flour"
							stroke={colors[6]}
							strokeWidth={2}
							dot={{ r: 4 }}
							activeDot={{ r: 6 }}
							name={flourItemName}
						/>
					)}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default InflationChart;
