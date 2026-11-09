// tarjeta de indicador. La variante cambia el color del borde izquierdo
const BORDES = {
  ok: 'border-l-verde',
  alerta: 'border-l-amarillo',
  peligro: 'border-l-rojo',
}

function TarjetaResumen({ numero, etiqueta, variante = 'ok' }) {
  return (
    <div className={`flex flex-col rounded-lg border border-l-[5px] border-borde bg-white p-3.5 text-gris ${BORDES[variante]}`}>
      <span className="text-2xl font-bold text-texto">{numero.toLocaleString('es-CL')}</span>
      <span>{etiqueta}</span>
    </div>
  )
}

export default TarjetaResumen
