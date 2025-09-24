import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

export const progresoRoutes = new Hono<{ Bindings: Bindings }>()

// Obtener estadísticas de progreso
progresoRoutes.get('/', async (c) => {
  return c.json({
    success: true,
    data: {
      decretosCompletados: 0,
      accionesRealizadas: 0,
      rachaActual: 0,
      progresoSemanal: [],
      areasProgreso: {
        empresarial: 0,
        material: 0,
        humano: 0
      }
    }
  })
})