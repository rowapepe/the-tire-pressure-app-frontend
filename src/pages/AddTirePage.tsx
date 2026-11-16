import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '../store/store'
import { createTire, fetchTires } from '../store/tiresSlice'

interface AddTirePageProps {
	onCreated: () => void
	onRequireLogin: () => void
}

const initialForm = {
	title: '',
	description: '',
	radius: 17,
	optimalPressure: 2.3,
	image: null as File | null,
	video: null as File | null,
}

export function AddTirePage({ onCreated, onRequireLogin }: AddTirePageProps) {
	const dispatch = useDispatch<AppDispatch>()
	const { loading, error } = useSelector((state: RootState) => state.tires)
	const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)

	const [form, setForm] = useState(initialForm)
	const [localError, setLocalError] = useState<string | null>(null)
	const [formVersion, setFormVersion] = useState(0)

	const updateText = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value })
	}

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		if (!isAuthenticated) {
			onRequireLogin()
			return
		}
		if (!form.title.trim() || !form.description.trim()) {
			setLocalError('Заполните название и описание')
			return
		}
		if (!form.image || !form.video) {
			setLocalError('Выберите изображение и видео')
			return
		}

		setLocalError(null)
		try {
			await dispatch(
				createTire({
					title: form.title.trim(),
					description: form.description.trim(),
					radius: form.radius,
					optimalPressure: form.optimalPressure,
					image: form.image,
					video: form.video,
				}),
			).unwrap()
			await dispatch(fetchTires())
			setForm(initialForm)
			setFormVersion((version) => version + 1)
			onCreated()
		} catch {
			// текст ошибки уже записан в Redux редьюсером createTire.rejected
		}
	}

	return (
		<section className="form-page">
			<h1 className="page-title">Добавить шину</h1>
			<form className="lab-form" onSubmit={handleSubmit} key={formVersion}>
				<label>
					Название
					<input
						required
						name="title"
						maxLength={100}
						placeholder="Например, Michelin Pilot Sport 5"
						value={form.title}
						onChange={updateText}
						disabled={loading}
					/>
				</label>
				<label>
					Описание
					<textarea
						required
						name="description"
						maxLength={500}
						rows={4}
						placeholder="Краткое описание услуги"
						value={form.description}
						onChange={updateText}
						disabled={loading}
					/>
				</label>
				<label>
					Радиус колеса (R13–R22)
					<input
						required
						name="radius"
						type="number"
						min={13}
						max={22}
						step={1}
						value={form.radius}
						onChange={(event) => setForm({ ...form, radius: Number(event.target.value) })}
						disabled={loading}
					/>
				</label>
				<label>
					Оптимальное давление, бар
					<input
						required
						name="optimalPressure"
						type="number"
						min={0.5}
						max={9.9}
						step={0.1}
						value={form.optimalPressure}
						onChange={(event) => setForm({ ...form, optimalPressure: Number(event.target.value) })}
						disabled={loading}
					/>
				</label>
				<label>
					Изображение (jpeg, png, webp, gif до 5 МБ)
					<input
						required
						name="image"
						type="file"
						accept="image/jpeg,image/png,image/webp,image/gif"
						onChange={(event) => setForm({ ...form, image: event.target.files?.[0] ?? null })}
						disabled={loading}
					/>
				</label>
				<label>
					Видео (mp4, mov, webm до 50 МБ)
					<input
						required
						name="video"
						type="file"
						accept="video/mp4,video/quicktime,video/webm"
						onChange={(event) => setForm({ ...form, video: event.target.files?.[0] ?? null })}
						disabled={loading}
					/>
				</label>
				{(localError || error) && <p className="form-error">{localError ?? error}</p>}
				<button type="submit" className="form-submit" disabled={loading}>
					{loading ? 'Сохранение…' : 'Добавить услугу'}
				</button>
				<p className="hint">
					Услуга создаётся в два шага через сгенерированный API: черновик с файлами, затем публикация радиуса,
					давления и описания.
				</p>
			</form>
		</section>
	)
}
