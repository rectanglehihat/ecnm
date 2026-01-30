'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HomeIcon = () => (
	<svg
		aria-hidden
		focusable="false"
		className="h-6 w-6"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.8"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M3 10.5 12 3l9 7.5" />
		<path d="M5 9.75v10.5h4.5v-4.5H14v4.5h5V9.75" />
	</svg>
);

const GaugeIcon = () => (
	<svg
		aria-hidden
		focusable="false"
		className="h-6 w-6"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.8"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M21 14.5A9 9 0 1 0 3 14.5" />
		<path d="M12 7v5l3 1.5" />
		<circle
			cx="12"
			cy="15"
			r=".5"
		/>
	</svg>
);

const Header = () => {
	const pathname = usePathname();
	if (pathname === '/') return null;

	return (
		<header className="fixed top-0 left-0 right-0 z-50">
			<nav className="retro-panel mx-auto flex w-full max-w-6xl items-center justify-between border border-zinc-200 bg-white px-4 py-4 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900">
				<Link
					href="/"
					aria-label="메인 페이지로 이동"
					className="flex items-center gap-2 text-md font-semibold text-zinc-700 hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:text-zinc-300 dark:hover:text-white dark:focus-visible:outline-white"
				>
					<HomeIcon />
				</Link>
				<Link
					href="/cpi"
					aria-label="소비자물가지수(CPI) 페이지로 이동"
					className="flex items-center gap-1 text-md font-semibold text-zinc-700 hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:text-zinc-300 dark:hover:text-white dark:focus-visible:outline-white"
				>
					<span className="hidden sm:inline">CPI</span>
					<GaugeIcon />
				</Link>
			</nav>
		</header>
	);
};

Header.displayName = 'Header';
export default Header;
