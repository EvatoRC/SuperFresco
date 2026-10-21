import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Header from './components/Header'
import MenuInferior from './components/MenuInferior'
import Inicio from './pages/Inicio'
import NuestrasTiendas from './pages/NuestrasTiendas'
import DetalleTienda from './pages/DetalleTienda'
import PreguntasFrecuentes from './pages/PreguntasFrecuentes'
import NoEncontrado from './pages/NoEncontrado'

function App() {
  return (
    // Router envuelve todo para que Link, NavLink y los hooks funcionen en cualquier componente.
    // basename toma el "base" de vite.config.js (/SuperFresco/) para que las rutas funcionen en GitHub Pages
    <Router basename={import.meta.env.BASE_URL}>
      <div className="app">
        <Header />

        <main className="contenido">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/tiendas" element={<NuestrasTiendas />} />
            {/* ruta dinamica: el :id cambia segun la tienda que se elija */}
            <Route path="/tiendas/:id" element={<DetalleTienda />} />
            <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
            {/* el * va al final, atrapa cualquier ruta que no exista */}
            <Route path="*" element={<NoEncontrado />} />
          </Routes>
        </main>

        {/* menu inferior fijo, segun lo que pide el enunciado */}
        <MenuInferior />
      </div>
    </Router>
  )
}

export default App
