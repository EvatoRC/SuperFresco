import { useRef, useState } from 'react'
import { Link } from 'react-router'
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

// ===== reglas para nombre y marca =====
// \p{L} = cualquier letra, con tildes y ñ incluidas (por eso la bandera u)
// \p{N} = cualquier digito
// Debe empezar con letra o numero y despues admite los signos tipicos de nombres comerciales:
// espacio . , ' & ( ) / % + -   ->  "Yogurt natural 4 un.", "Manzana roja (kg)", "L'Oréal", "Coca-Cola", "3M"
const PATRON_TEXTO = /^[\p{L}\p{N}][\p{L}\p{N} .,'&()/%+-]*$/u
const TIENE_LETRA = /\p{L}/u
const LARGOS = { nombre: { min: 3, max: 60 }, marca: { min: 2, max: 40 } }

// quita espacios al inicio/final y deja uno solo entre palabras ("Leche   entera" -> "Leche entera")
const normalizar = (texto) => texto.trim().replace(/\s+/g, ' ')

// devuelve el mensaje de error de un campo de texto, o undefined si esta bien
function validarTexto(valor, campo, etiqueta) {
  const { min, max } = LARGOS[campo]
  if (valor.length === 0) return `Ingresa ${etiqueta}.`
  if (valor.length < min || valor.length > max) return `Debe tener entre ${min} y ${max} caracteres.`
  if (!PATRON_TEXTO.test(valor)) return "Debe comenzar con una letra o número y solo admite letras, números, espacios y . , ' & ( ) / % + -"
  if (!TIENE_LETRA.test(valor)) return 'Debe incluir al menos una letra.'
  return undefined
}

// revisa los campos y devuelve un objeto { campo: 'mensaje de error' }
function validar(form, articulos) {
  const errores = {}
  const nombre = normalizar(form.nombre)
  const marca = normalizar(form.marca)

  const errorNombre = validarTexto(nombre, 'nombre', 'el nombre del producto')
  if (errorNombre) errores.nombre = errorNombre
  const errorMarca = validarTexto(marca, 'marca', 'la marca del producto')
  if (errorMarca) errores.marca = errorMarca
  // tipos.includes: aunque alguien manipule el select, solo se aceptan categorias de data/tipos.js
  if (!tipos.includes(form.tipo)) errores.tipo = 'Selecciona el tipo de producto.'

  // los campos numericos: obligatorios, enteros y no negativos
  const numericos = { stock: 'El stock', stockMinimo: 'El stock mínimo', precio: 'El precio' }
  Object.entries(numericos).forEach(([campo, etiqueta]) => {
    const valor = Number(form[campo])
    if (form[campo] === '' || !Number.isInteger(valor) || valor < 0) {
      errores[campo] = `${etiqueta} debe ser un número entero mayor o igual a 0.`
    }
  })
  // el precio ademas no puede ser 0: le dejo un mensaje propio que diga la regla correcta
  if (errores.precio || Number(form.precio) === 0) errores.precio = 'El precio debe ser un número entero mayor a 0.'

  // evito duplicados: mismo nombre y misma marca (sin importar mayusculas)
  const repetido = articulos.some(
    (a) => a.nombre.toLowerCase() === nombre.toLowerCase() && a.marca.toLowerCase() === marca.toLowerCase(),
  )
  if (!errores.nombre && repetido) errores.nombre = 'Ya existe un artículo con ese nombre y esa marca.'

  return errores
}

// clase base .control (index.css); si hay error el borde se pone rojo
const claseInput = (hayError) => `control ${hayError ? 'border-rojo focus:border-rojo focus:ring-rojo/30' : ''}`

// orden de los campos en pantalla: al enviar con errores el foco va al primero que falle
const ORDEN_CAMPOS = ['nombre', 'marca', 'tipo', 'precio', 'stock', 'stockMinimo']

// atributos de accesibilidad de cada input:
//   aria-invalid      -> el lector de pantalla anuncia "no valido"
//   aria-describedby  -> conecta el input con su mensaje de error (id "<campo>-error"),
//                        asi al llegar al campo tambien se lee que es lo que esta mal
const ariaCampo = (campo, error) => ({
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${campo}-error` : undefined,
})

// componente reutilizable: label + input + mensaje de error.
// va FUERA de AgregarArticulo; si lo defino adentro se vuelve a crear en cada render
// y el input pierde el foco cada vez que se escribe una letra
function Campo({ id, etiqueta, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">{etiqueta}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-rojo">{error}</p>}
    </div>
  )
}

function AgregarArticulo() {
  const { articulos, agregarArticulo } = useInventario()

  // estado local: solo le importa a este formulario, por eso no va en el contexto
  const [form, setForm] = useState(formularioVacio)
  const [errores, setErrores] = useState({})
  const [ultimoAgregado, setUltimoAgregado] = useState(null)
  // referencia al <form> para poder mover el foco al primer campo con error
  const formRef = useRef(null)

  // un solo manejador para todos los inputs, usando el atributo name.
  // Forma funcional (prev => ...): React entrega el valor MAS RECIENTE del estado,
  // asi dos actualizaciones seguidas no se pisan aunque React las agrupe en un solo render
  const manejarCambio = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // si el campo tenia error, lo borro mientras el usuario corrige
    setErrores((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  const manejarEnvio = (e) => {
    e.preventDefault() // evita que el formulario recargue la pagina

    const nuevosErrores = validar(form, articulos)
    setErrores(nuevosErrores)
    const primeroConError = ORDEN_CAMPOS.find((campo) => nuevosErrores[campo])
    if (primeroConError) {
      // navegacion asistida: quien usa teclado o lector de pantalla llega directo al problema
      formRef.current?.elements[primeroConError]?.focus()
      return
    }

    const articulo = {
      nombre: normalizar(form.nombre),
      marca: normalizar(form.marca),
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

      <form ref={formRef} onSubmit={manejarEnvio} noValidate className="rounded-lg border border-borde bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="nombre" etiqueta="Nombre del producto" error={errores.nombre}>
            <input id="nombre" name="nombre" type="text" maxLength={LARGOS.nombre.max} value={form.nombre} onChange={manejarCambio}
              placeholder="Ej: Mantequilla 250g" className={claseInput(errores.nombre)} {...ariaCampo('nombre', errores.nombre)} />
          </Campo>

          <Campo id="marca" etiqueta="Marca" error={errores.marca}>
            <input id="marca" name="marca" type="text" maxLength={LARGOS.marca.max} value={form.marca} onChange={manejarCambio}
              placeholder="Ej: Colun" className={claseInput(errores.marca)} {...ariaCampo('marca', errores.marca)} />
          </Campo>

          <Campo id="tipo" etiqueta="Tipo de producto" error={errores.tipo}>
            <select id="tipo" name="tipo" value={form.tipo} onChange={manejarCambio} className={claseInput(errores.tipo)} {...ariaCampo('tipo', errores.tipo)}>
              <option value="">Selecciona un tipo…</option>
              {tipos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Campo>

          <Campo id="precio" etiqueta="Precio (CLP)" error={errores.precio}>
            <input id="precio" name="precio" type="number" min="0" step="1" value={form.precio} onChange={manejarCambio}
              placeholder="Ej: 2490" className={claseInput(errores.precio)} {...ariaCampo('precio', errores.precio)} />
          </Campo>

          <Campo id="stock" etiqueta="Stock actual (unidades)" error={errores.stock}>
            <input id="stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={manejarCambio}
              placeholder="Ej: 50" className={claseInput(errores.stock)} {...ariaCampo('stock', errores.stock)} />
          </Campo>

          <Campo id="stockMinimo" etiqueta="Stock mínimo" error={errores.stockMinimo}>
            <input id="stockMinimo" name="stockMinimo" type="number" min="0" step="1" value={form.stockMinimo} onChange={manejarCambio}
              placeholder="Ej: 20" className={claseInput(errores.stockMinimo)} {...ariaCampo('stockMinimo', errores.stockMinimo)} />
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
