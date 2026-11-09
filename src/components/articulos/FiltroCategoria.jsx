// botones de categoria con la cantidad de articulos de cada una.
// Componente controlado: recibe la categoria activa y avisa el cambio al padre.
// No filtra nada por si mismo, solo muestra las opciones
function FiltroCategoria({ categorias, activa, onCambiar }) {
  const claseBoton = (seleccionada) =>
    `cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
      seleccionada
        ? 'border-verde bg-verde text-white'
        : 'border-borde bg-white text-gris hover:border-verde hover:text-verde-oscuro disabled:cursor-default disabled:opacity-50 disabled:hover:border-borde disabled:hover:text-gris'
    }`

  return (
    <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
      {categorias.map(({ nombre, cantidad }) => (
        <button
          key={nombre}
          type="button"
          onClick={() => onCambiar(nombre)}
          aria-pressed={activa === nombre}
          // las categorias sin articulos se muestran (vienen de data/tipos.js) pero no se pueden elegir,
          // salvo que sea la activa (por ejemplo, si se elimino el ultimo articulo de esa categoria)
          disabled={cantidad === 0 && activa !== nombre}
          className={claseBoton(activa === nombre)}
        >
          {nombre} <span className="opacity-75">({cantidad})</span>
        </button>
      ))}
    </div>
  )
}

export default FiltroCategoria
