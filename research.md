# ECNM 코드베이스 분석 보고서

> 작성일: 2026-03-20
> 대상: `/ecnm` 전체 프로젝트

---

## 1. 프로젝트 개요

**ECNM**(Economic Statistics for Everyone)은 한국은행 Open API(ECOS)를 활용해 소비자물가지수(CPI)와 부동산가격지수(PPI) 데이터를 시각화하는 Next.js 웹 애플리케이션이다. "모두의 국가 경제 통계"라는 슬로건처럼 공공 경제 데이터를 누구나 쉽게 탐색할 수 있도록 설계되어 있다.

### 기술 스택

| 항목         | 버전                 |
| ------------ | -------------------- |
| Next.js      | 16.0.10 (App Router) |
| React        | 19.2.0               |
| TypeScript   | ^5 (strict 모드)     |
| Recharts     | ^3.5.0               |
| Tailwind CSS | ^4                   |
| Node.js      | >=20.0.0             |

---

## 2. 전체 폴더/파일 구조

```
ecnm/
├── src/
│   ├── app/                          # Next.js App Router 라우트
│   │   ├── layout.tsx                # 루트 레이아웃 (폰트, Header 포함)
│   │   ├── page.tsx                  # 홈페이지 (CPI/PPI 진입점 선택)
│   │   ├── error.tsx                 # 일반 에러 바운더리
│   │   ├── global-error.tsx          # 루트 레이아웃 수준 에러 바운더리
│   │   ├── globals.css               # 전역 스타일 (레트로 테마, 다크모드)
│   │   ├── cpi/
│   │   │   ├── page.tsx              # CPI 목록 페이지
│   │   │   ├── error.tsx             # CPI 전용 에러 바운더리
│   │   │   └── [code]/
│   │   │       └── page.tsx          # CPI 동적 상세 페이지
│   │   └── ppi/
│   │       ├── page.tsx              # PPI 목록 페이지
│   │       └── [code]/
│   │           └── page.tsx          # PPI 동적 상세 페이지
│   │
│   ├── components/
│   │   ├── Header.tsx                # 네비게이션 헤더
│   │   ├── ui/
│   │   │   ├── Button.tsx            # 재사용 버튼 (Link/button 자동 분기)
│   │   │   └── Skeleton.tsx          # shimmer 스켈레톤
│   │   ├── charts/
│   │   │   ├── LineChart.tsx         # Recharts 기반 라인 차트 래퍼
│   │   │   ├── ChartSkeleton.tsx     # 차트 로딩 스켈레톤
│   │   │   └── index.ts              # 차트 컴포넌트 export
│   │   ├── cpi/
│   │   │   ├── CpiTopLevelButtons.tsx    # 최상위 CPI 카테고리 버튼
│   │   │   ├── CpiHierarchyButtons.tsx   # URL 기반 계층 탐색 버튼
│   │   │   ├── CpiChart.tsx              # CPI 데이터 → LineChart 변환
│   │   │   └── DynamicSection.tsx        # 서버 컴포넌트: 섹션별 통계 렌더
│   │   └── ppi/
│   │       ├── PpiTopLevelButtons.tsx    # PPI 카테고리 버튼
│   │       ├── PpiHierarchyButtons.tsx   # PPI 통계 테이블 단위 버튼
│   │       └── PpiDynamicSection.tsx     # 서버 컴포넌트: 섹션별 통계 렌더
│   │
│   ├── lib/
│   │   ├── cpi/
│   │   │   ├── fetchCpiItemCodes.ts      # CPI 항목 코드 조회
│   │   │   └── fetchCpiStatistics.ts     # CPI 통계 데이터 조회
│   │   ├── ppi/
│   │   │   ├── fetchPpiItemCodes.ts      # PPI 항목 코드 조회
│   │   │   ├── fetchPpiStatistics.ts     # PPI 통계 데이터 조회
│   │   │   └── fetchPpiStatisticTableList.ts  # PPI 통계 테이블 목록 조회
│   │   └── errors/
│   │       ├── AppError.ts               # 커스텀 에러 클래스 계층
│   │       ├── errorHandler.ts           # 에러 정규화/로깅/처리 유틸
│   │       └── index.ts                  # 에러 export
│   │
│   └── const/
│       ├── BOK_CODE.ts               # 한국은행 API 통계 코드 상수
│       └── CHART_COLORS.ts           # 30가지 차트 색상 팔레트
│
├── .env                              # BOK API 키 및 BASE URL
├── next.config.ts                    # Next.js 설정 (기본값)
├── tsconfig.json                     # TypeScript 설정 (strict, @/* 경로 별칭)
├── postcss.config.mjs                # Tailwind CSS PostCSS 설정
├── eslint.config.mjs                 # ESLint (Next.js Core Web Vitals)
├── ERROR_HANDLING.md
├── IMPLEMENTATION_SUMMARY.md
└── QUICKSTART.md
```

