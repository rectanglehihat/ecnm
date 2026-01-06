import GrainSection from '@/app/cpi/components/GrainSection';
import ChartSkeleton from '@/components/charts/ChartSkeleton';
import { Suspense } from 'react';

const APage = () => {
	return (
		<>
			<section className="text-sm text-zinc-700 dark:text-zinc-300 flex flex-col gap-2">
				<p className="font-semibold">🍎 2020=100</p>
				<ul>
					<li>기준연도: 2020년</li>
					<li>지수: 기준연도의 가격 수준을 100으로 고정</li>
					<li>다른 시점의 CPI가 100보다 높으면 기준연도보다 평균 물가가 높다는 뜻</li>
					<li>다른 시점의 CPI가 100보다 낮으면 기준연도보다 평균 물가가 낮다는 뜻</li>
				</ul>
			</section>

			<Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">곡물</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<GrainSection />
			</Suspense>

			{/* <Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">면류</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<NoodleSection />
			</Suspense>

			<Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">육류</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<MeatSection />
			</Suspense>

			<Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">어류</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<FishSection />
			</Suspense>

			<Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">수산물 및 가공품</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<SeafoodSection />
			</Suspense>

			<Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">우유 · 치즈 및 계란</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<DairySection />
			</Suspense>

			<Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">식용유지</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<OilSection />
			</Suspense>

			<Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">과일</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<FruitSection />
			</Suspense>

			<Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">채소1</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<Vegetable1Section />
			</Suspense>

			<Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">채소2</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<Vegetable2Section />
			</Suspense>

			<Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">과자 · 빙과류</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<SnackSection />
			</Suspense>

			<Suspense
				fallback={
					<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<h2 className="text-lg font-semibold mb-4">기타 식료품</h2>
						<ChartSkeleton />
					</section>
				}
			>
				<OtherGroceriesSection />
			</Suspense> */}
		</>
	);
};

export default APage;
