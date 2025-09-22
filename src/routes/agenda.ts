import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

export const agendaRoutes = new Hono<{ Bindings: Bindings }>()

// Obtener métricas del día
agendaRoutes.get('/metricas/:fecha', async (c) => {
  try {
    const fecha = c.req.param('fecha')
    
    // Obtener tareas del día
    const tareas = await c.env.DB.prepare(`
      SELECT ae.*, a.titulo as accion_titulo, d.area, d.titulo as decreto_titulo
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ?
      ORDER BY ae.hora_evento ASC
    `).bind(fecha).all()

    const total = tareas.results.length
    const completadas = tareas.results.filter((t: any) => t.estado === 'completada').length
    const pendientes = total - completadas
    const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0

    return c.json({
      success: true,
      data: {
        total,
        completadas,
        pendientes,
        progreso,
        tareas: tareas.results
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener métricas del día' }, 500)
  }
})

// Obtener eventos del calendario (por mes)
agendaRoutes.get('/calendario/:year/:month', async (c) => {
  try {
    const year = c.req.param('year')
    const month = c.req.param('month')
    
    const fechaInicio = `${year}-${month.padStart(2, '0')}-01`
    const fechaFin = `${year}-${month.padStart(2, '0')}-31`
    
    // Obtener todos los eventos del mes con métricas por día
    const eventos = await c.env.DB.prepare(`
      SELECT 
        fecha_evento,
        COUNT(*) as total,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado = 'pendiente' AND fecha_evento < date('now') THEN 1 END) as vencidas
      FROM agenda_eventos 
      WHERE fecha_evento BETWEEN ? AND ?
      GROUP BY fecha_evento
    `).bind(fechaInicio, fechaFin).all()

    // Procesar estados por día
    const diasConEstado: Record<string, string> = {}
    
    for (const evento of eventos.results as any[]) {
      const { fecha_evento, total, completadas, vencidas } = evento
      
      if (completadas === total) {
        diasConEstado[fecha_evento] = 'completado' // 🟢
      } else if (vencidas > 0) {
        diasConEstado[fecha_evento] = 'vencido' // 🔴
      } else if (total > completadas) {
        diasConEstado[fecha_evento] = 'pendiente' // 🟡
      }
    }

    return c.json({
      success: true,
      data: {
        eventos: eventos.results,
        estados: diasConEstado
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener calendario' }, 500)
  }
})

// Obtener timeline del día
agendaRoutes.get('/timeline/:fecha', async (c) => {
  try {
    const fecha = c.req.param('fecha')
    
    const tareas = await c.env.DB.prepare(`
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        a.que_hacer,
        a.tipo,
        d.area,
        d.titulo as decreto_titulo,
        d.id as decreto_id
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ?
      ORDER BY ae.hora_evento ASC, ae.created_at ASC
    `).bind(fecha).all()

    return c.json({
      success: true,
      data: tareas.results
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener timeline' }, 500)
  }
})

// Obtener enfoque del día
agendaRoutes.get('/enfoque/:fecha', async (c) => {
  try {
    const fecha = c.req.param('fecha')
    
    const enfoque = await c.env.DB.prepare(`
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        d.titulo as decreto_titulo,
        d.area
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ? AND ae.es_enfoque_dia = 1
      LIMIT 1
    `).bind(fecha).first()

    return c.json({
      success: true,
      data: enfoque
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener enfoque del día' }, 500)
  }
})

// Establecer enfoque del día
agendaRoutes.put('/enfoque/:fecha', async (c) => {
  try {
    const fecha = c.req.param('fecha')
    const { tarea_id } = await c.req.json()
    
    // Quitar enfoque anterior del día
    await c.env.DB.prepare(
      'UPDATE agenda_eventos SET es_enfoque_dia = 0 WHERE fecha_evento = ?'
    ).bind(fecha).run()
    
    // Establecer nuevo enfoque
    if (tarea_id) {
      await c.env.DB.prepare(
        'UPDATE agenda_eventos SET es_enfoque_dia = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(tarea_id).run()
    }

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al establecer enfoque' }, 500)
  }
})

// Crear nueva tarea desde agenda
agendaRoutes.post('/tareas', async (c) => {
  try {
    const { 
      decreto_id, 
      nombre, 
      descripcion, 
      fecha_hora, 
      tipo 
    } = await c.req.json()
    
    if (!decreto_id || !nombre || !fecha_hora) {
      return c.json({ 
        success: false, 
        error: 'Campos requeridos: decreto_id, nombre, fecha_hora' 
      }, 400)
    }

    // Crear acción
    const resultAccion = await c.env.DB.prepare(`
      INSERT INTO acciones (
        decreto_id, titulo, que_hacer, como_hacerlo, tipo, 
        proxima_revision, origen
      ) VALUES (?, ?, ?, ?, ?, ?, 'agenda')
    `).bind(
      decreto_id,
      nombre,
      descripcion || 'Tarea creada desde agenda',
      'Completar según se planificó',
      tipo || 'secundaria',
      fecha_hora
    ).run()

    // Crear evento agenda
    const fechaParte = fecha_hora.split('T')[0]
    const horaParte = fecha_hora.split('T')[1] || '09:00'
    
    await c.env.DB.prepare(`
      INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      resultAccion.meta.last_row_id,
      `[Agenda] ${nombre}`,
      descripcion || '',
      fechaParte,
      horaParte
    ).run()

    return c.json({ success: true, id: resultAccion.meta.last_row_id })
  } catch (error) {
    return c.json({ success: false, error: 'Error al crear tarea' }, 500)
  }
})

// Completar tarea
agendaRoutes.put('/tareas/:id/completar', async (c) => {
  try {
    const tareaId = c.req.param('id')
    
    // Completar evento
    await c.env.DB.prepare(
      'UPDATE agenda_eventos SET estado = "completada", updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(tareaId).run()

    // Completar acción asociada
    await c.env.DB.prepare(`
      UPDATE acciones SET 
        estado = "completada", 
        fecha_cierre = date("now"),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = (
        SELECT accion_id FROM agenda_eventos WHERE id = ?
      )
    `).bind(tareaId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al completar tarea' }, 500)
  }
})

// Eliminar tarea
agendaRoutes.delete('/tareas/:id', async (c) => {
  try {
    const tareaId = c.req.param('id')
    
    // Obtener accion_id antes de eliminar
    const evento = await c.env.DB.prepare(
      'SELECT accion_id FROM agenda_eventos WHERE id = ?'
    ).bind(tareaId).first()

    // Eliminar evento
    await c.env.DB.prepare('DELETE FROM agenda_eventos WHERE id = ?').bind(tareaId).run()

    // Si la acción fue creada desde agenda, eliminarla también
    if (evento?.accion_id) {
      const accion = await c.env.DB.prepare(
        'SELECT origen FROM acciones WHERE id = ?'
      ).bind(evento.accion_id).first()
      
      if (accion?.origen === 'agenda') {
        await c.env.DB.prepare('DELETE FROM acciones WHERE id = ?').bind(evento.accion_id).run()
      }
    }

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al eliminar tarea' }, 500)
  }
})

// Obtener tareas pendientes para selector de enfoque
agendaRoutes.get('/pendientes/:fecha', async (c) => {
  try {
    const fecha = c.req.param('fecha')
    
    const tareasPendientes = await c.env.DB.prepare(`
      SELECT 
        ae.id,
        ae.titulo,
        ae.hora_evento,
        a.titulo as accion_titulo,
        d.titulo as decreto_titulo,
        d.area
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ? AND ae.estado = 'pendiente'
      ORDER BY ae.hora_evento ASC
    `).bind(fecha).all()

    return c.json({
      success: true,
      data: tareas_pendientes.results
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener tareas pendientes' }, 500)
  }
})

// Obtener todas las tareas con filtros
agendaRoutes.get('/filtros', async (c) => {
  try {
    const { 
      fecha_desde, 
      fecha_hasta, 
      incluir_hoy, 
      incluir_futuras, 
      incluir_completadas, 
      incluir_pendientes,
      decreto_id,
      area 
    } = c.req.query()

    let query = `
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        a.tipo,
        d.titulo as decreto_titulo,
        d.area,
        d.id as decreto_id
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE 1=1
    `
    const params: any[] = []
    
    // Filtros de fecha
    if (incluir_hoy === 'true') {
      query += ` AND ae.fecha_evento = date('now')`
    }
    
    if (incluir_futuras === 'true') {
      query += ` AND ae.fecha_evento > date('now')`
    }
    
    if (fecha_desde && fecha_hasta) {
      query += ` AND ae.fecha_evento BETWEEN ? AND ?`
      params.push(fecha_desde, fecha_hasta)
    }
    
    // Filtros de estado
    const estados: string[] = []
    if (incluir_completadas === 'true') estados.push('completada')
    if (incluir_pendientes === 'true') estados.push('pendiente')
    
    if (estados.length > 0) {
      query += ` AND ae.estado IN (${estados.map(() => '?').join(',')})`
      params.push(...estados)
    }
    
    // Filtros de decreto
    if (decreto_id && decreto_id !== 'todos') {
      query += ` AND d.id = ?`
      params.push(decreto_id)
    }
    
    if (area && area !== 'todos') {
      query += ` AND d.area = ?`
      params.push(area)
    }
    
    query += ` ORDER BY ae.fecha_evento DESC, ae.hora_evento ASC`

    const result = await c.env.DB.prepare(query).bind(...params).all()

    return c.json({
      success: true,
      data: result.results
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al filtrar tareas' }, 500)
  }
})

// Crear seguimiento desde agenda
agendaRoutes.post('/tareas/:id/seguimiento', async (c) => {
  try {
    const tareaId = c.req.param('id')
    const seguimientoData = await c.req.json()
    
    // Obtener acción asociada
    const evento = await c.env.DB.prepare(
      'SELECT accion_id FROM agenda_eventos WHERE id = ?'
    ).bind(tareaId).first()

    if (!evento?.accion_id) {
      return c.json({ success: false, error: 'No se encontró acción asociada' }, 404)
    }

    // Crear seguimiento usando la ruta de decretos
    // (esto redirige a la misma lógica de seguimiento)
    const { 
      que_se_hizo, 
      como_se_hizo, 
      resultados_obtenidos, 
      tareas_pendientes, 
      proxima_revision, 
      calificacion 
    } = seguimientoData

    // Crear seguimiento
    await c.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      evento.accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos,
      JSON.stringify(tareas_pendientes || []), proxima_revision || null, calificacion || null
    ).run()

    // Actualizar acción
    await c.env.DB.prepare(`
      UPDATE acciones SET 
        resultados = ?, 
        tareas_pendientes = ?, 
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(
      resultados_obtenidos,
      JSON.stringify(tareas_pendientes || []),
      proxima_revision || null,
      calificacion || null,
      evento.accion_id
    ).run()

    return c.json({ 
      success: true, 
      message: 'Seguimiento guardado desde agenda'
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al crear seguimiento' }, 500)
  }
})