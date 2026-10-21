import { Link } from 'react-router-dom'

// se muestra cuando la URL no coincide con ninguna ruta
function NoEncontrado() {
  return (
    <section className="no-encontrado">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="boton">Volver al inicio</Link>
    </section>
  )
}

export default NoEncontrado
