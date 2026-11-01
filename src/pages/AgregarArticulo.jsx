import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInventario } from '../context/InventarioContext'
import tipos from '../data/tipos'
import TituloPagina from '../components/TituloPagina'

// estado inicial del formulario (los numeros van como texto porque vienen de un input)
const formularioVacio = {
  nombre: '',
  marca: '',
  tipo: '',
  stock: '',
  stockMinimo: '',
  precio: '',
}

// revisa los campos y devuelve un objeto { campo: 'mensaje de error' }
function validar(form, articulos) {
  const errores = {}

  if (form.nombre.trim().length < 3) errores.nombre = 'Ingresa un nombre de al menos 3 caracteres.'
  if (!form.marca.trim()) errores.marca = 'Ingresa la marca del producto.'
  if (!form.tipo) errores.tipo = 'Selecciona el tipo de producto.'

  // los campos numericos: obligatorios, enteros y no negativos
  const numericos = { stock: 'El stock', stockMinimo: 'El stock mínimo', precio: 'El precio' }
  Object.entries(numericos).forEach(([campo, etiqueta]) => {
    const valor = Number(form[campo])
    if (form[campo] === '' || !Number.isInteger(valor) || valor < 0) {
      errores[campo] = `${etiqueta} debe ser un número entero mayor o igual a 0.`
    }
  })
  if (!errores.precio && Number(form.precio) === 0) errores.precio = 'El precio debe ser mayor a 0.'

  // evito duplicados: mismo nombre y misma marca (sin importar mayusculas)
  const repetido = articulos.some(
    (a) =>
      a.nombre.toLowerCase() === form.nombre.trim().toLowerCase() &&
      a.marca.toLowerCase() === form.marca.trim().toLowerCase(),
  )
  if (repetido) errores.nombre = 'Ya existe un artículo con ese nombre y esa marca.'

  return errores
}

// clase base .control (index.css); si hay error el borde se pone rojo
const claseInput = (hayError) => `control ${hayError ? 'border-rojo focus:border-rojo focus:ring-rojo/30' : ''}`

// componente reutilizable: label + input + mensaje de error.
// va FUERA de AgregarArticulo; si lo defino adentro se vuelve a crear en cada render
// y el input pierde el foco cada vez que se escribe una letra
function Campo({ id, etiqueta, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">{etiqueta}</label>
      {children}
      {error && <p className="mt-1 text-sm text-rojo">{error}</p>}
    </div>
  )
}

function AgregarArticulo() {
  const { articulos, agregarArticulo } = useInventario()

  // estado local: solo le importa a este formulario, por eso no va en el contexto
  const [form, setForm] = useState(formularioVacio)
  const [errores, setErrores] = useState({})
  const [ultimoAgregado, setUltimoAgregado] = useState(null)

  // un solo manejador para todos los inputs, usando el atributo name
  const manejarCambio = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    // si el campo tenia error, lo borro mientras el usuario corrige
    if (errores[name]) setErrores({ ...errores, [name]: undefined })
  }

  const manejarEnvio = (e) => {
    e.preventDefault() // evita que el formulario recargue la pagina

    const nuevosErrores = validar(form, articulos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    const articulo = {
      nombre: form.nombre.trim(),
      marca: form.marca.trim(),
      tipo: form.tipo,
      stock: Number(form.stock),
      stockMinimo: Number(form.stockMinimo),
      precio: Number(form.precio),
    }

    // aqui se modifica el estado global: el listado, el inicio y el header se actualizan solos
    agregarArticulo(articulo)
    setUltimoAgregado(articulo)
    setForm(formularioVacio)
  }

  return (
    <section>
      <TituloPagina titulo="Agregar artículo" subtitulo="Ingresa un nuevo producto al inventario del supermercado." />

      {ultimoAgregado && (
        <div role="status" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-verde/30 bg-verde-claro px-4 py-3 text-verde-oscuro">
          <span>
            ✅ Se agregó <strong>{ultimoAgregado.nombre}</strong> ({ultimoAgregado.marca}) al inventario.
          </span>
          <Link to="/articulos" className="font-semibold underline underline-offset-2">Ver listado</Link>
        </div>
      )}

      <form onSubmit={manejarEnvio} noValidate className="rounded-lg border border-borde bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="nombre" etiqueta="Nombre del producto" error={errores.nombre}>
            <input id="nombre" name="nombre" type="text" value={form.nombre} onChange={manejarCambio}
              placeholder="Ej: Mantequilla 250g" className={claseInput(errores.nombre)} />
          </Campo>

          <Campo id="marca" etiqueta="Marca" error={errores.marca}>
            <input id="marca" name="marca" type="text" value={form.marca} onChange={manejarCambio}
              placeholder="Ej: Colun" className={claseInput(errores.marca)} />
          </Campo>

          <Campo id="tipo" etiqueta="Tipo de producto" error={errores.tipo}>
            <select id="tipo" name="tipo" value={form.tipo} onChange={manejarCambio} className={claseInput(errores.tipo)}>
              <option value="">Selecciona un tipo…</option>
              {tipos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Campo>

          <Campo id="precio" etiqueta="Precio (CLP)" error={errores.precio}>
            <input id="precio" name="precio" type="number" min="0" step="1" value={form.precio} onChange={manejarCambio}
              placeholder="Ej: 2490" className={claseInput(errores.precio)} />
          </Campo>

          <Campo id="stock" etiqueta="Stock actual (unidades)" error={errores.stock}>
            <input id="stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={manejarCambio}
              placeholder="Ej: 50" className={claseInput(errores.stock)} />
          </Campo>

          <Campo id="stockMinimo" etiqueta="Stock mínimo" error={errores.stockMinimo}>
            <input id="stockMinimo" name="stockMinimo" type="number" min="0" step="1" value={form.stockMinimo} onChange={manejarCambio}
              placeholder="Ej: 20" className={claseInput(errores.stockMinimo)} />
          </Campo>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" className="btn-primario">
            Guardar artículo
          </button>
          <button
            type="button"
            onClick={() => { setForm(formularioVacio); setErrores({}) }}
            className="btn-secundario"
          >
            Limpiar
          </button>
        </div>
      </form>
    </section>
  )
}

export default AgregarArticulo
