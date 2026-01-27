# 에러 핸들링 시스템 적용 완료 ✅

이 프로젝트에 **Next.js 16 버전에 최적화된 포괄적인 에러 핸들링 시스템**이 적용되었습니다.

## 📦 생성된 파일들

### 1. 에러 시스템 라이브러리
- **`src/lib/errors/AppError.ts`** - 커스텀 에러 클래스와 타입 정의
  - `AppError`: 기본 에러 클래스
  - `ApiError`: API 호출 에러
  - `NetworkError`: 네트워크 에러
  - `ValidationError`: 유효성 검증 에러
  - `DataError`: 데이터 처리 에러
  - `ErrorType` enum: 에러 타입 분류
  - `ErrorSeverity` enum: 에러 심각도

- **`src/lib/errors/errorHandler.ts`** - 에러 처리 유틸리티
  - `normalizeError()`: 알 수 없는 에러를 AppError로 변환
  - `logError()`: 에러 로깅 (개발/프로덕션 분기)
  - `handleFetchResponse()`: fetch 응답 처리
  - `handleError()`: 통합 에러 처리 함수
  - `withErrorHandling()`: async 함수 래핑

- **`src/lib/errors/index.ts`** - 진입점 및 export

### 2. 에러 UI 페이지
- **`src/app/global-error.tsx`** - 전역 에러 바운더리
  - Root Layout의 치명적 에러 처리
  - 심각한 애플리케이션 오류 UI

- **`src/app/error.tsx`** - 일반 에러 바운더리
  - 일반적인 애플리케이션 에러 처리
  - 사용자 친화적 UI

- **`src/app/cpi/error.tsx`** - CPI 라우트 전용 에러 바운더리
  - CPI 기능 관련 에러 처리
  - 특화된 에러 메시지

### 3. 업데이트된 파일들
- **`src/lib/cpi/fetchCpiStatistics.ts`** - API 호출 에러 처리 추가
- **`src/lib/cpi/fetchCpiItemCodes.ts`** - API 호출 에러 처리 추가
- **`src/app/cpi/page.tsx`** - 에러 처리 로직 추가
- **`src/app/cpi/[code]/page.tsx`** - 에러 처리 로직 추가
- **`src/components/cpi/DynamicSection.tsx`** - 에러 처리 로직 추가

### 4. 문서
- **`ERROR_HANDLING.md`** - 상세한 에러 핸들링 가이드

## 🎯 주요 기능

### ✨ 클라이언트/서버 에러 구분
```typescript
enum ErrorType {
  CLIENT = 'CLIENT',
  SERVER = 'SERVER',
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  UNKNOWN = 'UNKNOWN',
}
```

### ✨ 에러 심각도 분류
```typescript
enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}
```

### ✨ 사용자 친화적 에러 메시지
- 기술적 용어 제외
- 각 에러 타입에 맞는 기본 메시지
- 커스텀 메시지 지원

### ✨ 개발/프로덕션 환경 분기
- **개발**: 상세 로그 출력 (스택 트레이스, 메타데이터)
- **프로덕션**: 간결한 로그 (민감한 정보 제외)

### ✨ 자동 에러 처리
- Next.js의 `error.tsx`와 자동 연동
- 에러 바운더리에 의한 격리
- 부분 실패 처리 (일부 섹션 실패해도 전체 페이지 정지 안 함)

## 🚀 사용 방법

### 기본 사용
```typescript
import { ApiError, handleError } from '@/lib/errors';

export default async function Page() {
  try {
    const data = await fetchData();
    return <div>{data}</div>;
  } catch (error) {
    throw handleError(error, 'Page');
  }
}
```

### API 호출 에러
```typescript
const response = await fetch('/api/data');

if (!response.ok) {
  throw new ApiError('API 호출 실패', response.status, {
    location: 'fetchData',
    userMessage: '데이터를 불러올 수 없습니다.',
    retryable: response.status >= 500,
  });
}
```

### 에러 로깅만 수행
```typescript
try {
  const stats = await fetchStatistics(itemCodes);
} catch (error) {
  // 에러를 로깅만 하고 계속 진행
  handleError(error, 'DynamicSection');
  return <p>데이터를 불러올 수 없습니다.</p>;
}
```

## 📊 에러 처리 흐름

```
사용자 액션
    ↓
서버 컴포넌트/API 호출
    ↓
AppError 발생 (또는 알 수 없는 에러)
    ↓
handleError() → normalizeError() + logError()
    ↓
Next.js error.tsx (에러 바운더리)
    ↓
사용자 친화적 에러 UI 표시
    ↓
"다시 시도" 또는 "홈으로 이동" 버튼
```

## 🔍 에러 페이지 특징

### 재시도 기능
- `reset()` 함수로 에러 발생 지점부터 재시도
- 사용자가 문제를 해결한 후 다시 시도 가능

### 개발 모드
- 상세한 에러 메시지 표시
- Error ID (digest) 표시
- 스택 트레이스 제공

### 프로덕션 모드
- 일반적인 사용자 메시지만 표시
- 기술 정보 숨김
- 깔끔한 UI

## 📝 에러 컨텍스트 정보

모든 에러에 포함 가능한 정보:
```typescript
{
  location?: string;          // 발생 위치
  userMessage?: string;       // 사용자 메시지
  retryable?: boolean;        // 재시도 가능 여부
  metadata?: Record<string, unknown>;  // 추가 정보
}
```

## 🛠️ 확장 방법

### 새로운 에러 타입 추가
```typescript
// src/lib/errors/AppError.ts
export class AuthenticationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, ErrorType.AUTHENTICATION, ErrorSeverity.MEDIUM, context);
    this.name = 'AuthenticationError';
  }
}
```

### 외부 로깅 서비스 연동
```typescript
// src/lib/errors/errorHandler.ts
export function logError(error: AppError): void {
  // Sentry 연동 예시
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error);
  }
}
```

### 라우트별 에러 페이지 추가
```typescript
// src/app/api/error.tsx
'use client';

export default function ApiError({ error, reset }: ErrorPageProps) {
  // API 라우트 전용 에러 UI
  return <div>API 에러 발생</div>;
}
```

## ✅ 빌드 검증

프로젝트가 성공적으로 빌드되었습니다:
```
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages
```

## 📚 더 알아보기

자세한 사용법은 [ERROR_HANDLING.md](./ERROR_HANDLING.md)를 참고하세요.

## 🎓 베스트 프랙티스

1. **명확한 에러 타입** - 정확한 ErrorType 선택
2. **위치 정보 제공** - location에 발생 위치 명시
3. **사용자 메시지** - 기술적 용어 제외
4. **재시도 여부** - retryable 속성 설정
5. **메타데이터** - 디버깅에 필요한 정보 포함
6. **환경별 로그** - 개발/프로덕션 구분

---

**적용일**: 2026년 1월 27일
**Next.js 버전**: 16.0.7
**React 버전**: 19.2.0
