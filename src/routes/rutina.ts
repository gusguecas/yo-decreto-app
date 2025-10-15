/**
 * Rutas API para el Sistema de Rutina Diaria Tripartito
 *
 * Endpoints:
 * - GET /api/rutina/today - Obtiene la rotación del día
 * - POST /api/rutina/generate - Genera rotación para una fecha específica
 * - GET /api/rutina/stats - Estadísticas de la rutina
 * - POST /api/rutina/complete-task - Marca una tarea como completada
 * - POST /api/rutina/faith-checkin - Registra un check-in de fe
 * - POST /api/rutina/merit-commitment - Guarda compromiso de merecimiento
 * - GET /api/rutina/history/:days - Historial de últimos N días
 */

import { Hono } from 'hono'
import type { Env } from '../types'

export const rutinaRoutes = new Hono<{ Bindings: Env }>()

/**
 * Algoritmo de selección de decretos primarios
 *
 * Criterios (en orden de prioridad):
 * 1. Días desde último primario (más días = mayor prioridad)
 * 2. Nivel de fe (menor fe = mayor prioridad)
 * 3. Fecha de creación (más antiguo = mayor prioridad)
 */
async function selectPrimaryDecretos(db: D1Database, userId: string, date: string) {
  const categories = ['material', 'humano', 'empresarial']
  const selectedDecretos: { [key: string]: any } = {}

  for (const categoria of categories) {
    // Buscar decretos activos de esta categoría
    const query = `
      SELECT
        d.*,
        COALESCE(
          julianday(?) - julianday(d.last_primary_date),
          julianday(?) - julianday(d.created_at)
        ) as days_since_primary
      FROM decretos d
      WHERE d.user_id = ?
        AND d.categoria = ?
        AND d.status = 'active'
      ORDER BY
        days_since_primary DESC,
        d.faith_level ASC,
        d.created_at ASC
      LIMIT 1
    `

    const result = await db.prepare(query)
      .bind(date, date, userId, categoria)
      .first()

    if (!result) {
      throw new Error(`No hay decretos activos en categoría ${categoria}`)
    }

    selectedDecretos[categoria] = result
  }

  return selectedDecretos
}

/**
 * GET /api/rutina/today
 * Obtiene la rotación del día actual (o la genera si no existe)
 */
