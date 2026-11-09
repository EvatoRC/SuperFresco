// buscador + selector de tipo. No guarda estado: lo recibe por props
// y avisa los cambios al padre (componente controlado)
function FiltrosInventario({ busqueda, onBusqueda, tipo, onTipo, tipos }) {
  return (
    <div className="mb-4 flex flex-col gap-2.5 sm:flex-row">
      <input
        type="search"
        placeholder="Buscar por nombre o marca..."
        value={busqueda}
        onChange={(e) => onBusqueda(e.target.value)}
        aria-label="Buscar producto"
        className="control flex-1"
      />
      <select value={tipo} onChange={(e) => onTipo(e.target.value)} aria-label="Filtrar por tipo" className="control sm:w-auto">
        {tipos.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  )
}

export default FiltrosInventario
