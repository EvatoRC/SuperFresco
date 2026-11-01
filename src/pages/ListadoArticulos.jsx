import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInventario } from '../context/InventarioContext'
import BadgeEstado from '../components/BadgeEstado'
import TituloPagina from '../components/TituloPagina'
import { formatoPrecio } from '../utils/stock'

function ListadoArticulos() {
  // la lista sale del estado global, no de un import: si se agrega un articulo aparece aqui al tiro
  const { articulos, eliminarArticulo, reiniciarInventario } = useInventario()

  // id del articulo que se esta por eliminar (para pedir confirmacion en la misma fila)
  const [porEliminar, setPorEliminar] = useState(null)

  return (
    <section>
      <TituloPagina
        titulo="Listado de artículos"
        subtitulo={`${articulos.length} ${articulos.length === 1 ? 'artículo' : 'artículos'} actualmente en el inventario.`}
      >
        <Link to="/articulos/nuevo" className="btn-primario">➕ Agregar artículo</Link>
      </TituloPagina>

      {articulos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-borde bg-white p-8 text-center text-gris">
          <p className="mb-3">El inventario está vacío.</p>
          <button onClick={reiniciarInventario} className="cursor-pointer font-semibold text-verde underline">
            Cargar datos de prueba
          </button>
        </div>
      ) : (
        // overflow-x-auto: en celular la tabla se desplaza dentro de su caja y no rompe la pagina
        <div className="relative overflow-x-auto rounded-lg border border-borde bg-white shadow-sm">
          <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
            <thead className="bg-cabecera text-sm">
              <tr>
                <th className="px-3 py-2.5">#</th>
                <th className="px-3 py-2.5">Nombre</th>
                <th className="px-3 py-2.5">Marca</th>
                <th className="px-3 py-2.5">Tipo</th>
                <th className="px-3 py-2.5 text-right">Stock</th>
                <th className="px-3 py-2.5 text-right">Precio</th>
                <th className="px-3 py-2.5">Estado</th>
                <th className="px-3 py-2.5"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {articulos.map((a) => (
                <tr key={a.id} className="border-t border-borde odd:bg-white even:bg-fondo/60 hover:bg-verde-claro/40">
                  <td className="px-3 py-2.5 text-gris">{a.id}</td>
                  <td className="px-3 py-2.5 font-medium">{a.nombre}</td>
                  <td className="px-3 py-2.5">{a.marca}</td>
                  <td className="px-3 py-2.5">{a.tipo}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{a.stock}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatoPrecio(a.precio)}</td>
                  <td className="px-3 py-2.5"><BadgeEstado articulo={a} /></td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    {porEliminar === a.id ? (
                      <span className="inline-flex items-center gap-2 text-sm">
                        ¿Eliminar?
                        <button
                          onClick={() => { eliminarArticulo(a.id); setPorEliminar(null) }}
                          className="cursor-pointer rounded bg-rojo px-2 py-1 font-semibold text-white hover:bg-rojo-oscuro"
                        >
                          Sí
                        </button>
                        <button onClick={() => setPorEliminar(null)} className="cursor-pointer rounded border border-borde px-2 py-1 hover:bg-fondo">
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setPorEliminar(a.id)}
                        className="cursor-pointer rounded px-2 py-1 text-sm text-rojo hover:bg-peligro-fondo"
                        aria-label={`Eliminar ${a.nombre}`}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {articulos.length > 0 && (
        <button onClick={reiniciarInventario} className="mt-4 cursor-pointer text-sm text-gris underline hover:text-texto">
          Restablecer datos de prueba
        </button>
      )}
    </section>
  )
}

export default ListadoArticulos
