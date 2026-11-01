import { Link } from 'react-router-dom'

// se muestra cuando la URL no coincide con ninguna ruta
function NoEncontrado() {
  return (
    <section className="pt-10 text-center">
      <h1 className="text-6xl font-bold text-verde">404</h1>
      <p className="my-3">La página que buscas no existe.</p>
      <Link to="/" className="btn-primario">
        Volver al inicio
      </Link>
    </section>
  )
}

export default NoEncontrado
