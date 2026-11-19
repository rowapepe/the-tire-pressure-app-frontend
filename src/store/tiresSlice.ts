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

export interface NewTireDraftPayload {
	title: string
	image: File
	video: File
}

export interface PublishTirePayload {
	id: number
	title: string
	description: string
	optimalPressure: number
	radius: number
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
				message: getApiErrorMessage(error, "Не удалось загрузить шины"),
				mock: isGuest ? filterMockTires(state.filters) : null,
				isGuest
			})
		}
	}
)

export const fetchTireDraft = createAsyncThunk<TireType | null, void>("tires/fetchTireDraft", async () => {
	try {
		const response = await api.tireTypesControllerGetDraft()
		return response.data ? mapTire(response.data) : null
	} catch {
		return null
	}
})

export const createTireDraft = createAsyncThunk<TireType, NewTireDraftPayload, { rejectValue: string }>(
	"tires/createTireDraft",
	async (payload, { rejectWithValue }) => {
		try {
			const response = await api.tireTypesControllerCreateTireType({
				title: payload.title,
				image: payload.image,
				video: payload.video
			})
			return mapTire(response.data)
		} catch (error) {
			return rejectWithValue(getApiErrorMessage(error, "Не удалось создать черновик"))
		}
	}
)

export const publishTire = createAsyncThunk<TireType, PublishTirePayload, { rejectValue: string }>(
	"tires/publishTire",
	async (payload, { rejectWithValue }) => {
		try {
			const response = await api.tireTypesControllerPublishTireType(payload.id, {
				title: payload.title,
				description: payload.description,
				optimalPressure: payload.optimalPressure,
				radius: payload.radius
			})
			return mapTire(response.data)
		} catch (error) {
			return rejectWithValue(getApiErrorMessage(error, "Не удалось опубликовать шину"))
		}
	}
)

export const deleteTire = createAsyncThunk<number, number, { rejectValue: string }>("tires/deleteTire", async (id, { rejectWithValue }) => {
	try {
		await api.tireTypesControllerDeleteTireType(id)
		return id
	} catch (error) {
		return rejectWithValue(getApiErrorMessage(error, "Не удалось удалить шину"))
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
		if (!tire) return rejectWithValue("Шина не найдена")

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
					state.error = action.payload?.message ?? action.error.message ?? "Не удалось загрузить шины"
				}
			})

			.addCase(fetchTireDraft.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchTireDraft.fulfilled, (state) => {
				state.loading = false
			})

			.addCase(createTireDraft.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(createTireDraft.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createTireDraft.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload ?? "Не удалось создать черновик"
			})

			.addCase(publishTire.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(publishTire.fulfilled, (state, action) => {
				state.loading = false
				const index = state.items.findIndex((item) => item.id === action.payload.id)
				if (index >= 0) state.items[index] = action.payload
				else state.items.unshift(action.payload)
				state.source = "api"
			})
			.addCase(publishTire.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload ?? "Не удалось опубликовать шину"
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
				state.error = action.payload ?? "Не удалось удалить шину"
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
