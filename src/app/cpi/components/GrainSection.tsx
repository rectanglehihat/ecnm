import useCpiStatistics from '@/app/cpi/hooks/useCpiStatistics';
import CpiChart from '@/app/cpi/components/CpiChart';
import { GRAIN_ITEM_CODES } from '@/const/cpiItemCodes';
import { fetchCpiItemHierarchy } from '@/app/cpi/hooks/useCpiItemCodes';

const GrainSection = async () => {
	const grainStats = await useCpiStatistics([...GRAIN_ITEM_CODES]);
	const hierarchy = await fetchCpiItemHierarchy('901Y009');
	console.log('❤️ hierarchy', hierarchy);

	if (Object.keys(grainStats).length === 0) {
		return null;
	}

	return (
		<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
			<h2 className="text-lg font-semibold mb-4">곡물</h2>
			<CpiChart data={grainStats} />
		</section>
	);
};

export default GrainSection;
