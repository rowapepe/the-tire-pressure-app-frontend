import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface UserState {
	username: string
	isAuthenticated: boolean
	loading: boolean
	error: string | null
}

const initialState: UserState = {
	username: "",
	isAuthenticated: false,
	loading: false,
	error: null
}

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setAuthLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload
		},
		setUser(state, action: PayloadAction<string>) {
			state.username = action.payload
			state.isAuthenticated = true
			state.loading = false
			state.error = null
		},
		logout(state) {
			state.username = ""
			state.isAuthenticated = false
			state.loading = false
			state.error = null
		},
		setAuthError(state, action: PayloadAction<string | null>) {
			state.error = action.payload
			state.loading = false
		}
	}
})

export const { setAuthLoading, setUser, logout, setAuthError } = userSlice.actions
export default userSlice.reducer
