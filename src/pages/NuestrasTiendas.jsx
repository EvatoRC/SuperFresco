import { Link } from 'react-router-dom'
import tiendas from '../data/tiendas'

function NuestrasTiendas() {
  return (
    <section>
      <h1>Nuestras tiendas</h1>
      <p className="subtitulo">Elige una sucursal para ver su información y estado de inventario.</p>

      <div className="grilla-tiendas">
        {tiendas.map((t) => (
          <article key={t.id} className="tarjeta-tienda">
            <h2>{t.nombre}</h2>
            <p>📍 {t.direccion}</p>
            <p>🕒 {t.horario}</p>
            {/* cada tarjeta manda a la ruta dinamica /tiendas/:id */}
            <Link to={`/tiendas/${t.id}`} className="boton">Ver detalle</Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default NuestrasTiendas
