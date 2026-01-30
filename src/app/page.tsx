import Button from '@/components/ui/Button';

export default async function Home() {
	return (
		<div className="font-sans dark:bg-black">
			<main className="flex w-full max-w-3xl flex-col items-center justify-between gap-6 px-4 dark:bg-black sm:items-start sm:px-8 lg:px-16">
				<div className="flex flex-col items-center text-center sm:items-start sm:text-left">
					<h1 className="max-w-xs text-2xl font-semibold leading-9 tracking-tight text-black dark:text-zinc-50 sm:text-3xl sm:leading-10">
						ECNM
					</h1>
					<p className="max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg sm:leading-8">
						모두의 국가 경제 통계
					</p>
				</div>
				<div className="flex w-full flex-col gap-4 text-base font-medium sm:w-auto sm:flex-row">
					<Button
						href="/cpi"
						className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:w-fit md:w-[158px]"
					>
						소비자물가지수
					</Button>
				</div>
			</main>
		</div>
	);
}

Home.displayName = 'HomePage';
