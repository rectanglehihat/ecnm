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
		</>
	);
};

export default APage;
