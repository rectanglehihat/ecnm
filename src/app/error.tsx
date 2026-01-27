'use client';

import { useEffect } from 'react';

/**
 * 일반 에러 핸들러
 * App Router의 기본 에러 바운더리
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// 에러 로깅
		console.error('Application Error:', error);
	}, [error]);

	return (
		<div className="min-h-[50vh] flex items-center justify-center px-6">
			<div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-8 text-center">
				<div className="mb-6">
					<div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
						<svg
							className="w-8 h-8 text-amber-600 dark:text-amber-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
				</div>

				<h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">오류가 발생했습니다</h2>

				<p className="text-zinc-600 dark:text-zinc-400 mb-6">
					일시적인 문제가 발생했습니다.
					<br />
					다시 시도해 주세요.
				</p>

				{process.env.NODE_ENV === 'development' && error?.message && (
					<div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg text-left">
						<p className="text-xs font-mono text-amber-800 dark:text-amber-300 break-all">{error.message}</p>
						{error.digest && (
							<p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Error ID: {error.digest}</p>
						)}
					</div>
				)}

				<div className="flex flex-col gap-3">
					<button
						onClick={() => reset()}
						className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2.5 px-4 rounded-lg transition-colors"
					>
						다시 시도
					</button>
					<a
						href="/"
						className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 text-sm transition-colors"
					>
						홈으로 돌아가기
					</a>
				</div>
			</div>
		</div>
	);
}
