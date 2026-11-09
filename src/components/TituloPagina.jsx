// encabezado comun de todas las paginas: titulo, subtitulo opcional
// y "acciones" opcionales a la derecha (por ejemplo un boton)
function TituloPagina({ titulo, subtitulo, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="mb-1 text-3xl font-bold">{titulo}</h1>
        {subtitulo && <p className="text-gris">{subtitulo}</p>}
      </div>
      {children}
    </div>
  )
}

export default TituloPagina
