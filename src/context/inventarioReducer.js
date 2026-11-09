// ===== forma del estado (semana 3) =====
// {
//   articulos: [{ id, nombre, marca, tipo, stock, stockMinimo, precio }],
//   carrito:   [{ id, cantidad }]   <- solo el id y la cantidad, el resto se lee de articulos
//   siguienteId: numero            <- contador que solo sube (ver AGREGAR)
// }
// En el carrito NO copio nombre ni precio: si los copiara tendria dos versiones
// del mismo dato que se podrian desincronizar.
//
// Regla que nunca se rompe:  stock + cantidad en carrito = unidades totales del articulo.
// Por eso todo movimiento entre inventario y carrito pasa por una sola funcion (moverUnidades).

// ===== acciones =====
// las dejo en constantes para no equivocarme escribiendo el texto en cada dispatch
export const ACCIONES = {
  // inventario (semana 2)
  AGREGAR: 'AGREGAR_ARTICULO',
  ELIMINAR: 'ELIMINAR_ARTICULO',
  REINICIAR: 'REINICIAR_INVENTARIO',
  // carrito (semana 3)
  AGREGAR_AL_CARRITO: 'AGREGAR_AL_CARRITO',
  AUMENTAR: 'AUMENTAR_CANTIDAD',
  DISMINUIR: 'DISMINUIR_CANTIDAD',
  QUITAR_DEL_CARRITO: 'QUITAR_DEL_CARRITO',
  VACIAR_CARRITO: 'VACIAR_CARRITO',
  CONFIRMAR_COMPRA: 'CONFIRMAR_COMPRA',
}

// el siguiente id libre nunca es menor que el mayor id existente + 1
export const mayorIdMasUno = (articulos) => articulos.reduce((max, a) => Math.max(max, a.id), 0) + 1

export const estadoInicial = (articulos, siguienteId = 1) => ({
  articulos,
  carrito: [],
  siguienteId: Math.max(siguienteId, mayorIdMasUno(articulos)),
})

// cantidad que hay de un articulo en el carrito (0 si no esta)
export function cantidadEnCarrito(carrito, id) {
  return carrito.find((item) => item.id === id)?.cantidad ?? 0
}

// mueve unidades entre el inventario y el carrito.
//   delta > 0 -> sale del stock y entra al carrito
//   delta < 0 -> sale del carrito y vuelve al stock
// Si el movimiento no se puede hacer (no hay stock o no hay tantas en el carrito)
// devuelvo el MISMO estado, asi React no re-renderiza y nada queda a medias
function moverUnidades(estado, id, delta) {
  const articulo = estado.articulos.find((a) => a.id === id)
  if (!articulo || !Number.isInteger(delta) || delta === 0) return estado

  const enCarrito = cantidadEnCarrito(estado.carrito, id)
  if (delta > 0 && delta > articulo.stock) return estado // no hay suficiente stock
  if (delta < 0 && -delta > enCarrito) return estado // no hay tantas en el carrito

  const nuevaCantidad = enCarrito + delta

  // inventario: le resto delta al stock (si delta es negativo, en la practica suma)
  const articulos = estado.articulos.map((a) => (a.id === id ? { ...a, stock: a.stock - delta } : a))

  // carrito: si queda en 0 lo saco; si no estaba lo agrego al final; si estaba actualizo la cantidad
  let carrito
  if (nuevaCantidad === 0) carrito = estado.carrito.filter((item) => item.id !== id)
  else if (enCarrito === 0) carrito = [...estado.carrito, { id, cantidad: nuevaCantidad }]
  else carrito = estado.carrito.map((item) => (item.id === id ? { ...item, cantidad: nuevaCantidad } : item))

  return { ...estado, articulos, carrito }
}

// devuelve todo lo del carrito al inventario
function devolverTodo(estado) {
  const articulos = estado.articulos.map((a) => {
    const enCarrito = cantidadEnCarrito(estado.carrito, a.id)
    return enCarrito > 0 ? { ...a, stock: a.stock + enCarrito } : a
  })
  return { ...estado, articulos, carrito: [] }
}

// ===== reducer =====
// recibe el estado actual y una accion { type, payload } y devuelve un estado NUEVO.
// Nunca modifica los arreglos originales (inmutabilidad): uso map, filter y spread
export function inventarioReducer(estado, accion) {
  switch (accion.type) {
    case ACCIONES.AGREGAR: {
      // antes el id era "mayor id + 1": si se vaciaba el inventario, el siguiente articulo
      // volvia a ser el #1 y heredaba la identidad de uno eliminado.
      // Ahora uso un contador que se guarda con el estado y nunca baja
      const id = estado.siguienteId
      return { ...estado, articulos: [...estado.articulos, { ...accion.payload, id }], siguienteId: id + 1 }
    }

    case ACCIONES.ELIMINAR:
      // si el articulo estaba en el carrito tambien lo saco de ahi. El contador de id NO baja
      return {
        ...estado,
        articulos: estado.articulos.filter((a) => a.id !== accion.payload),
        carrito: estado.carrito.filter((item) => item.id !== accion.payload),
      }

    case ACCIONES.REINICIAR:
      // vuelven los datos de prueba (con sus ids originales); el contador se mantiene
      return estadoInicial(accion.payload, estado.siguienteId)

    case ACCIONES.AGREGAR_AL_CARRITO:
      return moverUnidades(estado, accion.payload.id, accion.payload.cantidad)

    case ACCIONES.AUMENTAR:
      return moverUnidades(estado, accion.payload, 1)

    case ACCIONES.DISMINUIR: {
      // no bajo de 1: para sacar el articulo esta el boton "Quitar"
      if (cantidadEnCarrito(estado.carrito, accion.payload) <= 1) return estado
      return moverUnidades(estado, accion.payload, -1)
    }

    case ACCIONES.QUITAR_DEL_CARRITO:
      return moverUnidades(estado, accion.payload, -cantidadEnCarrito(estado.carrito, accion.payload))

    case ACCIONES.VACIAR_CARRITO:
      return devolverTodo(estado)

    case ACCIONES.CONFIRMAR_COMPRA:
      // la compra se concreta: el stock ya estaba descontado, solo se vacia el carrito
      return { ...estado, carrito: [] }

    default:
      // si llega una accion que no conozco prefiero que falle a que no haga nada en silencio
      throw new Error(`Acción desconocida: ${accion.type}`)
  }
}
