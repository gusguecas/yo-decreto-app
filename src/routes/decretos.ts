import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

export const decretosRoutes = new Hono<{ Bindings: Bindings }>()

// Obtener configuración del usuario
decretosRoutes.get('/config', async (c) => {
  try {
    const config = await c.env.DB.prepare(
      'SELECT * FROM configuracion WHERE id = ?'
    ).bind('main').first()

    return c.json({
      success: true,
      data: config || {
        nombre_usuario: 'Gustavo Adolfo Guerrero Castaños',
        frase_vida: '(Agregar frase de vida)'
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener configuración' }, 500)
  }
})

// Actualizar configuración del usuario
decretosRoutes.put('/config', async (c) => {
  try {
    const { nombre_usuario, frase_vida } = await c.req.json()
    
    await c.env.DB.prepare(
      'UPDATE configuracion SET nombre_usuario = ?, frase_vida = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(nombre_usuario, frase_vida, 'main').run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al actualizar configuración' }, 500)
  }
})

// Obtener todos los decretos con contadores
decretosRoutes.get('/', async (c) => {
  try {
    // Obtener todos los decretos
    const decretos = await c.env.DB.prepare(
      'SELECT * FROM decretos ORDER BY created_at DESC'
    ).all()

    // Calcular contadores
    const contadores = {
      total: decretos.results.length,
      empresarial: decretos.results.filter((d: any) => d.area === 'empresarial').length,
      material: decretos.results.filter((d: any) => d.area === 'material').length,
      humano: decretos.results.filter((d: any) => d.area === 'humano').length,
    }

    // Calcular porcentajes
    const porcentajes = {
      empresarial: contadores.total > 0 ? Math.round((contadores.empresarial / contadores.total) * 100) : 0,
      material: contadores.total > 0 ? Math.round((contadores.material / contadores.total) * 100) : 0,
      humano: contadores.total > 0 ? Math.round((contadores.humano / contadores.total) * 100) : 0,
    }

    return c.json({
      success: true,
      data: {
        decretos: decretos.results,
        contadores,
        porcentajes
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener decretos' }, 500)
  }
})

// Obtener un decreto específico con sus acciones
decretosRoutes.get('/:id', async (c) => {
  try {
    const decretoId = c.req.param('id')
    
    // Obtener decreto
    const decreto = await c.env.DB.prepare(
      'SELECT * FROM decretos WHERE id = ?'
    ).bind(decretoId).first()

    if (!decreto) {
      return c.json({ success: false, error: 'Decreto no encontrado' }, 404)
    }

    // Obtener acciones del decreto
    const acciones = await c.env.DB.prepare(
      'SELECT * FROM acciones WHERE decreto_id = ? ORDER BY created_at DESC'
    ).bind(decretoId).all()

    // Calcular métricas
    const totalAcciones = acciones.results.length
    const completadas = acciones.results.filter((a: any) => a.estado === 'completada').length
    const pendientes = totalAcciones - completadas

    // Recalcular progreso del decreto
    const progreso = totalAcciones > 0 ? Math.round((completadas / totalAcciones) * 100) : 0
    
    // Actualizar progreso en BD
    await c.env.DB.prepare(
      'UPDATE decretos SET progreso = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(progreso, decretoId).run()

    return c.json({
      success: true,
      data: {
        decreto: { ...decreto, progreso },
        acciones: acciones.results,
        metricas: {
          total_acciones: totalAcciones,
          completadas,
          pendientes,
          progreso
        }
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener decreto' }, 500)
  }
})

// Crear nuevo decreto
decretosRoutes.post('/', async (c) => {
  try {
    const { area, titulo, sueno_meta, descripcion } = await c.req.json()
    
    if (!area || !titulo || !sueno_meta) {
      return c.json({ success: false, error: 'Campos requeridos: area, titulo, sueno_meta' }, 400)
    }

    const result = await c.env.DB.prepare(
      'INSERT INTO decretos (area, titulo, sueno_meta, descripcion) VALUES (?, ?, ?, ?)'
    ).bind(area, titulo, sueno_meta, descripcion || '').run()

    return c.json({ success: true, id: result.meta.last_row_id })
  } catch (error) {
    return c.json({ success: false, error: 'Error al crear decreto' }, 500)
  }
})

// Actualizar decreto
decretosRoutes.put('/:id', async (c) => {
  try {
    const decretoId = c.req.param('id')
    const { area, titulo, sueno_meta, descripcion } = await c.req.json()
    
    await c.env.DB.prepare(
      'UPDATE decretos SET area = ?, titulo = ?, sueno_meta = ?, descripcion = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(area, titulo, sueno_meta, descripcion || '', decretoId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al actualizar decreto' }, 500)
  }
})

// Eliminar decreto y todo lo asociado
decretosRoutes.delete('/:id', async (c) => {
  try {
    const decretoId = c.req.param('id')
    
    // Eliminar en cascada (configurado en FK)
    await c.env.DB.prepare('DELETE FROM decretos WHERE id = ?').bind(decretoId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al eliminar decreto' }, 500)
  }
})

// RUTAS DE ACCIONES

// Crear nueva acción
decretosRoutes.post('/:id/acciones', async (c) => {
  try {
    const decretoId = c.req.param('id')
    const { 
      titulo, 
      que_hacer, 
      como_hacerlo, 
      resultados, 
      tareas_pendientes, 
      tipo, 
      proxima_revision, 
      calificacion 
    } = await c.req.json()
    
    if (!titulo || !que_hacer) {
      return c.json({ success: false, error: 'Campos requeridos: titulo, que_hacer' }, 400)
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO acciones (
        decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
        tareas_pendientes, tipo, proxima_revision, calificacion, origen
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual')
    `).bind(
      decretoId, titulo, que_hacer, como_hacerlo || '', resultados || '',
      JSON.stringify(tareas_pendientes || []), tipo || 'secundaria',
      proxima_revision || null, calificacion || null
    ).run()

    // Si hay proxima_revision, crear evento en agenda
    if (proxima_revision) {
      await c.env.DB.prepare(`
        INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento)
        VALUES (?, ?, ?, date(?), time(?))
      `).bind(
        result.meta.last_row_id,
        `[Decreto] ${titulo}`,
        `${que_hacer} - ${como_hacerlo}`,
        proxima_revision.split('T')[0],
        proxima_revision.split('T')[1] || '09:00'
      ).run()
    }

    return c.json({ success: true, id: result.meta.last_row_id })
  } catch (error) {
    return c.json({ success: false, error: 'Error al crear acción' }, 500)
  }
})

// Completar acción
decretosRoutes.put('/:decretoId/acciones/:accionId/completar', async (c) => {
  try {
    const accionId = c.req.param('accionId')
    
    await c.env.DB.prepare(
      'UPDATE acciones SET estado = "completada", fecha_cierre = date("now"), updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(accionId).run()

    // Marcar evento de agenda como completado
    await c.env.DB.prepare(
      'UPDATE agenda_eventos SET estado = "completada", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?'
    ).bind(accionId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al completar acción' }, 500)
  }
})

// Eliminar acción
decretosRoutes.delete('/:decretoId/acciones/:accionId', async (c) => {
  try {
    const accionId = c.req.param('accionId')
    
    await c.env.DB.prepare('DELETE FROM acciones WHERE id = ?').bind(accionId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al eliminar acción' }, 500)
  }
})

// Crear seguimiento de acción
decretosRoutes.post('/:decretoId/acciones/:accionId/seguimientos', async (c) => {
  try {
    const accionId = c.req.param('accionId')
    const { 
      que_se_hizo, 
      como_se_hizo, 
      resultados_obtenidos, 
      tareas_pendientes, 
      proxima_revision, 
      calificacion 
    } = await c.req.json()
    
    if (!que_se_hizo || !como_se_hizo || !resultados_obtenidos) {
      return c.json({ 
        success: false, 
        error: 'Campos requeridos: que_se_hizo, como_se_hizo, resultados_obtenidos' 
      }, 400)
    }

    // Crear seguimiento
    await c.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      accionId, que_se_hizo, como_se_hizo, resultados_obtenidos,
      JSON.stringify(tareas_pendientes || []), proxima_revision || null, calificacion || null
    ).run()

    // Actualizar acción con nueva información
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
      accionId
    ).run()

    // Crear nuevas tareas si hay tareas_pendientes
    let nuevasTareas = 0
    if (tareas_pendientes && Array.isArray(tareas_pendientes)) {
      for (const tarea of tareas_pendientes) {
        if (typeof tarea === 'string' && tarea.trim()) {
          let textoTarea = tarea.trim()
          let tipo = 'secundaria'
          let fechaRevision = null

          // Detectar prefijos para tipo
          if (textoTarea.startsWith('[P]') || textoTarea.includes('#primaria')) {
            tipo = 'primaria'
            textoTarea = textoTarea.replace(/\[P\]|#primaria/g, '').trim()
          }
          if (textoTarea.includes('#diaria')) {
            tipo = 'secundaria'
            textoTarea = textoTarea.replace(/#diaria/g, '').trim()
          }

          // Detectar fecha @YYYY-MM-DD
          const fechaMatch = textoTarea.match(/@(\d{4}-\d{2}-\d{2})/)
          if (fechaMatch) {
            fechaRevision = fechaMatch[1] + 'T09:00'
            textoTarea = textoTarea.replace(/@\d{4}-\d{2}-\d{2}/g, '').trim()
          }

          // Obtener decreto_id de la acción original
          const accionOriginal = await c.env.DB.prepare(
            'SELECT decreto_id FROM acciones WHERE id = ?'
          ).bind(accionId).first()

          if (accionOriginal) {
            // Crear nueva acción
            const resultNuevaAccion = await c.env.DB.prepare(`
              INSERT INTO acciones (
                decreto_id, titulo, que_hacer, como_hacerlo, tipo, 
                proxima_revision, origen
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `).bind(
              accionOriginal.decreto_id,
              textoTarea,
              `Tarea generada desde seguimiento`,
              `Completar: ${textoTarea}`,
              tipo,
              fechaRevision,
              `seguimiento:${accionId}`
            ).run()

            // Si hay fecha, crear evento agenda
            if (fechaRevision) {
              await c.env.DB.prepare(`
                INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento)
                VALUES (?, ?, ?, date(?), time(?))
              `).bind(
                resultNuevaAccion.meta.last_row_id,
                `[Decreto] ${textoTarea}`,
                `Tarea generada desde seguimiento`,
                fechaRevision.split('T')[0],
                fechaRevision.split('T')[1]
              ).run()
            }

            nuevasTareas++
          }
        }
      }
    }

    return c.json({ 
      success: true, 
      message: `Seguimiento guardado. ${nuevasTareas} tareas nuevas creadas.`
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al crear seguimiento' }, 500)
  }
})

// Obtener sugerencias para un decreto
decretosRoutes.get('/:id/sugerencias', async (c) => {
  try {
    const decretoId = c.req.param('id')
    
    // Obtener decreto para contexto
    const decreto = await c.env.DB.prepare(
      'SELECT * FROM decretos WHERE id = ?'
    ).bind(decretoId).first()

    if (!decreto) {
      return c.json({ success: false, error: 'Decreto no encontrado' }, 404)
    }

    // Generar sugerencias basadas en el área del decreto
    let sugerencias: string[] = []
    
    switch (decreto.area) {
      case 'empresarial':
        sugerencias = [
          'Analizar competencia directa y ventajas competitivas',
          'Definir métricas clave de rendimiento (KPIs)',
          'Desarrollar plan de marketing digital',
          'Establecer alianzas estratégicas',
          'Optimizar procesos operativos'
        ]
        break
      case 'material':
        sugerencias = [
          'Revisar y optimizar presupuesto mensual',
          'Investigar nuevas oportunidades de inversión',
          'Crear fondo de emergencia',
          'Diversificar fuentes de ingresos',
          'Consultar con asesor financiero'
        ]
        break
      case 'humano':
        sugerencias = [
          'Establecer rutina de ejercicio diario',
          'Practicar meditación mindfulness',
          'Fortalecer relaciones familiares',
          'Desarrollar nuevas habilidades',
          'Cultivar hábitos de sueño saludables'
        ]
        break
      default:
        sugerencias = [
          'Definir objetivos específicos y medibles',
          'Crear plan de acción detallado',
          'Establecer fechas límite realistas',
          'Buscar recursos y herramientas necesarias',
          'Programar revisiones de progreso'
        ]
    }

    return c.json({
      success: true,
      data: sugerencias.map((texto, index) => ({
        id: `sugerencia_${index + 1}`,
        texto,
        categoria: decreto.area
      }))
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al generar sugerencias' }, 500)
  }
})