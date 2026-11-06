import { lazy } from 'react'
import { Routes, Route } from 'react-router'
import Layout from '../layouts/Layout'
import Inicio from '../pages/Inicio'

// Inicio se carga normal porque es la primera pantalla.
// El resto se carga con lazy: su codigo se descarga recien cuando el usuario entra
const NuestrasTiendas = lazy(() => import('../pages/NuestrasTiendas'))
const DetalleTienda = lazy(() => import('../pages/DetalleTienda'))
const PreguntasFrecuentes = lazy(() => import('../pages/PreguntasFrecuentes'))
const ListadoArticulos = lazy(() => import('../pages/ListadoArticulos'))
const AgregarArticulo = lazy(() => import('../pages/AgregarArticulo'))
const DetalleArticulo = lazy(() => import('../pages/DetalleArticulo'))
const Carrito = lazy(() => import('../pages/Carrito'))
const NoEncontrado = lazy(() => import('../pages/NoEncontrado'))

// todas las rutas van anidadas dentro de Layout (ruta "padre" sin path)
function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="tiendas" element={<NuestrasTiendas />} />
        {/* ruta dinamica: el :id cambia segun la tienda que se elija */}
        <Route path="tiendas/:id" element={<DetalleTienda />} />
        <Route path="preguntas-frecuentes" element={<PreguntasFrecuentes />} />
        <Route path="articulos" element={<ListadoArticulos />} />
        {/* "nuevo" es un segmento fijo y gana sobre :id, asi /articulos/nuevo no se confunde con un detalle */}
        <Route path="articulos/nuevo" element={<AgregarArticulo />} />
        {/* semana 3: detalle de un articulo (ruta dinamica) y carrito */}
        <Route path="articulos/:id" element={<DetalleArticulo />} />
        <Route path="carrito" element={<Carrito />} />
        {/* el * va al final, atrapa cualquier ruta que no exista */}
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
