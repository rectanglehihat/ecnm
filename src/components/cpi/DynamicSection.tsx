import CpiChart from '@/components/cpi/CpiChart';
import fetchCpiStatistics from '@/lib/cpi/fetchCpiStatistics';

interface DynamicSectionProps {
	itemCodes: string[];
	name: string;
}

const DynamicSection = async ({ itemCodes, name }: DynamicSectionProps) => {
	const stats = await fetchCpiStatistics(itemCodes);

	if (Object.keys(stats).length === 0) {
		return (
			<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
				<h2 className="text-lg font-semibold mb-4">{name}</h2>
				<p className="text-zinc-500">데이터가 없습니다.</p>
			</section>
		);
	}

	return (
		<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
			<h2 className="text-lg font-semibold mb-4">{name}</h2>
			<CpiChart data={stats} />
		</section>
	);
};

DynamicSection.displayName = 'DynamicSection';
export default DynamicSection;
