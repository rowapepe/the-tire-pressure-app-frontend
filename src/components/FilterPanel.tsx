import { Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"

import { fetchTires } from "../store/tiresSlice"
import { setRadiusMax, setRadiusMin } from "../store/filtersSlice"
import type { AppDispatch, RootState } from "../store/store"

interface FilterPanelProps {
	resultCount: number
	loading: boolean
}

export function FilterPanel({ resultCount, loading }: FilterPanelProps) {
	const dispatch = useDispatch<AppDispatch>()
	const { radiusMin, radiusMax } = useSelector((state: RootState) => state.filters)

	return (
		<form
			className="filter-form"
			onSubmit={(event) => {
				event.preventDefault()
				dispatch(fetchTires())
			}}
		>
			<label>Радиус колеса</label>
			<div className="range-slider">
				<input
					type="range"
					min={13}
					max={22}
					value={radiusMin}
					onChange={(event) => dispatch(setRadiusMin(Number(event.target.value)))}
					disabled={loading}
					aria-label="Минимальный радиус"
				/>
				<input
					type="range"
					min={13}
					max={22}
					value={radiusMax}
					onChange={(event) => dispatch(setRadiusMax(Number(event.target.value)))}
					disabled={loading}
					aria-label="Максимальный радиус"
				/>
			</div>
			<div className="range-scale">
				<span>R13</span>
				<span className="range-selected">
					R{radiusMin} – R{radiusMax}
				</span>
				<span>R22</span>
			</div>
			<Button type="submit" className="filter-btn" disabled={loading}>
				{loading ? "Загрузка…" : "Найти"}
			</Button>
			<p className="filter-result">Найдено: {resultCount}</p>
		</form>
	)
}
