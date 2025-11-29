// CPI 차트용 통일된 색상 팔레트 (최대 20개)
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
	'rgb(99, 102, 241)', // Indigo-500
	'rgb(16, 185, 129)', // Emerald-500
	'rgb(139, 92, 246)', // Violet-500
	'rgb(239, 68, 68)', // Red-500
	'rgb(245, 158, 11)', // Amber-500
	'rgb(6, 182, 212)', // Cyan-500
	'rgb(180, 83, 9)', // Amber-800
	'rgb(194, 65, 12)', // Orange-700
	'rgb(225, 29, 72)', // Pink-600
	'rgb(107, 114, 128)', // Gray-500
] as const;

// 아이템 코드별 매핑 정보 (색상은 순서대로 할당)
export const ITEM_CODE_MAPPING = {
	// 곡류
	A01101: { key: 'rice' as const, color: CHART_COLORS[0] },
	A01102: { key: 'brownRice' as const, color: CHART_COLORS[1] },
	A01103: { key: 'glutinousRice' as const, color: CHART_COLORS[2] },
	A01104: { key: 'barleyRice' as const, color: CHART_COLORS[3] },
	A01105: { key: 'bean' as const, color: CHART_COLORS[4] },
	A01106: { key: 'peanut' as const, color: CHART_COLORS[5] },
	A01108: { key: 'flour' as const, color: CHART_COLORS[6] },

	// 면류
	A01109: { key: 'noodles' as const, color: CHART_COLORS[0] },
	A01110: { key: 'instantNoodles' as const, color: CHART_COLORS[1] },
	A01111: { key: 'glassNoodles' as const, color: CHART_COLORS[2] },
	A01112: { key: 'tofu' as const, color: CHART_COLORS[7] },
	A01113: { key: 'cereals' as const, color: CHART_COLORS[6] },
	A01114: { key: 'pancakePowder' as const, color: CHART_COLORS[8] },
	A01115: { key: 'cake' as const, color: CHART_COLORS[3] },
	A01116: { key: 'bread' as const, color: CHART_COLORS[4] },

	// 육류
	A01201: { key: 'domesticBeef' as const, color: CHART_COLORS[0] },
	A01202: { key: 'importedBeef' as const, color: CHART_COLORS[1] },
	A01203: { key: 'pork' as const, color: CHART_COLORS[2] },
	A01204: { key: 'chicken' as const, color: CHART_COLORS[3] },
	A01205: { key: 'sausage' as const, color: CHART_COLORS[4] },
	A01206: { key: 'hamBacon' as const, color: CHART_COLORS[5] },
	A01207: { key: 'otherProcessedMeat' as const, color: CHART_COLORS[6] },

	// 어류
	A01301: { key: 'cutlassfish' as const, color: CHART_COLORS[0] },
	A01302: { key: 'pollock' as const, color: CHART_COLORS[1] },
	A01303: { key: 'croaker' as const, color: CHART_COLORS[2] },
	A01304: { key: 'mackerel' as const, color: CHART_COLORS[3] },
	A01305: { key: 'squid' as const, color: CHART_COLORS[4] },
	A01313: { key: 'octopus' as const, color: CHART_COLORS[5] },

	// 수산물 및 가공품
	A01306: { key: 'crab' as const, color: CHART_COLORS[0] },
	A01307: { key: 'oyster' as const, color: CHART_COLORS[1] },
	A01308: { key: 'shellfish' as const, color: CHART_COLORS[2] },
	A01309: { key: 'abalone' as const, color: CHART_COLORS[3] },
	A01310: { key: 'shrimp' as const, color: CHART_COLORS[4] },
	A01311: { key: 'driedAnchovy' as const, color: CHART_COLORS[5] },
	A01312: { key: 'driedSquid' as const, color: CHART_COLORS[6] },
	A01314: { key: 'squidStrips' as const, color: CHART_COLORS[7] },
	A01315: { key: 'driedPollack' as const, color: CHART_COLORS[8] },
	A01316: { key: 'fishCake' as const, color: CHART_COLORS[9] },
	A01317: { key: 'crabStick' as const, color: CHART_COLORS[10] },
	A01318: { key: 'cannedSeafood' as const, color: CHART_COLORS[11] },
	A01319: { key: 'saltedSeafood' as const, color: CHART_COLORS[12] },
} as const;
