import BadgeEstado from '../BadgeEstado'
import { formatoPrecio } from '../../utils/stock'

// tabla de solo lectura del inventario (pagina de Inicio)
function TablaProductos({ productos }) {
  if (productos.length === 0) {
    return <p className="py-5 text-gris">No se encontraron productos con esos filtros.</p>
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border border-borde bg-white">
      <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
        <thead className="bg-cabecera">
          <tr>
            <th className="px-3 py-2.5">Producto</th>
            <th className="px-3 py-2.5">Tipo</th>
            <th className="px-3 py-2.5 text-right">Stock</th>
            <th className="px-3 py-2.5 text-right">Mínimo</th>
            <th className="px-3 py-2.5 text-right">Precio</th>
            <th className="px-3 py-2.5">Estado</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} className="border-t border-borde">
              <td className="px-3 py-2.5">
                {p.nombre}
                <span className="block text-xs text-gris">{p.marca}</span>
              </td>
              <td className="px-3 py-2.5">{p.tipo}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{p.stock}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{p.stockMinimo}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{formatoPrecio(p.precio)}</td>
              <td className="px-3 py-2.5"><BadgeEstado articulo={p} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaProductos
