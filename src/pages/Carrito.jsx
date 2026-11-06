import { useState } from 'react'
import { Link } from 'react-router'
import { useInventario } from '../context/InventarioContext'
import TituloPagina from '../components/TituloPagina'
import EstadoVacio from '../components/EstadoVacio'
import ItemCarrito from '../components/carrito/ItemCarrito'
import { formatoPrecio } from '../utils/stock'
import { itemsDelCarrito, totalCarrito, totalUnidades } from '../utils/carrito'

function Carrito() {
  const { articulos, carrito, aumentarCantidad, disminuirCantidad, quitarDelCarrito, vaciarCarrito, confirmarCompra } =
    useInventario()

  // estado local de la pantalla: pedir confirmacion antes de vaciar y mostrar el resultado de la compra
  const [confirmandoVaciar, setConfirmandoVaciar] = useState(false)
  const [compraRealizada, setCompraRealizada] = useState(null)

  const items = itemsDelCarrito(carrito, articulos)
  const unidades = totalUnidades(carrito)
  const total = totalCarrito(items)

  const manejarCompra = () => {
    setCompraRealizada({ unidades, total })
    confirmarCompra()
  }

  return (
    <section>
      <TituloPagina
        titulo="Carrito de compras"
        subtitulo="Al aumentar o disminuir una cantidad, el stock del inventario se actualiza al mismo tiempo."
      />

      {compraRealizada && (
        <div role="status" className="mb-5 rounded-lg border border-verde/30 bg-verde-claro px-4 py-3 text-verde-oscuro">
          ✅ Compra confirmada: {compraRealizada.unidades} {compraRealizada.unidades === 1 ? 'unidad' : 'unidades'} por{' '}
          <strong>{formatoPrecio(compraRealizada.total)}</strong>. El stock descontado queda registrado en el inventario.
        </div>
      )}

      {items.length === 0 ? (
        <EstadoVacio icono="🛒" mensaje="Tu carrito está vacío.">
          <Link to="/articulos" className="btn-primario">Ver artículos</Link>
        </EstadoVacio>
      ) : (
        // en celular el resumen va debajo; desde md va a la derecha
        <div className="grid items-start gap-4 md:grid-cols-[1fr_280px]">
          <ul className="rounded-lg border border-borde bg-white shadow-sm">
            {items.map((item) => (
              <ItemCarrito
                key={item.id}
                item={item}
                onAumentar={() => aumentarCantidad(item.id)}
                onDisminuir={() => disminuirCantidad(item.id)}
                onQuitar={() => quitarDelCarrito(item.id)}
              />
            ))}
          </ul>

          <aside className="rounded-lg border border-borde bg-white p-5 shadow-sm md:sticky md:top-4">
            <h2 className="mb-3 text-lg font-semibold">Resumen</h2>
            <dl className="mb-4 space-y-1.5 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-gris">Artículos distintos</dt>
                <dd className="tabular-nums">{items.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gris">Unidades</dt>
                <dd className="tabular-nums">{unidades}</dd>
              </div>
              <div className="flex justify-between border-t border-borde pt-2 text-lg font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatoPrecio(total)}</dd>
              </div>
            </dl>

            <button type="button" onClick={manejarCompra} className="btn-primario mb-2 w-full text-center">
              Confirmar compra
            </button>

            {confirmandoVaciar ? (
              <div className="rounded-md bg-peligro-fondo p-3 text-sm text-peligro-texto">
                <p className="mb-2">¿Vaciar el carrito? Todas las unidades vuelven al inventario.</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { vaciarCarrito(); setConfirmandoVaciar(false) }}
                    className="cursor-pointer rounded bg-rojo px-3 py-1 font-semibold text-white hover:bg-rojo-oscuro"
                  >
                    Sí, vaciar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmandoVaciar(false)}
                    className="cursor-pointer rounded border border-borde bg-white px-3 py-1 text-texto hover:bg-fondo"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmandoVaciar(true)} className="btn-secundario w-full text-center">
                Vaciar carrito
              </button>
            )}

            <Link to="/articulos" className="mt-3 block text-center text-sm text-verde underline underline-offset-2">
              Seguir agregando artículos
            </Link>
          </aside>
        </div>
      )}
    </section>
  )
}

export default Carrito
