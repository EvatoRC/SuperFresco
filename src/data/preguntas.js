const preguntas = [
  {
    pregunta: '¿Qué significa que un producto esté en "Stock bajo"?',
    respuesta:
      'Que su cantidad actual es menor o igual al stock mínimo definido para ese producto. En ese caso conviene generar una orden de reposición.',
  },
  {
    pregunta: '¿Cada cuánto se actualiza el inventario?',
    respuesta:
      'El inventario se actualiza cada vez que una sucursal registra una venta o una recepción de mercadería. En esta versión los datos son de prueba.',
  },
  {
    pregunta: '¿Puedo ver el stock de una sucursal en particular?',
    respuesta:
      'Sí. En "Nuestras tiendas" puedes elegir una sucursal y ver su detalle, incluida la cantidad de productos con stock bajo.',
  },
  {
    pregunta: '¿Quién puede modificar el stock mínimo de un producto?',
    respuesta:
      'Solo el encargado de cada sucursal o el área de abastecimiento. Los demás usuarios pueden consultar, pero no editar.',
  },
  {
    pregunta: '¿Qué hago si un producto aparece "Sin stock"?',
    respuesta:
      'Revisa si hay unidades en bodega que no se hayan ingresado al sistema. Si no hay, avisa al encargado de la sucursal para solicitar reposición urgente.',
  },
]

export default preguntas
