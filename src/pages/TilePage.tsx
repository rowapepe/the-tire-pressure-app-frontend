import { useDispatch, useSelector } from "react-redux"

import { FilterPanel } from "../components/FilterPanel"
import { TireCard } from "../components/TireCard"
import type { AppDispatch, RootState } from "../store/store"
import { deleteTire, toggleMockLike, toggleTireLike } from "../store/tiresSlice"

interface TilePageProps {
	onOpenInFeed: (id: number) => void
}

export function TilePage({ onOpenInFeed }: TilePageProps) {
	const dispatch = useDispatch<AppDispatch>()
	const { items, loading, error, source } = useSelector((state: RootState) => state.tires)
	const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)

	return (
		<section className="tile-page">
			<h1 className="page-title">Каталог шин</h1>
			<FilterPanel resultCount={items.length} loading={loading} />
			{error && source !== "mock" && <p className="form-error notice">{error}</p>}
			<div className="tile-grid">
				{items.map((tire) => (
					<div className="tile-entry" key={tire.id}>
						<TireCard
							tire={tire}
							onOpen={onOpenInFeed}
							isAuthenticated={isAuthenticated}
							loading={loading}
							onToggleLike={() => {
								if (isAuthenticated) dispatch(toggleTireLike(tire.id))
								else dispatch(toggleMockLike(tire.id))
							}}
							onDelete={() => dispatch(deleteTire(tire.id))}
						/>
					</div>
				))}
			</div>
			{!items.length && !loading && <p className="empty-result">Ничего не найдено</p>}
		</section>
	)
}
