import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// nombre del repositorio en GitHub. Si cambia el repo, solo hay que cambiar esta linea
const REPO = 'SuperFresco'

// https://vite.dev/config/
export default defineConfig({
  // tailwindcss() es el plugin oficial de Tailwind v4 para Vite:
  // lee las clases que uso en los .jsx y genera solo el CSS necesario
  plugins: [react(), tailwindcss()],
  // en GitHub Pages el sitio queda en /SuperFresco/ y no en la raiz,
  // asi que hay que decirle a Vite desde donde cargar los archivos
  base: `/${REPO}/`,
})
