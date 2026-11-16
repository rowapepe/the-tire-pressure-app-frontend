import { Api } from "./Api"

const client = new Api({
	baseURL: "/",
	withCredentials: true
})

export const api = client.api

export * from "./Api"
