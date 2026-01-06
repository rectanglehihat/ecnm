import Button from '@/components/ui/Button';

const CpiPage = () => {
	return (
		<main>
			<header className="pb-10">
				<h1 className="text-2xl font-semibold tracking-tight">소비자물가지수(CPI)</h1>
			</header>

			<Button
				href="/cpi/a"
				className="flex h-12 w-fit items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
			>
				식료품 및 비주류음료
			</Button>
		</main>
	);
};

export default CpiPage;
