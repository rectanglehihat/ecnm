import useCpiStatistics from '@/hooks/cpi/useCpiStatistics';
import CpiChart from '@/components/cpi/CpiChart';
import { SEAFOOD_ITEM_CODES } from '@/const/cpiItemCodes';

const SeafoodSection = async () => {
	const seafoodStats = await useCpiStatistics([...SEAFOOD_ITEM_CODES]);

	if (Object.keys(seafoodStats).length === 0) {
		return null;
	}

	return (
		<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
			<h2 className="text-lg font-semibold mb-4">수산물 및 가공품</h2>
			<CpiChart data={seafoodStats} />
		</section>
	);
};

export default SeafoodSection;
