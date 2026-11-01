# SuperFresco – Gestión de Inventario

Sitio de gestión de inventario para un supermercado hecho con **React + Vite**, **React Router**, **estado global con Context API + useReducer** y **Tailwind CSS**.

- Semana 1: "Utilizando tecnologías avanzadas de React en sitios web" (React Router).
- Semana 2: "Implementando gestión de estado en componentes frontend con React" (estado global + framework CSS).

## Páginas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Inicio | Inventario general: resumen, buscador por nombre/marca, filtro por tipo y estado del stock |
| `/tiendas` | Nuestras tiendas | Listado de sucursales |
| `/tiendas/:id` | Detalle de tienda | Ruta dinámica, lee el `id` con `useParams` |
| `/preguntas-frecuentes` | Preguntas frecuentes | Acordeón de dudas sobre el sistema |
| `/articulos` | **Listado de artículos** (sem. 2) | Tabla con todos los artículos del inventario; permite eliminar |
| `/articulos/nuevo` | **Agregar artículo** (sem. 2) | Formulario con validación para ingresar artículos |
| `*` | 404 | Cualquier ruta que no exista |

Navegación:
- **Menú inferior** fijo (`MenuInferior.jsx`): Inicio, Nuestras tiendas, Preguntas frecuentes.
- **Menú de inventario** en el header (`Header.jsx`, semana 2): Listado de artículos y Agregar artículo, más un contador de artículos que se actualiza solo.

## Estado global (semana 2)

La lista de artículos vive en un estado global creado con `createContext` + `useReducer`:

```
src/context/
├── inventarioReducer.js     # ACCIONES (AGREGAR, ELIMINAR, REINICIAR) y la función reducer
├── InventarioContext.js     # createContext + hook useInventario()
└── InventarioProvider.jsx   # useReducer + useEffect (guarda en localStorage) y el Provider
```

- `App.jsx` envuelve toda la app con `<InventarioProvider>` (por fuera del Router).
- Cada artículo tiene: `id`, `nombre`, `marca`, `tipo`, `stock`, `stockMinimo`, `precio`.
- Cualquier componente accede con `const { articulos, agregarArticulo } = useInventario()`.
- Lo usan **cuatro** lugares: Inicio (resumen y tabla), Listado, Agregar artículo y el contador del Header. Al agregar un artículo los cuatro se actualizan sin recargar.
- Se usa `useReducer` (y no solo `useState`) porque el estado tiene varias acciones distintas y así la lógica de cambio queda centralizada en el reducer.
- Los cambios se guardan en `localStorage` para no perderlos al recargar. El botón "Restablecer datos de prueba" del listado vuelve a los datos iniciales.

El formulario usa estado **local** (`useState`) para los campos y errores, porque solo le importa a ese componente. Valida campos obligatorios, números enteros no negativos y que no se repita la combinación nombre + marca.


## Framework CSS: Tailwind CSS v4

- Instalado con `npm install tailwindcss @tailwindcss/vite`; `vite.config.js` agrega el plugin `tailwindcss()`.
- `src/index.css` es el único archivo CSS (~60 líneas; antes `App.css` tenía 325):
  - `@import "tailwindcss";`
  - `@theme` con **todas** las variables de color del sitio (marca, neutros y estados de stock `ok` / `alerta` / `peligro`). Ningún componente usa colores sueltos.
  - `@layer components` con las 3 clases que se repetían en varias páginas: `.btn-primario`, `.btn-secundario` y `.control` (inputs y selects).
- El resto de los estilos va en cada componente con clases utilitarias: cada componente lleva sus propios estilos y no hay nombres de clase globales que puedan chocar.
- Diseño responsivo con `sm:` y `md:` (tarjetas 2→4 columnas, header en columna en celular, tablas con scroll horizontal propio).

> En Tailwind v4 ya no se usa `tailwind.config.js` ni `npx tailwindcss init` (eso era la v3, que muestra la guía con create-react-app). La personalización que antes iba en `theme.extend.colors` ahora va en `@theme`.

## Mejoras aplicadas desde la retroalimentación de la semana 1

