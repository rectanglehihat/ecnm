// CPI 차트용 통일된 색상 팔레트 (최대 10개)
export const CHART_COLORS = [
	'rgb(59, 130, 246)', // Blue-500
	'rgb(34, 197, 94)', // Green-500
	'rgb(168, 85, 247)', // Purple-500
	'rgb(245, 101, 101)', // Red-400
	'rgb(251, 191, 36)', // Yellow-400
	'rgb(14, 165, 233)', // Sky-500
	'rgb(139, 69, 19)', // Brown
	'rgb(251, 146, 60)', // Orange-400
	'rgb(244, 63, 94)', // Rose-500
	'rgb(156, 163, 175)', // Gray-400
] as const;

// 아이템 코드별 매핑 정보 (색상은 순서대로 할당)
export const ITEM_CODE_MAPPING = {
	// 곡류 (0-6번 색상 사용)
	A01101: { key: 'rice' as const, color: CHART_COLORS[0] },
	A01102: { key: 'brownRice' as const, color: CHART_COLORS[1] },
	A01103: { key: 'glutinousRice' as const, color: CHART_COLORS[2] },
	A01104: { key: 'barleyRice' as const, color: CHART_COLORS[3] },
	A01105: { key: 'bean' as const, color: CHART_COLORS[4] },
	A01106: { key: 'peanut' as const, color: CHART_COLORS[5] },
	A01108: { key: 'flour' as const, color: CHART_COLORS[6] },

	// 면류 (0-7번 색상 사용)
	A01109: { key: 'noodles' as const, color: CHART_COLORS[0] },
	A01110: { key: 'instantNoodles' as const, color: CHART_COLORS[1] },
	A01111: { key: 'glassNoodles' as const, color: CHART_COLORS[2] },
	A01112: { key: 'tofu' as const, color: CHART_COLORS[7] },
	A01113: { key: 'cereals' as const, color: CHART_COLORS[6] },
	A01114: { key: 'pancakePowder' as const, color: CHART_COLORS[8] },
	A01115: { key: 'cake' as const, color: CHART_COLORS[3] },
	A01116: { key: 'bread' as const, color: CHART_COLORS[4] },
} as const;
