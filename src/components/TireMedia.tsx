import type { TireType } from "../data/tireTypes"

interface TireMediaProps {
	tire: TireType
	mode?: "image" | "video"
	className?: string
}

const DEFAULT_IMAGE = "/default.jpg"
const DEFAULT_VIDEO = "/default.MOV"

export function toMediaProxyUrl(url: string | null | undefined): string {
	if (!url) return ""
	try {
		const parsed = new URL(url)
		if (parsed.pathname.startsWith("/media/") || parsed.port === "9000") return `/s3${parsed.pathname}${parsed.search}`
		return url
	} catch {
		return url
	}
}

function fallbackToDefaultImage(event: React.SyntheticEvent<HTMLImageElement>) {
	const image = event.currentTarget
	if (image.dataset.fallback === "true") return
	image.dataset.fallback = "true"
	image.src = DEFAULT_IMAGE
}

export function TireMedia({ tire, mode = "image", className = "" }: TireMediaProps) {
	if (mode === "video") {
		return (
			<video
				className={className}
				src={toMediaProxyUrl(tire.videoUrl) || DEFAULT_VIDEO}
				poster={toMediaProxyUrl(tire.imageUrl) || DEFAULT_IMAGE}
				autoPlay
				muted
				loop
				playsInline
			/>
		)
	}

	return (
		<div className={`media-fallback ${className}`}>
			<img src={toMediaProxyUrl(tire.imageUrl) || DEFAULT_IMAGE} alt={tire.title} onError={fallbackToDefaultImage} />
		</div>
	)
}