---

## 3. 라우팅 구조

Next.js App Router 기반이며 총 4개의 페이지와 3개의 에러 바운더리로 구성된다.

### 페이지 목록

| URL 패턴      | 파일 경로                 | 렌더링 방식              | 역할                     |
| ------------- | ------------------------- | ------------------------ | ------------------------ |
| `/`           | `app/page.tsx`            | 서버 컴포넌트            | CPI/PPI 진입 선택        |
| `/cpi`        | `app/cpi/page.tsx`        | 서버 컴포넌트            | CPI 최상위 카테고리 목록 |
| `/cpi/[code]` | `app/cpi/[code]/page.tsx` | 서버 컴포넌트 + Suspense | CPI 계층 탐색 및 차트    |
| `/ppi`        | `app/ppi/page.tsx`        | 서버 컴포넌트            | PPI 통계 테이블 목록 6개 |
| `/ppi/[code]` | `app/ppi/[code]/page.tsx` | 서버 컴포넌트 + Suspense | PPI 계층 탐색 및 차트    |

### 에러 바운더리 범위

| 파일                   | 커버 범위                            | 테마 색상 |
| ---------------------- | ------------------------------------ | --------- |
| `app/global-error.tsx` | 루트 레이아웃까지 포함한 치명적 에러 | 빨간색    |
| `app/error.tsx`        | 루트 레이아웃 하위 일반 에러         | 호박색    |
| `app/cpi/error.tsx`    | CPI 라우트 한정 에러                 | 파란색    |

### URL 상태 관리 (CPI)

CPI 동적 페이지는 계층 탐색 상태를 URL 검색 파라미터로 관리한다.

```
/cpi/A0110?code=A01101&name=식료품및비주류음료
```

- `code`: 현재 선택된 하위 카테고리 코드
- `name`: 표시용 이름 (타이틀 렌더링에 사용)
- `CpiHierarchyButtons`가 `useRouter` + `useSearchParams`로 URL을 업데이트하며, `scroll: false` 옵션으로 스크롤 위치를 유지한다.

---

## 4. 데이터 모델 및 타입 정의

### 한국은행 API 응답 타입

**`StatisticItem`** (항목 코드 목록 응답)

```typescript
interface StatisticItem {
	STAT_CODE: string; // 통계 코드 (예: '901Y009')
	STAT_NAME: string; // 통계명
	GRP_CODE: string; // 그룹 코드
	GRP_NAME: string; // 그룹명
	ITEM_CODE: string; // 항목 코드 (예: 'A01101')
	ITEM_NAME: string; // 항목명
	P_ITEM_CODE: string | null; // 부모 항목 코드 (null이면 최상위)
	P_ITEM_NAME: string | null;
	CYCLE: string; // 주기: 'A'(연), 'M'(월), 'Q'(분기)
	START_TIME: string; // 데이터 시작 시점
	END_TIME: string;
	DATA_CNT: number; // 데이터 건수
	UNIT_NAME: string; // 단위 (예: '2020=100')
	WEIGHT: string; // 가중치
}
```

**`StatisticSearchItem`** (통계 데이터 조회 응답 행)

