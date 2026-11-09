import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { useInventario } from '../context/InventarioContext'
import { cantidadEnCarrito } from '../context/inventarioReducer'
import TituloPagina from '../components/TituloPagina'
import BadgeEstado from '../components/BadgeEstado'
import SelectorCantidad from '../components/SelectorCantidad'
import { formatoPrecio } from '../utils/stock'

// un dato del articulo: etiqueta arriba, valor abajo
function Dato({ etiqueta, children }) {
  return (
    <div className="rounded-md bg-fondo px-3 py-2.5">
      <dt className="text-xs font-semibold tracking-wide text-gris uppercase">{etiqueta}</dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums">{children}</dd>
    </div>
  )
}

function DetalleArticulo() {
  // useParams entrega el :id como texto; los ids del inventario son numeros
  const { id } = useParams()
  const { state } = useLocation()
  const { articulos, carrito, agregarAlCarrito } = useInventario()

  // cantidad que el usuario quiere agregar: estado local, solo le importa a esta pantalla
  const [cantidad, setCantidad] = useState(1)
  // mensaje de confirmacion despues de agregar
  const [agregado, setAgregado] = useState(null)

  // si vengo del listado con un filtro puesto, "Volver" lo conserva
  const volverA = state?.desde ? `/articulos?${state.desde}` : '/articulos'

  const articulo = articulos.find((a) => a.id === Number(id))

  if (!articulo) {
    return (
      <section>
        <TituloPagina titulo="Artículo no encontrado" subtitulo={`No existe un artículo con el código "${id}".`} />
        <Link to="/articulos" className="btn-primario">Ver listado de artículos</Link>
      </section>
    )
  }

  const enCarrito = cantidadEnCarrito(carrito, articulo.id)
  const sinStock = articulo.stock === 0
  // si el stock bajo (por ejemplo, despues de agregar) la cantidad elegida no puede quedar por encima
  const cantidadValida = Math.max(1, Math.min(cantidad, articulo.stock))

  const manejarAgregar = () => {
    // el reducer descuenta del stock y suma al carrito en la misma accion
    agregarAlCarrito(articulo.id, cantidadValida)
    setAgregado(cantidadValida)
    setCantidad(1)
  }

  return (
    <section>
      <Link to={volverA} className="btn-secundario mb-3.5 px-3 py-1.5 text-sm">← Volver al listado</Link>

      <TituloPagina titulo={articulo.nombre} subtitulo={`${articulo.marca} · ${articulo.tipo}`} />

      {agregado && (
        <div role="status" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-verde/30 bg-verde-claro px-4 py-3 text-verde-oscuro">
          <span>
            ✅ Agregaste <strong>{agregado}</strong> {agregado === 1 ? 'unidad' : 'unidades'} al carrito. El inventario se actualizó.
          </span>
          <Link to="/carrito" className="font-semibold underline underline-offset-2">Ir al carrito</Link>
        </div>
      )}

      {/* en celular una columna; desde md la ficha a la izquierda y la compra a la derecha */}
      <div className="grid gap-4 md:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-borde bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-3xl font-bold text-verde-oscuro tabular-nums">{formatoPrecio(articulo.precio)}</p>
            <BadgeEstado articulo={articulo} />
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Dato etiqueta="Código">#{articulo.id}</Dato>
            <Dato etiqueta="Marca">{articulo.marca}</Dato>
            <Dato etiqueta="Categoría">{articulo.tipo}</Dato>
            <Dato etiqueta="Stock disponible">{articulo.stock}</Dato>
            <Dato etiqueta="Stock mínimo">{articulo.stockMinimo}</Dato>
            <Dato etiqueta="En el carrito">{enCarrito}</Dato>
          </dl>
        </div>

        <aside className="rounded-lg border border-borde bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Agregar al carrito</h2>

          {sinStock ? (
            <p className="rounded-md bg-peligro-fondo px-3 py-2.5 text-peligro-texto">
              No quedan unidades disponibles de este artículo.
            </p>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between gap-3">
                <SelectorCantidad
                  valor={cantidadValida}
                  onDisminuir={() => setCantidad(cantidadValida - 1)}
                  onAumentar={() => setCantidad(cantidadValida + 1)}
                  puedeDisminuir={cantidadValida > 1}
                  puedeAumentar={cantidadValida < articulo.stock}
                  etiqueta="Cantidad a agregar"
                />
                <span className="text-sm text-gris">máx. {articulo.stock}</span>
              </div>
              <p className="mb-4 text-sm text-gris">
                Subtotal: <strong className="text-texto tabular-nums">{formatoPrecio(articulo.precio * cantidadValida)}</strong>
              </p>
              <button type="button" onClick={manejarAgregar} className="btn-primario w-full text-center">
                🛒 Agregar al carrito
              </button>
            </>
          )}

          {enCarrito > 0 && (
            <Link to="/carrito" className="mt-3 block text-center text-sm font-semibold text-verde underline underline-offset-2">
              Ya tienes {enCarrito} en el carrito · ver carrito
            </Link>
          )}
        </aside>
      </div>
    </section>
  )
}

export default DetalleArticulo
