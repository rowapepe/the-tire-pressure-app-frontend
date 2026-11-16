import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { DEFAULT_FILTERS, type TireFilters } from "../data/tireTypes"
import { logout } from "./userSlice"

const filtersSlice = createSlice({
	name: "filters",
	initialState: { ...DEFAULT_FILTERS } as TireFilters,
	reducers: {
		setRadiusMin(state, action: PayloadAction<number>) {
			state.radiusMin = Math.min(action.payload, state.radiusMax)
		},
		setRadiusMax(state, action: PayloadAction<number>) {
			state.radiusMax = Math.max(action.payload, state.radiusMin)
		},
		setFilters(state, action: PayloadAction<TireFilters>) {
			const radiusMin = Math.min(action.payload.radiusMin, action.payload.radiusMax)
			const radiusMax = Math.max(action.payload.radiusMin, action.payload.radiusMax)
			state.radiusMin = radiusMin
			state.radiusMax = radiusMax
		},
		resetFilters() {
			return { ...DEFAULT_FILTERS }
		}
	},
	extraReducers: (builder) => {
		builder.addCase(logout, () => ({ ...DEFAULT_FILTERS }))
	}
})

export const { setRadiusMin, setRadiusMax, setFilters, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer
