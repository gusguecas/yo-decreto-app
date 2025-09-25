import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

export const progresoRoutes = new Hono<{ Bindings: Bindings }>()

// Obtener métricas generales
progresoRoutes.get('/metricas', async (c) => {
  try {
    // Obtener todas las acciones
    const totalAcciones = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM acciones'
    ).first()

    const completadas = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM acciones WHERE estado = "completada"'
    ).first()

    const pendientes = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM acciones WHERE estado IN ("pendiente", "en_progreso")'
    ).first()

    const total = totalAcciones?.total || 0
    const completadasCount = completadas?.total || 0
    const pendientesCount = pendientes?.total || 0
    const progresoGlobal = total > 0 ? Math.round((completadasCount / total) * 100) : 0

    return c.json({
      success: true,
      data: {
        total_tareas: total,
        completadas: completadasCount,
        pendientes: pendientesCount,
        progreso_global: progresoGlobal
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener métricas' }, 500)
  }
})

// Obtener progreso por decreto
progresoRoutes.get('/por-decreto', async (c) => {
  try {
    const progresoDecretos = await c.env.DB.prepare(`
      SELECT 
        d.id,
        d.titulo,
        d.area,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN a.estado IN ('pendiente', 'en_progreso') THEN 1 END) as pendientes,
        CASE 
          WHEN COUNT(a.id) > 0 
          THEN ROUND((COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) * 100.0) / COUNT(a.id))
          ELSE 0 
        END as progreso_porcentaje
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.id, d.titulo, d.area
      ORDER BY d.area, d.created_at
    `).all()

    // Agrupar por área
    const porArea = {
      empresarial: [],
      material: [],
      humano: []
    }

    for (const decreto of progresoDecretos.results as any[]) {
      if (porArea[decreto.area as keyof typeof porArea]) {
        porArea[decreto.area as keyof typeof porArea].push(decreto)
      }
    }

    // Calcular totales por área
    const totalesPorArea = {
      empresarial: {
        total_acciones: porArea.empresarial.reduce((sum, d) => sum + d.total_acciones, 0),
        completadas: porArea.empresarial.reduce((sum, d) => sum + d.completadas, 0),
        progreso: 0
      },
      material: {
        total_acciones: porArea.material.reduce((sum, d) => sum + d.total_acciones, 0),
        completadas: porArea.material.reduce((sum, d) => sum + d.completadas, 0),
        progreso: 0
      },
      humano: {
        total_acciones: porArea.humano.reduce((sum, d) => sum + d.total_acciones, 0),
        completadas: porArea.humano.reduce((sum, d) => sum + d.completadas, 0),
        progreso: 0
      }
    }

    // Calcular progreso por área
    Object.keys(totalesPorArea).forEach(area => {
      const areaData = totalesPorArea[area as keyof typeof totalesPorArea]
      areaData.progreso = areaData.total_acciones > 0 
        ? Math.round((areaData.completadas / areaData.total_acciones) * 100) 
        : 0
    })

    return c.json({
      success: true,
      data: {
        decretos: progresoDecretos.results,
        por_area: porArea,
        totales_por_area: totalesPorArea
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener progreso por decreto' }, 500)
  }
})

// Obtener timeline de avances (hitos completados)
progresoRoutes.get('/timeline', async (c) => {
  try {
    const { periodo } = c.req.query() // día, semana, mes, acumulado
    
    let whereClause = ''
    const params: any[] = []
    
    switch (periodo) {
      case 'dia':
        whereClause = 'WHERE a.fecha_cierre = date("now")'
        break
      case 'semana':
        whereClause = 'WHERE a.fecha_cierre >= date("now", "-7 days")'
        break
      case 'mes':
        whereClause = 'WHERE a.fecha_cierre >= date("now", "-30 days")'
        break
      default:
        // acumulado - sin filtro
        break
    }

    const hitos = await c.env.DB.prepare(`
      SELECT 
        a.titulo,
        a.fecha_cierre,
        a.tipo,
        a.calificacion,
        d.titulo as decreto_titulo,
        d.area,
        s.que_se_hizo,
        s.resultados_obtenidos
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      LEFT JOIN seguimientos s ON a.id = s.accion_id
      ${whereClause}
      AND a.estado = 'completada'
      ORDER BY a.fecha_cierre DESC, a.updated_at DESC
      LIMIT 50
    `).bind(...params).all()

    return c.json({
      success: true,
      data: hitos.results
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener timeline' }, 500)
  }
})

// Obtener evolución de tareas completadas (para gráfico de línea)
progresoRoutes.get('/evolucion', async (c) => {
  try {
    const { dias = 30 } = c.req.query()
    
    const evolucion = await c.env.DB.prepare(`
      SELECT 
        fecha_cierre,
        COUNT(*) as completadas_dia,
        SUM(COUNT(*)) OVER (ORDER BY fecha_cierre) as acumuladas
      FROM acciones
      WHERE estado = 'completada' 
        AND fecha_cierre >= date('now', '-' || ? || ' days')
        AND fecha_cierre IS NOT NULL
      GROUP BY fecha_cierre
      ORDER BY fecha_cierre
    `).bind(dias).all()

    return c.json({
      success: true,
      data: evolucion.results
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener evolución' }, 500)
  }
})

// Obtener datos para gráfico circular (distribución por área)
progresoRoutes.get('/distribucion', async (c) => {
  try {
    const distribucion = await c.env.DB.prepare(`
      SELECT 
        d.area,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.area
    `).all()

    return c.json({
      success: true,
      data: distribucion.results
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener distribución' }, 500)
  }
})

// Generar datos para reporte (exportar PDF - se prepara la data)
progresoRoutes.get('/reporte', async (c) => {
  try {
    // Métricas generales
    const metricas = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_tareas,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado IN ('pendiente', 'en_progreso') THEN 1 END) as pendientes,
        COUNT(DISTINCT decreto_id) as total_decretos
      FROM acciones
    `).first()

    // Progreso por decreto
    const decretos = await c.env.DB.prepare(`
      SELECT 
        d.titulo,
        d.area,
        d.sueno_meta,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas,
        CASE 
          WHEN COUNT(a.id) > 0 
          THEN ROUND((COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) * 100.0) / COUNT(a.id))
          ELSE 0 
        END as progreso
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.id, d.titulo, d.area, d.sueno_meta
      ORDER BY progreso DESC
    `).all()

    // Últimos logros
    const logros = await c.env.DB.prepare(`
      SELECT 
        a.titulo,
        a.fecha_cierre,
        d.titulo as decreto_titulo,
        d.area,
        s.resultados_obtenidos
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      LEFT JOIN seguimientos s ON a.id = s.accion_id
      WHERE a.estado = 'completada'
      ORDER BY a.fecha_cierre DESC
      LIMIT 10
    `).all()

    // Configuración del usuario
    const config = await c.env.DB.prepare(
      'SELECT * FROM configuracion WHERE id = ?'
    ).bind('main').first()

    const fecha_reporte = new Date().toISOString().split('T')[0]
    const progreso_global = metricas?.total_tareas > 0 
      ? Math.round(((metricas?.completadas || 0) / metricas.total_tareas) * 100) 
      : 0

    return c.json({
      success: true,
      data: {
        fecha_reporte,
        usuario: config || { nombre_usuario: 'Usuario', frase_vida: '' },
        metricas: {
          ...metricas,
          progreso_global
        },
        decretos: decretos.results,
        ultimos_logros: logros.results
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al generar reporte' }, 500)
  }
})

// Obtener estadísticas adicionales
progresoRoutes.get('/estadisticas', async (c) => {
  try {
    // Promedio de calificaciones
    const promedioCalif = await c.env.DB.prepare(
      'SELECT AVG(calificacion) as promedio FROM acciones WHERE calificacion IS NOT NULL'
    ).first()

    // Tareas por tipo
    const porTipo = await c.env.DB.prepare(`
      SELECT 
        tipo,
        COUNT(*) as cantidad,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas
      FROM acciones
      GROUP BY tipo
    `).all()

    // Días más productivos (más tareas completadas)
    const diasProductivos = await c.env.DB.prepare(`
      SELECT 
        fecha_cierre,
        COUNT(*) as tareas_completadas
      FROM acciones
      WHERE estado = 'completada' AND fecha_cierre IS NOT NULL
      GROUP BY fecha_cierre
      ORDER BY tareas_completadas DESC
      LIMIT 5
    `).all()

    return c.json({
      success: true,
      data: {
        promedio_calificacion: promedioCalif?.promedio || 0,
        por_tipo: porTipo.results,
        dias_mas_productivos: diasProductivos.results
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener estadísticas' }, 500)
  }
})