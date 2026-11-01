import { useMemo, useState } from "react"
import type { TireType } from "../data/tireTypes"
import { FilterPanel, type Filters } from "../components/FilterPanel"
import { TireCard } from "../components/TireCard"

interface TilePageProps {
	tires: TireType[]
	onOpenInFeed: (id: number) => void
}

const initialFilters: Filters = { radiusMin: 13, radiusMax: 22 }

export function TilePage({ tires, onOpenInFeed }: TilePageProps) {
	const [draftFilters, setDraftFilters] = useState<Filters>(initialFilters)
	const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters)
	const filteredTires = useMemo(() => {
		return tires.filter((tire) => tire.radius >= appliedFilters.radiusMin && tire.radius <= appliedFilters.radiusMax)
	}, [appliedFilters, tires])

	return (
		<section className="tile-page">
			<h1 className="page-title">Каталог шин</h1>
			<FilterPanel
				filters={draftFilters}
				onChange={setDraftFilters}
				onApply={() => setAppliedFilters(draftFilters)}
				resultCount={filteredTires.length}
			/>
			<div className="tile-grid">
				{filteredTires.map((tire) => (
					<TireCard key={tire.id} tire={tire} onOpen={onOpenInFeed} />
				))}
			</div>
			{filteredTires.length === 0 && <p className="empty-result">Ничего не найдено</p>}
		</section>
	)
}
