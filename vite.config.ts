import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * CORS решается обратным прокси Vite:
 *  /api  -> бэкенд NestJS (localhost:3000)
 *  /s3   -> MinIO (localhost:9000); префикс /s3 отрезается.
 * changeOrigin нужен MinIO: подпись presigned-ссылки проверяется по заголовку Host.
 */
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', 'VITE_')

	return {
		plugins: [react()],
		server: {
			port: 5173,
			proxy: {
				'/api': {
					target: env.VITE_BACKEND_URL || 'http://localhost:3000',
					changeOrigin: true,
				},
				'/s3': {
					target: env.VITE_S3_URL || 'http://localhost:9000',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/s3/, ''),
				},
			},
		},
	}
})