```typescript
interface StatisticSearchItem {
	DATA_VALUE: string; // 지수 값 (문자열, parseFloat 필요)
	ITEM_CODE1: string; // 1단계 항목 코드
	ITEM_CODE2: string | null; // 2단계 항목 코드
	ITEM_CODE3: string | null; // 3단계 항목 코드
	ITEM_CODE4: string | null;
	ITEM_NAME1: string; // 1단계 항목명
	ITEM_NAME2: string | null; // 2단계 항목명 (PPI 차트 레이블에 사용)
	ITEM_NAME3: string | null;
	ITEM_NAME4: string | null;
	STAT_CODE: string;
	STAT_NAME: string;
	TIME: string; // 시점 (CPI: '2024', PPI: '202312')
	UNIT_NAME: string; // 단위
	WGT: string; // 가중치
}
```

### 애플리케이션 내부 계층 타입

**CPI 계층 구조** (재귀적 트리)

```typescript
interface CpiItemHierarchy {
	code: string;
	name: string;
	children: Record<string, CpiItemHierarchy>; // 코드 → 계층 노드
}
```

**PPI 계층 구조** (2단계 평면 계층)

```typescript
interface PpiItemHierarchy {
	code: string; // H로 시작 (부모)
	name: string;
	children: StatisticItem[]; // R로 시작 (자식들)
}
```

CPI는 `P_ITEM_CODE`를 활용한 재귀 트리이고, PPI는 ITEM_CODE의 접두어(H/R)를 기준으로 단순 2단계 계층을 구성하는 점이 구조적으로 다르다.

---

## 5. 한국은행 Open API 연동 상세

### 환경 변수

`NEXT_PUBLIC_` 접두어를 사용하므로 클라이언트 사이드에도 노출된다. 민감도가 낮은 공공 API 키이지만 향후 서버 전용 환경 변수(`BOK_API_KEY`)로 이전하는 것을 고려할 수 있다.

### 통계 코드 상수 (`BOK_CODE.ts`)

```typescript
CODE_CPI = '901Y009'; // 소비자물가지수 (2020=100)
CODE_PPI_BUYING_2021_06 = '901Y093'; // 매매가격지수 (2021.06=100)
CODE_PPI_BUYING_2025_03 = '901Y113'; // 매매가격지수 (2025.03=100)
CODE_PPI_JEONSE_2021_06 = '901Y094'; // 전세가격지수 (2021.06=100)
CODE_PPI_JEONSE_2025_03 = '901Y114'; // 전세가격지수 (2025.03=100)
CODE_PPI_MONTHLY_RENT_2021_06 = '901Y095'; // 월세가격지수 (2021.06=100)
CODE_PPI_MONTHLY_RENT_2025_03 = '901Y115'; // 월세가격지수 (2025.03=100)
CODE_PPI_ACTUAL_TRANSACTION_PRICE = '901Y089'; // 실거래가격지수 (미사용)
```

### 엔드포인트 패턴

**1. `StatisticItemList`** — 항목 코드 계층 조회

```
GET /StatisticItemList/{apiKey}/json/kr/{start}/{end}/{statCode}
```

**2. `StatisticSearch`** — 시계열 통계 데이터 조회

```
GET /StatisticSearch/{apiKey}/json/kr/{start}/{end}/{statCode}/{cycle}/{startTime}/{endTime}/{itemCode}
GET /StatisticSearch/{apiKey}/json/kr/{start}/{end}/{statCode}/{cycle}/{startTime}/{endTime}/{parentCode}/{itemCode}
```

**3. `StatisticTableList`** — 통계 테이블 메타 정보 조회

```
GET /StatisticTableList/{apiKey}/json/kr/1/10/{statCode}
```

### API 제약 사항

- **페이지당 최대 레코드 수**: 10건 (`StatisticItemList` 기준)
- **복수 itemCode 배치 쿼리 불가**: 코드별 개별 요청 필수
- **캐싱 전략**: `{ next: { revalidate: 60 * 60 * 24 * 30 } }` (30일 ISR)

---

## 6. 데이터 페칭 함수 상세

### `fetchCpiItemCodes(statCode, rootItemCode?)`

