import { useState, type FormEvent } from "react"
import { useDispatch, useSelector } from "react-redux"

import { api, type UserResponseDto } from "../api"
import { getApiErrorMessage } from "../api/http"
import type { AppDispatch, RootState } from "../store/store"
import { fetchTires } from "../store/tiresSlice"
import { setAuthError, setAuthLoading, setUser } from "../store/userSlice"

interface LoginPageProps {
	onLoggedIn: () => void
	onGuest: () => void
}

export function LoginPage({ onLoggedIn, onGuest }: LoginPageProps) {
	const dispatch = useDispatch<AppDispatch>()
	const { isAuthenticated, username, loading, error } = useSelector((state: RootState) => state.user)

	const [login, setLogin] = useState("")
	const [password, setPassword] = useState("")

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		if (!login.trim() || !password) {
			dispatch(setAuthError("Введите логин и пароль"))
			return
		}

		dispatch(setAuthError(null))
		dispatch(setAuthLoading(true))
		try {
			const { data }: { data: UserResponseDto } = await api.usersControllerLogin({
				login: login.trim(),
				password
			})
			dispatch(setUser(data.login))
			dispatch(fetchTires())
			onLoggedIn()
		} catch (caught) {
			dispatch(setAuthError(getApiErrorMessage(caught, "Не удалось авторизоваться")))
		}
	}

	if (isAuthenticated) {
		return (
			<section className="form-page">
				<h1 className="page-title">Авторизация</h1>
				<div className="auth-card">
					<p>
						Вы вошли как <strong>{username}</strong>.
					</p>
					<button type="button" className="form-submit" onClick={onLoggedIn}>
						Перейти в каталог
					</button>
				</div>
			</section>
		)
	}

	return (
		<section className="form-page">
			<h1 className="page-title">Авторизация</h1>
			<form className="lab-form" onSubmit={handleSubmit}>
				<label>
					Логин
					<input
						required
						autoComplete="username"
						value={login}
						onChange={(event) => setLogin(event.target.value)}
						placeholder="Введите логин"
						disabled={loading}
					/>
				</label>
				<label>
					Пароль
					<input
						required
						type="password"
						autoComplete="current-password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						placeholder="Введите пароль"
						disabled={loading}
					/>
				</label>
				{error && <p className="form-error">{error}</p>}
				<button type="submit" className="form-submit" disabled={loading}>
					{loading ? "Выполняется вход…" : "Войти"}
				</button>
				<button type="button" className="form-secondary" onClick={onGuest} disabled={loading}>
					Продолжить как гость
				</button>
			</form>
		</section>
	)
}
