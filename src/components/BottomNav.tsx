import { Button } from "react-bootstrap"

export type Page = "feed" | "add" | "tile" | "login"

interface BottomNavProps {
	activePage: Page
	onNavigate: (page: Page) => void
}

const items: Array<{ page: Page; icon: string; label: string; available: boolean }> = [
	{ page: "feed", icon: "/icons/home.png", label: "Лента", available: true },
	{ page: "add", icon: "/icons/plus.png", label: "Добавить", available: false },
	{ page: "tile", icon: "/icons/shelf.png", label: "Плитка", available: true },
	{ page: "login", icon: "/icons/login.png", label: "Вход", available: false }
]

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
	return (
		<nav className="bottom-nav" aria-label="Основная навигация">
			{items.map((item) => (
				<Button
					key={item.page}
					variant="link"
					className={`nav-item ${activePage === item.page ? "active" : ""}`}
					disabled={!item.available}
					onClick={() => onNavigate(item.page)}
				>
					<img src={item.icon} alt={item.label} />
				</Button>
			))}
		</nav>
	)
}
