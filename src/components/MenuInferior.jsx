import { NavLink } from 'react-router-dom'

// uso NavLink en vez de Link porque sabe si la ruta esta activa
// y asi se marca en que pagina esta el usuario
const opciones = [
  { ruta: '/', texto: 'Inicio', icono: '🏠' },
  { ruta: '/tiendas', texto: 'Nuestras tiendas', icono: '🏬' },
  { ruta: '/preguntas-frecuentes', texto: 'Preguntas frecuentes', icono: '❓' },
]

function MenuInferior() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 flex border-t border-borde bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
      aria-label="Menú principal"
    >
      {opciones.map((op) => (
        <NavLink
          key={op.ruta}
          to={op.ruta}
          end={op.ruta === '/'} // sin esto "Inicio" quedaria activo en todas las rutas
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center border-t-[3px] px-1 py-2.5 text-[13px] no-underline ${
              isActive ? 'border-verde font-semibold text-verde' : 'border-transparent text-gris hover:text-texto'
            }`
          }
        >
          <span className="text-[22px]" aria-hidden="true">{op.icono}</span>
          <span>{op.texto}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MenuInferior
