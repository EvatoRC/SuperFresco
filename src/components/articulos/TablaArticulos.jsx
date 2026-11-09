// tabla configurable de articulos: la usan Inicio (solo lectura) y el Listado (con acciones).
// Los estilos de encabezado, filas, bordes y alineacion viven solo aqui.
//
// props:
//   articulos   -> filas a mostrar
//   columnas    -> arreglo de columnas (ver columnas.jsx); { clave, titulo, celda, derecha?, tituloOculto?, sinClicFila? }
//   onFilaClick -> opcional: si viene, toda la fila es clickeable
//   contexto    -> opcional: datos extra que reciben las celdas
//   anchoMinimo -> ancho minimo antes de que aparezca el scroll horizontal (en celular)
function TablaArticulos({ articulos, columnas, onFilaClick, contexto, anchoMinimo = 640 }) {
  const alinear = (col) => (col.derecha ? 'text-right' : '')

  return (
    // overflow-x-auto: en celular la tabla se desplaza dentro de su caja y no rompe la pagina
    <div className="relative overflow-x-auto rounded-lg border border-borde bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-[15px]" style={{ minWidth: anchoMinimo }}>
        <thead className="bg-cabecera text-sm">
          <tr>
            {columnas.map((col) => (
              <th key={col.clave} scope="col" className={`px-3 py-2.5 ${alinear(col)}`}>
                {col.tituloOculto ? <span className="sr-only">{col.titulo}</span> : col.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {articulos.map((a) => (
            <tr
              key={a.id}
              onClick={onFilaClick ? () => onFilaClick(a) : undefined}
              className={`border-t border-borde odd:bg-white even:bg-fondo/60 ${onFilaClick ? 'cursor-pointer hover:bg-verde-claro/50' : ''}`}
            >
              {columnas.map((col) => (
                <td
                  key={col.clave}
                  className={`px-3 py-2.5 ${alinear(col)}`}
                  // celdas con botones propios (ej. Eliminar): su clic no debe abrir el detalle
                  onClick={col.sinClicFila ? (e) => e.stopPropagation() : undefined}
                >
                  {col.celda(a, contexto)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaArticulos
