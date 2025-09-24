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
      SELECT 
        ae.*, 
        a.titulo as accion_titulo, 
        a.fecha_creacion as accion_fecha_creacion,
        a.fecha_cierre as accion_fecha_cierre,
        d.area, 
        d.titulo as decreto_titulo
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ?
      ORDER BY 
        CASE ae.prioridad 
          WHEN 'alta' THEN 1 
          WHEN 'media' THEN 2 
          WHEN 'baja' THEN 3 
          ELSE 2 
        END ASC, 
        ae.hora_evento ASC
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
        a.fecha_creacion as accion_fecha_creacion,
        a.fecha_cierre as accion_fecha_cierre,
        d.area,
        d.titulo as decreto_titulo,
        d.id as decreto_id
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ?
      ORDER BY 
        CASE ae.prioridad 
          WHEN 'alta' THEN 1 
          WHEN 'media' THEN 2 
          WHEN 'baja' THEN 3 
          ELSE 2 
        END ASC, 
        ae.hora_evento ASC, 
        ae.created_at ASC
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

// Crear nueva tarea desde agenda - LÓGICA SIMPLE DIRECTA
agendaRoutes.post('/tareas', async (c) => {
  try {
    const { 
      decreto_id, 
      nombre, 
      descripcion, 
      fecha_hora, 
      tipo,
      prioridad
    } = await c.req.json()
    
    console.log('📝 Creando tarea agenda:', { decreto_id, nombre, fecha_hora, tipo, prioridad })
    
    if (!nombre || !fecha_hora) {
      return c.json({ 
        success: false, 
        error: 'Campos requeridos: nombre, fecha_hora' 
      }, 400)
    }

    // LÓGICA SIMPLE: Crear evento de agenda directamente (sin acción)
    const fechaParte = fecha_hora.split('T')[0]
    const horaParte = fecha_hora.split('T')[1] || '09:00'
    
    const result = await c.env.DB.prepare(`
      INSERT INTO agenda_eventos (
        titulo, 
        descripcion, 
        fecha_evento, 
        hora_evento,
        prioridad,
        estado,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      nombre,
      descripcion || '',
      fechaParte,
      horaParte,
      prioridad || 'media'
    ).run()

    console.log('✅ Tarea agenda creada:', result.meta.last_row_id)
    
    return c.json({ 
      success: true, 
      id: result.meta.last_row_id,
      message: 'Tarea creada correctamente'
    })
    
  } catch (error) {
    console.error('❌ Error crear tarea:', error)
    return c.json({ 
      success: false, 
      error: `Error al crear tarea: ${error.message}` 
    }, 500)
  }
})

// Completar tarea
agendaRoutes.put('/tareas/:id/completar', async (c) => {
  try {
    const tareaId = c.req.param('id')
    
    // 🕐 REGISTRAR CUÁNDO REALMENTE LA COMPLETASTE
    const fechaCompletada = new Date().toISOString()
    
    // Completar evento EN AGENDA con fecha de finalización
    await c.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        estado = "completada", 
        fecha_completada = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(fechaCompletada, tareaId).run()

    // Completar acción asociada con fecha de cierre
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

// Marcar tarea como pendiente
agendaRoutes.put('/tareas/:id/pendiente', async (c) => {
  try {
    const tareaId = c.req.param('id')
    
    // 🔄 LIMPIAR fecha de completada cuando se marca como pendiente
    await c.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        estado = "pendiente", 
        fecha_completada = NULL,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(tareaId).run()

    // Limpiar fecha de cierre en acción asociada
    await c.env.DB.prepare(`
      UPDATE acciones SET 
        estado = "pendiente", 
        fecha_cierre = NULL,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = (
        SELECT accion_id FROM agenda_eventos WHERE id = ?
      )
    `).bind(tareaId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al marcar tarea como pendiente' }, 500)
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
      data: tareasPendientes.results
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener tareas pendientes' }, 500)
  }
})

// Obtener detalles completos de una tarea
agendaRoutes.get('/tareas/:id', async (c) => {
  try {
    const tareaId = c.req.param('id')
    
    const tarea = await c.env.DB.prepare(`
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        a.que_hacer,
        a.como_hacerlo,
        a.resultados,
        a.tipo,
        a.calificacion,
        a.proxima_revision,
        a.tareas_pendientes,
        d.titulo as decreto_titulo,
        d.sueno_meta,
        d.descripcion as decreto_descripcion,
        d.area,
        d.id as decreto_id
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.id = ?
    `).bind(tareaId).first()

    if (!tarea) {
      return c.json({ success: false, error: 'Tarea no encontrada' }, 404)
    }

    // Parsear tareas_pendientes si existe
    if (tarea.tareas_pendientes) {
      try {
        tarea.tareas_pendientes = JSON.parse(tarea.tareas_pendientes)
      } catch (e) {
        tarea.tareas_pendientes = []
      }
    }

    return c.json({
      success: true,
      data: tarea
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener detalles de la tarea' }, 500)
  }
})

// Editar tarea
agendaRoutes.put('/tareas/:id', async (c) => {
  try {
    const tareaId = c.req.param('id')
    const { 
      titulo,
      descripcion, 
      fecha_hora,
      que_hacer,
      como_hacerlo,
      resultados,
      tipo,
      calificacion,
      prioridad
    } = await c.req.json()
    
    if (!titulo || !fecha_hora) {
      return c.json({ 
        success: false, 
        error: 'Campos requeridos: titulo, fecha_hora' 
      }, 400)
    }

    // Dividir fecha y hora
    const fechaParte = fecha_hora.split('T')[0]
    const horaParte = fecha_hora.split('T')[1] || '09:00'

    // Actualizar evento de agenda
    await c.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        titulo = ?,
        descripcion = ?,
        fecha_evento = ?,
        hora_evento = ?,
        prioridad = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(titulo, descripcion || '', fechaParte, horaParte, prioridad || 'media', tareaId).run()

    // Obtener accion_id para actualizar la acción asociada
    const evento = await c.env.DB.prepare(
      'SELECT accion_id FROM agenda_eventos WHERE id = ?'
    ).bind(tareaId).first()

    // Actualizar acción asociada si existe
    if (evento?.accion_id) {
      await c.env.DB.prepare(`
        UPDATE acciones SET 
          titulo = ?,
          que_hacer = ?,
          como_hacerlo = ?,
          resultados = ?,
          tipo = ?,
          proxima_revision = ?,
          calificacion = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        titulo,
        que_hacer || '',
        como_hacerlo || '',
        resultados || '',
        tipo || 'secundaria',
        fecha_hora,
        calificacion || null,
        evento.accion_id
      ).run()
    }

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al editar tarea' }, 500)
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