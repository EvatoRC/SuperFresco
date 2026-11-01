import { Link } from 'react-router-dom'
import tiendas from '../data/tiendas'
import TituloPagina from '../components/TituloPagina'

function NuestrasTiendas() {
  return (
    <section>
      <TituloPagina titulo="Nuestras tiendas" subtitulo="Elige una sucursal para ver su información y estado de inventario." />

      {/* grilla que se adapta sola: tantas columnas de minimo 220px como quepan */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {tiendas.map((t) => (
          <article key={t.id} className="flex flex-col rounded-lg border border-borde bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="mb-2 text-lg font-semibold">{t.nombre}</h2>
            <p className="mb-2">📍 {t.direccion}</p>
            <p className="mb-3">🕒 {t.horario}</p>
            {/* cada tarjeta manda a la ruta dinamica /tiendas/:id */}
            <Link
              to={`/tiendas/${t.id}`}
              className="btn-primario mt-auto self-start"
            >
              Ver detalle
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default NuestrasTiendas