| 항목         | 내용                                                                  |
| ------------ | --------------------------------------------------------------------- |
| 엔드포인트   | `StatisticItemList`                                                   |
| 배치 크기    | 100                                                                   |
| 필터         | `CYCLE === 'A'` (연간 데이터만)                                       |
| 계층 구성    | `P_ITEM_CODE`를 활용한 재귀 `buildHierarchy()`                        |
| 반환 타입    | `rootItemCode` 있음 → `CpiItemHierarchy`, 없음 → `CpiItemHierarchy[]` |
| 페이지네이션 | 첫 요청 후 남은 배치 `Promise.all`로 병렬 처리                        |

### `fetchCpiStatistics(itemCodes)`

| 항목        | 내용                                       |
| ----------- | ------------------------------------------ |
| 엔드포인트  | `StatisticSearch`                          |
| 통계 코드   | `CODE_CPI = '901Y009'`                     |
| 주기        | `A` (연간)                                 |
| 조회 기간   | 1950 ~ 2024                                |
| 페이지 크기 | 100 (단일 페이지, 연간 데이터는 건수 적음) |
| 병렬 처리   | itemCode별 `Promise.allSettled`            |
| 반환 타입   | `Record<itemCode, StatisticSearchItem[]>`  |

### `fetchPpiItemCodes(statCode, rootItemCode?)`

| 항목         | 내용                                           |
| ------------ | ---------------------------------------------- |
| 엔드포인트   | `StatisticItemList`                            |
| 배치 크기    | **10** (API 최대값)                            |
| 필터         | `CYCLE === 'M'` (월간 데이터만)                |
| 계층 구성    | ITEM_CODE 접두어 기반: `H`→부모, `R`→자식      |
| 반환 타입    | `PpiItemHierarchy[]`                           |
| 페이지네이션 | 첫 요청 후 남은 배치 `Promise.all`로 병렬 처리 |

### `fetchPpiStatistics(itemCodes, parentCode?)`

| 항목        | 내용                                                           |
| ----------- | -------------------------------------------------------------- |
| 엔드포인트  | `StatisticSearch`                                              |
| 통계 코드   | `CODE_PPI_BUYING_2021_06` (하드코딩 — 아래 이슈 참고)          |
| 주기        | `M` (월간)                                                     |
| 조회 기간   | 195001 ~ 202512                                                |
| 페이지 크기 | 100                                                            |
| 병렬 처리   | itemCode별 `Promise.allSettled`, 페이지별 `Promise.allSettled` |
| 반환 타입   | `Record<itemCode, StatisticSearchItem[]>`                      |

### `fetchPpiStatisticTableList(itemCode)` / `fetchPpiStatisticTableLists(itemCodes[])`

| 항목       | 내용                                          |
| ---------- | --------------------------------------------- |
| 엔드포인트 | `StatisticTableList`                          |
| 고정 범위  | `1/10`                                        |
| 응답 처리  | 배열에서 `STAT_CODE === itemCode`인 항목 탐색 |
| 복수 처리  | `Promise.allSettled`로 6개 병렬 요청          |

---

## 7. 컴포넌트 구조 및 렌더링 패턴

### 컴포넌트 분류

| 컴포넌트              | 유형                  | 역할                              |
| --------------------- | --------------------- | --------------------------------- |
| `Header`              | `'use client'`        | 현재 경로 감지, 홈에서 숨김       |
| `Button`              | 서버 (memo)           | `href` 있으면 Link, 없으면 button |
| `Skeleton`            | 서버 (memo)           | shimmer 로딩 placeholder          |
| `LineChart`           | `'use client'` (memo) | Recharts 추상화 래퍼              |
| `ChartSkeleton`       | 서버                  | 차트 영역 로딩 스켈레톤           |
| `CpiChart`            | `'use client'` (memo) | 통계 데이터 → LineChart 변환      |
| `CpiTopLevelButtons`  | 서버                  | 최상위 CPI 카테고리 버튼 그리드   |
| `CpiHierarchyButtons` | `'use client'`        | URL 파라미터 기반 계층 탐색       |
| `DynamicSection`      | 서버 async            | CPI 섹션별 데이터 페칭 + 차트     |
| `PpiTopLevelButtons`  | 서버                  | PPI 버튼 그리드                   |
| `PpiHierarchyButtons` | 서버                  | 단일 PPI 통계 테이블 버튼         |
| `PpiDynamicSection`   | 서버 async            | PPI 섹션별 데이터 페칭 + 차트     |

