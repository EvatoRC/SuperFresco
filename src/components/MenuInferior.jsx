import { NavLink } from 'react-router-dom'

// uso NavLink en vez de Link porque agrega la clase "active" sola
// y asi se marca en que pagina esta el usuario
const opciones = [
  { ruta: '/', texto: 'Inicio', icono: '🏠' },
  { ruta: '/tiendas', texto: 'Nuestras tiendas', icono: '🏬' },
  { ruta: '/preguntas-frecuentes', texto: 'Preguntas frecuentes', icono: '❓' },
]

function MenuInferior() {
  return (
    <nav className="menu-inferior" aria-label="Menú principal">
      {opciones.map((op) => (
        <NavLink
          key={op.ruta}
          to={op.ruta}
          end={op.ruta === '/'} // sin esto "Inicio" quedaria activo en todas las rutas
          className="menu-item"
        >
          <span className="menu-icono" aria-hidden="true">{op.icono}</span>
          <span>{op.texto}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MenuInferior
