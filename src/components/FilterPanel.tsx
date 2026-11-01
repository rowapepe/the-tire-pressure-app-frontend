import { Button } from "react-bootstrap"

export interface Filters {
	radiusMin: number
	radiusMax: number
}

interface FilterPanelProps {
	filters: Filters
	onChange: (filters: Filters) => void
	onApply: () => void
	resultCount: number
}

export function FilterPanel({ filters, onChange, onApply, resultCount }: FilterPanelProps) {
	const update = (key: keyof Filters, value: number) => {
		const next = { ...filters, [key]: value }
		onChange({ radiusMin: Math.min(next.radiusMin, next.radiusMax), radiusMax: Math.max(next.radiusMin, next.radiusMax) })
	}

	return (
		<form
			className="filter-form"
			onSubmit={(event) => {
				event.preventDefault()
				onApply()
			}}
		>
			<label>Радиус колеса</label>
			<div className="range-slider">
				<input
					type="range"
					min={13}
					max={22}
					value={filters.radiusMin}
					onChange={(event) => update("radiusMin", Number(event.target.value))}
					aria-label="Минимальный радиус"
				/>
				<input
					type="range"
					min={13}
					max={22}
					value={filters.radiusMax}
					onChange={(event) => update("radiusMax", Number(event.target.value))}
					aria-label="Максимальный радиус"
				/>
			</div>
			<div className="range-scale">
				<span>R13</span>
				<span className="range-selected">
					R{filters.radiusMin} – R{filters.radiusMax}
				</span>
				<span>R22</span>
			</div>
			<Button type="submit" className="filter-btn">
				Найти
			</Button>
			<p className="filter-result">Найдено: {resultCount}</p>
		</form>
	)
}
