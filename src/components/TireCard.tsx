import type { TireType } from "../data/tireTypes"
import { TireMedia } from "./TireMedia"

interface TireCardProps {
	tire: TireType
	onOpen: (id: number) => void
}

export function TireCard({ tire, onOpen }: TireCardProps) {
	return (
		<div
			className="tire-type-card"
			role="button"
			tabIndex={0}
			onClick={() => onOpen(tire.id)}
			onKeyDown={(event) => event.key === "Enter" && onOpen(tire.id)}
		>
			<div className="tire-type-link">
				<TireMedia tire={tire} className="card-media" />
				<h3>{tire.title}</h3>
				<p className="likes">♡ {tire.likesCount}</p>
				<p className="tire-type-radius">Радиус: R{tire.radius}</p>
			</div>
		</div>
	)
}
