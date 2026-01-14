import Button from '@/components/ui/Button';
import { cacheLife } from 'next/cache';

export default async function CpiPage() {
	'use cache';
	cacheLife('minutes');

	return (
		<main>
			<h1 className="text-2xl font-bold">소비자물가지수(CPI)</h1>
			<section className="py-10">
				<div className="p-5 text-sm text-gray-600 flex flex-col gap-2 bg-gray-200 rounded-lg">
					<p className="font-semibold">🍎 2020=100</p>
					<ul className="list-disc list-inside">
						<li>기준연도: 2020년</li>
						<li>지수: 기준연도의 가격 수준을 100으로 고정</li>
						<li>다른 시점의 CPI가 100보다 높으면 기준연도보다 평균 물가가 높다는 뜻</li>
						<li>다른 시점의 CPI가 100보다 낮으면 기준연도보다 평균 물가가 낮다는 뜻</li>
					</ul>
				</div>
			</section>
			<Button
				href="/cpi/a"
				className="flex h-12 w-fit items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
			>
				식료품 및 비주류음료
			</Button>
		</main>
	);
}
