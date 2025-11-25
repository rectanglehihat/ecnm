'use client';

import {
	LineChart as RechartsLineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

export type ChartDataPoint = {
	[key: string]: string | number | null;
};

export type LineConfig = {
	dataKey: string;
	name: string;
	color: string;
	strokeWidth?: number;
	dotRadius?: number;
	activeDotRadius?: number;
};

export type LineChartProps = {
	data: ChartDataPoint[];
	lines: LineConfig[];
	xAxisKey: string;
	yAxisLabel?: string;
	height?: string | number;
	className?: string;
	emptyMessage?: string;
	margin?: {
		top?: number;
		right?: number;
		left?: number;
		bottom?: number;
	};
	showGrid?: boolean;
	showLegend?: boolean;
	showTooltip?: boolean;
};

const defaultColors = [
	'rgb(59, 130, 246)', // blue
	'rgb(34, 197, 94)', // green
	'rgb(168, 85, 247)', // purple
	'rgb(245, 101, 101)', // red
	'rgb(251, 191, 36)', // amber
	'rgb(14, 165, 233)', // sky
	'rgb(139, 69, 19)', // brown
	'rgb(236, 72, 153)', // pink
	'rgb(16, 185, 129)', // emerald
	'rgb(99, 102, 241)', // indigo
];

const LineChart = ({
	data,
	lines,
	xAxisKey,
	yAxisLabel,
	height = 384,
	className = '',
	emptyMessage = '표시할 데이터가 없습니다.',
	margin = {
		top: 20,
		right: 30,
		left: 20,
		bottom: 5,
	},
	showGrid = true,
	showLegend = true,
	showTooltip = true,
}: LineChartProps) => {
	if (!data || data.length === 0) {
		return (
			<div
				className={`flex items-center justify-center text-sm text-zinc-600 dark:text-zinc-400 ${className}`}
				style={{ height: typeof height === 'number' ? `${height}px` : height }}
			>
				{emptyMessage}
			</div>
		);
	}

	// 자동으로 색상 할당 (색상이 지정되지 않은 경우)
	const processedLines = lines.map((line, index) => ({
		...line,
		color: line.color || defaultColors[index % defaultColors.length],
		strokeWidth: line.strokeWidth || 2,
		dotRadius: line.dotRadius || 4,
		activeDotRadius: line.activeDotRadius || 6,
	}));

	return (
		<div
			className={`w-full ${className}`}
			style={{ height: typeof height === 'number' ? `${height}px` : height }}
		>
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<RechartsLineChart
					data={data}
					margin={margin}
				>
					{showGrid && (
						<CartesianGrid
							strokeDasharray="3 3"
							className="stroke-zinc-200 dark:stroke-zinc-800"
						/>
					)}
					<XAxis
						dataKey={xAxisKey}
						className="text-xs"
						tick={{ fill: 'currentColor' }}
						stroke="currentColor"
					/>
					<YAxis
						className="text-xs"
						tick={{ fill: 'currentColor' }}
						stroke="currentColor"
						label={
							yAxisLabel
								? {
										value: yAxisLabel,
										angle: -90,
										position: 'insideLeft',
								  }
								: undefined
						}
					/>
					{showTooltip && (
						<Tooltip
							contentStyle={{
								backgroundColor: 'var(--tw-color-zinc-900)',
								border: 'none',
								fontWeight: 'semi-bold',
							}}
							labelStyle={{ color: 'var(--tw-color-zinc-50)' }}
						/>
					)}
					{showLegend && <Legend />}
					{processedLines.map((line) => (
						<Line
							key={line.dataKey}
							type="monotone"
							dataKey={line.dataKey}
							stroke={line.color}
							strokeWidth={line.strokeWidth}
							dot={{ r: line.dotRadius }}
							activeDot={{ r: line.activeDotRadius }}
							name={line.name}
							connectNulls={false}
						/>
					))}
				</RechartsLineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default LineChart;
