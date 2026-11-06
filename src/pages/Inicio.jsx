import { useState } from 'react'
import { useInventario } from '../context/InventarioContext'
import TituloPagina from '../components/TituloPagina'
import TarjetaResumen from '../components/inicio/TarjetaResumen'
import FiltrosInventario from '../components/inicio/FiltrosInventario'
import TablaArticulos from '../components/articulos/TablaArticulos'
import { COLUMNAS } from '../components/articulos/columnas'
import { resumenInventario } from '../utils/stock'
import { TODAS, categoriasConConteo, filtrarPorCategoria } from '../utils/categorias'

// columnas de la tabla de Inicio (vista compacta, solo lectura)
const columnasInicio = [COLUMNAS.producto, COLUMNAS.categoria, COLUMNAS.stock, COLUMNAS.minimo, COLUMNAS.precio, COLUMNAS.estado]

// Inicio solo coordina: lee el estado global, maneja los filtros
// y reparte los datos a componentes especializados
function Inicio() {
  const { articulos } = useInventario()

  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState(TODAS)

  // mismas categorias y mismo filtro que el listado de articulos (utils/categorias.js)
  const tipos = categoriasConConteo(articulos).map((c) => c.nombre)

  const texto = busqueda.toLowerCase()
  const filtrados = filtrarPorCategoria(articulos, tipo).filter(
    (p) => p.nombre.toLowerCase().includes(texto) || p.marca.toLowerCase().includes(texto),
  )

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

      {filtrados.length === 0 ? (
        <p className="py-5 text-gris">No se encontraron productos con esos filtros.</p>
      ) : (
        <TablaArticulos articulos={filtrados} columnas={columnasInicio} />
      )}
    </section>
  )
}

export default Inicio
