import useCpiStatistics from '@/app/cpi/hooks/useCpiStatistics';
import GrainChart from '@/app/cpi/components/GrainChart';

const GrainSection = async () => {
	const grainItemCodes = ['A01101', 'A01102', 'A01103', 'A01104', 'A01105', 'A01106', 'A01108'];
	const grainStats = await useCpiStatistics(grainItemCodes);

	if (Object.keys(grainStats).length === 0) {
		return null;
	}

	return (
		<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
			<h2 className="text-lg font-semibold mb-4">곡물</h2>
			<GrainChart data={grainStats} />
		</section>
	);
};

export default GrainSection;
