# 에러 핸들링 가이드

이 프로젝트는 Next.js 16 App Router에 최적화된 포괄적인 에러 핸들링 시스템을 구현하고 있습니다.

## 📁 구조

```
src/
├── lib/
│   └── errors/
│       ├── AppError.ts        # 커스텀 에러 클래스 정의
│       ├── errorHandler.ts    # 에러 처리 유틸리티
│       └── index.ts           # Export 진입점
├── app/
│   ├── global-error.tsx       # 전역 에러 바운더리 (Root Layout 에러)
│   ├── error.tsx              # 일반 에러 바운더리
│   └── cpi/
│       └── error.tsx          # CPI 라우트 전용 에러 바운더리
```

## 🎯 주요 기능

### 1. 에러 타입 구분

클라이언트와 서버 에러를 명확히 구분합니다:

```typescript
enum ErrorType {
	CLIENT = 'CLIENT', // 클라이언트 측 에러
	SERVER = 'SERVER', // 서버 측 에러
	NETWORK = 'NETWORK', // 네트워크 에러
	VALIDATION = 'VALIDATION', // 유효성 검증 에러
	AUTHENTICATION = 'AUTHENTICATION', // 인증 에러
	AUTHORIZATION = 'AUTHORIZATION', // 권한 에러
	UNKNOWN = 'UNKNOWN', // 알 수 없는 에러
}
```

### 2. 에러 심각도 분류

```typescript
enum ErrorSeverity {
	LOW = 'LOW', // 낮은 심각도
	MEDIUM = 'MEDIUM', // 중간 심각도
	HIGH = 'HIGH', // 높은 심각도
	CRITICAL = 'CRITICAL', // 치명적
}
```

### 3. 커스텀 에러 클래스

#### AppError (기본 에러 클래스)

```typescript
throw new AppError('에러 메시지', ErrorType.SERVER, ErrorSeverity.HIGH, {
	location: '함수명/컴포넌트명',
	userMessage: '사용자에게 보여줄 메시지',
	retryable: true,
	metadata: {
		/* 추가 정보 */
	},
});
```

#### ApiError (API 호출 에러)

```typescript
throw new ApiError('API 호출 실패', 500, {
	location: 'fetchData',
	userMessage: '서버에 문제가 발생했습니다.',
	retryable: true,
	metadata: { url: '/api/data' },
});
```

#### NetworkError (네트워크 에러)

```typescript
throw new NetworkError('네트워크 연결 실패', {
	location: 'fetchData',
	userMessage: '인터넷 연결을 확인해주세요.',
});
```

#### ValidationError (유효성 검증 에러)

```typescript
throw new ValidationError('잘못된 입력', {
	location: 'validateInput',
	userMessage: '입력 형식이 올바르지 않습니다.',
	metadata: { field: 'email' },
});
```

#### DataError (데이터 처리 에러)

```typescript
throw new DataError('데이터 파싱 실패', {
	location: 'parseData',
	userMessage: '데이터 형식이 올바르지 않습니다.',
});
```

## 🛠️ 사용법

### 1. 서버 컴포넌트에서 에러 처리

```typescript
import { handleError, DataError } from '@/lib/errors';

export default async function Page() {
  try {
    const data = await fetchData();

    if (!data) {
      throw new DataError('데이터 없음', {
        location: 'Page',
        userMessage: '요청한 데이터를 찾을 수 없습니다.'
      });
    }

    return <div>{data}</div>;
  } catch (error) {
    // 에러를 정규화하고 로깅한 후 재throw
    // Next.js의 error.tsx가 자동으로 처리
    throw handleError(error, 'Page');
  }
}
```

### 2. API 호출에서 에러 처리

```typescript
import { ApiError, handleError } from '@/lib/errors';

async function fetchData() {
	try {
		const response = await fetch('/api/data');

		if (!response.ok) {
			throw new ApiError('API 호출 실패', response.status, {
				location: 'fetchData',
				userMessage: 'データを読み込めませんでした。',
				retryable: response.status >= 500,
				metadata: { url: '/api/data' },
			});
		}

		return await response.json();
	} catch (error) {
		throw handleError(error, 'fetchData');
	}
}
```

### 3. 에러 로깅만 수행 (에러를 throw하지 않음)

일부 섹션에서 에러가 발생해도 다른 섹션은 정상 동작해야 하는 경우:

