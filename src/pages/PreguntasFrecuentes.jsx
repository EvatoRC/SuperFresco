import { useState } from 'react'
import preguntas from '../data/preguntas'
import TituloPagina from '../components/TituloPagina'

function PreguntasFrecuentes() {
  // guardo el indice de la pregunta abierta (null = ninguna)
  const [abierta, setAbierta] = useState(null)

  const togglePregunta = (i) => {
    setAbierta(abierta === i ? null : i)
  }

  return (
    <section>
      <TituloPagina titulo="Preguntas frecuentes" subtitulo="Dudas comunes sobre el uso del sistema de inventario." />

      <div className="space-y-2.5">
        {preguntas.map((p, i) => (
          <div key={i} className="rounded-lg border border-borde bg-white">
            <button
              className="flex w-full cursor-pointer justify-between gap-2.5 px-4 py-3.5 text-left font-semibold"
              onClick={() => togglePregunta(i)}
              aria-expanded={abierta === i}
            >
              {p.pregunta}
              <span className="text-verde">{abierta === i ? '−' : '+'}</span>
            </button>
            {abierta === i && <p className="px-4 pb-3.5 leading-relaxed text-gris">{p.respuesta}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

export default PreguntasFrecuentes
