import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

export const agendaRoutes = new Hono<{ Bindings: Bindings }>()

// Obtener métricas del día
agendaRoutes.get('/metricas/:fecha', async (c) => {
  try {
    const fecha = c.req.param('fecha')

    // Obtener acciones del día
    const tareas = await c.env.DB.prepare(`
      SELECT
        a.*,
        d.area,
        d.titulo as decreto_titulo
      FROM acciones a
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE a.fecha_evento = ?
      ORDER BY
        CASE a.prioridad
          WHEN 'alta' THEN 1
          WHEN 'media' THEN 2
          WHEN 'baja' THEN 3
          ELSE 2
        END ASC,
        a.hora_evento ASC
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
      FROM acciones
      WHERE fecha_evento BETWEEN ? AND ?
        AND fecha_evento IS NOT NULL
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
        a.id,
        a.titulo,
        a.que_hacer,
        a.fecha_evento,
        a.hora_evento,
        a.estado,
        a.prioridad,
        a.tipo,
        a.duracion_minutos,
        a.es_enfoque_dia,
        d.area,
        d.titulo as decreto_titulo,
        d.id as decreto_id
      FROM acciones a
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE a.fecha_evento = ?
      ORDER BY
        CASE a.prioridad
          WHEN 'alta' THEN 1
          WHEN 'media' THEN 2
          WHEN 'baja' THEN 3
          ELSE 2
        END ASC,
        a.hora_evento ASC,
        a.created_at ASC
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
        a.*,
        d.titulo as decreto_titulo,
        d.area
      FROM acciones a
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE a.fecha_evento = ? AND a.es_enfoque_dia = 1
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
      'UPDATE acciones SET es_enfoque_dia = 0 WHERE fecha_evento = ?'
    ).bind(fecha).run()

    // Establecer nuevo enfoque
    if (tarea_id) {
      await c.env.DB.prepare(
        'UPDATE acciones SET es_enfoque_dia = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(tarea_id).run()
    }

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al establecer enfoque' }, 500)
  }
})

// Crear nueva tarea/acción desde agenda
agendaRoutes.post('/tareas', async (c) => {
  try {
    const {
      decreto_id,
      nombre,
      descripcion,
      fecha_hora,
      tipo,
      prioridad,
      duracion_minutos
    } = await c.req.json()

    console.log('📝 Creando acción desde agenda:', { decreto_id, nombre, fecha_hora, tipo, prioridad })

    if (!nombre || !fecha_hora) {
      return c.json({
        success: false,
        error: 'Campos requeridos: nombre, fecha_hora'
      }, 400)
    }

    // Separar fecha y hora
    const fechaParte = fecha_hora.split('T')[0]
    const horaParte = fecha_hora.split('T')[1] || '09:00'

    const result = await c.env.DB.prepare(`
      INSERT INTO acciones (
        decreto_id,
        titulo,
        que_hacer,
        fecha_evento,
        hora_evento,
        tipo,
        prioridad,
        duracion_minutos,
        estado,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      decreto_id || null,
      nombre,
      descripcion || '',
      fechaParte,
      horaParte,
      tipo || 'secundaria',
      prioridad || 'media',
      duracion_minutos || 15
    ).run()

    console.log('✅ Acción creada desde agenda:', result.meta.last_row_id)

    return c.json({
      success: true,
      id: result.meta.last_row_id,
      message: 'Acción creada correctamente'
    })

  } catch (error: any) {
    console.error('❌ Error crear acción:', error)
    return c.json({
      success: false,
      error: `Error al crear acción: ${error.message}`
    }, 500)
  }
})

// Completar tarea
agendaRoutes.put('/tareas/:id/completar', async (c) => {
  try {
    const tareaId = c.req.param('id')

    await c.env.DB.prepare(`
      UPDATE acciones SET
        estado = 'completada',
        fecha_cierre = date('now'),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
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

    await c.env.DB.prepare(`
      UPDATE acciones SET
        estado = 'pendiente',
        fecha_cierre = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
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

    // Eliminar acción directamente
    await c.env.DB.prepare('DELETE FROM acciones WHERE id = ?').bind(tareaId).run()

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
        a.id,
        a.titulo,
        a.hora_evento,
        d.titulo as decreto_titulo,
        d.area
      FROM acciones a
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE a.fecha_evento = ? AND a.estado = 'pendiente'
      ORDER BY a.hora_evento ASC
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
        a.*,
        d.titulo as decreto_titulo,
        d.sueno_meta,
        d.descripcion as decreto_descripcion,
        d.area,
        d.id as decreto_id
      FROM acciones a
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE a.id = ?
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
      prioridad,
      duracion_minutos
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

    // Actualizar acción
    await c.env.DB.prepare(`
      UPDATE acciones SET
        titulo = ?,
        que_hacer = ?,
        como_hacerlo = ?,
        resultados = ?,
        fecha_evento = ?,
        hora_evento = ?,
        tipo = ?,
        prioridad = ?,
        duracion_minutos = ?,
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      titulo,
      que_hacer || descripcion || '',
      como_hacerlo || '',
      resultados || '',
      fechaParte,
      horaParte,
      tipo || 'secundaria',
      prioridad || 'media',
      duracion_minutos || 15,
      fecha_hora,
      calificacion || null,
      tareaId
    ).run()

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
        a.*,
        d.titulo as decreto_titulo,
        d.area,
        d.id as decreto_id
      FROM acciones a
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE a.fecha_evento IS NOT NULL
    `
    const params: any[] = []

    // Filtros de fecha
    if (incluir_hoy === 'true') {
      query += ` AND a.fecha_evento = date('now')`
    }

    if (incluir_futuras === 'true') {
      query += ` AND a.fecha_evento > date('now')`
    }

    if (fecha_desde && fecha_hasta) {
      query += ` AND a.fecha_evento BETWEEN ? AND ?`
      params.push(fecha_desde, fecha_hasta)
    }

    // Filtros de estado
    const estados: string[] = []
    if (incluir_completadas === 'true') estados.push('completada')
    if (incluir_pendientes === 'true') estados.push('pendiente')

    if (estados.length > 0) {
      query += ` AND a.estado IN (${estados.map(() => '?').join(',')})`
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

    query += ` ORDER BY a.fecha_evento DESC, a.hora_evento ASC`

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
      tareaId, que_se_hizo, como_se_hizo, resultados_obtenidos,
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
      tareaId
    ).run()

    return c.json({
      success: true,
      message: 'Seguimiento guardado desde agenda'
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al crear seguimiento' }, 500)
  }
})

// Vista panorámica de acciones pendientes
agendaRoutes.get('/panoramica-pendientes', async (c) => {
  try {
    const { area } = c.req.query()

    console.log('🔍 Obteniendo panorámica pendientes, área:', area)

    let query = `
      SELECT
        a.id,
        a.titulo,
        a.que_hacer,
        a.tipo,
        a.fecha_creacion,
        a.fecha_evento,
        a.hora_evento,
        a.prioridad,
        a.proxima_revision,
        a.calificacion,
        d.titulo as decreto_titulo,
        d.area,
        d.sueno_meta,
        d.id as decreto_id
      FROM acciones a
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE a.estado = 'pendiente'
    `

    const params: any[] = []

    // Filtro por área/tipo de decreto
    if (area && area !== 'todos') {
      query += ` AND d.area = ?`
      params.push(area)
    }

    // Ordenar cronológicamente desde la más antigua
    query += `
      ORDER BY
        a.fecha_creacion ASC,
        a.proxima_revision ASC NULLS LAST,
        a.created_at ASC
    `

    const result = await c.env.DB.prepare(query).bind(...params).all()

    // Procesar resultados para agrupar y enriquecer datos
    const accionesProcesadas = result.results.map((accion: any) => ({
      ...accion,
      // Calcular días desde creación
      dias_desde_creacion: Math.floor(
        (Date.now() - new Date(accion.fecha_creacion).getTime()) / (1000 * 60 * 60 * 24)
      ),
      // Determinar estado de urgencia
      urgencia: determinarUrgencia(accion),
      // Formatear fechas
      fecha_creacion_formatted: formatearFecha(accion.fecha_creacion),
      proxima_revision_formatted: accion.proxima_revision ? formatearFecha(accion.proxima_revision) : null
    }))

    // Estadísticas generales
    const estadisticas = {
      total: accionesProcesadas.length,
      por_area: {},
      antiguedad_promedio: 0,
      con_revision_pendiente: 0,
      sin_revision: 0
    }

    // Calcular estadísticas por área
    const areaStats: Record<string, number> = {}
    let totalDias = 0

    accionesProcesadas.forEach((accion: any) => {
      const area = accion.area || 'sin_area'
      areaStats[area] = (areaStats[area] || 0) + 1
      totalDias += accion.dias_desde_creacion

      if (accion.proxima_revision) {
        estadisticas.con_revision_pendiente++
      } else {
        estadisticas.sin_revision++
      }
    })

    estadisticas.por_area = areaStats
    estadisticas.antiguedad_promedio = accionesProcesadas.length > 0
      ? Math.round(totalDias / accionesProcesadas.length)
      : 0

    console.log('✅ Panorámica obtenida:', {
      total: estadisticas.total,
      areas: estadisticas.por_area
    })

    return c.json({
      success: true,
      data: {
        acciones: accionesProcesadas,
        estadisticas
      }
    })
  } catch (error: any) {
    console.error('❌ Error panorámica pendientes:', error)
    return c.json({
      success: false,
      error: `Error al obtener panorámica de pendientes: ${error.message}`
    }, 500)
  }
})

// Funciones auxiliares para procesamiento de datos
function determinarUrgencia(accion: any): string {
  const ahora = new Date()
  const diasCreacion = Math.floor(
    (ahora.getTime() - new Date(accion.fecha_creacion).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Si tiene próxima revisión
  if (accion.proxima_revision) {
    const fechaRevision = new Date(accion.proxima_revision)
    const diasHastaRevision = Math.floor(
      (fechaRevision.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diasHastaRevision < 0) return 'vencida' // 🔴
    if (diasHastaRevision <= 1) return 'urgente' // 🟠
    if (diasHastaRevision <= 3) return 'importante' // 🟡
  }

  // Por antigüedad
  if (diasCreacion > 14) return 'muy_antigua' // 🟣
  if (diasCreacion > 7) return 'antigua' // 🔵

  return 'normal' // 🟢
}

// ============================================
// 🤖 AUTO-SCHEDULING
// ============================================

/**
 * POST /api/agenda/auto-schedule
 * Auto-agenda acciones en espacios libres del calendario de Google
 */
agendaRoutes.post('/auto-schedule', async (c) => {
  try {
    const { fecha, horaInicio, horaFin, exportToGoogle, bloqueoComida, decretosPrioritarios } = await c.req.json()
    const userId = 'demo-user'

    console.log('🤖 Iniciando auto-scheduling para:', { fecha, horaInicio, horaFin, bloqueoComida, decretosPrioritarios })

    // 1. Obtener eventos de Google Calendar
    const eventosGoogle = await obtenerEventosGoogleCalendar(c, userId, fecha)
    console.log(`📅 Eventos de Google Calendar: ${eventosGoogle.length}`)

    // 2. Detectar espacios libres (con bloqueo de comida si está habilitado)
    const espaciosLibres = detectarEspaciosLibres(
      eventosGoogle,
      fecha,
      horaInicio || '08:00',
      horaFin || '20:00',
      bloqueoComida || false // 🍽️ Si es true, bloquea 2-4pm para comida
    )
    console.log(`🆓 Espacios libres detectados: ${espaciosLibres.length}`)

    // 3. Si vienen decretosPrioritarios, crear acciones automáticamente
    let accionesCreadas: any[] = []
    if (decretosPrioritarios && decretosPrioritarios.length > 0) {
      console.log(`🎯 Creando acciones desde ${decretosPrioritarios.length} decretos prioritarios`)

      for (const decretoId of decretosPrioritarios) {
        // Obtener información del decreto
        const decreto = await c.env.DB.prepare(`
          SELECT id, titulo, area, descripcion FROM decretos WHERE id = ?
        `).bind(decretoId).first()

        if (decreto) {
          // Crear acción para este decreto
          const result = await c.env.DB.prepare(`
            INSERT INTO acciones (
              decreto_id,
              titulo,
              que_hacer,
              fecha_evento,
              tipo,
              prioridad,
              duracion_minutos,
              estado,
              created_at,
              updated_at
            ) VALUES (?, ?, ?, ?, 'primaria', 'alta', 30, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `).bind(
            decreto.id,
            decreto.titulo,
            decreto.descripcion || '',
            fecha
          ).run()

          accionesCreadas.push({
            id: result.meta.last_row_id,
            titulo: decreto.titulo,
            decreto_id: decreto.id,
            tipo: 'primaria',
            duracion_minutos: 30,
            prioridad: 'alta',
            es_enfoque_dia: 0,
            area: decreto.area
          })

          console.log(`✅ Acción creada: ${decreto.titulo}`)
        }
      }
    }

    // 4. Obtener acciones pendientes sin agendar (además de las creadas)
    const accionesPendientes = await c.env.DB.prepare(`
      SELECT
        a.id,
        a.titulo,
        a.decreto_id,
        a.tipo,
        a.duracion_minutos,
        a.prioridad,
        a.es_enfoque_dia,
        d.area
      FROM acciones a
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE a.estado = 'pendiente'
        AND (a.fecha_evento IS NULL OR a.fecha_evento = ?)
        AND a.hora_evento IS NULL
      ORDER BY
        CASE a.prioridad
          WHEN 'alta' THEN 1
          WHEN 'media' THEN 2
          WHEN 'baja' THEN 3
        END ASC,
        a.tipo DESC,
        a.created_at ASC
    `).bind(fecha).all()

    // Combinar acciones creadas + acciones existentes
    const todasLasAcciones = [...accionesCreadas, ...accionesPendientes.results]
    console.log(`📋 Total acciones a agendar: ${todasLasAcciones.length} (${accionesCreadas.length} creadas + ${accionesPendientes.results.length} existentes)`)

    // 5. Ejecutar algoritmo de scheduling con TODAS las acciones
    const accionesAgendadas = algoritmoScheduling(
      todasLasAcciones as any[],
      espaciosLibres
    )

    console.log(`✅ Acciones agendadas: ${accionesAgendadas.length}`)

    // 6. Actualizar acciones en BD con fecha y hora
    let actualizadas = 0
    for (const accion of accionesAgendadas) {
      await c.env.DB.prepare(`
        UPDATE acciones
        SET
          fecha_evento = ?,
          hora_evento = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(accion.fecha_evento, accion.hora_evento, accion.id).run()
      actualizadas++
    }

    // 7. Exportar a Google Calendar si se solicita
    let exportadas = 0
    if (exportToGoogle && accionesAgendadas.length > 0) {
      try {
        const accessToken = await getValidAccessToken(c, userId)

        for (const accion of accionesAgendadas) {
          try {
            await exportarAccionAGoogle(accessToken, accion, fecha)
            exportadas++
          } catch (error) {
            console.error(`Error exportando acción ${accion.id}:`, error)
          }
        }
      } catch (error: any) {
        console.error('Error obteniendo access token:', error)
      }
    }

    // 7. Calcular estadísticas
    const noAgendadas = accionesPendientes.results.length - accionesAgendadas.length

    return c.json({
      success: true,
      data: {
        accionesAgendadas: accionesAgendadas.length,
        accionesNoAgendadas: noAgendadas,
        espaciosLibresEncontrados: espaciosLibres.length,
        accionesExportadas: exportadas,
        detalles: accionesAgendadas.map(a => ({
          id: a.id,
          titulo: a.titulo,
          hora: a.hora_evento,
          duracion: a.duracion_minutos
        }))
      }
    })

  } catch (error: any) {
    console.error('❌ Error en auto-scheduling:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al auto-agendar tareas'
    }, 500)
  }
})

// ============================================
// 🔧 FUNCIONES AUXILIARES DE AUTO-SCHEDULING
// ============================================

interface EspacioLibre {
  inicio: string  // HH:MM
  fin: string     // HH:MM
  duracion: number // minutos
}

interface AccionParaAgendar {
  id: string
  titulo: string
  decreto_id: string | null
  tipo: string
  duracion_minutos: number
  prioridad: string
  es_enfoque_dia: number
  area?: string
  fecha_evento?: string
  hora_evento?: string
}

/**
 * Obtiene eventos de Google Calendar para una fecha
 */
async function obtenerEventosGoogleCalendar(c: any, userId: string, fecha: string) {
  try {
    // Verificar si tiene integración activa
    const integration = await c.env.DB.prepare(`
      SELECT google_access_token, google_token_expiry, google_refresh_token
      FROM user_integrations
      WHERE user_id = ? AND sync_enabled = 1
    `).bind(userId).first() as any

    if (!integration?.google_access_token) {
      console.log('⚠️ No hay integración de Google Calendar activa')
      return []
    }

    const accessToken = await getValidAccessToken(c, userId)

    // Obtener eventos del día
    const timeMin = `${fecha}T00:00:00Z`
    const timeMax = `${fecha}T23:59:59Z`

    const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events')
    url.searchParams.set('timeMin', timeMin)
    url.searchParams.set('timeMax', timeMax)
    url.searchParams.set('singleEvents', 'true')
    url.searchParams.set('orderBy', 'startTime')

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Error obteniendo eventos de Google:', response.status)
      return []
    }

    const data = await response.json()
    return data.items || []

  } catch (error) {
    console.error('Error en obtenerEventosGoogleCalendar:', error)
    return []
  }
}

/**
 * Detecta espacios libres en el calendario
 */
function detectarEspaciosLibres(
  eventos: any[],
  fecha: string,
  horaInicio: string,
  horaFin: string,
  bloqueoComida: boolean = false
): EspacioLibre[] {
  const espacios: EspacioLibre[] = []

  // Convertir horaInicio y horaFin a minutos desde medianoche
  const minutosInicio = convertirHoraAMinutos(horaInicio)
  const minutosFin = convertirHoraAMinutos(horaFin)

  // Extraer y ordenar los eventos por hora de inicio
  const eventosOrdenados = eventos
    .filter(e => e.start?.dateTime) // Solo eventos con hora (no all-day)
    .map(e => ({
      inicio: new Date(e.start.dateTime).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      fin: new Date(e.end.dateTime).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }))
    .sort((a, b) => convertirHoraAMinutos(a.inicio) - convertirHoraAMinutos(b.inicio))

  // 🍽️ Si bloqueoComida está activo, agregar evento ficticio de 2-4pm
  if (bloqueoComida) {
    eventosOrdenados.push({
      inicio: '14:00',
      fin: '16:00'
    })
    // Re-ordenar después de agregar el bloqueo
    eventosOrdenados.sort((a, b) => convertirHoraAMinutos(a.inicio) - convertirHoraAMinutos(b.inicio))
    console.log('🍽️ Bloqueo de comida 2-4pm agregado')
  }

  // Si no hay eventos, todo el día es espacio libre
  if (eventosOrdenados.length === 0) {
    return [{
      inicio: horaInicio,
      fin: horaFin,
      duracion: minutosFin - minutosInicio
    }]
  }

  // Buscar espacios entre eventos
  let cursorActual = minutosInicio

  for (const evento of eventosOrdenados) {
    const eventoInicio = convertirHoraAMinutos(evento.inicio)
    const eventoFin = convertirHoraAMinutos(evento.fin)

    // Si hay espacio antes del evento
    if (cursorActual < eventoInicio) {
      const duracion = eventoInicio - cursorActual
      if (duracion >= 15) { // Mínimo 15 minutos
        espacios.push({
          inicio: convertirMinutosAHora(cursorActual),
          fin: convertirMinutosAHora(eventoInicio),
          duracion
        })
      }
    }

    // Mover cursor al fin del evento
    cursorActual = Math.max(cursorActual, eventoFin)
  }

  // Espacio después del último evento
  if (cursorActual < minutosFin) {
    const duracion = minutosFin - cursorActual
    if (duracion >= 15) {
      espacios.push({
        inicio: convertirMinutosAHora(cursorActual),
        fin: convertirMinutosAHora(minutosFin),
        duracion
      })
    }
  }

  return espacios
}

/**
 * Algoritmo de scheduling: asigna acciones a espacios libres
 */
function algoritmoScheduling(
  acciones: AccionParaAgendar[],
  espaciosLibres: EspacioLibre[]
): AccionParaAgendar[] {
  const accionesAgendadas: AccionParaAgendar[] = []
  const espaciosDisponibles = [...espaciosLibres] // Copia para modificar

  // Ordenar acciones: primero enfoque del día, luego por prioridad y tipo
  const accionesOrdenadas = [...acciones].sort((a, b) => {
    // 1. Enfoque del día primero
    if (a.es_enfoque_dia && !b.es_enfoque_dia) return -1
    if (!a.es_enfoque_dia && b.es_enfoque_dia) return 1

    // 2. Prioridad
    const prioridadA = a.prioridad === 'alta' ? 1 : a.prioridad === 'media' ? 2 : 3
    const prioridadB = b.prioridad === 'alta' ? 1 : b.prioridad === 'media' ? 2 : 3
    if (prioridadA !== prioridadB) return prioridadA - prioridadB

    // 3. Tipo (primarias antes que secundarias)
    if (a.tipo === 'primaria' && b.tipo === 'secundaria') return -1
    if (a.tipo === 'secundaria' && b.tipo === 'primaria') return 1

    return 0
  })

  for (const accion of accionesOrdenadas) {
    const duracionNecesaria = accion.duracion_minutos || 15

    // Buscar el primer espacio que quepa
    for (let i = 0; i < espaciosDisponibles.length; i++) {
      const espacio = espaciosDisponibles[i]

      if (espacio.duracion >= duracionNecesaria) {
        // Asignar acción a este espacio
        const accionAgendada = {
          ...accion,
          hora_evento: espacio.inicio
        }
        accionesAgendadas.push(accionAgendada)

        // Reducir o eliminar el espacio usado
        const minutosInicio = convertirHoraAMinutos(espacio.inicio)
        const nuevoComienzo = minutosInicio + duracionNecesaria

        if (espacio.duracion > duracionNecesaria) {
          // Actualizar el espacio restante
          espaciosDisponibles[i] = {
            inicio: convertirMinutosAHora(nuevoComienzo),
            fin: espacio.fin,
            duracion: espacio.duracion - duracionNecesaria
          }
        } else {
          // Eliminar el espacio completamente
          espaciosDisponibles.splice(i, 1)
        }

        break // Pasar a la siguiente acción
      }
    }
  }

  return accionesAgendadas
}

/**
 * Exporta una acción a Google Calendar
 */
async function exportarAccionAGoogle(accessToken: string, accion: any, fecha: string) {
  const startDateTime = `${fecha}T${accion.hora_evento}:00`
  const duracion = accion.duracion_minutos || 15
  const endDateTime = new Date(
    new Date(startDateTime).getTime() + duracion * 60000
  ).toISOString().split('.')[0]

  const emojis: any = {
    empresarial: '💼',
    material: '💎',
    humano: '❤️'
  }

  const colorIds: any = {
    empresarial: '1', // Azul
    material: '5',    // Amarillo
    humano: '11'      // Rojo
  }

  const emoji = accion.area ? emojis[accion.area] || '📋' : '📋'
  const colorId = accion.area ? colorIds[accion.area] || '7' : '7'

  const eventData = {
    summary: `${emoji} ${accion.titulo}`,
    description: `Tipo: ${accion.tipo === 'primaria' ? 'Primaria (semanal)' : 'Secundaria (diaria)'}\nPrioridad: ${accion.prioridad}\n\n🎯 Yo Decreto App`,
    start: { dateTime: startDateTime, timeZone: 'America/Mexico_City' },
    end: { dateTime: endDateTime, timeZone: 'America/Mexico_City' },
    colorId: colorId,
    reminders: {
      useDefault: false,
      overrides: [{ method: 'popup', minutes: 10 }]
    }
  }

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error creando evento en Google Calendar')
  }

  return response.json()
}

/**
 * Obtiene un access token válido (reutiliza de google-calendar.ts)
 */
async function getValidAccessToken(c: any, userId: string): Promise<string> {
  const db = c.env.DB
  const integration = await db.prepare(`
    SELECT google_access_token, google_token_expiry, google_refresh_token
    FROM user_integrations
    WHERE user_id = ?
  `).bind(userId).first() as any

  if (!integration?.google_access_token) {
    throw new Error('No access token available')
  }

  // Verificar si expiró
  const now = new Date()
  const expiry = new Date(integration.google_token_expiry)

  if (now >= expiry && integration.google_refresh_token) {
    // Refrescar token
    const clientId = c.env.GOOGLE_CLIENT_ID
    const clientSecret = c.env.GOOGLE_CLIENT_SECRET

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        refresh_token: integration.google_refresh_token,
        grant_type: 'refresh_token'
      })
    })

    const tokens = await response.json()
    if (response.ok) {
      const expiryDate = new Date(Date.now() + (tokens.expires_in * 1000)).toISOString()
      await db.prepare(`
        UPDATE user_integrations
        SET google_access_token = ?, google_token_expiry = ?
        WHERE user_id = ?
      `).bind(tokens.access_token, expiryDate, userId).run()

      return tokens.access_token
    }
  }

  return integration.google_access_token
}

// ============================================
// 🛠️ UTILIDADES
// ============================================

function convertirHoraAMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

function convertirMinutosAHora(minutos: number): string {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function formatearFecha(fecha: string): string {
  const date = new Date(fecha)
  const opciones: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return date.toLocaleDateString('es-ES', opciones)
}
