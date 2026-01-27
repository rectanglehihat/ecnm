import { AppError, ErrorType, ErrorSeverity, NetworkError, ApiError, DataError } from './AppError';

/**
 * 알 수 없는 에러를 AppError로 변환
 */
export function normalizeError(error: unknown, location?: string): AppError {
	// 이미 AppError인 경우
	if (error instanceof AppError) {
		return error;
	}

	// Error 객체인 경우
	if (error instanceof Error) {
		// 네트워크 에러 감지
		if (error.message.includes('fetch failed') || error.message.includes('network')) {
			return new NetworkError(error.message, { location });
		}

		// 일반 Error를 AppError로 변환
		return new AppError(error.message, ErrorType.UNKNOWN, ErrorSeverity.MEDIUM, {
			location,
			metadata: { originalError: error.name },
		});
	}

	// 문자열 에러
	if (typeof error === 'string') {
		return new AppError(error, ErrorType.UNKNOWN, ErrorSeverity.MEDIUM, { location });
	}

	// 그 외의 경우
	return new AppError('알 수 없는 오류가 발생했습니다.', ErrorType.UNKNOWN, ErrorSeverity.MEDIUM, {
		location,
		metadata: { error: JSON.stringify(error) },
	});
}

/**
 * 서버 측에서 에러 로깅
 * 실제 프로덕션에서는 Sentry, LogRocket 등의 서비스 사용 권장
 */
export function logError(error: AppError): void {
	const isServer = typeof window === 'undefined';

	// 개발 환경에서는 상세 로그 출력
	if (process.env.NODE_ENV === 'development') {
		console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.error(`[${error.severity}] ${error.type} Error`);
		console.error(`Message: ${error.message}`);
		console.error(`Location: ${error.context?.location || 'Unknown'}`);
		console.error(`Timestamp: ${error.timestamp.toISOString()}`);
		if (error.statusCode) console.error(`Status Code: ${error.statusCode}`);
		if (error.context?.metadata) {
			console.error('Metadata:', JSON.stringify(error.context.metadata, null, 2));
		}
		console.error('Stack:', error.stack);
		console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
	} else {
		// 프로덕션 환경
		const logLevel =
			error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH ? 'error' : 'warn';

		console[logLevel](`[${error.type}] ${error.message}`, {
			location: error.context?.location,
			timestamp: error.timestamp.toISOString(),
			...(isServer && { stack: error.stack }),
		});
	}
}

/**
 * fetch 응답을 처리하고 에러 발생 시 적절한 AppError로 변환
 */
export async function handleFetchResponse<T>(response: Response, location: string): Promise<T> {
	if (!response.ok) {
		// API 응답 에러
		let errorMessage = `API 요청 실패: ${response.status} ${response.statusText}`;

		try {
			const errorData = await response.json();
			errorMessage = errorData.message || errorMessage;
		} catch {
			// JSON 파싱 실패 시 기본 메시지 사용
		}

		throw new ApiError(errorMessage, response.status, {
			location,
			userMessage: getStatusCodeMessage(response.status),
			retryable: response.status >= 500,
			metadata: { url: response.url },
		});
	}

	try {
		const data = await response.json();
		return data as T;
	} catch (error) {
		throw new DataError('응답 데이터를 파싱할 수 없습니다.', {
			location,
			userMessage: '데이터 형식이 올바르지 않습니다.',
			metadata: { url: response.url },
		});
	}
}

/**
 * HTTP 상태 코드에 따른 사용자 메시지
 */
function getStatusCodeMessage(statusCode: number): string {
	if (statusCode >= 500) {
		return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
	}

	switch (statusCode) {
		case 400:
			return '잘못된 요청입니다.';
		case 401:
			return '인증이 필요합니다.';
		case 403:
			return '접근 권한이 없습니다.';
		case 404:
			return '요청한 데이터를 찾을 수 없습니다.';
		case 429:
			return '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해 주세요.';
		default:
			return '요청 처리 중 오류가 발생했습니다.';
	}
}

/**
 * 에러 처리 및 로깅을 한 번에 수행
 */
export function handleError(error: unknown, location: string): AppError {
	const normalizedError = normalizeError(error, location);
	logError(normalizedError);
	return normalizedError;
}

/**
 * async 함수를 래핑하여 에러를 자동으로 처리
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(fn: T, location: string): T {
	return (async (...args: Parameters<T>) => {
		try {
			return await fn(...args);
		} catch (error) {
			throw handleError(error, location);
		}
	}) as T;
}
