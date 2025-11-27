import useCpiStatistics from '@/app/cpi/hooks/useCpiStatistics';
import NoodleChart from '@/app/cpi/components/NoodleChart';

const NoodleSection = async () => {
	const noodleItemCodes = ['A01109', 'A01110', 'A01111', 'A01112', 'A01113', 'A01114', 'A01115', 'A01116'];
	const noodleStats = await useCpiStatistics(noodleItemCodes);

	if (Object.keys(noodleStats).length === 0) {
		return null;
	}

	return (
		<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
			<h2 className="text-lg font-semibold mb-4">면 및 빵</h2>
			<NoodleChart data={noodleStats} />
		</section>
	);
};

export default NoodleSection;
