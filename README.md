# SuperFresco – Gestión de Inventario

Sitio de gestión de inventario para un supermercado hecho con **React + Vite**, **React Router**, **estado global con Context API + useReducer** y **Tailwind CSS**.

- Semana 1: "Utilizando tecnologías avanzadas de React en sitios web" (React Router).
- Semana 2: "Implementando gestión de estado en componentes frontend con React" (estado global + framework CSS).
- Semana 3: "Desarrollando sitios web con React avanzado" (filtro por categoría, detalle de artículo y carrito de compras conectado al inventario).

## Páginas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Inicio | Inventario general: resumen, buscador por nombre/marca, filtro por tipo y estado del stock |
| `/tiendas` | Nuestras tiendas | Listado de sucursales |
| `/tiendas/:id` | Detalle de tienda | Ruta dinámica, lee el `id` con `useParams` |
| `/preguntas-frecuentes` | Preguntas frecuentes | Acordeón de dudas sobre el sistema |
| `/articulos` | **Listado de artículos** (sem. 2 y 3) | Tabla con todos los artículos, **filtro por categoría** (sem. 3), columna "En carrito"; clic en una fila abre el detalle; permite eliminar |
| `/articulos/nuevo` | **Agregar artículo** (sem. 2) | Formulario con validación para ingresar artículos |
| `/articulos/:id` | **Detalle de artículo** (sem. 3) | Ruta dinámica: ficha del artículo, selector de cantidad y botón "Agregar al carrito" |
| `/carrito` | **Carrito de compras** (sem. 3) | Lista lo agregado; aumentar / disminuir / quitar, vaciar y confirmar compra. Cada cambio actualiza el inventario |
| `*` | 404 | Cualquier ruta que no exista |

Navegación:
- **Menú inferior** fijo (`MenuInferior.jsx`): Inicio, Nuestras tiendas, Preguntas frecuentes.
- **Menú de inventario** en el header (`Header.jsx`): Listado de artículos, Agregar artículo y **Carrito** (sem. 3, con contador de unidades), más un contador de artículos que se actualiza solo.

## Estado global (semana 2)

La lista de artículos vive en un estado global creado con `createContext` + `useReducer`:

```
src/context/
├── inventarioReducer.js     # ACCIONES de inventario y carrito, moverUnidades() y el reducer
├── persistencia.js          # localStorage con versión, migración y validación de estructura
├── InventarioContext.js     # createContext + hook useInventario()
└── InventarioProvider.jsx   # useReducer + useEffect (guarda con persistencia.js) y el Provider
```

- `App.jsx` envuelve toda la app con `<InventarioProvider>` (por fuera del Router).
- Cada artículo tiene: `id`, `nombre`, `marca`, `tipo`, `stock`, `stockMinimo`, `precio`. El `id` sale de un contador `siguienteId` que se guarda con el estado y nunca baja.
- Cualquier componente accede con `const { articulos, carrito, agregarArticulo, agregarAlCarrito } = useInventario()`.
- Lo usan **cuatro** lugares: Inicio (resumen y tabla), Listado, Agregar artículo y el contador del Header. Al agregar un artículo los cuatro se actualizan sin recargar.
- Se usa `useReducer` (y no solo `useState`) porque el estado tiene varias acciones distintas y así la lógica de cambio queda centralizada en el reducer.
- Los cambios se guardan en `localStorage` para no perderlos al recargar. El botón "Restablecer datos de prueba" del listado vuelve a los datos iniciales.

El formulario usa estado **local** (`useState`) para los campos y errores, porque solo le importa a ese componente. Valida nombre y marca con expresión regular y largo, números enteros no negativos, precio mayor a 0 y que no se repita la combinación nombre + marca.


## Semana 3: filtro, detalle y carrito

