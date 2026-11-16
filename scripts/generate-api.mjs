import { writeFile } from "node:fs/promises"
import { resolve } from "node:path"

import { generateApi } from "swagger-typescript-api"

const swaggerUrl = process.env.API_SWAGGER_URL ?? "http://localhost:3000/docs-json"
const specPath = resolve(process.cwd(), "./src/api/openapi.json")
const outputPath = resolve(process.cwd(), "./src/api")

async function refreshSpec() {
	try {
		const response = await fetch(swaggerUrl)
		if (!response.ok) throw new Error(`HTTP ${response.status}`)
		const spec = await response.json()
		await writeFile(specPath, `${JSON.stringify(spec, null, 2)}\n`)
		console.log(`Спецификация Swagger обновлена из ${swaggerUrl}`)
	} catch (error) {
		console.warn(`Не удалось получить Swagger по адресу ${swaggerUrl}: ${error.message}`)
		console.warn(`Код будет сгенерирован из локального файла ${specPath}`)
	}
}

await refreshSpec()

await generateApi({
	name: "Api.ts",
	output: outputPath,
	input: specPath,
	httpClientType: "axios",
	generateClient: true,
	generateRouteTypes: false,
	modular: false
})

console.log(`Клиент API сгенерирован в ${outputPath}/Api.ts`)
