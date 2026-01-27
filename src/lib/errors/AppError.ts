/**
 * 애플리케이션 전역에서 사용하는 커스텀 에러 클래스
 */

export enum ErrorType {
	/** 클라이언트 측 에러 (브라우저, 사용자 입력 등) */
	CLIENT = 'CLIENT',
	/** 서버 측 에러 (API, 데이터베이스 등) */
	SERVER = 'SERVER',
	/** 네트워크 에러 */
	NETWORK = 'NETWORK',
	/** 유효성 검증 에러 */
	VALIDATION = 'VALIDATION',
	/** 인증 에러 */
	AUTHENTICATION = 'AUTHENTICATION',
	/** 권한 에러 */
	AUTHORIZATION = 'AUTHORIZATION',
	/** 알 수 없는 에러 */
	UNKNOWN = 'UNKNOWN',
}

export enum ErrorSeverity {
	/** 낮은 심각도 - 사용자에게 알림만 필요 */
	LOW = 'LOW',
	/** 중간 심각도 - 일부 기능이 작동하지 않을 수 있음 */
	MEDIUM = 'MEDIUM',
	/** 높은 심각도 - 주요 기능이 작동하지 않음 */
	HIGH = 'HIGH',
	/** 치명적 - 애플리케이션이 정상 작동하지 않음 */
	CRITICAL = 'CRITICAL',
}

export interface ErrorContext {
	/** 에러가 발생한 컴포넌트나 함수 이름 */
	location?: string;
	/** 추가 메타데이터 */
	metadata?: Record<string, unknown>;
	/** 사용자에게 보여줄 메시지 */
	userMessage?: string;
	/** 재시도 가능 여부 */
	retryable?: boolean;
}

/**
 * 애플리케이션 커스텀 에러 클래스
 */
export class AppError extends Error {
	public readonly type: ErrorType;
	public readonly severity: ErrorSeverity;
	public readonly context?: ErrorContext;
	public readonly statusCode?: number;
	public readonly timestamp: Date;
	public readonly isOperational: boolean;

	constructor(
		message: string,
		type: ErrorType = ErrorType.UNKNOWN,
		severity: ErrorSeverity = ErrorSeverity.MEDIUM,
		context?: ErrorContext,
		statusCode?: number,
	) {
		super(message);
		this.name = 'AppError';
		this.type = type;
		this.severity = severity;
		this.context = context;
		this.statusCode = statusCode;
		this.timestamp = new Date();
		this.isOperational = true; // 예상 가능한 에러

		// TypeScript의 prototype chain을 올바르게 유지
		Object.setPrototypeOf(this, AppError.prototype);
	}

	/**
	 * 에러를 JSON 형태로 변환
	 */
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			type: this.type,
			severity: this.severity,
			context: this.context,
			statusCode: this.statusCode,
			timestamp: this.timestamp.toISOString(),
			stack: this.stack,
		};
	}

	/**
	 * 사용자에게 보여줄 메시지 반환
	 */
	getUserMessage(): string {
		return this.context?.userMessage || this.getDefaultUserMessage();
	}

	/**
	 * 기본 사용자 메시지 반환
	 */
	private getDefaultUserMessage(): string {
		switch (this.type) {
			case ErrorType.CLIENT:
				return '입력 정보를 확인해 주세요.';
			case ErrorType.SERVER:
				return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
			case ErrorType.NETWORK:
				return '네트워크 연결을 확인해 주세요.';
			case ErrorType.VALIDATION:
				return '입력한 정보가 올바르지 않습니다.';
			case ErrorType.AUTHENTICATION:
				return '인증이 필요합니다. 다시 로그인해 주세요.';
			case ErrorType.AUTHORIZATION:
				return '접근 권한이 없습니다.';
			default:
				return '예상치 못한 오류가 발생했습니다.';
		}
	}
}

/**
 * API 에러 (서버 측)
 */
export class ApiError extends AppError {
	constructor(message: string, statusCode: number, context?: ErrorContext) {
		super(
			message,
			ErrorType.SERVER,
			statusCode >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
			context,
			statusCode,
		);
		this.name = 'ApiError';
	}
}

/**
 * 네트워크 에러
 */
export class NetworkError extends AppError {
	constructor(message: string, context?: ErrorContext) {
		super(message, ErrorType.NETWORK, ErrorSeverity.HIGH, context);
		this.name = 'NetworkError';
	}
}

/**
 * 유효성 검증 에러 (클라이언트 측)
 */
export class ValidationError extends AppError {
	constructor(message: string, context?: ErrorContext) {
		super(message, ErrorType.VALIDATION, ErrorSeverity.LOW, {
			...context,
			retryable: false,
		});
		this.name = 'ValidationError';
	}
}

/**
 * 데이터 처리 에러
 */
export class DataError extends AppError {
	constructor(message: string, context?: ErrorContext) {
		super(message, ErrorType.SERVER, ErrorSeverity.MEDIUM, context);
		this.name = 'DataError';
	}
}
