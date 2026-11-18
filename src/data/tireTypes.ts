import type { TireTypeResponseDto } from "../api"

export interface TireType {
	id: number
	title: string
	description: string | null
	optimalPressure: number
	radius: number
	likesCount: number
	imageUrl: string
	videoUrl: string
	isLiked: boolean
	isOwner: boolean
	status?: "draft" | "published" | "deleted"
}

export interface TireFilters {
	radiusMin: number
	radiusMax: number
}

export const DEFAULT_FILTERS: TireFilters = {
	radiusMin: 13,
	radiusMax: 22
}

/**
 * Mock-коллекция используется только в режиме гостя и только тогда,
 * когда запрос к бэкенду завершился ошибкой.
 */
export const TIRE_TYPES_MOCK: TireType[] = [
	{
		id: 1,
		title: "Michelin Pilot Sport 5",
		description: "Летняя шина для динамичного вождения. Уверенно держит траекторию на сухом и мокром покрытии.",
		optimalPressure: 2.4,
		radius: 18,
		likesCount: 128,
		imageUrl: "",
		videoUrl: "",
		isLiked: false,
		isOwner: false,
		status: "published"
	},
	{
		id: 2,
		title: "Pirelli Ice Zero",
		description: "Шипованная зимняя шина для безопасных поездок по льду и снегу в городском режиме.",
		optimalPressure: 2.2,
		radius: 17,
		likesCount: 96,
		imageUrl: "",
		videoUrl: "",
		isLiked: false,
		isOwner: false,
		status: "published"
	},
	{
		id: 3,
		title: "Continental PremiumContact 7",
		description: "Комфортная летняя модель с коротким тормозным путём и низким уровнем шума.",
		optimalPressure: 2.3,
		radius: 19,
		likesCount: 74,
		imageUrl: "",
		videoUrl: "",
		isLiked: false,
		isOwner: false,
		status: "published"
	},
	{
		id: 4,
		title: "Nokian Tyres Nordman 8",
		description: "Зимняя шина для суровой погоды: стабильное сцепление, износостойкий протектор.",
		optimalPressure: 2.1,
		radius: 16,
		likesCount: 111,
		imageUrl: "",
		videoUrl: "",
		isLiked: false,
		isOwner: false,
		status: "published"
	},
	{
		id: 5,
		title: "Goodyear Vector 4Seasons",
		description: "Всесезонная шина для умеренного климата и ежедневных городских маршрутов.",
		optimalPressure: 2.3,
		radius: 18,
		likesCount: 63,
		imageUrl: "",
		videoUrl: "",
		isLiked: false,
		isOwner: false,
		status: "published"
	}
]

export function filterMockTires(filters: TireFilters): TireType[] {
	return TIRE_TYPES_MOCK.filter((tire) => tire.radius >= filters.radiusMin && tire.radius <= filters.radiusMax)
}

export function mapTire(dto: TireTypeResponseDto): TireType {
	return {
		id: dto.id,
		title: dto.title,
		description: dto.description,
		optimalPressure: dto.optimalPressure ?? 0,
		radius: dto.radius ?? DEFAULT_FILTERS.radiusMin,
		likesCount: dto.likesCount,
		imageUrl: dto.imageUrl ?? "",
		videoUrl: dto.videoUrl ?? "",
		isLiked: dto.isLiked === 1,
		isOwner: dto.isOwner === 1,
		status: dto.status
	}
}
