import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'ECNM',
	description: '모두의 국가 경제 통계',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen dark:bg-black text-black dark:text-zinc-50 mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8 py-14 sm:py-20`}
			>
				<Header />
				{children}
			</body>
		</html>
	);
}
