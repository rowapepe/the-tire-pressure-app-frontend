import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { http } from "./api/http"
import { BottomNav, type Page } from "./components/BottomNav"
import { LoadingOverlay } from "./components/LoadingOverlay"
import type { TireType } from "./data/tireTypes"
import { AddTirePage } from "./pages/AddTirePage"
import { FeedPage } from "./pages/FeedPage"
import { LoginPage } from "./pages/LoginPage"
import { TilePage } from "./pages/TilePage"
import type { AppDispatch, RootState } from "./store/store"
import { deleteTire, fetchTires, toggleMockLike, toggleTireLike } from "./store/tiresSlice"
import { logout, setAuthLoading } from "./store/userSlice"

const PAGE_TITLES: Record<Page, string> = {
	feed: "Лента шин",
	tile: "Каталог шин",
	add: "Добавить шину",
	login: "Авторизация"
}

function App() {
	const dispatch = useDispatch<AppDispatch>()
	const { items, loading, error, source } = useSelector((state: RootState) => state.tires)
	const { username, isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.user)

	const [page, setPage] = useState<Page>("feed")
	const [feedId, setFeedId] = useState<number | null>(null)
	const initialFetchStarted = useRef(false)

	// В StrictMode эффект запускается дважды: не дублируем первый запрос списка.
	useEffect(() => {
		if (initialFetchStarted.current) return
		initialFetchStarted.current = true
		dispatch(fetchTires())
	}, [dispatch])

	useEffect(() => {
		document.title = PAGE_TITLES[page]
	}, [page])

	const busy = loading || authLoading

	const handleNavigate = (next: Page) => {
		if (next === "add" && !isAuthenticated) {
			setPage("login")
			return
		}
		setPage(next)
	}

	/**
	 * Выход: только axios + ручное обновление Redux.
	 * logout-редьюсер сбрасывает пользователя, а filtersSlice по extraReducers
	 * автоматически очищает фильтр. После этого список запрашивается заново.
	 */
	const handleLogout = async () => {
		dispatch(setAuthLoading(true))
		try {
			await http.post("/users/logout")
		} catch {
			// даже если сессия уже истекла, интерфейс должен вернуться в гостевой режим
		}
		dispatch(logout())
		dispatch(fetchTires())
		setFeedId(null)
		setPage("feed")
	}

	const handleToggleLike = (tire: TireType) => {
		if (isAuthenticated) {
			dispatch(toggleTireLike(tire.id))
		} else {
			dispatch(toggleMockLike(tire.id))
		}
	}

	const handleOpenInFeed = (id: number) => {
		setFeedId(id)
		setPage("feed")
	}

	return (
		<main>
			{page === "feed" && (
				<FeedPage
					tires={items}
					selectedId={feedId}
					onSelect={setFeedId}
					onToggleLike={handleToggleLike}
					onDelete={(id) => dispatch(deleteTire(id))}
					isAuthenticated={isAuthenticated}
					loading={busy}
					error={error}
				/>
			)}

			{page === "tile" && <TilePage onOpenInFeed={handleOpenInFeed} />}

			{page === "add" &&
				(isAuthenticated ? (
					<AddTirePage onCreated={() => setPage("tile")} onRequireLogin={() => setPage("login")} />
				) : (
					<LoginPage onLoggedIn={() => setPage("tile")} onGuest={() => setPage("feed")} />
				))}

			{page === "login" && <LoginPage onLoggedIn={() => setPage("tile")} onGuest={() => setPage("feed")} />}

			{source === "mock" && <p className="api-notice">{error ?? "Показаны mock-данные"}</p>}
			{source !== "mock" && error && <p className="form-error notice global-error">{error}</p>}
			{isAuthenticated && <p className="user-badge">Вы вошли как {username}</p>}

			{busy && <LoadingOverlay label={authLoading ? "Проверяем авторизацию…" : "Выполняется запрос…"} />}

			<BottomNav
				activePage={page}
				onNavigate={handleNavigate}
				onLogout={handleLogout}
				isAuthenticated={isAuthenticated}
				username={username}
				loading={busy}
			/>
		</main>
	)
}

export default App
