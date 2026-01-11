import useCpiStatistics from '@/hooks/cpi/useCpiStatistics';
import CpiChart from '@/components/cpi/CpiChart';
import { MEAT_ITEM_CODES } from '@/const/cpiItemCodes';

const MeatSection = async () => {
	const meatStats = await useCpiStatistics([...MEAT_ITEM_CODES]);

	if (Object.keys(meatStats).length === 0) {
		return null;
	}

	return (
		<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
			<h2 className="text-lg font-semibold mb-4">육류</h2>
			<CpiChart data={meatStats} />
		</section>
	);
};

export default MeatSection;
