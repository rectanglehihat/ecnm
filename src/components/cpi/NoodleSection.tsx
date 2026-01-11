import useCpiStatistics from '@/hooks/cpi/useCpiStatistics';
import CpiChart from '@/components/cpi/CpiChart';
import { NOODLE_ITEM_CODES } from '@/const/cpiItemCodes';

const NoodleSection = async () => {
	const noodleStats = await useCpiStatistics([...NOODLE_ITEM_CODES]);

	if (Object.keys(noodleStats).length === 0) {
		return null;
	}

	return (
		<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
			<h2 className="text-lg font-semibold mb-4">면 및 빵</h2>
			<CpiChart data={noodleStats} />
		</section>
	);
};

export default NoodleSection;
