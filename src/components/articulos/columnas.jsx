import { Link } from 'react-router'
import BadgeEstado from '../BadgeEstado'
import { formatoPrecio } from '../../utils/stock'

// ===== catalogo de columnas para TablaArticulos =====
// Cada columna define: titulo del encabezado, alineacion y como se dibuja la celda.
// Inicio y el Listado eligen cuales usar, pero el formato de cada dato (precio, stock,
// badge de estado, link al detalle) se define UNA vez aqui y se ve igual en las dos tablas.
//
// celda(articulo, contexto): contexto trae datos extra de la pagina (por ejemplo el estado
// que se le pasa al link del detalle para que "Volver" conserve el filtro)

const enlaceDetalle = (a, contexto) => (
  <Link
    to={`/articulos/${a.id}`}
    state={contexto?.estadoEnlace}
    // si la fila completa tambien es clickeable, evito que el clic se procese dos veces
    onClick={(e) => e.stopPropagation()}
    className="font-medium text-texto hover:text-verde-oscuro hover:underline"
  >
    {a.nombre}
  </Link>
)

const numero = (valor) => <span className="tabular-nums">{valor}</span>

export const COLUMNAS = {
  id: { clave: 'id', titulo: '#', celda: (a) => <span className="text-gris">{a.id}</span> },
  // nombre con la marca debajo (vista compacta de Inicio)
  producto: {
    clave: 'producto',
    titulo: 'Producto',
    celda: (a, ctx) => (
      <>
        {enlaceDetalle(a, ctx)}
        <span className="block text-xs text-gris">{a.marca}</span>
      </>
    ),
  },
  nombre: { clave: 'nombre', titulo: 'Nombre', celda: enlaceDetalle },
  marca: { clave: 'marca', titulo: 'Marca', celda: (a) => a.marca },
  categoria: { clave: 'categoria', titulo: 'Categoría', celda: (a) => a.tipo },
  stock: { clave: 'stock', titulo: 'Stock', derecha: true, celda: (a) => numero(a.stock) },
  minimo: { clave: 'minimo', titulo: 'Mínimo', derecha: true, celda: (a) => numero(a.stockMinimo) },
  precio: { clave: 'precio', titulo: 'Precio', derecha: true, celda: (a) => numero(formatoPrecio(a.precio)) },
  estado: { clave: 'estado', titulo: 'Estado', celda: (a) => <BadgeEstado articulo={a} /> },
}
