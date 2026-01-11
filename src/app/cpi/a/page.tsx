import GrainSection from '@/components/cpi/GrainSection';
import ChartSkeleton from '@/components/charts/ChartSkeleton';
import { Suspense } from 'react';
import { fetchCpiItemHierarchy } from '@/hooks/cpi/useCpiItemCodes';
import HierarchyButtons from '../../../components/cpi/HierarchyButtons';

const APage = async () => {
	const aHierarchy = await fetchCpiItemHierarchy('901Y009', 'A');
	console.log('❤️ aHierarchy', aHierarchy);

	if (!aHierarchy) {
		return <div className="text-red-500">❌ 데이터 조회 실패</div>;
	}

	return (
		<>
			<h1 className="text-2xl font-bold">{aHierarchy.name}</h1>
			<HierarchyButtons children={aHierarchy.children} />

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
