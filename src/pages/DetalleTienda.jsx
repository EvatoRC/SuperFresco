import { useParams, useNavigate, Link } from 'react-router-dom'
import tiendas from '../data/tiendas'
import TituloPagina from '../components/TituloPagina'
import Badge from '../components/Badge'
import { varianteTienda } from '../utils/stock'

function DetalleTienda() {
  // useParams lee el :id que viene en la URL
  const { id } = useParams()
  const navigate = useNavigate()

  const tienda = tiendas.find((t) => t.id === id)

  // si alguien escribe un id que no existe, muestro un aviso en vez de romper la pagina
  if (!tienda) {
    return (
      <section>
        <TituloPagina titulo="Tienda no encontrada" subtitulo={`No existe una sucursal con el código "${id}".`} />
        <Link to="/tiendas" className="btn-primario">
          Ver todas las tiendas
        </Link>
      </section>
    )
  }

  return (
    <section>
      {/* navigate(-1) vuelve a la pagina anterior del historial */}
      <button
        className="btn-secundario mb-3.5 px-3 py-1.5 text-sm"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <TituloPagina titulo={tienda.nombre} />

      <div className="space-y-2 rounded-lg border border-borde bg-white p-4 shadow-sm">
        <p><strong>Dirección:</strong> {tienda.direccion}</p>
        <p><strong>Horario:</strong> {tienda.horario}</p>
        <p><strong>Teléfono:</strong> {tienda.telefono}</p>
        <p><strong>Encargado/a:</strong> {tienda.encargado}</p>
        <p>
          <strong>Productos con stock bajo:</strong>{' '}
          {/* el umbral de tienda critica vive en utils/stock.js */}
          <Badge variante={varianteTienda(tienda.productosBajoStock)}>{tienda.productosBajoStock}</Badge>
        </p>

        <h2 className="pt-2 text-lg font-semibold">Servicios</h2>
        <ul className="list-disc pl-5">
          {tienda.servicios.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default DetalleTienda
