import { useEffect, useState } from "react"
import { BottomNav, type Page } from "./components/BottomNav"
import { TIRE_TYPES_MOCK } from "./data/tireTypes"
import { FeedPage } from "./pages/FeedPage"
import { TilePage } from "./pages/TilePage"

function App() {
	const [page, setPage] = useState<Page>("feed")
	const [feedOrder, setFeedOrder] = useState(TIRE_TYPES_MOCK)

	useEffect(() => {
		document.title = page === "feed" ? "Лента шин" : "Каталог шин"
	}, [page])

	const openInFeed = (id: number) => {
		const selected = TIRE_TYPES_MOCK.find((tire) => tire.id === id)
		if (!selected) return
		setFeedOrder([selected, ...TIRE_TYPES_MOCK.filter((tire) => tire.id !== id)])
		setPage("feed")
	}

	return (
		<main>
			{page === "feed" ? <FeedPage tires={feedOrder} /> : <TilePage tires={TIRE_TYPES_MOCK} onOpenInFeed={openInFeed} />}
			<BottomNav activePage={page} onNavigate={setPage} />
		</main>
	)
}

export default App
