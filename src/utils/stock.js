// ===== criterios de stock compartidos por todo el sitio =====
// si cambia una regla de negocio, se cambia solo aqui

// una sucursal con MAS de este numero de productos en stock bajo se considera critica
export const UMBRAL_TIENDA_CRITICA = 3

// estado de un articulo segun su stock. Devuelve una clave + el texto a mostrar
// (los colores no van aqui: los decide el componente Badge segun la variante)
export function estadoStock(p) {
  if (p.stock === 0) return { variante: 'peligro', texto: 'Sin stock' }
  if (p.stock <= p.stockMinimo) return { variante: 'alerta', texto: 'Stock bajo' }
  return { variante: 'ok', texto: 'Disponible' }
}

// cuenta los articulos por estado, usando la MISMA regla de estadoStock
export function resumenInventario(articulos) {
  return {
    productos: articulos.length,
    unidades: articulos.reduce((suma, p) => suma + p.stock, 0),
    bajos: articulos.filter((p) => estadoStock(p).variante === 'alerta').length,
    agotados: articulos.filter((p) => estadoStock(p).variante === 'peligro').length,
  }
}

// variante de alerta para el numero de productos con stock bajo de una sucursal
export function varianteTienda(cantidadBajoStock) {
  return cantidadBajoStock > UMBRAL_TIENDA_CRITICA ? 'peligro' : 'alerta'
}

export function formatoPrecio(valor) {
  return `$${valor.toLocaleString('es-CL')}`
}
