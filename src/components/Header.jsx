import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      {/* el logo tambien lleva al inicio, como en cualquier sitio */}
      <Link to="/" className="logo">
        <span className="logo-icono">🛒</span>
        <span>
          <strong>SuperFresco</strong>
          <small>Gestión de inventario</small>
        </span>
      </Link>
    </header>
  )
}

export default Header
