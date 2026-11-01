import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import MenuInferior from '../components/MenuInferior'

// estructura comun de todas las paginas. <Outlet /> es el hueco
// donde React Router dibuja la pagina de la ruta actual
function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* pb-28: espacio abajo para que el menu inferior fijo no tape el contenido */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-28">
        {/* Suspense muestra el aviso mientras se descarga una pagina cargada con lazy */}
        <Suspense fallback={<p className="py-10 text-center text-gris">Cargando…</p>}>
          <Outlet />
        </Suspense>
      </main>

      <MenuInferior />
    </div>
  )
}

export default Layout
