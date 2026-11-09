import { Link } from 'react-router'
import SelectorCantidad from '../SelectorCantidad'
import { formatoPrecio } from '../../utils/stock'

// una fila del carrito. Recibe el item (articulo + cantidad + subtotal)
// y las funciones del estado global para cambiar la cantidad
function ItemCarrito({ item, onAumentar, onDisminuir, onQuitar }) {
  return (
    <li className="flex flex-col gap-3 border-t border-borde p-4 first:border-t-0 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <Link to={`/articulos/${item.id}`} className="font-semibold text-texto hover:text-verde-oscuro hover:underline">
          {item.nombre}
        </Link>
        <p className="text-sm text-gris">
          {item.marca} · {formatoPrecio(item.precio)} c/u
        </p>
        {/* el stock que queda se lee del inventario global, se actualiza con cada + o − */}
        <p className={`text-xs ${item.stock === 0 ? 'font-semibold text-peligro-texto' : 'text-gris'}`}>
          {item.stock === 0 ? 'No quedan más unidades en inventario' : `Quedan ${item.stock} en inventario`}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <SelectorCantidad
          valor={item.cantidad}
          onDisminuir={onDisminuir}
          onAumentar={onAumentar}
          puedeDisminuir={item.cantidad > 1}
          puedeAumentar={item.stock > 0}
          etiqueta={`Cantidad de ${item.nombre}`}
        />
        <span className="w-24 text-right font-semibold tabular-nums">{formatoPrecio(item.subtotal)}</span>
        <button
          type="button"
          onClick={onQuitar}
          className="cursor-pointer rounded px-2 py-1 text-sm text-rojo hover:bg-peligro-fondo"
          aria-label={`Quitar ${item.nombre} del carrito`}
        >
          Quitar
        </button>
      </div>
    </li>
  )
}

export default ItemCarrito
