export interface TireType {
	id: number
	title: string
	description: string | null
	optimalPressure: number
	radius: number
	likesCount: number
	imageUrl: string
	videoUrl: string
}

export const TIRE_TYPES_MOCK: TireType[] = [
	{
		id: 1,
		title: "Michelin Pilot Sport 5",
		description: "Летняя шина для динамичного вождения. Уверенно держит траекторию на сухом и мокром покрытии.",
		optimalPressure: 2.4,
		radius: 18,
		likesCount: 128,
		imageUrl: "",
		videoUrl: ""
	},
	{
		id: 2,
		title: "Pirelli Ice Zero",
		description: "Шипованная зимняя шина для безопасных поездок по льду и снегу в городском режиме.",
		optimalPressure: 2.2,
		radius: 17,
		likesCount: 96,
		imageUrl: "",
		videoUrl: ""
	},
	{
		id: 3,
		title: "Continental PremiumContact 7",
		description: "Комфортная летняя модель с коротким тормозным путём и низким уровнем шума.",
		optimalPressure: 2.3,
		radius: 19,
		likesCount: 74,
		imageUrl: "",
		videoUrl: ""
	},
	{
		id: 4,
		title: "Nokian Tyres Nordman 8",
		description: "Зимняя шина для суровой погоды: стабильное сцепление, износостойкий протектор.",
		optimalPressure: 2.1,
		radius: 16,
		likesCount: 111,
		imageUrl: "",
		videoUrl: ""
	},
	{
		id: 5,
		title: "Goodyear Vector 4Seasons",
		description: "Всесезонная шина для умеренного климата и ежедневных городских маршрутов.",
		optimalPressure: 2.3,
		radius: 18,
		likesCount: 63,
		imageUrl: "",
		videoUrl: ""
	}
]
