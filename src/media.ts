export const DEFAULT_IMAGE = "/default.jpg"
export const DEFAULT_VIDEO = "/default.MOV"

export function toMediaProxyUrl(url: string | null | undefined): string {
	if (!url) return ""
	try {
		const parsed = new URL(url)
		if (parsed.pathname.startsWith("/media/") || parsed.port === "9000") return `/s3${parsed.pathname}${parsed.search}`
		return url
	} catch {
		return url
	}
}
