import useCpiStatistics from '@/hooks/cpi/useCpiStatistics';
import CpiChart from '@/components/cpi/CpiChart';
import { DAIRY_EGGS_ITEM_CODES } from '@/const/cpiItemCodes';

const DairySection = async () => {
	const stats = await useCpiStatistics([...DAIRY_EGGS_ITEM_CODES]);

	if (Object.keys(stats).length === 0) {
		return null;
	}

	return (
		<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
			<h2 className="text-lg font-semibold mb-4">우유 · 치즈 및 계란</h2>
			<CpiChart data={stats} />
		</section>
	);
};

export default DairySection;
