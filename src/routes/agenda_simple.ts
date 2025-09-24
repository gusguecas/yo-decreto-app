import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

export const agendaRoutes = new Hono<{ Bindings: Bindings }>()

// Obtener eventos de la agenda
agendaRoutes.get('/', async (c) => {
  return c.json({
    success: true,
    data: []
  })
})

// Crear nuevo evento
agendaRoutes.post('/', async (c) => {
  return c.json({
    success: true,
    data: {
      id: Math.floor(Math.random() * 1000),
      message: 'Evento creado exitosamente'
    }
  })
})

// Actualizar evento
agendaRoutes.put('/:id', async (c) => {
  return c.json({ success: true })
})

// Eliminar evento
agendaRoutes.delete('/:id', async (c) => {
  return c.json({ success: true })
})