import ChartSkeleton from '@/components/charts/ChartSkeleton';
import PpiDynamicSection from '@/components/ppi/PpiDynamicSection';
import { handleError, ValidationError } from '@/lib/errors';
import { fetchPpiItemCodes } from '@/lib/ppi/fetchPpiItemCodes';
import { Suspense } from 'react';

interface PageProps {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ code?: string; name?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
	const { code } = await params;
	let hierarchy;

	try {
		hierarchy = await fetchPpiItemCodes(code);
	} catch (error) {
		// 에러가 발생하면 Next.js의 error.tsx로 전파
		throw handleError(error, 'DynamicPpiPage');
	}

	if (!hierarchy) {
		return <div className="text-red-500">❌ 데이터 조회 실패</div>;
	}

	const queryParams = await searchParams;

	return (
		<main className="space-y-6">
			<h1 className="text-xl font-bold sm:text-2xl">{queryParams.name}</h1>

			{hierarchy?.map((childItem) => {
				const childItemCodes = childItem.children
					? Object.values(childItem.children).map((item) => item.ITEM_CODE)
					: [];

				return (
					<Suspense
						key={childItem.code}
						fallback={
							<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
								<h2 className="text-lg font-semibold mb-4">{childItem.name}</h2>
								<ChartSkeleton />
							</section>
						}
					>
						<PpiDynamicSection
							itemCodes={childItemCodes}
							name={childItem.name}
							parentCode={childItem.code}
						/>
					</Suspense>
				);
			})}
		</main>
	);
}
