import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "")
	return {
		plugins: [
			react()
		],
		define: {
			"process.env.ANTHROPIC_API_KEY": JSON.stringify(env.ANTHROPIC_API_KEY || env.VITE_ANTHROPIC_API_KEY || ""),
			"process.env.HF_ACCESS_TOKEN": JSON.stringify(env.HF_ACCESS_TOKEN || env.VITE_HF_ACCESS_TOKEN || ""),
		},
		server: {
			proxy: {
				"/api/anthropic": {
					target: "https://api.anthropic.com",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api\/anthropic/, ""),
				},
				"/api/huggingface": {
					target: "https://router.huggingface.co",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api\/huggingface/, ""),
				}
			}
		}
	}
})