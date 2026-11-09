// ===== calculos del carrito =====
// el carrito solo guarda { id, cantidad }; aqui se cruza con los articulos
// para tener nombre, precio y subtotal al momento de mostrarlo

// devuelve cada item del carrito con los datos completos de su articulo
export function itemsDelCarrito(carrito, articulos) {
  return carrito
    .map((item) => {
      const articulo = articulos.find((a) => a.id === item.id)
      return articulo ? { ...articulo, cantidad: item.cantidad, subtotal: articulo.precio * item.cantidad } : null
    })
    .filter(Boolean) // por si un id ya no existe en el inventario
}

export function totalUnidades(carrito) {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0)
}

export function totalCarrito(items) {
  return items.reduce((suma, item) => suma + item.subtotal, 0)
}
