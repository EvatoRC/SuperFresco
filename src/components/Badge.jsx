// etiqueta de color reutilizable. Los colores salen de las variables del tema (index.css)
const VARIANTES = {
  ok: 'bg-ok-fondo text-ok-texto',
  alerta: 'bg-alerta-fondo text-alerta-texto',
  peligro: 'bg-peligro-fondo text-peligro-texto',
}

function Badge({ variante = 'ok', children }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${VARIANTES[variante]}`}>
      {children}
    </span>
  )
}

export default Badge