### 1. Filtro por categoría (`ListadoArticulos.jsx` + `components/articulos/FiltroCategoria.jsx`)
- Botones por categoría con la cantidad de artículos de cada una (`Todas (12)`, `Lácteos (3)`, …). Las categorías salen del propio inventario (`utils/categorias.js → categoriasConConteo`), así una categoría nueva aparece sola.
- La categoría elegida es **estado de React guardado en la URL** con `useSearchParams` (`/articulos?categoria=Lácteos`). Al cambiarla React vuelve a dibujar igual que con `useState`, pero además el filtro se mantiene al volver desde el detalle y el link se puede compartir.
- **No se pierden los datos originales**: la lista filtrada se *calcula* en cada render con `filtrarPorCategoria(articulos, categoria)`, que usa `filter` (devuelve un arreglo nuevo). El arreglo `articulos` del estado global nunca se reemplaza ni se modifica; al volver a "Todas" están los 12.
- El mismo util se reutiliza en el filtro de la página de Inicio.

### 2. Detalle de artículo (`pages/DetalleArticulo.jsx`)
- Ruta dinámica `/articulos/:id` (cargada con `lazy`). Se llega haciendo clic en cualquier parte de la fila del listado (o en el nombre, que es un `Link` para navegar con teclado), o desde el nombre en la tabla de Inicio y en el carrito.
- Muestra precio, estado de stock, código, marca, categoría, stock disponible, stock mínimo y cuántas unidades hay en el carrito.
- Selector de cantidad (`components/SelectorCantidad.jsx`, reutilizable) limitado entre 1 y el stock disponible. "Agregar al carrito" descuenta del inventario en ese mismo momento.
- Si el artículo no tiene stock el botón no aparece; si el `id` no existe se muestra un aviso en vez de romper la página.

### 3. Carrito de compras (`pages/Carrito.jsx` + `components/carrito/ItemCarrito.jsx`)
- Lista cada artículo con precio unitario, subtotal y "Quedan N en inventario".
- **+** toma una unidad más del inventario (se deshabilita cuando el stock llega a 0); **−** devuelve una (mínimo 1); **Quitar** devuelve todas las unidades de ese artículo.
- Resumen con artículos distintos, unidades y total. **Vaciar carrito** (con confirmación) devuelve todo al inventario; **Confirmar compra** vacía el carrito y deja el stock descontado.

### Cómo se mantiene sincronizado el inventario
Inventario y carrito viven en el **mismo reducer**, así una sola acción actualiza ambos y nunca queda uno cambiado y el otro no:

```js
{ articulos: [{ id, nombre, marca, tipo, stock, stockMinimo, precio }],
  carrito:   [{ id, cantidad }] }   // solo id y cantidad; nombre y precio se leen de articulos
```

Todas las acciones del carrito pasan por una sola función, `moverUnidades(estado, id, delta)`, que mueve unidades entre `stock` y `carrito` y rechaza el movimiento si no hay stock o no hay tantas unidades en el carrito (devuelve el mismo estado). Así se cumple siempre que **stock + cantidad en carrito = unidades totales del artículo**.

| Acción | Efecto |
|---|---|
| `AGREGAR_AL_CARRITO` | `moverUnidades(id, +cantidad)` |
| `AUMENTAR_CANTIDAD` / `DISMINUIR_CANTIDAD` | `±1` (no baja de 1) |
| `QUITAR_DEL_CARRITO` | devuelve todo lo de ese artículo |
| `VACIAR_CARRITO` | devuelve todo al inventario |
| `CONFIRMAR_COMPRA` | vacía el carrito sin devolver stock |
| `ELIMINAR_ARTICULO` | también lo saca del carrito |
| `REINICIAR_INVENTARIO` | datos de prueba y carrito vacío |

Se sigue guardando en `localStorage` (misma clave), ahora con número de versión; ver "Persistencia versionada" más abajo.

## Framework CSS: Tailwind CSS v4

- Instalado con `npm install tailwindcss @tailwindcss/vite`; `vite.config.js` agrega el plugin `tailwindcss()`.
- `src/index.css` es el único archivo CSS (~60 líneas; antes `App.css` tenía 325):
  - `@import "tailwindcss";`
  - `@theme` con **todas** las variables de color del sitio (marca, neutros y estados de stock `ok` / `alerta` / `peligro`). Ningún componente usa colores sueltos.
  - `@layer components` con las 3 clases que se repetían en varias páginas: `.btn-primario`, `.btn-secundario` y `.control` (inputs y selects).
