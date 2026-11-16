import axios from "axios"

export const http = axios.create({
	baseURL: "/api",
	withCredentials: true
})

type ErrorBody = {
	message?: string | string[]
	error?: string
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
	if (axios.isAxiosError(error)) {
		const body = error.response?.data as ErrorBody | undefined
		if (Array.isArray(body?.message)) return body.message.join(". ")
		if (typeof body?.message === "string") return body.message
		if (typeof body?.error === "string") return body.error
		if (!error.response) return "Сервис недоступен"
		return `${fallback} (HTTP ${error.response.status})`
	}

	if (error instanceof Error && error.message) return error.message
	return fallback
}
