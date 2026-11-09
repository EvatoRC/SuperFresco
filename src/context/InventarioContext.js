import { createContext, useContext } from 'react'

// el contexto es el "canal" por donde viaja el estado global
// sin pasar props de componente en componente
export const InventarioContext = createContext(null)

// hook propio para no repetir useContext(InventarioContext) en cada pagina
// y para avisar si alguien lo usa fuera del Provider
export function useInventario() {
  const contexto = useContext(InventarioContext)
  if (!contexto) {
    throw new Error('useInventario debe usarse dentro de <InventarioProvider>')
  }
  return contexto
}
