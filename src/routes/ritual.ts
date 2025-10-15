import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const ritualRoutes = new Hono<{ Bindings: Bindings }>()

// Crear nueva sesión de ritual SPEC
ritualRoutes.post('/sesiones', async (c) => {
  try {
    const { decreto_id, momento } = await c.req.json()

    if (!momento || !['manana', 'noche'].includes(momento)) {
      return c.json({ success: false, error: 'Momento inválido (debe ser "manana" o "noche")' }, 400)
    }

    const fecha_hoy = new Date().toISOString().split('T')[0]
    const hora_inicio = new Date().toISOString()

    // Insertar nueva sesión
    const result = await c.env.DB.prepare(`
      INSERT INTO ritual_spec_sesiones
      (decreto_id, momento, fecha, hora_inicio, completada, duracion_segundos)
      VALUES (?, ?, ?, ?, 0, 0)
    `).bind(decreto_id || null, momento, fecha_hoy, hora_inicio).run()

    const sessionId = result.meta.last_row_id

    return c.json({
      success: true,
      session_id: sessionId,
      fecha: fecha_hoy,
      hora_inicio
    })
  } catch (error) {
    console.error('Error al crear sesión de ritual:', error)
    return c.json({ success: false, error: 'Error al crear sesión de ritual' }, 500)
  }
})

// Obtener sesiones de un día específico
ritualRoutes.get('/sesiones', async (c) => {
  try {
    const fecha = c.req.query('fecha') || new Date().toISOString().split('T')[0]

    const sesiones = await c.env.DB.prepare(`
      SELECT
        rss.*,
        d.titulo as decreto_titulo,
        d.area as decreto_area
      FROM ritual_spec_sesiones rss
      LEFT JOIN decretos d ON rss.decreto_id = d.id
      WHERE rss.fecha = ?
      ORDER BY rss.hora_inicio DESC
    `).bind(fecha).all()

    return c.json({
      success: true,
      data: sesiones.results
    })
  } catch (error) {
    console.error('Error al obtener sesiones:', error)
    return c.json({ success: false, error: 'Error al obtener sesiones' }, 500)
  }
})

// Obtener una sesión específica
ritualRoutes.get('/sesiones/:id', async (c) => {
  try {
    const sessionId = c.req.param('id')

    const sesion = await c.env.DB.prepare(`
      SELECT
        rss.*,
        d.titulo as decreto_titulo,
        d.area as decreto_area
      FROM ritual_spec_sesiones rss
      LEFT JOIN decretos d ON rss.decreto_id = d.id
      WHERE rss.id = ?
    `).bind(sessionId).first()

    if (!sesion) {
      return c.json({ success: false, error: 'Sesión no encontrada' }, 404)
    }

    return c.json({
      success: true,
      data: sesion
    })
  } catch (error) {
    console.error('Error al obtener sesión:', error)
    return c.json({ success: false, error: 'Error al obtener sesión' }, 500)
  }
})

// Actualizar sesión (guardar progreso, completar, etc.)
ritualRoutes.put('/sesiones/:id', async (c) => {
  try {
    const sessionId = c.req.param('id')
    const {
      completada,
      duracion_segundos,
      etapa_actual,
      notas
    } = await c.req.json()

    const hora_fin = completada ? new Date().toISOString() : null

    await c.env.DB.prepare(`
      UPDATE ritual_spec_sesiones
      SET
        completada = COALESCE(?, completada),
        duracion_segundos = COALESCE(?, duracion_segundos),
        etapa_actual = COALESCE(?, etapa_actual),
        notas = COALESCE(?, notas),
        hora_fin = COALESCE(?, hora_fin),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      completada !== undefined ? (completada ? 1 : 0) : null,
      duracion_segundos || null,
      etapa_actual || null,
      notas || null,
      hora_fin,
      sessionId
    ).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Error al actualizar sesión:', error)
    return c.json({ success: false, error: 'Error al actualizar sesión' }, 500)
  }
})

// Eliminar sesión
ritualRoutes.delete('/sesiones/:id', async (c) => {
  try {
    const sessionId = c.req.param('id')

    await c.env.DB.prepare('DELETE FROM ritual_spec_sesiones WHERE id = ?').bind(sessionId).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar sesión:', error)
    return c.json({ success: false, error: 'Error al eliminar sesión' }, 500)
  }
})

// Obtener estadísticas del ritual SPEC
ritualRoutes.get('/estadisticas', async (c) => {
  try {
    // Sesiones completadas
    const sesionesCompletadas = await c.env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM ritual_spec_sesiones
      WHERE completada = 1
    `).first()

    // Sesiones por momento del día
    const sesionesPorMomento = await c.env.DB.prepare(`
      SELECT
        momento,
        COUNT(*) as cantidad
      FROM ritual_spec_sesiones
      WHERE completada = 1
      GROUP BY momento
    `).all()

    const sesionesManana = sesionesPorMomento.results.find((s: any) => s.momento === 'manana')?.cantidad || 0
    const sesionesNoche = sesionesPorMomento.results.find((s: any) => s.momento === 'noche')?.cantidad || 0

    // Racha de días consecutivos con al menos 1 ritual completado
    const racha = await c.env.DB.prepare(`
      WITH RECURSIVE fecha_serie AS (
        SELECT date('now') as fecha
        UNION ALL
        SELECT date(fecha, '-1 day')
        FROM fecha_serie
        WHERE fecha >= date('now', '-30 days')
      ),
      dias_con_ritual AS (
        SELECT DISTINCT fecha
        FROM ritual_spec_sesiones
        WHERE completada = 1 AND fecha >= date('now', '-30 days')
      )
      SELECT COUNT(*) as racha
      FROM fecha_serie fs
      WHERE fs.fecha IN (SELECT fecha FROM dias_con_ritual)
      AND NOT EXISTS (
        SELECT 1 FROM fecha_serie fs2
        WHERE fs2.fecha > fs.fecha
        AND fs2.fecha NOT IN (SELECT fecha FROM dias_con_ritual)
      )
    `).first()

    // Duración promedio
    const duracionPromedio = await c.env.DB.prepare(`
      SELECT AVG(duracion_segundos) as promedio
      FROM ritual_spec_sesiones
      WHERE completada = 1 AND duracion_segundos > 0
    `).first()

    return c.json({
      success: true,
      data: {
        sesiones_completadas: sesionesCompletadas?.total || 0,
        sesiones_manana: sesionesManana,
        sesiones_noche: sesionesNoche,
        racha_dias: racha?.racha || 0,
        duracion_promedio_segundos: duracionPromedio?.promedio || 0,
        duracion_promedio_minutos: Math.round((duracionPromedio?.promedio || 0) / 60)
      }
    })
  } catch (error) {
    console.error('Error al obtener estadísticas del ritual:', error)
    return c.json({ success: false, error: 'Error al obtener estadísticas' }, 500)
  }
})

export default ritualRoutes
