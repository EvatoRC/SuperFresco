// ===== acciones =====
// las dejo en constantes para no equivocarme escribiendo el texto en cada dispatch
export const ACCIONES = {
  AGREGAR: 'AGREGAR_ARTICULO',
  ELIMINAR: 'ELIMINAR_ARTICULO',
  REINICIAR: 'REINICIAR_INVENTARIO',
}

// ===== reducer =====
// recibe el estado actual (la lista de articulos) y una accion { type, payload }
// y devuelve un estado NUEVO. Nunca modifica el arreglo original (inmutabilidad),
// por eso uso [...estado] y filter en vez de push o splice
export function inventarioReducer(estado, accion) {
  switch (accion.type) {
    case ACCIONES.AGREGAR: {
      // el id nuevo es el mayor que exista + 1
      const nuevoId = estado.reduce((max, a) => Math.max(max, a.id), 0) + 1
      return [...estado, { ...accion.payload, id: nuevoId }]
    }

    case ACCIONES.ELIMINAR:
      return estado.filter((a) => a.id !== accion.payload)

    case ACCIONES.REINICIAR:
      return accion.payload

    default:
      // si llega una accion que no conozco prefiero que falle a que no haga nada en silencio
      throw new Error(`Acción desconocida: ${accion.type}`)
  }
}
