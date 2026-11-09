import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useInventario } from '../context/InventarioContext'
import { cantidadEnCarrito } from '../context/inventarioReducer'
import TituloPagina from '../components/TituloPagina'
import EstadoVacio from '../components/EstadoVacio'
import FiltroCategoria from '../components/articulos/FiltroCategoria'
import TablaArticulos from '../components/articulos/TablaArticulos'
import { COLUMNAS } from '../components/articulos/columnas'
import { TODAS, categoriasConConteo, filtrarPorCategoria } from '../utils/categorias'

function ListadoArticulos() {
  // la lista sale del estado global, no de un import: si se agrega un articulo aparece aqui al tiro
  const { articulos, carrito, eliminarArticulo, reiniciarInventario } = useInventario()
  const navigate = useNavigate()

  // ===== filtro por categoria (semana 3) =====
  // la categoria elegida es estado, pero guardado en la URL (?categoria=Lácteos) con useSearchParams.
  // Funciona igual que un useState (al cambiarlo React vuelve a dibujar), con dos ventajas:
  // al volver desde el detalle el filtro sigue puesto, y el link se puede compartir
  const [parametros, setParametros] = useSearchParams()
  const categoria = parametros.get('categoria') ?? TODAS

  const cambiarCategoria = (nueva) => {
    // replace: cambiar de filtro no llena el historial del boton "atras"
    setParametros(nueva === TODAS ? {} : { categoria: nueva }, { replace: true })
  }

  // el filtrado se CALCULA en cada render a partir de la lista completa.
  // Nunca se guarda ni se reemplaza "articulos": el inventario original queda intacto
  const categorias = categoriasConConteo(articulos)
  const visibles = filtrarPorCategoria(articulos, categoria)

  // id del articulo que se esta por eliminar (para pedir confirmacion en la misma fila)
  const [porEliminar, setPorEliminar] = useState(null)

  // al detalle le paso de donde viene, para que "Volver" respete el filtro
  const estadoEnlace = { desde: parametros.toString() }
  const verDetalle = (a) => navigate(`/articulos/${a.id}`, { state: estadoEnlace })

  // columnas: las comunes vienen del catalogo; "En carrito" y "Acciones" son propias de esta pantalla
  const columnas = [
    COLUMNAS.id,
    COLUMNAS.nombre,
    COLUMNAS.marca,
    COLUMNAS.categoria,
    COLUMNAS.stock,
    {
      clave: 'enCarrito',
      titulo: 'En carrito',
      derecha: true,
      celda: (a) => {
        const enCarrito = cantidadEnCarrito(carrito, a.id)
        return enCarrito > 0 ? <span className="font-semibold text-verde-oscuro tabular-nums">{enCarrito}</span> : <span className="text-gris">—</span>
      },
    },
    COLUMNAS.precio,
    COLUMNAS.estado,
    {
      clave: 'acciones',
      titulo: 'Acciones',
      tituloOculto: true,
      derecha: true,
      sinClicFila: true, // el clic en Eliminar no debe abrir el detalle
      celda: (a) =>
        porEliminar === a.id ? (
          <span className="inline-flex items-center gap-2 text-sm whitespace-nowrap">
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
        ),
    },
  ]

  const subtitulo =
    categoria === TODAS
      ? `${articulos.length} ${articulos.length === 1 ? 'artículo' : 'artículos'} en el inventario. Haz clic en uno para ver su detalle.`
      : `Mostrando ${visibles.length} de ${articulos.length} artículos · categoría ${categoria}.`

  return (
    <section>
      <TituloPagina titulo="Listado de artículos" subtitulo={subtitulo}>
        <Link to="/articulos/nuevo" className="btn-primario">➕ Agregar artículo</Link>
      </TituloPagina>

      {articulos.length === 0 ? (
        <EstadoVacio icono="📦" mensaje="El inventario está vacío.">
          <button onClick={reiniciarInventario} className="cursor-pointer font-semibold text-verde underline">
            Cargar datos de prueba
          </button>
        </EstadoVacio>
      ) : (
        <>
          <FiltroCategoria categorias={categorias} activa={categoria} onCambiar={cambiarCategoria} />

          {visibles.length === 0 ? (
            // pasa si se elimina el ultimo articulo de la categoria filtrada, o si la URL trae una categoria vacia
            <EstadoVacio mensaje={`No hay artículos en la categoría "${categoria}".`}>
              <button onClick={() => cambiarCategoria(TODAS)} className="cursor-pointer font-semibold text-verde underline">
                Ver todas las categorías
              </button>
            </EstadoVacio>
          ) : (
            <TablaArticulos
              articulos={visibles}
              columnas={columnas}
              onFilaClick={verDetalle}
              contexto={{ estadoEnlace }}
              anchoMinimo={760}
            />
          )}

          <button onClick={reiniciarInventario} className="mt-4 cursor-pointer text-sm text-gris underline hover:text-texto">
            Restablecer datos de prueba (también vacía el carrito)
          </button>
        </>
      )}
    </section>
  )
}

export default ListadoArticulos