### Suspense 스트리밍 패턴

CPI와 PPI 동적 페이지 모두 Suspense로 각 차트 섹션을 감싸 점진적 렌더링을 구현한다.

```
Page (서버 컴포넌트, 즉시 렌더)
  ├── <h1> 제목
  ├── 네비게이션 버튼
  └── {childItems.map()} 각 항목마다:
        └── <Suspense fallback={<ChartSkeleton />}>
              └── DynamicSection / PpiDynamicSection
                    └── fetchStatistics() (비동기)
                    └── <CpiChart />
```

이 구조 덕분에 첫 번째 섹션의 데이터가 오기 전에 페이지 骨격과 스켈레톤이 먼저 노출된다.

### CpiChart 내부 로직

```
data: Record<itemCode, StatisticSearchItem[]>
  ↓
1. sortedYears: 모든 TIME 값을 Set으로 수집 후 정렬
2. chartData: 연도별로 { year, [itemCode]: value, ... } 형태로 변환
3. lines: itemCode별 색상(getColorIndex로 결정적 해시)과 이름 설정
4. <LineChart> 렌더링
```

`getColorIndex`는 코드 문자열의 charCode 합을 CHART_COLORS 배열 길이로 모듈로 연산하여, 동일한 항목 코드는 항상 동일한 색상이 되도록 보장한다.

---

## 8. 데이터 흐름 (end-to-end)

### CPI 전체 흐름

```
① /cpi 접속
   → fetchCpiItemCodes('901Y009')
   → StatisticItemList 배치 요청 (최대 1~2회, 배치 100)
   → CYCLE='A' 필터 → 재귀 buildHierarchy()
   → CpiTopLevelButtons 렌더링 (최상위 항목 버튼)

② 버튼 클릭 → /cpi/A0110?code=A01101
   → fetchCpiItemCodes('901Y009', 'A0110')
   → 특정 코드 하위 계층만 반환
   → CpiHierarchyButtons (URL 상태 탐색)
   → 선택된 parentItem 하위 children 순회
     └── 각 childItem마다 Suspense + DynamicSection
           → fetchCpiStatistics([childItemCodes])
           → itemCode별 Promise.allSettled 병렬 호출
           → CpiChart 렌더링
```

### PPI 전체 흐름

```
① /ppi 접속
   → fetchPpiStatisticTableLists([6개 코드])
   → StatisticTableList × 6 병렬 호출
   → PpiHierarchyButtons 6개 렌더링

② 버튼 클릭 → /ppi/901Y093?name=매매가격지수
   → fetchPpiItemCodes('901Y093')
   → StatisticItemList 배치 요청 (배치 10, 페이지네이션)
   → CYCLE='M' 필터 → H/R 코드 기반 buildPpiHierarchy()
   → hierarchy.map() 각 H-항목마다 Suspense + PpiDynamicSection
       → fetchPpiStatistics([R-codes], H-code)
       → R-code별 Promise.allSettled 병렬 호출
         → 각 코드마다 페이지네이션 처리 (페이지 100건)
       → CpiChart (nameKey='ITEM_NAME2') 렌더링
```

---

## 9. 에러 처리 시스템

### 에러 클래스 계층

```
Error (내장)
  └── AppError
        ├── ApiError       (HTTP 에러, statusCode 기반 severity 자동 결정)
        ├── NetworkError   (severity: HIGH, retryable: true)
        ├── ValidationError (severity: LOW, retryable: false)
        └── DataError      (데이터 형식/처리 에러)
```

**AppError 주요 속성**

```typescript
type: ErrorType         // CLIENT | SERVER | NETWORK | VALIDATION | UNKNOWN
severity: ErrorSeverity // LOW | MEDIUM | HIGH | CRITICAL
context: {
  location?: string    // 에러 발생 함수명
  metadata?: object    // 디버그 정보
  userMessage?: string // 사용자 노출 메시지
  retryable?: boolean  // 재시도 가능 여부
}
statusCode?: number
timestamp: Date
isOperational: boolean  // 예상된 에러 vs 버그 구분
```

