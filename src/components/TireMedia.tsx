import type { TireType } from "../data/tireTypes"

interface TireMediaProps {
	tire: TireType
	mode?: "image" | "video"
	className?: string
}

const DEFAULT_IMAGE = "/default.jpg"
const DEFAULT_VIDEO = "/default.MOV"

export function TireMedia({ tire, mode = "image", className = "" }: TireMediaProps) {
	if (mode === "video") {
		return (
			<video
				className={className}
				src={tire.videoUrl || DEFAULT_VIDEO}
				poster={tire.imageUrl || DEFAULT_IMAGE}
				autoPlay
				muted
				loop
				playsInline
			/>
		)
	}

	return (
		<div className={`media-fallback ${className}`}>
			<img src={tire.imageUrl || DEFAULT_IMAGE} alt={tire.title} />
		</div>
	)
}
