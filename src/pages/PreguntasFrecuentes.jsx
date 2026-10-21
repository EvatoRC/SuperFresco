import { useState } from 'react'
import preguntas from '../data/preguntas'

function PreguntasFrecuentes() {
  // guardo el indice de la pregunta abierta (null = ninguna)
  const [abierta, setAbierta] = useState(null)

  const togglePregunta = (i) => {
    setAbierta(abierta === i ? null : i)
  }

  return (
    <section>
      <h1>Preguntas frecuentes</h1>
      <p className="subtitulo">Dudas comunes sobre el uso del sistema de inventario.</p>

      <div className="faq">
        {preguntas.map((p, i) => (
          <div key={i} className="faq-item">
            <button
              className="faq-pregunta"
              onClick={() => togglePregunta(i)}
              aria-expanded={abierta === i}
            >
              {p.pregunta}
              <span>{abierta === i ? '−' : '+'}</span>
            </button>
            {abierta === i && <p className="faq-respuesta">{p.respuesta}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

export default PreguntasFrecuentes