### 에러 처리 전략

| 상황                    | 처리 방식                       | 결과                             |
| ----------------------- | ------------------------------- | -------------------------------- |
| 페이지 전체 데이터 없음 | `throw handleError()`           | `error.tsx` 에러 바운더리 렌더링 |
| 항목 일부 실패          | `handleError()` 후 빈 배열 반환 | 해당 섹션만 빈 상태로 렌더링     |
| API 키/URL 미설정       | `DataError` throw               | 치명적 에러로 처리               |
| HTTP 5xx                | `ApiError(retryable: true)`     | 재시도 가능 표시                 |
| HTTP 4xx                | `ApiError(retryable: false)`    | 재시도 불가 표시                 |

### 로깅 전략

- **개발 환경**: `console.error`에 전체 스택 트레이스, 메타데이터 포함 상세 로그
- **프로덕션**: 간결한 에러 메시지만 출력 (민감 정보 노출 방지)

---

## 10. 스타일링 시스템

### 테마 (CSS 변수)

```css
/* 라이트 모드: 레트로 크림 배경 */
--background: #fff7d6 --foreground: #1b1b1b --retro-accent: #ff7a00 /* 주황색 강조 */ --retro-accent-2: #16a3ff
	/* 다크 모드 */ --background: #0b0f1f --foreground: #f5f3ff --retro-accent: #ffb347 --retro-accent-2: #3dd5ff;
```

### 공통 유틸리티 클래스

```css
.retro-panel {
	border: 2px solid var(--retro-ink);
	box-shadow: 4px 4px 0 var(--retro-shadow); /* 레트로 그림자 */
}

.retro-button {
	border: 2px solid var(--retro-ink);
	box-shadow: 3px 3px 0 var(--retro-shadow);
	text-transform: uppercase;
	transition:
		transform 0.12s,
		box-shadow 0.12s;
}
.retro-button:hover {
	transform: translate(-1px, -1px); /* 호버 시 떠오르는 효과 */
	box-shadow: 4px 4px 0 var(--retro-shadow);
}
```

### 차트 색상 팔레트

`CHART_COLORS`는 30가지 구분 가능한 색상을 담고 있으며, `getColorIndex(itemCode)` 함수가 itemCode 문자열 기반 해시로 결정론적 색상 매핑을 제공한다.

---

## 11. 성능 최적화 현황

| 최적화 기법                          | 적용 위치                                          | 효과                            |
| ------------------------------------ | -------------------------------------------------- | ------------------------------- |
| `memo()`                             | Button, Skeleton, LineChart, CpiChart              | 불필요한 리렌더링 방지          |
| `useMemo`                            | CpiChart (sortedYears, chartData, lines, unitName) | 비용 큰 계산 캐싱               |
| `useCallback`                        | CpiChart (getColorIndex)                           | 함수 참조 안정화                |
| Next.js ISR                          | 모든 fetch 호출 (`revalidate: 30일`)               | 반복 API 호출 차단              |
| `Promise.all` / `Promise.allSettled` | 배치 페이지네이션, itemCode별 통계 조회            | 병렬 처리로 지연 최소화         |
| Suspense 스트리밍                    | CPI/PPI 동적 페이지                                | 첫 바이트까지의 시간(TTFB) 단축 |
| 서버 컴포넌트                        | 대부분의 컴포넌트                                  | JS 번들 크기 감소               |

---

## 12. 알려진 이슈 및 개선 포인트

### 이슈 1: `fetchPpiStatistics`의 `statCode` 하드코딩

```typescript
// 현재 코드 (fetchPpiStatistics.ts line 16)
const statCode = CODE_PPI_BUYING_2021_06; // '901Y093' 고정
```

