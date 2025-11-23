'use client';

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LabelList,
} from 'recharts';

type StatisticItem = {
	DATA_VALUE: string;
	TIME: string;
	ITEM_NAME1: string;
	UNIT_NAME: string;
};

type InflationChartProps = {
	data: StatisticItem[];
};

const InflationChart = ({ data }: InflationChartProps) => {
	// 데이터를 차트 형식으로 변환 (시간순 정렬 및 숫자 변환)
	const chartData = data
		.map((item) => ({
			year: item.TIME,
			value: parseFloat(item.DATA_VALUE) || 0,
		}))
		.sort((a, b) => a.year.localeCompare(b.year));

	if (chartData.length === 0) {
		return (
			<div className="flex items-center justify-center h-64 text-sm text-zinc-600 dark:text-zinc-400">
				표시할 데이터가 없습니다.
			</div>
		);
	}

	const unitName = data[0]?.UNIT_NAME || '';
	const itemName = data[0]?.ITEM_NAME1 || '';

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
						dataKey="value"
						stroke="rgb(59, 130, 246)"
						strokeWidth={2}
						dot={{ r: 4 }}
						activeDot={{ r: 6 }}
						name={itemName}
					>
						<LabelList
							dataKey="value"
							position="top"
							className="fill-zinc-700 dark:fill-zinc-300"
							style={{ fontSize: '12px', fontWeight: 500 }}
						/>
					</Line>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default InflationChart;
