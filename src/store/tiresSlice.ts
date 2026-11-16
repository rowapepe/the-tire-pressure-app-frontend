import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { api } from "../api"
import { getApiErrorMessage } from "../api/http"
import { filterMockTires, mapTire, type TireType } from "../data/tireTypes"
import type { RootState } from "./store"

export type DataSource = "api" | "mock" | "empty"

interface TiresState {
	items: TireType[]
	loading: boolean
	error: string | null
	source: DataSource
}

const initialState: TiresState = {
	items: [],
	loading: false,
	error: null,
	source: "empty"
}

interface FetchTiresResult {
	items: TireType[]
	source: "api"
}

interface FetchTiresError {
	message: string
	mock: TireType[] | null
	isGuest: boolean
}

export interface NewTirePayload {
	title: string
	description: string
	optimalPressure: number
	radius: number
	image: File
	video: File
}

export const fetchTires = createAsyncThunk<FetchTiresResult, void, { state: RootState; rejectValue: FetchTiresError }>(
	"tires/fetchTires",
	async (_, { getState, rejectWithValue }) => {
		const state = getState()
		try {
			const response = await api.tireTypesControllerGetAllTireTypes({
				radiusMin: state.filters.radiusMin,
				radiusMax: state.filters.radiusMax
			})

			return { items: response.data.map(mapTire), source: "api" }
		} catch (error) {
			const isGuest = !state.user.isAuthenticated
			return rejectWithValue({
				message: getApiErrorMessage(error, "Не удалось загрузить услуги"),
				mock: isGuest ? filterMockTires(state.filters) : null,
				isGuest
			})
		}
	}
)

export const createTire = createAsyncThunk<TireType, NewTirePayload, { rejectValue: string }>(
	"tires/createTire",
	async (payload, { rejectWithValue }) => {
		try {
			const draft = await api.tireTypesControllerCreateTireType({
				title: payload.title,
				image: payload.image,
				video: payload.video
			})

			const published = await api.tireTypesControllerPublishTireType(draft.data.id, {
				title: payload.title,
				description: payload.description,
				optimalPressure: payload.optimalPressure,
				radius: payload.radius
			})

			return mapTire(published.data)
		} catch (error) {
			return rejectWithValue(getApiErrorMessage(error, "Не удалось добавить услугу"))
		}
	}
)

export const deleteTire = createAsyncThunk<number, number, { rejectValue: string }>("tires/deleteTire", async (id, { rejectWithValue }) => {
	try {
		await api.tireTypesControllerDeleteTireType(id)
		return id
	} catch (error) {
		return rejectWithValue(getApiErrorMessage(error, "Не удалось удалить услугу"))
	}
})

interface LikeResult {
	id: number
	likesCount: number
	isLiked: boolean
}

export const toggleTireLike = createAsyncThunk<LikeResult, number, { state: RootState; rejectValue: string }>(
	"tires/toggleTireLike",
	async (id, { getState, rejectWithValue }) => {
		const tire = getState().tires.items.find((item) => item.id === id)
		if (!tire) return rejectWithValue("Услуга не найдена")

		try {
			const response = await api.tireTypesControllerSetLike(id, { like: tire.isLiked ? 0 : 1 })
			return { id, likesCount: response.data.likesCount, isLiked: response.data.isLiked === 1 }
		} catch (error) {
			return rejectWithValue(getApiErrorMessage(error, "Не удалось изменить лайк"))
		}
	}
)

const tiresSlice = createSlice({
	name: "tires",
	initialState,
	reducers: {
		toggleMockLike(state, action: PayloadAction<number>) {
			const tire = state.items.find((item) => item.id === action.payload)
			if (!tire) return
			tire.isLiked = !tire.isLiked
			tire.likesCount += tire.isLiked ? 1 : -1
		},
		clearTiresError(state) {
			state.error = null
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTires.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchTires.fulfilled, (state, action) => {
				state.loading = false
				state.items = action.payload.items
				state.source = action.payload.source
			})
			.addCase(fetchTires.rejected, (state, action) => {
				state.loading = false
				if (action.payload?.mock) {
					state.items = action.payload.mock
					state.source = "mock"
					state.error = "Бэкенд недоступен — показаны mock-данные (режим гостя)."
				} else {
					if (state.source === "mock") {
						state.items = []
						state.source = "empty"
					}
					state.error = action.payload?.message ?? action.error.message ?? "Не удалось загрузить услуги"
				}
			})

			.addCase(createTire.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(createTire.fulfilled, (state, action) => {
				state.loading = false
				state.items.unshift(action.payload)
				state.source = "api"
			})
			.addCase(createTire.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload ?? "Не удалось добавить услугу"
			})

			.addCase(deleteTire.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(deleteTire.fulfilled, (state, action) => {
				state.loading = false
				state.items = state.items.filter((item) => item.id !== action.payload)
			})
			.addCase(deleteTire.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload ?? "Не удалось удалить услугу"
			})

			.addCase(toggleTireLike.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(toggleTireLike.fulfilled, (state, action) => {
				state.loading = false
				const tire = state.items.find((item) => item.id === action.payload.id)
				if (tire) {
					tire.likesCount = action.payload.likesCount
					tire.isLiked = action.payload.isLiked
				}
			})
			.addCase(toggleTireLike.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload ?? "Не удалось изменить лайк"
			})
	}
})

export const { toggleMockLike, clearTiresError } = tiresSlice.actions
export default tiresSlice.reducer
