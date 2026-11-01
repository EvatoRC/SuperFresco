import { BrowserRouter as Router } from 'react-router-dom'
import InventarioProvider from './context/InventarioProvider'
import AppRoutes from './routes/AppRoutes'

// App solo arma los "proveedores": estado global + router.
// El layout vive en layouts/Layout.jsx y las rutas en routes/AppRoutes.jsx
function App() {
  return (
    <InventarioProvider>
      {/* basename toma el "base" de vite.config.js (/SuperFresco/) para que las rutas funcionen en GitHub Pages */}
      <Router basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </Router>
    </InventarioProvider>
  )
}

export default App
