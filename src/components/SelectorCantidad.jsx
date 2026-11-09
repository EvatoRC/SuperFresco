// control "−  N  +" reutilizable. No guarda estado: el padre decide que hace cada boton.
// Lo usan el detalle (cantidad a agregar, estado local) y el carrito (estado global)
function SelectorCantidad({ valor, onDisminuir, onAumentar, puedeDisminuir = true, puedeAumentar = true, etiqueta = 'Cantidad' }) {
  const claseBoton =
    'flex h-9 w-9 cursor-pointer items-center justify-center text-lg font-bold text-verde-oscuro transition-colors hover:bg-verde-claro disabled:cursor-not-allowed disabled:text-borde disabled:hover:bg-transparent'

  return (
    <div className="inline-flex items-center rounded-md border border-borde bg-white" role="group" aria-label={etiqueta}>
      <button type="button" onClick={onDisminuir} disabled={!puedeDisminuir} className={claseBoton} aria-label="Disminuir cantidad">
        −
      </button>
      {/* aria-live: el lector de pantalla anuncia el numero nuevo */}
      <span className="min-w-10 border-x border-borde px-2 text-center font-semibold tabular-nums" aria-live="polite">
        {valor}
      </span>
      <button type="button" onClick={onAumentar} disabled={!puedeAumentar} className={claseBoton} aria-label="Aumentar cantidad">
        +
      </button>
    </div>
  )
}

export default SelectorCantidad
