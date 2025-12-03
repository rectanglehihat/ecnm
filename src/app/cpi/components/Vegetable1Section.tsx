import useCpiStatistics from '@/app/cpi/hooks/useCpiStatistics';
import CpiChart from '@/app/cpi/components/CpiChart';
import { VEGETABLE1_ITEM_CODES } from '@/const/cpiItemCodes';

const Vegetable1Section = async () => {
	const stats = await useCpiStatistics([...VEGETABLE1_ITEM_CODES]);

	if (Object.keys(stats).length === 0) {
		return null;
	}

	return (
		<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
			<h2 className="text-lg font-semibold mb-4">채소1</h2>
			<CpiChart data={stats} />
		</section>
	);
};

export default Vegetable1Section;
