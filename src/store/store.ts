import { configureStore } from "@reduxjs/toolkit"

import filtersReducer from "./filtersSlice"
import tiresReducer from "./tiresSlice"
import userReducer from "./userSlice"

export const store = configureStore({
	reducer: {
		filters: filtersReducer,
		tires: tiresReducer,
		user: userReducer
	},
	devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
