/**
 * Rutas API para el Sistema de Rutina Diaria
 *
 * NOTA: Este módulo está deshabilitado porque requiere un esquema de base de datos diferente.
 * El sistema actual usa /api/practica y /api/ritual en su lugar.
 */

import { Hono } from 'hono'
import type { Env } from '../types'

const rutinaRoutes = new Hono<{ Bindings: Env }>()

// Ruta placeholder para mantener compatibilidad
rutinaRoutes.get('/today', async (c) => {
  return c.json({
    success: false,
    error: 'Esta funcionalidad no está disponible. Use /api/practica en su lugar.'
  }, 501)
})

rutinaRoutes.get('/stats', async (c) => {
  return c.json({
    success: false,
    error: 'Esta funcionalidad no está disponible. Use /api/practica en su lugar.'
  }, 501)
})

export default rutinaRoutes
