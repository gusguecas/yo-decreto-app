import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

export const practicaRoutes = new Hono<{ Bindings: Bindings }>()

// Obtener rutinas y prácticas
practicaRoutes.get('/rutinas', async (c) => {
  return c.json({
    success: true,
    data: []
  })
})

// Crear nueva rutina
practicaRoutes.post('/rutinas', async (c) => {
  return c.json({
    success: true,
    data: {
      id: Math.floor(Math.random() * 1000),
      message: 'Rutina creada exitosamente'
    }
  })
})

// Obtener ejercicios
practicaRoutes.get('/ejercicios', async (c) => {
  return c.json({
    success: true,
    data: []
  })
})

// Crear nuevo ejercicio
practicaRoutes.post('/ejercicios', async (c) => {
  return c.json({
    success: true,
    data: {
      id: Math.floor(Math.random() * 1000),
      message: 'Ejercicio creado exitosamente'
    }
  })
})