import tipos from '../data/tipos'
import { estadoInicial } from './inventarioReducer'

// ===== persistencia en localStorage =====
// Lo que se guarda lleva un numero de version. Al leerlo:
//   1. si el JSON esta roto            -> datos de prueba
//   2. si es de una version anterior   -> se migra a la actual
//   3. si la estructura no es valida   -> datos de prueba (y aviso en consola)
// Asi un dato viejo o manipulado a mano nunca llega al reducer.

export const CLAVE_STORAGE = 'superfresco-inventario'
export const VERSION = 3

const esEnteroNoNegativo = (n) => Number.isInteger(n) && n >= 0
const esTextoConContenido = (t) => typeof t === 'string' && t.trim().length > 0

function esArticuloValido(a) {
  return (
    a !== null &&
    typeof a === 'object' &&
    Number.isInteger(a.id) && a.id > 0 &&
    esTextoConContenido(a.nombre) &&
    esTextoConContenido(a.marca) &&
    tipos.includes(a.tipo) && // la categoria tiene que existir en data/tipos.js
    esEnteroNoNegativo(a.stock) &&
    esEnteroNoNegativo(a.stockMinimo) &&
    Number.isInteger(a.precio) && a.precio > 0
  )
}

// valida el estado completo, incluida la coherencia entre articulos y carrito
export function esEstadoValido(estado) {
  if (!estado || !Array.isArray(estado.articulos) || !Array.isArray(estado.carrito)) return false
  if (!estado.articulos.every(esArticuloValido)) return false

  const ids = estado.articulos.map((a) => a.id)
  if (new Set(ids).size !== ids.length) return false // ids repetidos

  const idsCarrito = estado.carrito.map((item) => item.id)
  if (new Set(idsCarrito).size !== idsCarrito.length) return false
  const carritoOk = estado.carrito.every(
    (item) => ids.includes(item.id) && Number.isInteger(item.cantidad) && item.cantidad > 0,
  )
  if (!carritoOk) return false

  // el contador nunca puede apuntar a un id que ya existe
  return Number.isInteger(estado.siguienteId) && estado.siguienteId > Math.max(0, ...ids)
}

// convierte formatos anteriores al actual
function migrar(guardado) {
  // semana 2: solo se guardaba el arreglo de articulos
  if (Array.isArray(guardado)) return estadoInicial(guardado)
  // objeto sin version (formato intermedio sin contador de ids)
  if (guardado && guardado.version === undefined && Array.isArray(guardado.articulos)) {
    return { ...estadoInicial(guardado.articulos), carrito: Array.isArray(guardado.carrito) ? guardado.carrito : [] }
  }
  if (guardado?.version === VERSION) {
    const { articulos, carrito, siguienteId } = guardado
    return { articulos, carrito, siguienteId }
  }
  return null // version desconocida (por ejemplo, de una version futura)
}

// lee y valida; si algo falla devuelve el estado con los datos por defecto
export function cargarEstado(articulosPorDefecto) {
  let guardado = null
  try {
    const texto = localStorage.getItem(CLAVE_STORAGE)
    if (texto === null) return estadoInicial(articulosPorDefecto) // primera visita
    guardado = JSON.parse(texto)
  } catch {
    // JSON roto o storage bloqueado (modo incognito, etc.)
    console.warn('SuperFresco: no se pudieron leer los datos guardados, se cargan los datos de prueba.')
    return estadoInicial(articulosPorDefecto)
  }

  const estado = migrar(guardado)
  if (estado && esEstadoValido(estado)) return estado

  console.warn('SuperFresco: los datos guardados no tienen un formato válido, se cargan los datos de prueba.')
  return estadoInicial(articulosPorDefecto)
}

export function guardarEstado(estado) {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify({ version: VERSION, ...estado }))
  } catch {
    // si no se puede guardar, la app sigue funcionando en memoria
  }
}
