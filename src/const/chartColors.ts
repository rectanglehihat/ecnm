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

	// 우유, 치즈 및 계란
	A01401: { key: 'milk' as const, color: CHART_COLORS[0] },
	A01402: { key: 'babyFormula' as const, color: CHART_COLORS[1] },
	A01403: { key: 'cheese' as const, color: CHART_COLORS[2] },
	A01404: { key: 'fermentedMilk' as const, color: CHART_COLORS[3] },
	A01405: { key: 'egg' as const, color: CHART_COLORS[4] },

	// 식용유지
	A01501: { key: 'sesameOil' as const, color: CHART_COLORS[0] },
	A01502: { key: 'cookingOil' as const, color: CHART_COLORS[1] },

	// 과일
	A01601: { key: 'apple' as const, color: CHART_COLORS[0] },
	A01602: { key: 'pear' as const, color: CHART_COLORS[1] },
	A01603: { key: 'peach' as const, color: CHART_COLORS[2] },
	A01604: { key: 'grape' as const, color: CHART_COLORS[3] },
	A01605: { key: 'chestnut' as const, color: CHART_COLORS[4] },
	A01606: { key: 'persimmon' as const, color: CHART_COLORS[5] },
	A01607: { key: 'mandarin' as const, color: CHART_COLORS[6] },
	A01608: { key: 'orange' as const, color: CHART_COLORS[7] },
	A01609: { key: 'koreanMelon' as const, color: CHART_COLORS[8] },
	A01610: { key: 'watermelon' as const, color: CHART_COLORS[9] },
	A01611: { key: 'strawberry' as const, color: CHART_COLORS[10] },
	A01612: { key: 'banana' as const, color: CHART_COLORS[11] },
	A01613: { key: 'kiwi' as const, color: CHART_COLORS[12] },
	A01614: { key: 'blackberry' as const, color: CHART_COLORS[13] },
	A01615: { key: 'mango' as const, color: CHART_COLORS[14] },
	A01616: { key: 'cherry' as const, color: CHART_COLORS[15] },
	A01617: { key: 'avocado' as const, color: CHART_COLORS[16] },
	A01618: { key: 'pineapple' as const, color: CHART_COLORS[17] },
	A01619: { key: 'almond' as const, color: CHART_COLORS[18] },

	// 채소1
	A01701: { key: 'kimchiCabbage' as const, color: CHART_COLORS[0] },
	A01702: { key: 'lettuce' as const, color: CHART_COLORS[1] },
	A01703: { key: 'spinach' as const, color: CHART_COLORS[2] },
	A01704: { key: 'cabbage' as const, color: CHART_COLORS[3] },
	A01705: { key: 'waterParsley' as const, color: CHART_COLORS[4] },
	A01706: { key: 'perillaLeaves' as const, color: CHART_COLORS[5] },
	A01707: { key: 'chives' as const, color: CHART_COLORS[6] },
	A01708: { key: 'radish' as const, color: CHART_COLORS[7] },
	A01709: { key: 'yeolmu' as const, color: CHART_COLORS[8] },
	A01710: { key: 'carrot' as const, color: CHART_COLORS[9] },
	A01711: { key: 'potato' as const, color: CHART_COLORS[10] },
	A01712: { key: 'sweetPotato' as const, color: CHART_COLORS[11] },
	A01713: { key: 'balloonFlower' as const, color: CHART_COLORS[12] },
	A01714: { key: 'beanSprout' as const, color: CHART_COLORS[13] },
	A01715: { key: 'mushroom' as const, color: CHART_COLORS[14] },

	// 채소2
	A01716: { key: 'cucumber' as const, color: CHART_COLORS[0] },
	A01717: { key: 'greenPepper' as const, color: CHART_COLORS[1] },
	A01718: { key: 'pumpkin' as const, color: CHART_COLORS[2] },
	A01719: { key: 'eggPlant' as const, color: CHART_COLORS[3] },
	A01720: { key: 'tomato' as const, color: CHART_COLORS[4] },
	A01721: { key: 'greenOnion' as const, color: CHART_COLORS[5] },
	A01722: { key: 'onion' as const, color: CHART_COLORS[6] },
	A01723: { key: 'garlic' as const, color: CHART_COLORS[7] },
	A01724: { key: 'broccoli' as const, color: CHART_COLORS[8] },
	A01725: { key: 'bracken' as const, color: CHART_COLORS[9] },
	A01726: { key: 'paprika' as const, color: CHART_COLORS[10] },
	A01727: { key: 'pickledRadish' as const, color: CHART_COLORS[11] },
	A01728: { key: 'kim' as const, color: CHART_COLORS[12] },
	A01729: { key: 'saltedKim' as const, color: CHART_COLORS[13] },
	A01730: { key: 'seaweed' as const, color: CHART_COLORS[14] },
} as const;
