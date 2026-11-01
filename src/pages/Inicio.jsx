import { useState } from 'react'
import { useInventario } from '../context/InventarioContext'
import TituloPagina from '../components/TituloPagina'
import TarjetaResumen from '../components/inicio/TarjetaResumen'
import FiltrosInventario from '../components/inicio/FiltrosInventario'
import TablaProductos from '../components/inicio/TablaProductos'
import { resumenInventario } from '../utils/stock'

// Inicio solo coordina: lee el estado global, maneja los filtros
// y reparte los datos a componentes especializados
function Inicio() {
  const { articulos } = useInventario()

  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState('Todos')

  // saco los tipos de los mismos productos para no escribirlos a mano
  const tipos = ['Todos', ...new Set(articulos.map((p) => p.tipo))]

  const filtrados = articulos.filter((p) => {
    const texto = busqueda.toLowerCase()
    const coincideTexto = p.nombre.toLowerCase().includes(texto) || p.marca.toLowerCase().includes(texto)
    const coincideTipo = tipo === 'Todos' || p.tipo === tipo
    return coincideTexto && coincideTipo
  })

  // los criterios de stock bajo / agotado vienen de utils/stock.js
  const resumen = resumenInventario(articulos)

  // agregar un indicador nuevo = agregar un objeto a este arreglo
  const indicadores = [
    { etiqueta: 'Productos', numero: resumen.productos },
    { etiqueta: 'Unidades', numero: resumen.unidades },
    { etiqueta: 'Stock bajo', numero: resumen.bajos, variante: 'alerta' },
    { etiqueta: 'Sin stock', numero: resumen.agotados, variante: 'peligro' },
  ]

  return (
    <section>
      <TituloPagina titulo="Inventario general" subtitulo="Resumen del stock de productos de todas las sucursales." />

      {/* 2 columnas en celular, 4 desde md */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {indicadores.map((ind) => (
          <TarjetaResumen key={ind.etiqueta} {...ind} />
        ))}
      </div>

      <FiltrosInventario busqueda={busqueda} onBusqueda={setBusqueda} tipo={tipo} onTipo={setTipo} tipos={tipos} />

      <TablaProductos productos={filtrados} />
    </section>
  )
}

export default Inicio
