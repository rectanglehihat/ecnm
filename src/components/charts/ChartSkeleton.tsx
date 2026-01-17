import Skeleton from '@/components/ui/Skeleton';

const ChartSkeleton = () => {
	return (
		<div className="w-full h-96 p-2">
			{/* 차트 영역 스켈레톤 */}
			<div className="relative w-full h-80 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
				{/* Y축 레이블들 */}
				<div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton
							key={i}
							className="h-2 w-6"
						/>
					))}
				</div>

				{/* 차트 그래프 영역 */}
				<div className="ml-10 mr-4 mt-4 mb-8 h-full relative">
					{/* 로딩 스피너와 텍스트 */}
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<div className="w-12 h-12 border-4 border-zinc-300 dark:border-zinc-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
						<div className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">차트 데이터를 불러오는 중...</div>
					</div>
				</div>

				{/* X축 레이블들 */}
				<div className="absolute bottom-2 left-10 right-4 flex justify-between">
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton
							key={i}
							className="h-2 w-8"
						/>
					))}
				</div>
			</div>

			{/* 범례 스켈레톤 */}
			<div className="flex flex-wrap gap-4 mt-4 justify-center">
				{[
					{ color: 'bg-blue-400', width: 'w-8' },
					{ color: 'bg-green-400', width: 'w-12' },
					{ color: 'bg-purple-400', width: 'w-10' },
					{ color: 'bg-red-400', width: 'w-14' },
					{ color: 'bg-yellow-400', width: 'w-8' },
				].map((item, i) => (
					<div
						key={i}
						className="flex items-center gap-2"
					>
						<div className={`h-2 w-2 rounded-full ${item.color} skeleton-fade`} />
						<Skeleton className={`h-2 ${item.width}`} />
					</div>
				))}
			</div>
		</div>
	);
};

ChartSkeleton.displayName = 'ChartSkeleton';
export default ChartSkeleton;
