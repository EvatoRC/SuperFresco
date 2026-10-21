// datos de prueba del inventario (despues podrian venir de una API)
// stockMinimo = desde cuanto se considera que hay que reponer
const productos = [
  { id: 1, nombre: 'Leche entera 1L', categoria: 'Lácteos', stock: 120, stockMinimo: 40, precio: 1190 },
  { id: 2, nombre: 'Yogurt natural 4 un.', categoria: 'Lácteos', stock: 18, stockMinimo: 30, precio: 1650 },
  { id: 3, nombre: 'Queso gauda 250g', categoria: 'Lácteos', stock: 0, stockMinimo: 15, precio: 3290 },
  { id: 4, nombre: 'Pan de molde integral', categoria: 'Panadería', stock: 45, stockMinimo: 20, precio: 2190 },
  { id: 5, nombre: 'Arroz grado 1 1kg', categoria: 'Despensa', stock: 200, stockMinimo: 60, precio: 1390 },
  { id: 6, nombre: 'Fideos spaghetti 400g', categoria: 'Despensa', stock: 25, stockMinimo: 50, precio: 890 },
  { id: 7, nombre: 'Aceite maravilla 1L', categoria: 'Despensa', stock: 64, stockMinimo: 30, precio: 2490 },
  { id: 8, nombre: 'Manzana roja (kg)', categoria: 'Frutas y verduras', stock: 80, stockMinimo: 25, precio: 1490 },
  { id: 9, nombre: 'Palta hass (kg)', categoria: 'Frutas y verduras', stock: 12, stockMinimo: 20, precio: 4990 },
  { id: 10, nombre: 'Detergente líquido 3L', categoria: 'Limpieza', stock: 33, stockMinimo: 10, precio: 7990 },
  { id: 11, nombre: 'Papel higiénico 12 rollos', categoria: 'Limpieza', stock: 0, stockMinimo: 25, precio: 6490 },
  { id: 12, nombre: 'Agua mineral 1.5L', categoria: 'Bebidas', stock: 150, stockMinimo: 50, precio: 790 },
]

export default productos
