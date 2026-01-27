'use client';

import { useEffect } from 'react';

/**
 * 전역 에러 핸들러
 * Root Layout 에러를 잡기 위한 최상위 에러 바운더리
 * global-error.tsx는 반드시 'use client' 디렉티브가 필요합니다.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// 에러 로깅 (프로덕션에서는 외부 로깅 서비스 사용)
		console.error('Global Error:', error);
	}, [error]);

	return (
		<html lang="ko">
			<body>
				<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-black px-6">
					<div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 text-center">
						<div className="mb-6">
							<div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
								<svg
									className="w-10 h-10 text-red-600 dark:text-red-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
							</div>
						</div>

						<h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">심각한 오류 발생</h1>

						<p className="text-zinc-600 dark:text-zinc-400 mb-6">
							애플리케이션에 심각한 문제가 발생했습니다.
							<br />
							잠시 후 다시 시도해 주세요.
						</p>

						{process.env.NODE_ENV === 'development' && error?.message && (
							<div className="mb-6 p-4 bg-red-50 dark:bg-red-950 rounded-lg text-left">
								<p className="text-xs font-mono text-red-800 dark:text-red-300 break-all">{error.message}</p>
								{error.digest && (
									<p className="text-xs text-red-600 dark:text-red-400 mt-2">Error ID: {error.digest}</p>
								)}
							</div>
						)}

						<div className="flex flex-col gap-3">
							<button
								onClick={() => reset()}
								className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
							>
								다시 시도
							</button>
							<a
								href="/"
								className="w-full bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 font-medium py-3 px-4 rounded-lg transition-colors block"
							>
								홈으로 이동
							</a>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
