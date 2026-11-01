import { useEffect, useState } from "react"
import type { TireType } from "../data/tireTypes"
import { TireMedia } from "../components/TireMedia"

interface FeedPageProps {
	tires: TireType[]
}

export function FeedPage({ tires }: FeedPageProps) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [liked, setLiked] = useState(false)
	const tire = tires[currentIndex] ?? tires[0]

	useEffect(() => {
		setCurrentIndex(0)
		setLiked(false)
	}, [tires])

	if (!tire) return <p className="p-4">Нет доступных шин.</p>

	const nextTire = () => {
		setCurrentIndex((index) => (index + 1) % tires.length)
		setLiked(false)
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
				<button type="button" className="like-btn" onClick={() => setLiked((value) => !value)} aria-label="Поставить лайк">
					<span className="like-icon">
						<img src={liked ? "/icons/like-active.png" : "/icons/like.png"} alt="Лайк" />
					</span>
					<span>{tire.likesCount + Number(liked)}</span>
				</button>
				<button type="button" className="next-btn" onClick={nextTire} aria-label="Следующая шина">
					<img src="/icons/next.png" alt="Следующая" />
				</button>
			</div>
		</section>
	)
}