```typescript
import { handleError } from '@/lib/errors';

async function DynamicSection({ itemCodes }: Props) {
  let stats;

  try {
    stats = await fetchStatistics(itemCodes);
  } catch (error) {
    // 에러를 로깅만 하고 빈 객체 반환
    handleError(error, 'DynamicSection');
    stats = {};
  }

  if (Object.keys(stats).length === 0) {
    return <p>데이터를 불러올 수 없습니다.</p>;
  }

  return <Chart data={stats} />;
}
```

### 4. 함수 래핑으로 자동 에러 처리

```typescript
import { withErrorHandling } from '@/lib/errors';

const fetchData = withErrorHandling(async (id: string) => {
	const response = await fetch(`/api/data/${id}`);
	return response.json();
}, 'fetchData');

// 사용 시 자동으로 에러 처리
const data = await fetchData('123');
```

## 📄 에러 페이지

### global-error.tsx

- Root Layout의 에러를 처리
- 전체 애플리케이션에 영향을 미치는 치명적 에러
- 반드시 `'use client'` 디렉티브 필요
- `<html>`과 `<body>` 태그 포함 필요

### error.tsx

- 일반적인 애플리케이션 에러 처리
- 각 라우트 세그먼트에 배치 가능
- 자동으로 Error Boundary 생성

### 커스텀 에러 페이지

특정 라우트에 대한 맞춤형 에러 UI:

```tsx
// app/cpi/error.tsx
'use client';

export default function CpiError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<div>
			<h2>CPI 데이터 조회 실패</h2>
			<button onClick={reset}>다시 시도</button>
		</div>
	);
}
```

## 🎨 에러 UI 기능

1. **다시 시도**: `reset()` 함수로 에러 발생 지점부터 재시도
2. **홈으로 이동**: 안전한 페이지로 네비게이션
3. **개발 환경 정보**: 개발 중에만 상세 에러 메시지 표시
4. **Error ID**: 디버깅을 위한 고유 식별자 (digest)

## 📊 로깅

### 개발 환경

- 상세한 에러 정보 콘솔 출력
- 스택 트레이스 포함
- 메타데이터 JSON 형식으로 표시

### 프로덕션 환경

- 간결한 로그
- 민감한 정보 제외
- 외부 로깅 서비스 연동 가능 (Sentry, LogRocket 등)

```typescript
// lib/errors/errorHandler.ts에서 수정
export function logError(error: AppError): void {
	// 프로덕션에서는 Sentry 등으로 전송
	if (process.env.NODE_ENV === 'production') {
		// Sentry.captureException(error);
	}
}
```

## 🔍 베스트 프랙티스

### 1. 명확한 에러 메시지

```typescript
// ❌ 나쁜 예
throw new Error('Error');

// ✅ 좋은 예
throw new ApiError('CPI 통계 데이터 조회 실패', response.status, {
	location: 'fetchCpiStatistics',
	userMessage: '소비자물가지수 데이터를 불러올 수 없습니다.',
	retryable: true,
	metadata: { itemCode: 'A01101' },
});
```

### 2. 적절한 에러 타입 선택

- API 호출 실패 → `ApiError`
- 네트워크 문제 → `NetworkError`
- 사용자 입력 검증 → `ValidationError`
- 데이터 형식 문제 → `DataError`

### 3. 위치 정보 제공

모든 에러에 발생 위치를 명시:

```typescript
{
  location: '컴포넌트명' 또는 '함수명'
}
```

### 4. 사용자 친화적 메시지

기술적 용어 대신 사용자가 이해할 수 있는 메시지:

```typescript
{
	userMessage: '네트워크 연결을 확인해 주세요.';
}
```

### 5. 재시도 가능 여부 명시

```typescript
{
	retryable: response.status >= 500; // 5xx 에러는 재시도 가능
}
```

### 6. 메타데이터 활용

디버깅에 필요한 추가 정보:

```typescript
{
  metadata: {
    itemCode: 'A01101',
    url: '/api/data',
    timestamp: Date.now()
  }
}
```

## 🧪 테스트

에러 핸들링을 테스트하려면:

```typescript
// 개발 환경에서 일부러 에러 발생
throw new ApiError('테스트 에러', 500, {
	location: 'test',
	userMessage: '이것은 테스트 에러입니다.',
});
```

## 📚 참고

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
