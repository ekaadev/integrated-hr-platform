import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// TanStack Start in SPA mode: the build output is static files, with no SSR and no server functions.
export default defineConfig({
  server: { port: 3004, strictPort: true },
  preview: { port: 3004, strictPort: true },
  plugins: [tailwindcss(), tanstackStart({ spa: { enabled: true } }), viteReact()],
})
