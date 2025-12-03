import useCpiStatistics from '@/app/cpi/hooks/useCpiStatistics';
import CpiChart from '@/app/cpi/components/CpiChart';
import { SNACK_ICECREAM_ITEM_CODES } from '@/const/cpiItemCodes';

const SnackSection = async () => {
    const stats = await useCpiStatistics([...SNACK_ICECREAM_ITEM_CODES]);

    if (Object.keys(stats).length === 0) return null;

    return (
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold mb-4">과자 · 빙과류</h2>
            <CpiChart data={stats} />
        </section>
    );
};

export default SnackSection;
