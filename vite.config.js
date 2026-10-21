import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // en GitHub Pages el sitio queda en /SuperFresco/ y no en la raiz,
  // asi que hay que decirle a Vite desde donde cargar los archivos
  base: '/SuperFresco/',
})
