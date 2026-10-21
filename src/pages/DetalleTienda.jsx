import { useParams, useNavigate, Link } from 'react-router-dom'
import tiendas from '../data/tiendas'

function DetalleTienda() {
  // useParams lee el :id que viene en la URL
  const { id } = useParams()
  const navigate = useNavigate()

  const tienda = tiendas.find((t) => t.id === id)

  // si alguien escribe un id que no existe, muestro un aviso en vez de romper la pagina
  if (!tienda) {
    return (
      <section>
        <h1>Tienda no encontrada</h1>
        <p>No existe una sucursal con el código "{id}".</p>
        <Link to="/tiendas" className="boton">Ver todas las tiendas</Link>
      </section>
    )
  }

  return (
    <section>
      {/* navigate(-1) vuelve a la pagina anterior del historial */}
      <button className="boton-secundario" onClick={() => navigate(-1)}>← Volver</button>

      <h1>{tienda.nombre}</h1>

      <div className="detalle-tienda">
        <p><strong>Dirección:</strong> {tienda.direccion}</p>
        <p><strong>Horario:</strong> {tienda.horario}</p>
        <p><strong>Teléfono:</strong> {tienda.telefono}</p>
        <p><strong>Encargado/a:</strong> {tienda.encargado}</p>
        <p>
          <strong>Productos con stock bajo:</strong>{' '}
          <span className={`badge ${tienda.productosBajoStock > 3 ? 'sin-stock' : 'stock-bajo'}`}>
            {tienda.productosBajoStock}
          </span>
        </p>

        <h2>Servicios</h2>
        <ul>
          {tienda.servicios.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default DetalleTienda
