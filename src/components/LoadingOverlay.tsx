interface LoadingOverlayProps {
	label?: string
}

export function LoadingOverlay({ label = "Выполняется запрос…" }: LoadingOverlayProps) {
	return (
		<div className="loading-overlay" role="status" aria-live="polite">
			<span className="spinner" aria-hidden="true" />
			<span>{label}</span>
		</div>
	)
}
