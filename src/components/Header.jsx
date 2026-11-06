import { Link, NavLink } from 'react-router'
import { useInventario } from '../context/InventarioContext'
import { totalUnidades } from '../utils/carrito'

// menu de inventario (semana 2) + carrito (semana 3)
const opcionesInventario = [
  { ruta: '/articulos', texto: 'Listado de artículos', icono: '📋' },
  { ruta: '/articulos/nuevo', texto: 'Agregar artículo', icono: '➕' },
  { ruta: '/carrito', texto: 'Carrito', icono: '🛒', esCarrito: true },
]

function Header() {
  // el header tambien lee el estado global: los contadores se actualizan solos
  const { articulos, carrito } = useInventario()
  const unidadesCarrito = totalUnidades(carrito)

  // NavLink acepta una funcion en className y le pasa isActive,
  // asi cambio las clases de Tailwind segun la pagina actual
  const claseLink = ({ isActive }) =>
    `flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-white text-verde-oscuro shadow-sm' : 'text-white/90 hover:bg-white/15 hover:text-white'
    }`

  return (
    <header className="bg-verde shadow">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* el logo tambien lleva al inicio, como en cualquier sitio */}
        <Link to="/" className="flex items-center gap-2.5 text-white no-underline">
          <span className="text-3xl" aria-hidden="true">🛒</span>
          <span className="leading-tight">
            <strong className="block text-xl">SuperFresco</strong>
            <small className="opacity-85">Gestión de inventario</small>
          </span>
        </Link>

        <nav aria-label="Menú de inventario" className="flex flex-wrap items-center gap-1">
          {opcionesInventario.map((op) => (
            // end en /articulos para que no quede activo tambien en /articulos/nuevo
            <NavLink key={op.ruta} to={op.ruta} end className={claseLink}>
              <span aria-hidden="true">{op.icono}</span>
              {op.texto}
              {op.esCarrito && unidadesCarrito > 0 && (
                <span className="rounded-full bg-amarillo px-1.5 text-xs font-bold text-texto" aria-label={`${unidadesCarrito} unidades en el carrito`}>
                  {unidadesCarrito}
                </span>
              )}
            </NavLink>
          ))}
          <span
            className="ml-1 rounded-full bg-verde-oscuro px-2.5 py-1 text-xs font-semibold text-white"
            title="Artículos en el inventario"
          >
            {articulos.length} artículos
          </span>
        </nav>
      </div>
    </header>
  )
}

export default Header
