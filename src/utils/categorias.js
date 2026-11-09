import tipos from '../data/tipos'

// valor especial del filtro que muestra todo
export const TODAS = 'Todas'

// UNA sola fuente de categorias: data/tipos.js.
// La usan el formulario (opciones del select), el filtro del listado y el de Inicio,
// asi las opciones para crear un articulo y las categorias que se muestran nunca difieren.
// (persistencia.js ademas rechaza articulos guardados con una categoria que no este en la lista)
export function categoriasConConteo(articulos) {
  const conteo = {}
  articulos.forEach((a) => {
    conteo[a.tipo] = (conteo[a.tipo] ?? 0) + 1
  })

  return [{ nombre: TODAS, cantidad: articulos.length }, ...tipos.map((nombre) => ({ nombre, cantidad: conteo[nombre] ?? 0 }))]
}

// devuelve un arreglo NUEVO con los articulos de la categoria.
// filter no modifica el arreglo original, asi el inventario queda intacto
export function filtrarPorCategoria(articulos, categoria) {
  if (!categoria || categoria === TODAS) return articulos
  return articulos.filter((a) => a.tipo === categoria)
}
