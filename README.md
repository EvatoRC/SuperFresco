# SuperFresco – Gestión de Inventario

Actividad formativa semana 1: "Utilizando tecnologías avanzadas de React en sitios web".

Sitio de gestión de inventario para un supermercado hecho con React + Vite y **React Router** para la navegación entre pantallas sin recargar la página (SPA).

## Páginas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Inicio | Inventario general: resumen, buscador, filtro por categoría y estado del stock |
| `/tiendas` | Nuestras tiendas | Listado de sucursales |
| `/tiendas/:id` | Detalle de tienda | Ruta dinámica, lee el `id` con `useParams` |
| `/preguntas-frecuentes` | Preguntas frecuentes | Acordeón de dudas sobre el sistema |
| `*` | 404 | Cualquier ruta que no exista |

La navegación principal está en un **menú inferior** fijo (`MenuInferior.jsx`) que usa `NavLink` para marcar la página activa.

## Qué se usa de React Router

- `BrowserRouter`, `Routes` y `Route` en `App.jsx`
- `NavLink` en el menú inferior y `Link` en el logo y las tarjetas
- Ruta dinámica `/tiendas/:id` con `useParams`
- `useNavigate(-1)` para el botón "Volver"
- Ruta `*` al final para páginas no encontradas

## Estructura

```
src/
├── App.jsx              # configuración de rutas
├── App.css
├── components/
│   ├── Header.jsx
│   └── MenuInferior.jsx
├── data/                # datos de prueba
│   ├── productos.js
│   ├── tiendas.js
│   └── preguntas.js
└── pages/
    ├── Inicio.jsx
    ├── NuestrasTiendas.jsx
    ├── DetalleTienda.jsx
    ├── PreguntasFrecuentes.jsx
    └── NoEncontrado.jsx
```

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abrir la URL que muestra la terminal (normalmente http://localhost:5173).

## Despliegue en GitHub Pages

Sitio publicado: https://evatorc.github.io/SuperFresco/

```bash
npm run deploy
```

Esto hace el build y sube la carpeta `dist` a la rama `gh-pages`.

Configuración que lo hace funcionar:
- `vite.config.js` → `base: '/SuperFresco/'` (el sitio no está en la raíz del dominio)
- `App.jsx` → `<Router basename={import.meta.env.BASE_URL}>` para que las rutas de React Router incluyan `/SuperFresco/`
- `postbuild` copia `index.html` a `404.html`: GitHub Pages no conoce las rutas de React, así que al recargar `/SuperFresco/tiendas/maipu` entrega el 404.html, que carga la app y React Router muestra la página correcta.