| Observación | Qué se hizo |
|---|---|
| 1. Inicio concentraba estado, filtros, cálculos, tarjetas y tabla | Se dividió en `components/inicio/TarjetaResumen`, `FiltrosInventario` y `TablaProductos`. `Inicio.jsx` solo maneja los filtros y reparte los datos. |
| 2. Tarjetas repetidas | `TarjetaResumen` recibe `numero`, `etiqueta` y `variante`. Inicio define un arreglo `indicadores` y lo recorre con `map`: agregar un indicador es agregar un objeto. |
| 3. Criterios de stock duplicados | `utils/stock.js` centraliza `estadoStock`, `resumenInventario` (los contadores usan la misma regla que los badges) y `varianteTienda` con la constante `UMBRAL_TIENDA_CRITICA`, que antes estaba escrita como `> 3` en DetalleTienda. Los colores se resuelven en un solo componente, `Badge`. |
| 4. Layout y rutas mezclados en App.jsx | `layouts/Layout.jsx` (Header + `<Outlet />` + MenuInferior) y `routes/AppRoutes.jsx` con rutas anidadas. Además se implementó la carga diferida: todas las páginas excepto Inicio se cargan con `lazy` + `Suspense`, y cada una genera su propio archivo JS en el build. |
| 5. CSS global de 325 líneas | Se reemplazó por Tailwind: variables en `@theme`, 3 clases reutilizables y estilos por componente. También se creó `TituloPagina` para el encabezado que se repetía en todas las páginas. |

## Estructura

```
src/
├── App.jsx                  # solo proveedores: InventarioProvider + Router
├── index.css                # Tailwind + variables del tema + clases reutilizables
├── routes/
│   └── AppRoutes.jsx        # todas las rutas (anidadas en Layout, con lazy)
├── layouts/
│   └── Layout.jsx           # Header + <Outlet /> + MenuInferior + Suspense
├── context/                 # estado global
│   ├── inventarioReducer.js
│   ├── InventarioContext.js
│   └── InventarioProvider.jsx
├── components/
│   ├── Header.jsx           # logo + menú de inventario
│   ├── MenuInferior.jsx
│   ├── TituloPagina.jsx     # encabezado común de las páginas
│   ├── Badge.jsx            # etiqueta de color por variante
│   ├── BadgeEstado.jsx      # badge del estado de stock de un artículo
│   └── inicio/
│       ├── TarjetaResumen.jsx
│       ├── FiltrosInventario.jsx
│       └── TablaProductos.jsx
├── data/                    # datos de prueba
│   ├── productos.js
│   ├── tipos.js
│   ├── tiendas.js
│   └── preguntas.js
├── pages/
│   ├── Inicio.jsx
│   ├── ListadoArticulos.jsx
│   ├── AgregarArticulo.jsx
│   ├── NuestrasTiendas.jsx
│   ├── DetalleTienda.jsx
│   ├── PreguntasFrecuentes.jsx
│   └── NoEncontrado.jsx
└── utils/
    └── stock.js             # criterios de stock compartidos y formato de precio
```

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abrir la URL que muestra la terminal (normalmente http://localhost:5173/SuperFresco/).

## Despliegue en GitHub Pages

Sitio publicado: https://evatorc.github.io/SuperFresco/

```bash
npm run deploy
```

Esto hace el build y sube la carpeta `dist` a la rama `gh-pages`.

Configuración que lo hace funcionar:
- `vite.config.js` → `const REPO = 'SuperFresco'` y `base: '/${REPO}/'` (el sitio no está en la raíz del dominio). Si el repositorio cambia de nombre, se cambia solo esa constante (y `homepage` en `package.json`).
- `App.jsx` → `<Router basename={import.meta.env.BASE_URL}>` para que las rutas de React Router incluyan `/SuperFresco/`.
- `postbuild` copia `index.html` a `404.html`: GitHub Pages no conoce las rutas de React, así que al recargar `/SuperFresco/articulos/nuevo` entrega el 404.html, que carga la app y React Router muestra la página correcta.
