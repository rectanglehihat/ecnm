'use client';

import { useEffect } from 'react';

/**
 * CPI 페이지 전용 에러 핸들러
 */
export default function CpiError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error('CPI Error:', error);
	}, [error]);

	return (
		<div className="min-h-[50vh] flex items-center justify-center px-6">
			<div className="max-w-lg w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-8">
				<div className="flex items-start gap-4">
					<div className="shrink-0">
						<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
							<svg
								className="w-6 h-6 text-blue-600 dark:text-blue-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>

					<div className="flex-1">
						<h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">CPI 데이터 조회 실패</h2>

						<p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm">
							소비자물가지수 데이터를 불러오는 중 문제가 발생했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해
							주세요.
						</p>

						{process.env.NODE_ENV === 'development' && error?.message && (
							<div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
								<p className="text-xs font-mono text-blue-800 dark:text-blue-300 break-all">{error.message}</p>
								{error.digest && (
									<p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Error ID: {error.digest}</p>
								)}
							</div>
						)}

						<div className="flex gap-3">
							<button
								onClick={() => reset()}
								className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
							>
								다시 시도
							</button>
							<a
								href="/cpi"
								className="flex-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm"
							>
								CPI 홈
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
