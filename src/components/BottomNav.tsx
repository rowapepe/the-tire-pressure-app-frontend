import { Button } from "react-bootstrap"

export type Page = "feed" | "add" | "tile" | "login"

interface BottomNavProps {
	activePage: Page
	onNavigate: (page: Page) => void
	onLogout: () => void
	isAuthenticated: boolean
	username: string
	loading: boolean
}

export function BottomNav({ activePage, onNavigate, onLogout, isAuthenticated, username, loading }: BottomNavProps) {
	const items: Array<{ page: Page; icon: string; label: string; disabled: boolean }> = [
		{ page: "feed", icon: "/icons/home.png", label: "Лента", disabled: false },
		{ page: "add", icon: "/icons/plus.png", label: "Добавить", disabled: !isAuthenticated },
		{ page: "tile", icon: "/icons/shelf.png", label: "Плитка", disabled: false },
		{
			page: "login",
			icon: "/icons/login.png",
			label: isAuthenticated ? "Выход" : "Вход",
			disabled: false
		}
	]

	return (
		<nav className="bottom-nav" aria-label="Основная навигация">
			{items.map((item) => (
				<Button
					key={item.page}
					variant="link"
					className={`nav-item ${activePage === item.page ? "active" : ""}`}
					disabled={loading || item.disabled}
					onClick={() => {
						if (item.page === "login" && isAuthenticated) {
							onLogout()
							return
						}
						onNavigate(item.page)
					}}
					title={item.page === "login" && isAuthenticated ? `Выйти из аккаунта ${username}` : item.label}
				>
					<img src={item.icon} alt={item.label} />
					<span className="nav-label">{item.label}</span>
				</Button>
			))}
		</nav>
	)
}
