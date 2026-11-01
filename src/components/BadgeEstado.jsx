import Badge from './Badge'
import { estadoStock } from '../utils/stock'

// badge del estado de stock de un articulo (Disponible / Stock bajo / Sin stock)
function BadgeEstado({ articulo }) {
  const { variante, texto } = estadoStock(articulo)
  return <Badge variante={variante}>{texto}</Badge>
}

export default BadgeEstado
