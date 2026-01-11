import useCpiStatistics from '@/hooks/cpi/useCpiStatistics';
import CpiChart from '@/components/cpi/CpiChart';
import { FISH_ITEM_CODES } from '@/const/cpiItemCodes';

const FishSection = async () => {
	const fishStats = await useCpiStatistics([...FISH_ITEM_CODES]);

	if (Object.keys(fishStats).length === 0) {
		return null;
	}

	return (
		<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
			<h2 className="text-lg font-semibold mb-4">어류</h2>
			<CpiChart data={fishStats} />
		</section>
	);
};

export default FishSection;
