import type { TireType } from "../data/tireTypes"
import { DEFAULT_IMAGE, DEFAULT_VIDEO, toMediaProxyUrl } from "../media"

interface TireMediaProps {
	tire: TireType
	mode?: "image" | "video"
	className?: string
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
