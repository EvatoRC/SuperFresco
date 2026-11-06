// caja punteada para cuando no hay nada que mostrar (inventario vacio, filtro sin resultados, carrito vacio).
// children = la accion que se ofrece (un boton o un link)
function EstadoVacio({ icono, mensaje, children }) {
  return (
    <div className="rounded-lg border border-dashed border-borde bg-white p-8 text-center text-gris">
      {icono && <p className="mb-2 text-4xl" aria-hidden="true">{icono}</p>}
      <p className="mb-3">{mensaje}</p>
      {children}
    </div>
  )
}

export default EstadoVacio
