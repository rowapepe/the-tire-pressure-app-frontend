import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { useDispatch, useSelector } from "react-redux"

import type { AppDispatch, RootState } from "../store/store"
import { createTire, fetchTires } from "../store/tiresSlice"

interface AddTirePageProps {
	onCreated: () => void
	onRequireLogin: () => void
}

const initialForm = {
	title: "",
	description: "",
	radius: 17,
	optimalPressure: 2.1,
	image: null as File | null,
	video: null as File | null
}

export function AddTirePage({ onCreated, onRequireLogin }: AddTirePageProps) {
	const dispatch = useDispatch<AppDispatch>()
	const { loading, error } = useSelector((state: RootState) => state.tires)
	const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)

	const [form, setForm] = useState(initialForm)
	const [localError, setLocalError] = useState<string | null>(null)
	const [formVersion, setFormVersion] = useState(0)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [videoPreview, setVideoPreview] = useState<string | null>(null)

	const imageInputRef = useRef<HTMLInputElement>(null)
	const videoInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!imagePreview) return
		return () => URL.revokeObjectURL(imagePreview)
	}, [imagePreview])

	useEffect(() => {
		if (!videoPreview) return
		return () => URL.revokeObjectURL(videoPreview)
	}, [videoPreview])

	const updateText = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value })
	}

	const updateMedia = (event: ChangeEvent<HTMLInputElement>, field: "image" | "video") => {
		const file = event.target.files?.[0] ?? null
		setForm((current) => (field === "image" ? { ...current, image: file } : { ...current, video: file }))

		if (field === "image") setImagePreview(file ? URL.createObjectURL(file) : null)
		else setVideoPreview(file ? URL.createObjectURL(file) : null)

		event.target.value = ""
	}

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		if (!isAuthenticated) {
			onRequireLogin()
			return
		}
		if (!form.title.trim() || !form.description.trim()) {
			setLocalError("Заполните название и описание")
			return
		}
		if (!form.image || !form.video) {
			setLocalError("Выберите изображение и видео")
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
					video: form.video
				})
			).unwrap()
			await dispatch(fetchTires())
			setForm(initialForm)
			setImagePreview(null)
			setVideoPreview(null)
			setFormVersion((version) => version + 1)
			onCreated()
		} catch {}
	}

	return (
		<section className="add-page-wrap">
			<div className="add-form-card">
				<h2>Добавление шин</h2>
				<form onSubmit={handleSubmit} key={formVersion}>
					<div className="media-block">
						<div className="media-row">
							<label htmlFor="tire-image">Фото</label>
							<div className="media-controls">
								<button
									type="button"
									className="media-btn"
									onClick={() => imageInputRef.current?.click()}
									disabled={loading}
									aria-label="Обновить фото"
								>
									Обновить
								</button>
								<input
									id="tire-image"
									ref={imageInputRef}
									className="file-input"
									name="image"
									type="file"
									accept="image/jpeg,image/png,image/webp,image/gif"
									onChange={(event) => updateMedia(event, "image")}
									disabled={loading}
								/>
								{imagePreview ? (
									<img className="media-preview" src={imagePreview} alt="Превью фото" />
								) : (
									<div className="media-preview empty">Нет фото</div>
								)}
							</div>
						</div>

						<div className="media-row">
							<label htmlFor="tire-video">Видео</label>
							<div className="media-controls">
								<button
									type="button"
									className="media-btn"
									onClick={() => videoInputRef.current?.click()}
									disabled={loading}
									aria-label="Обновить видео"
								>
									Обновить
								</button>
								<input
									id="tire-video"
									ref={videoInputRef}
									className="file-input"
									name="video"
									type="file"
									accept="video/mp4,video/quicktime,video/webm"
									onChange={(event) => updateMedia(event, "video")}
									disabled={loading}
								/>
								{videoPreview ? (
									<div className="media-preview-box">
										<video
											className="media-preview"
											src={videoPreview}
											muted
											playsInline
											preload="metadata"
											aria-label="Превью видео"
										/>
										<span className="media-play" aria-hidden="true">
											▶
										</span>
									</div>
								) : (
									<div className="media-preview empty">Нет видео</div>
								)}
							</div>
						</div>
					</div>

					<div className="fields-block">
						<label>
							Название
							<input
								required
								name="title"
								maxLength={100}
								placeholder="Nokian Hakkapeliitta 10"
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
								placeholder="Шипованная зимняя шина для экстремально низких температур. Усиленный каркас и мягкая резина сохраняют сцепление со льдом."
								value={form.description}
								onChange={updateText}
								disabled={loading}
							/>
						</label>
						<label>
							Оптимальное давление
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
							Радиус колеса
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
					</div>

					{(localError || error) && <p className="form-error">{localError ?? error}</p>}
					<button type="submit" className="submit-btn" disabled={loading}>
						{loading ? "Сохранение…" : "Добавить шину"}
					</button>
				</form>
			</div>
		</section>
	)
}