- El resto de los estilos va en cada componente con clases utilitarias: cada componente lleva sus propios estilos y no hay nombres de clase globales que puedan chocar.
- Diseño responsivo con `sm:` y `md:` (tarjetas 2→4 columnas, header en columna en celular, tablas con scroll horizontal propio).

> En Tailwind v4 ya no se usa `tailwind.config.js` ni `npx tailwindcss init` (eso era la v3, que muestra la guía con create-react-app). La personalización que antes iba en `theme.extend.colors` ahora va en `@theme`.

## Mejoras aplicadas desde la retroalimentación de la semana 2

| Observación | Qué se hizo | Dónde |
|---|---|---|
| 1. Precisar validación de nombre y marca | Expresión regular con `\p{L}` y `\p{N}` (bandera `u`): acepta tildes, ñ, números y los signos habituales en nombres comerciales (`. , ' & ( ) / % + -`), debe empezar con letra o número e incluir al menos una letra. Largo 3–60 (nombre) y 2–40 (marca). Los espacios repetidos se normalizan antes de validar y guardar. Acepta "Yogurt natural 4 un.", "Manzana roja (kg)", "L'Oréal", "Coca-Cola", "3M"; rechaza "-Leche", "Leche!", "&lt;script&gt;". | `pages/AgregarArticulo.jsx` |
| 2. `react-router-dom` en React Router 7 | Se reemplazó por `react-router` (en v7 `react-router-dom` solo reexporta ese paquete). Todas las importaciones usan `'react-router'`. | `package.json`, imports |
| 3. Tablas de Inicio y Listado repetidas | `TablaArticulos` (configurable por columnas) + catálogo `COLUMNAS` con el formato de cada dato (precio, stock, badge, link al detalle). Inicio y Listado eligen columnas; el Listado agrega las propias ("En carrito", "Acciones"). Se eliminó `TablaProductos`. | `components/articulos/TablaArticulos.jsx`, `columnas.jsx` |
| 4. Id "máximo + 1" reutilizable | Contador `siguienteId` guardado en el estado: solo sube. Si se elimina todo y se agrega un artículo, no recibe el #1 de nuevo. "Restablecer datos de prueba" recupera los ids originales del set de prueba pero no baja el contador. | `context/inventarioReducer.js` |
| 5. Validar estructura y versión de lo guardado | Se guarda `{ version: 3, articulos, carrito, siguienteId }`. Al cargar: JSON roto → datos de prueba; formato de semana 2 (arreglo) → se migra; estructura inválida (tipos de dato, categoría inexistente, ids repetidos, carrito que apunta a un id que no existe, contador inconsistente) o versión desconocida → datos de prueba y aviso en consola. | `context/persistencia.js` |
| 6. Tipos con dos orígenes | `data/tipos.js` es la única fuente: la usan el formulario, el filtro del Listado y el de Inicio. Las categorías sin artículos se muestran con `(0)` y deshabilitadas. El formulario y la persistencia rechazan categorías que no estén en la lista. | `utils/categorias.js` |
| 7. Actualizaciones funcionales | `setForm(prev => ({ ...prev, [name]: value }))` y lo mismo para `setErrores`. | `pages/AgregarArticulo.jsx` |
| 8. Errores accesibles | Cada mensaje tiene `id="<campo>-error"`; el input lleva `aria-invalid` y `aria-describedby` apuntando a ese id cuando hay error. Al enviar con errores el foco se mueve al primer campo inválido. | `pages/AgregarArticulo.jsx` |

### Escenarios límite y comportamiento esperado

