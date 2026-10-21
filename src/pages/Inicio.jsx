import { useState } from 'react'
import productos from '../data/productos'

// devuelve el estado del producto segun su stock
function estadoStock(p) {
  if (p.stock === 0) return { texto: 'Sin stock', clase: 'sin-stock' }
  if (p.stock <= p.stockMinimo) return { texto: 'Stock bajo', clase: 'stock-bajo' }
  return { texto: 'Disponible', clase: 'disponible' }
}

function Inicio() {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')

  // saco las categorias de los mismos productos para no escribirlas a mano
  const categorias = ['Todas', ...new Set(productos.map((p) => p.categoria))]

  const filtrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = categoria === 'Todas' || p.categoria === categoria
    return coincideNombre && coincideCategoria
  })

  // resumen para las tarjetas de arriba
  const totalUnidades = productos.reduce((suma, p) => suma + p.stock, 0)
  const bajos = productos.filter((p) => p.stock > 0 && p.stock <= p.stockMinimo).length
  const agotados = productos.filter((p) => p.stock === 0).length

  return (
    <section>
      <h1>Inventario general</h1>
      <p className="subtitulo">Resumen del stock de productos de todas las sucursales.</p>

      <div className="resumen">
        <div className="tarjeta-resumen">
          <span className="numero">{productos.length}</span>
          <span>Productos</span>
        </div>
        <div className="tarjeta-resumen">
          <span className="numero">{totalUnidades}</span>
          <span>Unidades</span>
        </div>
        <div className="tarjeta-resumen alerta">
          <span className="numero">{bajos}</span>
          <span>Stock bajo</span>
        </div>
        <div className="tarjeta-resumen peligro">
          <span className="numero">{agotados}</span>
          <span>Sin stock</span>
        </div>
      </div>

      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar producto"
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Filtrar por categoría">
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtrados.length === 0 ? (
        <p className="vacio">No se encontraron productos con esos filtros.</p>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => {
                const estado = estadoStock(p)
                return (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>{p.stock}</td>
                    <td>{p.stockMinimo}</td>
                    <td>${p.precio.toLocaleString('es-CL')}</td>
                    <td><span className={`badge ${estado.clase}`}>{estado.texto}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Inicio