rutinaRoutes.get('/today', async (c) => {
  try {
    const userId = c.req.header('X-User-ID') || 'demo-user'
    const db = c.env.DB

    // Fecha de hoy en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0]

    // Buscar si ya existe rotación para hoy
    let rotation = await db.prepare(`
      SELECT
        dr.*,
        dm.titulo as material_titulo,
        dm.description as material_description,
        dh.titulo as humano_titulo,
        dh.description as humano_description,
        de.titulo as empresarial_titulo,
        de.description as empresarial_description
      FROM daily_rotation dr
      LEFT JOIN decretos dm ON dr.decreto_material_id = dm.id
      LEFT JOIN decretos dh ON dr.decreto_humano_id = dh.id
      LEFT JOIN decretos de ON dr.decreto_empresarial_id = de.id
      WHERE dr.user_id = ? AND dr.date = ?
    `).bind(userId, today).first()

    // Si no existe, generar nueva rotación
    if (!rotation) {
      const selectedDecretos = await selectPrimaryDecretos(db, userId, today)

      // Insertar rotación en base de datos
      await db.prepare(`
        INSERT INTO daily_rotation (user_id, date, decreto_material_id, decreto_humano_id, decreto_empresarial_id)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        userId,
        today,
        selectedDecretos.material.id,
        selectedDecretos.humano.id,
        selectedDecretos.empresarial.id
      ).run()

      // Actualizar last_primary_date de cada decreto
      for (const [categoria, decreto] of Object.entries(selectedDecretos)) {
        await db.prepare(`
          UPDATE decretos SET last_primary_date = ? WHERE id = ?
        `).bind(today, decreto.id).run()
      }

      // Obtener la rotación recién creada
      rotation = await db.prepare(`
        SELECT
          dr.*,
          dm.titulo as material_titulo,
          dm.description as material_description,
          dm.faith_level as material_faith,
          dh.titulo as humano_titulo,
          dh.description as humano_description,
          dh.faith_level as humano_faith,
          de.titulo as empresarial_titulo,
          de.description as empresarial_description,
          de.faith_level as empresarial_faith
        FROM daily_rotation dr
        LEFT JOIN decretos dm ON dr.decreto_material_id = dm.id
        LEFT JOIN decretos dh ON dr.decreto_humano_id = dh.id
        LEFT JOIN decretos de ON dr.decreto_empresarial_id = de.id
        WHERE dr.user_id = ? AND dr.date = ?
      `).bind(userId, today).first()
    }

    // Obtener decretos secundarios (todos los demás activos)
    const secondaryDecretos = await db.prepare(`
      SELECT
        d.*,
        CASE
          WHEN d.id = ? THEN 'primary'
          WHEN d.id = ? THEN 'primary'
          WHEN d.id = ? THEN 'primary'
          ELSE 'secondary'
        END as role
      FROM decretos d
      WHERE d.user_id = ?
        AND d.status = 'active'
        AND d.id NOT IN (?, ?, ?)
    `).bind(
      rotation.decreto_material_id,
      rotation.decreto_humano_id,
      rotation.decreto_empresarial_id,
      userId,
      rotation.decreto_material_id,
      rotation.decreto_humano_id,
      rotation.decreto_empresarial_id
    ).all()

    // Obtener rutinas del día
    const routines = await db.prepare(`
      SELECT * FROM daily_routines
      WHERE user_id = ? AND date = ?
    `).bind(userId, today).all()

    // Obtener check-ins de fe del día
    const faithCheckins = await db.prepare(`
      SELECT * FROM faith_tracking
      WHERE user_id = ? AND date = ?
    `).bind(userId, today).all()

    // Obtener compromiso de merecimiento del día
    const meritCommitment = await db.prepare(`
      SELECT * FROM merit_commitments
      WHERE user_id = ? AND date = ?
    `).bind(userId, today).first()

    // Obtener tareas completadas del día
    const completedTasks = await db.prepare(`
      SELECT * FROM task_completion
      WHERE user_id = ? AND date = ?
    `).bind(userId, today).all()

    // Calcular enfoque del día (ciclo de 7 días)
    const dayOfWeek = new Date(today).getDay()
    const focusCycle = [
      'RECARGA', // Domingo
      'SELECT',   // Lunes
      'PROJECT',  // Martes
      'EXPECT',   // Miércoles
      'MERECIMIENTO', // Jueves
      'ACCION',   // Viernes
      'GRATITUD'  // Sábado
    ]
    const dailyFocus = focusCycle[dayOfWeek]

    return c.json({
      success: true,
      data: {
        date: today,
        dailyFocus,
        primary: {
          material: {
            id: rotation.decreto_material_id,
            titulo: rotation.material_titulo,
            description: rotation.material_description,
            faith_level: rotation.material_faith
          },
          humano: {
            id: rotation.decreto_humano_id,
            titulo: rotation.humano_titulo,
            description: rotation.humano_description,
            faith_level: rotation.humano_faith
          },
          empresarial: {
            id: rotation.decreto_empresarial_id,
            titulo: rotation.empresarial_titulo,
            description: rotation.empresarial_description,
            faith_level: rotation.empresarial_faith
          }
        },
        secondary: secondaryDecretos.results,
        routines: routines.results,
        faithCheckins: faithCheckins.results,
        meritCommitment,
        completedTasks: completedTasks.results
      }
    })

  } catch (error) {
    console.error('Error al obtener rotación del día:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al obtener rotación del día'
    }, 500)
  }
})

/**
 * POST /api/rutina/complete-task
 * Marca una tarea como completada
 */
rutinaRoutes.post('/complete-task', async (c) => {
  try {
    const userId = c.req.header('X-User-ID') || 'demo-user'
    const db = c.env.DB
    const { decretoId, taskType, minutesSpent, notes } = await c.req.json()

    const today = new Date().toISOString().split('T')[0]
    const now = new Date().toISOString()

    // Insertar o actualizar tarea completada
    await db.prepare(`
      INSERT INTO task_completion (user_id, decreto_id, date, task_type, completed, minutes_spent, notes, completed_at)
      VALUES (?, ?, ?, ?, 1, ?, ?, ?)
      ON CONFLICT(user_id, decreto_id, date, task_type)
      DO UPDATE SET
        completed = 1,
        minutes_spent = excluded.minutes_spent,
        notes = excluded.notes,
        completed_at = excluded.completed_at
    `).bind(userId, decretoId, today, taskType, minutesSpent || 0, notes || '', now).run()

    return c.json({
      success: true,
      message: 'Tarea marcada como completada'
    })

  } catch (error) {
    console.error('Error al completar tarea:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al completar tarea'
    }, 500)
  }
})

/**
 * POST /api/rutina/faith-checkin
 * Registra un check-in de nivel de fe
 */
rutinaRoutes.post('/faith-checkin', async (c) => {
  try {
    const userId = c.req.header('X-User-ID') || 'demo-user'
    const db = c.env.DB
    const { decretoId, checkInTime, faithLevel, notes } = await c.req.json()

    const today = new Date().toISOString().split('T')[0]

    // Validar faithLevel
    if (faithLevel < 1 || faithLevel > 10) {
      return c.json({
        success: false,
        error: 'El nivel de fe debe estar entre 1 y 10'
      }, 400)
    }

    // Insertar check-in de fe
    await db.prepare(`
      INSERT INTO faith_tracking (user_id, decreto_id, date, check_in_time, faith_level, notes)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, decreto_id, date, check_in_time)
      DO UPDATE SET
        faith_level = excluded.faith_level,
        notes = excluded.notes
    `).bind(userId, decretoId, today, checkInTime, faithLevel, notes || '').run()

    // Actualizar promedio de fe del decreto
    const avgFaith = await db.prepare(`
      SELECT AVG(faith_level) as avg_faith
      FROM faith_tracking
      WHERE decreto_id = ?
        AND date >= date('now', '-7 days')
    `).bind(decretoId).first()

    await db.prepare(`
      UPDATE decretos SET faith_level = ? WHERE id = ?
    `).bind(avgFaith.avg_faith || faithLevel, decretoId).run()

    return c.json({
      success: true,
      message: 'Check-in de fe registrado',
      data: {
        avgFaith: avgFaith.avg_faith
      }
    })

  } catch (error) {
    console.error('Error al registrar check-in de fe:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al registrar check-in de fe'
    }, 500)
  }
})

/**
 * POST /api/rutina/merit-commitment
 * Guarda el compromiso de merecimiento del día
 */
rutinaRoutes.post('/merit-commitment', async (c) => {
  try {
    const userId = c.req.header('X-User-ID') || 'demo-user'
    const db = c.env.DB
    const { commitment, completed, reflection } = await c.req.json()

    const today = new Date().toISOString().split('T')[0]
    const now = new Date().toISOString()

    await db.prepare(`
      INSERT INTO merit_commitments (user_id, date, commitment, completed, completed_at, reflection)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, date)
      DO UPDATE SET
        commitment = excluded.commitment,
        completed = excluded.completed,
        completed_at = excluded.completed_at,
        reflection = excluded.reflection
    `).bind(
      userId,
      today,
      commitment,
      completed ? 1 : 0,
      completed ? now : null,
      reflection || ''
    ).run()

    return c.json({
      success: true,
      message: 'Compromiso de merecimiento guardado'
    })

  } catch (error) {
    console.error('Error al guardar compromiso de merecimiento:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al guardar compromiso'
    }, 500)
  }
})

/**
 * POST /api/rutina/routine
 * Marca una rutina matutina/vespertina como completada
 */
rutinaRoutes.post('/routine', async (c) => {
  try {
    const userId = c.req.header('X-User-ID') || 'demo-user'
    const db = c.env.DB
    const { routineType, notes } = await c.req.json()

    const today = new Date().toISOString().split('T')[0]
    const now = new Date().toISOString()

    await db.prepare(`
      INSERT INTO daily_routines (user_id, date, routine_type, completed, completed_at, notes)
      VALUES (?, ?, ?, 1, ?, ?)
      ON CONFLICT(user_id, date, routine_type)
      DO UPDATE SET
        completed = 1,
        completed_at = excluded.completed_at,
        notes = excluded.notes
    `).bind(userId, today, routineType, now, notes || '').run()

    return c.json({
      success: true,
      message: `Rutina ${routineType === 'morning' ? 'matutina' : 'vespertina'} completada`
    })

  } catch (error) {
    console.error('Error al completar rutina:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al completar rutina'
    }, 500)
  }
})

/**
 * GET /api/rutina/stats
 * Obtiene estadísticas de la rutina diaria
 */
rutinaRoutes.get('/stats', async (c) => {
  try {
    const userId = c.req.header('X-User-ID') || 'demo-user'
    const db = c.env.DB

    // Estadísticas de últimos 7 días
    const completionStats = await db.prepare(`
      SELECT
        date,
        COUNT(*) as total_tasks,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_tasks,
        SUM(minutes_spent) as total_minutes
      FROM task_completion
      WHERE user_id = ?
        AND date >= date('now', '-7 days')
      GROUP BY date
      ORDER BY date DESC
    `).bind(userId).all()

    // Promedio de fe por categoría
    const avgFaithByCategory = await db.prepare(`
      SELECT
        d.categoria,
        AVG(ft.faith_level) as avg_faith
      FROM faith_tracking ft
      JOIN decretos d ON ft.decreto_id = d.id
      WHERE ft.user_id = ?
        AND ft.date >= date('now', '-7 days')
      GROUP BY d.categoria
    `).bind(userId).all()

    // Racha de días consecutivos
    const streak = await db.prepare(`
      SELECT COUNT(DISTINCT date) as streak_days
      FROM daily_routines
      WHERE user_id = ?
        AND date >= date('now', '-30 days')
        AND completed = 1
    `).bind(userId).first()

    return c.json({
      success: true,
      data: {
        completionStats: completionStats.results,
        avgFaithByCategory: avgFaithByCategory.results,
        streak: streak.streak_days || 0
      }
    })

  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al obtener estadísticas'
    }, 500)
  }
})

/**
 * POST /api/rutina/signal
 * Registra una señal o sincronicidad
 */
rutinaRoutes.post('/signal', async (c) => {
  try {
    const userId = c.req.header('X-User-ID') || 'demo-user'
    const db = c.env.DB
    const { decretoId, description, signalType, emotionalImpact } = await c.req.json()

    const today = new Date().toISOString().split('T')[0]

    await db.prepare(`
      INSERT INTO signals_synchronicities (user_id, decreto_id, date, description, signal_type, emotional_impact)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      decretoId,
      today,
      description,
      signalType || 'señal',
      emotionalImpact || null
    ).run()

    return c.json({
      success: true,
      message: 'Señal registrada exitosamente'
    })

  } catch (error) {
    console.error('Error al registrar señal:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al registrar señal'
    }, 500)
  }
})

export default rutinaRoutes
