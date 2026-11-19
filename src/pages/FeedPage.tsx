import type { TireType } from "../data/tireTypes"
import { TireMedia } from "../components/TireMedia"

interface FeedPageProps {
	tires: TireType[]
	selectedId: number | null
	onSelect: (id: number | null) => void
	onToggleLike: (tire: TireType) => void
	onDelete: (id: number) => void
	isAuthenticated: boolean
	loading: boolean
	error: string | null
}

export function FeedPage({ tires, selectedId, onSelect, onToggleLike, onDelete, isAuthenticated, loading, error }: FeedPageProps) {
	if (!tires.length) {
		return (
			<section className="feed-empty">
				<p>{error ?? "Нет доступных шин."}</p>
			</section>
		)
	}

	const foundIndex = selectedId === null ? 0 : tires.findIndex((item) => item.id === selectedId)
	const currentIndex = foundIndex >= 0 ? foundIndex : 0
	const tire = tires[currentIndex]

	const nextTire = () => {
		const next = tires[(currentIndex + 1) % tires.length]
		if (next) onSelect(next.id)
	}

	const deleteCurrent = () => {
		const remaining = tires.filter((item) => item.id !== tire.id)
		const next = remaining[currentIndex] ?? remaining[0] ?? null
		onDelete(tire.id)
		onSelect(next ? next.id : null)
	}

	return (
		<section className="feed-container">
			<TireMedia tire={tire} mode="video" />
			<div className="feed-overlay">
				<div className="feed-text">
					<h2>{tire.title}</h2>
					<details className="feed-more">
						<summary>
							<span className="feed-description">{tire.description ?? "Описание отсутствует."}</span>
							<span className="more-link more-open">Больше</span>
							<span className="more-link more-close">Меньше</span>
						</summary>
					</details>
				</div>
				<div className="feed-fields">
					<span>Оптимальное давление: {tire.optimalPressure} бар</span>
					<span>Радиус: R{tire.radius}</span>
				</div>
			</div>
			<div className="feed-actions">
				<button
					type="button"
					className={`like-btn ${tire.isLiked ? "liked" : ""}`}
					onClick={() => onToggleLike(tire)}
					disabled={loading}
					aria-label={tire.isLiked ? "Убрать лайк" : "Поставить лайк"}
				>
					<span className="like-icon">
						<img src={tire.isLiked ? "/icons/like-active.png" : "/icons/like.png"} alt="Лайк" />
					</span>
					<span>{tire.likesCount}</span>
				</button>
				<button type="button" className="next-btn" onClick={nextTire} disabled={loading || tires.length < 2} aria-label="Следующая шина">
					<img src="/icons/next.png" alt="Следующая" />
				</button>
				{isAuthenticated && tire.isOwner && (
					<button
						type="button"
						className="next-btn delete-btn"
						onClick={deleteCurrent}
						disabled={loading}
						aria-label="Удалить шину"
					>
						×
					</button>
				)}
			</div>
		</section>
	)
}
