import CpiChart from '@/components/cpi/CpiChart';
import { handleError } from '@/lib/errors';
import fetchPpiStatistics from '@/lib/ppi/fetchPpiStatistics';

interface DynamicSectionProps {
	itemCodes: string[];
	name: string;
	parentCode: string;
}

const DynamicSection = async ({ itemCodes, name, parentCode }: DynamicSectionProps) => {
	let stats;

	console.log('PPI itemCodes', itemCodes);
	console.log('PPI name', name);

	try {
		stats = await fetchPpiStatistics(itemCodes, parentCode);
	} catch (error) {
		// 에러를 로깅하고 빈 객체 반환 (다른 섹션들은 계속 렌더링)
		handleError(error, 'DynamicSection');
		stats = {};
	}

	console.log('2222 stats', stats);

	if (Object.keys(stats).length === 0) {
		return (
			<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
				<h2 className="text-lg font-semibold mb-4">{name}</h2>
				<p className="text-zinc-500 text-sm">데이터를 불러올 수 없습니다.</p>
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
