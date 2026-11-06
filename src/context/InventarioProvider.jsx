import { useEffect, useReducer } from 'react'
import { InventarioContext } from './InventarioContext'
import { ACCIONES, inventarioReducer } from './inventarioReducer'
import { cargarEstado, guardarEstado } from './persistencia'
import productosIniciales from '../data/productos'

function InventarioProvider({ children }) {
  // inventario y carrito viven en el MISMO reducer: agregar al carrito descuenta stock
  // en una sola accion, asi nunca queda uno actualizado y el otro no.
  // cargarEstado (persistencia.js) lee localStorage, migra versiones antiguas y valida la estructura;
  // como tercer parametro de useReducer solo se ejecuta la primera vez
  const [estado, dispatch] = useReducer(inventarioReducer, productosIniciales, cargarEstado)

  // cada vez que cambia el estado lo guardo (con su version), asi no se pierde al recargar
  useEffect(() => {
    guardarEstado(estado)
  }, [estado])

  // funciones que exponen las acciones, para que las paginas no tengan que conocer el dispatch
  const valor = {
    articulos: estado.articulos,
    carrito: estado.carrito,
    // inventario
    agregarArticulo: (articulo) => dispatch({ type: ACCIONES.AGREGAR, payload: articulo }),
    eliminarArticulo: (id) => dispatch({ type: ACCIONES.ELIMINAR, payload: id }),
    reiniciarInventario: () => dispatch({ type: ACCIONES.REINICIAR, payload: productosIniciales }),
    // carrito
    agregarAlCarrito: (id, cantidad) => dispatch({ type: ACCIONES.AGREGAR_AL_CARRITO, payload: { id, cantidad } }),
    aumentarCantidad: (id) => dispatch({ type: ACCIONES.AUMENTAR, payload: id }),
    disminuirCantidad: (id) => dispatch({ type: ACCIONES.DISMINUIR, payload: id }),
    quitarDelCarrito: (id) => dispatch({ type: ACCIONES.QUITAR_DEL_CARRITO, payload: id }),
    vaciarCarrito: () => dispatch({ type: ACCIONES.VACIAR_CARRITO }),
    confirmarCompra: () => dispatch({ type: ACCIONES.CONFIRMAR_COMPRA }),
  }

  return <InventarioContext.Provider value={valor}>{children}</InventarioContext.Provider>
}

export default InventarioProvider