| Escenario | Qué pasa | Por qué |
|---|---|---|
| **Inventario vacío** | Listado e Inicio muestran un aviso con "Cargar datos de prueba"; el carrito queda vacío porque al eliminar un artículo también sale del carrito. El siguiente artículo agregado no reutiliza ids. | `ELIMINAR` limpia el carrito; `siguienteId` no baja. |
| **Datos guardados incompatibles** | Se migran si son de la semana 2; si están corruptos o no cumplen la estructura, se cargan los datos de prueba sin romper la app. | `cargarEstado` valida antes de entregar el estado al reducer, así ningún componente recibe datos inválidos. |
| **Cambios rápidos** (muchos clics en "+") | El stock nunca queda negativo ni el carrito supera lo disponible. | Cada clic es un `dispatch`; React aplica las acciones en orden y el reducer siempre recibe el estado más reciente, valida y, si no hay stock, devuelve el mismo estado. En el formulario, la forma `prev => ...` cumple el mismo rol. |
| **Filtro sobre una categoría que se queda sin artículos** | Se muestra "No hay artículos en la categoría…" con un botón para ver todas; el botón de esa categoría sigue activo para poder salir. | La categoría está en la URL; la lista se recalcula en cada render. |
| **Id inexistente en `/articulos/:id`** | Página "Artículo no encontrado" con link al listado. | El detalle busca el id en el estado y no asume que existe. |
| **Navegación asistida** (teclado / lector de pantalla) | El nombre de cada fila es un `Link` enfocable; los botones de categoría usan `aria-pressed`; el selector de cantidad anuncia el valor con `aria-live`; los errores del formulario están asociados a su campo y reciben el foco. | La fila clickeable es un atajo para mouse, no la única vía. |

## Mejoras aplicadas desde la retroalimentación de la semana 1

| Observación | Qué se hizo |
|---|---|
| 1. Inicio concentraba estado, filtros, cálculos, tarjetas y tabla | Se dividió en `components/inicio/TarjetaResumen`, `FiltrosInventario` y `TablaProductos` (en semana 3 reemplazada por la tabla compartida `TablaArticulos`). `Inicio.jsx` solo maneja los filtros y reparte los datos. |
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
│   ├── persistencia.js      # versión, migración y validación de localStorage
│   ├── InventarioContext.js
│   └── InventarioProvider.jsx
├── components/
│   ├── Header.jsx           # logo + menú de inventario
│   ├── MenuInferior.jsx
│   ├── TituloPagina.jsx     # encabezado común de las páginas
│   ├── Badge.jsx            # etiqueta de color por variante
│   ├── BadgeEstado.jsx      # badge del estado de stock de un artículo
│   ├── SelectorCantidad.jsx # control − N + (detalle y carrito)        [sem. 3]
│   ├── EstadoVacio.jsx      # aviso de lista vacía reutilizable          [sem. 3]
│   ├── articulos/
│   │   ├── FiltroCategoria.jsx                                         [sem. 3]
│   │   ├── TablaArticulos.jsx  # tabla configurable (Inicio y Listado)  [sem. 3]
│   │   └── columnas.jsx        # catálogo de columnas compartidas        [sem. 3]
│   ├── carrito/
│   │   └── ItemCarrito.jsx                                             [sem. 3]
│   └── inicio/
│       ├── TarjetaResumen.jsx
│       └── FiltrosInventario.jsx
├── data/                    # datos de prueba
│   ├── productos.js
│   ├── tipos.js             # única fuente de categorías
│   ├── tiendas.js
│   └── preguntas.js
├── pages/
│   ├── Inicio.jsx
│   ├── ListadoArticulos.jsx
│   ├── AgregarArticulo.jsx
│   ├── DetalleArticulo.jsx  # /articulos/:id                         [sem. 3]
│   ├── Carrito.jsx          # /carrito                               [sem. 3]
│   ├── NuestrasTiendas.jsx
│   ├── DetalleTienda.jsx
│   ├── PreguntasFrecuentes.jsx
│   └── NoEncontrado.jsx
└── utils/
    ├── stock.js             # criterios de stock compartidos y formato de precio
    ├── categorias.js        # categorías con conteo y filtro (no muta)  [sem. 3]
    └── carrito.js           # items con subtotal, total y unidades      [sem. 3]
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
