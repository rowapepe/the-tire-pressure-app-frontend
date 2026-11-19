import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { useDispatch, useSelector } from "react-redux"

import { DEFAULT_IMAGE, DEFAULT_VIDEO, toMediaProxyUrl } from "../media"
import type { TireType } from "../data/tireTypes"
import type { AppDispatch, RootState } from "../store/store"
import { createTireDraft, fetchTireDraft, fetchTires, publishTire } from "../store/tiresSlice"

interface AddTirePageProps {
	onCreated: () => void
	onRequireLogin: () => void
}

const initialForm = {
	title: "",
	description: "",
	optimalPressure: "2.1",
	radius: "17",
	image: null as File | null,
	video: null as File | null
}

export function AddTirePage({ onCreated, onRequireLogin }: AddTirePageProps) {
	const dispatch = useDispatch<AppDispatch>()
	const { loading, error } = useSelector((state: RootState) => state.tires)
	const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)

	const [form, setForm] = useState(initialForm)
	const [draft, setDraft] = useState<TireType | null>(null)
	const [localError, setLocalError] = useState<string | null>(null)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [videoPreview, setVideoPreview] = useState<string | null>(null)

	const imageInputRef = useRef<HTMLInputElement>(null)
	const videoInputRef = useRef<HTMLInputElement>(null)
	const draftLoadStarted = useRef(false)

	useEffect(() => {
		if (draftLoadStarted.current) return
		draftLoadStarted.current = true
		dispatch(fetchTireDraft())
			.unwrap()
			.then((existing) => {
				if (!existing) return
				setDraft(existing)
				setForm((current) => ({ ...current, title: existing.title }))
			})
	}, [dispatch])

	useEffect(() => {
		if (!imagePreview) return
		return () => URL.revokeObjectURL(imagePreview)
	}, [imagePreview])

	useEffect(() => {
		if (!videoPreview) return
		return () => URL.revokeObjectURL(videoPreview)
	}, [videoPreview])

	const updateText = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
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

		const title = form.title.trim()
		if (!title) {
			setLocalError("Введите название")
			return
		}

		if (!draft) {
			if (!form.image || !form.video) {
				setLocalError("Выберите изображение и видео")
				return
			}
			setLocalError(null)
			try {
				const created = await dispatch(createTireDraft({ title, image: form.image, video: form.video })).unwrap()
				setDraft(created)
				setForm((current) => ({ ...current, image: null, video: null }))
				setImagePreview(null)
				setVideoPreview(null)
			} catch {
				// ошибка уже записана в state.tires.error
			}
			return
		}

		const description = form.description.trim()
		if (!description) {
			setLocalError("Введите описание")
			return
		}
		const optimalPressure = Number(form.optimalPressure)
		const radius = Number(form.radius)
		if (!Number.isFinite(optimalPressure) || !Number.isFinite(radius)) {
			setLocalError("Укажите давление и радиус")
			return
		}

		setLocalError(null)
		try {
			await dispatch(publishTire({ id: draft.id, title, description, optimalPressure, radius })).unwrap()
			await dispatch(fetchTires())
			onCreated()
		} catch {
			// ошибка уже записана в state.tires.error
		}
	}

	const imageSrc = imagePreview ?? (draft ? toMediaProxyUrl(draft.imageUrl) || DEFAULT_IMAGE : DEFAULT_IMAGE)
	const videoSrc = videoPreview ?? (draft ? toMediaProxyUrl(draft.videoUrl) || DEFAULT_VIDEO : DEFAULT_VIDEO)

	return (
		<section className="add-page-wrap">
			<form className="add-form-card" onSubmit={handleSubmit}>
				<h2>Добавление шин</h2>

				<div className="media-block">
					<div className="media-row">
						<label htmlFor={draft ? undefined : "tire-image"}>Фото</label>
						<div className="media-controls">
							{!draft && (
								<>
									<button
										type="button"
										className="media-btn"
										onClick={() => imageInputRef.current?.click()}
										disabled={loading}
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
								</>
							)}
							<img className="media-preview" src={imageSrc} alt="Превью фото" />
						</div>
					</div>

					<div className="media-row">
						<label htmlFor={draft ? undefined : "tire-video"}>Видео</label>
						<div className="media-controls">
							{!draft && (
								<>
									<button
										type="button"
										className="media-btn"
										onClick={() => videoInputRef.current?.click()}
										disabled={loading}
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
								</>
							)}
							<video key={videoSrc} className="media-preview" src={`${videoSrc}#t=0.1`} muted playsInline preload="metadata" />
						</div>
					</div>
				</div>

				<div className="text-block">
					<label htmlFor="title">Название</label>
					<input
						id="title"
						name="title"
						type="text"
						maxLength={100}
						required
						value={form.title}
						onChange={updateText}
						disabled={loading}
					/>

					{draft && (
						<>
							<label htmlFor="description">Описание</label>
							<textarea
								id="description"
								name="description"
								maxLength={500}
								required
								value={form.description}
								onChange={updateText}
								disabled={loading}
							/>
						</>
					)}
				</div>

				{draft && (
					<div className="fields-block">
						<label htmlFor="optimalPressure">Оптимальное давление</label>
						<input
							id="optimalPressure"
							name="optimalPressure"
							type="number"
							step={0.1}
							min={0.5}
							max={9.9}
							required
							value={form.optimalPressure}
							onChange={updateText}
							disabled={loading}
						/>

						<label htmlFor="radius">Радиус колеса</label>
						<input
							id="radius"
							name="radius"
							type="number"
							step={1}
							min={13}
							max={22}
							required
							value={form.radius}
							onChange={updateText}
							disabled={loading}
						/>
					</div>
				)}

				{(localError || error) && <p className="form-error">{localError ?? error}</p>}
				<button type="submit" className="submit-btn" disabled={loading}>
					{loading ? "Сохранение…" : draft ? "Опубликовать" : "Далее"}
				</button>
			</form>
		</section>
	)
}