`/ppi/901Y094`(전세), `/ppi/901Y095`(월세) 등 어느 PPI 페이지를 방문하더라도 항상 매매가격지수(`901Y093`) 데이터를 조회한다. `PpiDynamicSection`이 `statCode`를 받지 않기 때문에 발생하는 구조적 문제이다.

**수정 방법**: `fetchPpiStatistics`의 시그니처를 `(itemCodes, parentCode, statCode)` 형태로 확장하고, `PpiDynamicSection` → `/ppi/[code]/page.tsx` 경로로 `statCode`를 전달해야 한다.

### 이슈 2: `fetchPpiStatisticTableList`의 타입 캐스팅

```typescript
const rows = (data as any)?.StatisticTableList?.row as PpiStatisticTableListType[] | undefined;
```

`data`를 `StatisticSearchResponse`로 타입 지정했지만 실제 응답은 `StatisticTableList` 구조다. `as any` 캐스팅이 타입 안전성을 해친다. 별도 응답 타입 인터페이스 정의가 필요하다.

### 이슈 3: `endTime` 고정값 (`'202512'`)

현재 `fetchPpiStatistics`에서 `endTime`이 `'202512'`로 고정되어 있어 2026년 이후 데이터가 누락된다. 현재 날짜 기반 동적 생성으로 변경이 권장된다.

### 이슈 4: PPI 동적 페이지의 타이틀

```typescript
// /ppi/[code]/page.tsx
<h1>{queryParams.name}</h1>  // URL 쿼리 파라미터에 의존
```

`name`이 URL에 없으면 타이틀이 비어있다. `fetchPpiItemCodes`나 `fetchPpiStatisticTableList`에서 이름을 가져오는 것이 더 안전하다.

### 이슈 5: PPI API 호출 수

PPI 동적 페이지의 API 호출 구조상 섹션 수 × (itemCode 수 × 페이지 수)만큼 요청이 발생한다. API가 배치 쿼리를 지원하지 않아 구조적으로 많은 요청이 불가피하며, 현실적인 해결책은 Redis 등 서버 사이드 캐시 레이어 도입이다.

---

## 13. 설정 파일 요약

### `next.config.ts`

```typescript
const nextConfig: NextConfig = {}; // 커스텀 설정 없음
```

### `tsconfig.json` 핵심 설정

```json
{
	"strict": true, // 엄격 타입 검사
	"paths": { "@/*": ["./src/*"] }, // 경로 별칭
	"target": "ES2017",
	"moduleResolution": "bundler"
}
```

### 환경 변수 (`.env`)

```
NEXT_PUBLIC_BOK_API_KEY
```

`BOK_BASE_URL`은 `src/const/BOK_CODE.ts`의 상수로 관리합니다.

---

## 14. 의존성 맵 (주요 파일 간 관계)

```
app/
  page.tsx
    └── components/ui/Button

  cpi/page.tsx
    ├── lib/cpi/fetchCpiItemCodes          ← const/BOK_CODE (CODE_CPI)
    └── components/cpi/CpiTopLevelButtons

  cpi/[code]/page.tsx
    ├── lib/cpi/fetchCpiItemCodes
    ├── components/cpi/CpiHierarchyButtons
    └── components/cpi/DynamicSection
          ├── lib/cpi/fetchCpiStatistics
          └── components/cpi/CpiChart
                ├── components/charts/LineChart  ← recharts
                └── const/CHART_COLORS

  ppi/page.tsx
    ├── lib/ppi/fetchPpiStatisticTableList   ← const/BOK_CODE (6개 코드)
    └── components/ppi/PpiHierarchyButtons

  ppi/[code]/page.tsx
    ├── lib/ppi/fetchPpiItemCodes
    └── components/ppi/PpiDynamicSection
          ├── lib/ppi/fetchPpiStatistics       ← const/BOK_CODE (하드코딩 이슈)
          └── components/cpi/CpiChart           (CPI 차트 컴포넌트 공유)

lib/errors/ ← 모든 lib/* 파일에서 공통 사용
  AppError.ts, errorHandler.ts, index.ts
```

---

_이 보고서는 2026-03-20 기준 코드베이스 전체를 분석한 결과이며, 이후 코드 변경 시 내용이 달라질 수 있다._
