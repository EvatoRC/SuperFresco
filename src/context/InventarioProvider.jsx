import { useEffect, useReducer } from 'react'
import { InventarioContext } from './InventarioContext'
import { ACCIONES, inventarioReducer } from './inventarioReducer'
import productosIniciales from '../data/productos'

const CLAVE_STORAGE = 'superfresco-inventario'

// carga inicial: si hay datos guardados en el navegador los uso,
// si no, parto con los datos de prueba
function cargarInventario(datosPorDefecto) {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    return guardado ? JSON.parse(guardado) : datosPorDefecto
  } catch {
    // modo incognito o storage bloqueado: sigo con los datos de prueba
    return datosPorDefecto
  }
}

function InventarioProvider({ children }) {
  // useReducer en vez de useState porque el estado tiene varias acciones
  // (agregar, eliminar, reiniciar) y asi toda la logica queda en un solo lugar.
  // el tercer parametro (cargarInventario) solo se ejecuta la primera vez
  const [articulos, dispatch] = useReducer(inventarioReducer, productosIniciales, cargarInventario)

  // cada vez que cambia la lista la guardo, asi no se pierde al recargar la pagina
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(articulos))
    } catch {
      // si no se puede guardar, la app sigue funcionando igual en memoria
    }
  }, [articulos])

  // funciones que exponen las acciones, para que las paginas no tengan que conocer el dispatch
  const agregarArticulo = (articulo) => dispatch({ type: ACCIONES.AGREGAR, payload: articulo })
  const eliminarArticulo = (id) => dispatch({ type: ACCIONES.ELIMINAR, payload: id })
  const reiniciarInventario = () => dispatch({ type: ACCIONES.REINICIAR, payload: productosIniciales })

  return (
    <InventarioContext.Provider value={{ articulos, agregarArticulo, eliminarArticulo, reiniciarInventario }}>
      {children}
    </InventarioContext.Provider>
  )
}

export default InventarioProvider
