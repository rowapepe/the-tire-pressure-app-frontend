import type { TireType } from "../data/tireTypes"
import { TireMedia } from "./TireMedia"

interface TireCardProps {
	tire: TireType
	onOpen: (id: number) => void
	onToggleLike: () => void
	onDelete: () => void
	isAuthenticated: boolean
	loading: boolean
}

export function TireCard({ tire, onOpen, onToggleLike, onDelete, isAuthenticated, loading }: TireCardProps) {
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
			<div className="tile-actions" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
				<button
					type="button"
					className={`card-like ${tire.isLiked ? "liked" : ""}`}
					onClick={onToggleLike}
					disabled={loading}
					aria-label={tire.isLiked ? "Убрать лайк" : "Поставить лайк"}
				>
					<img src={tire.isLiked ? "/icons/like-active.png" : "/icons/like.png"} alt="" />
				</button>
				{isAuthenticated && tire.isOwner && (
					<button type="button" className="card-delete" onClick={onDelete} disabled={loading}>
						Удалить
					</button>
				)}
			</div>
		</div>
	)
}
