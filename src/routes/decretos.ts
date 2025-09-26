import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

// Función auxiliar para sincronizar acciones con agenda - LÓGICA SIMPLE CORRECTA
async function sincronizarAccionConAgenda(
  db: D1Database, 
  accionId: string, 
  titulo: string, 
  queHacer: string, 
  comoHacerlo: string | null, 
  tipo: string, 
  proximaRevision: string | null
) {
  try {
    console.log('📅 Sincronizando con agenda:', { accionId, titulo, proximaRevision })
    
    if (proximaRevision) {
      // LÓGICA SIMPLE: Separar fecha y hora correctamente
      const fechaParte = proximaRevision.split('T')[0]
      const horaParte = proximaRevision.split('T')[1] || '09:00'
      
      console.log('📅 Creando evento agenda:', { fechaParte, horaParte })
      
      // Crear evento en agenda_eventos con campos CORRECTOS
      const result = await db.prepare(`
        INSERT INTO agenda_eventos (
          accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad, estado,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        accionId,
        `[Decreto] ${titulo}`,
        `${queHacer}${comoHacerlo ? ' - ' + comoHacerlo : ''}`,
        fechaParte,
        horaParte,
        'media' // Prioridad por defecto para decretos
      ).run()
      
      console.log('✅ Evento agenda creado:', result.meta.last_row_id)
    } else {
      console.log('⏭️ Sin fecha programada, no se crea evento agenda')
    }
  } catch (error) {
    console.error('❌ Error al sincronizar con agenda:', error)
    // No fallar la creación de la acción por esto
  }
}

export const decretosRoutes = new Hono<{ Bindings: Bindings }>()

// Endpoint para forzar sincronización completa de todas las acciones
decretosRoutes.post('/sincronizar-agenda', async (c) => {
  try {
    console.log('🔄 Iniciando sincronización completa de agenda...')
    
    // Obtener todas las acciones que no tienen evento de agenda
    const acciones = await c.env.DB.prepare(`
      SELECT a.*, d.titulo as decreto_titulo 
      FROM acciones a 
      LEFT JOIN decretos d ON a.decreto_id = d.id
      LEFT JOIN agenda_eventos ae ON a.id = ae.accion_id
      WHERE ae.id IS NULL
    `).all()
    
    console.log(`📋 Encontradas ${acciones.results.length} acciones sin sincronizar`)
    
    let sincronizadas = 0
    
    for (const accion of acciones.results as any[]) {
      // Crear fecha de próxima revisión si no existe
      let proximaRevision = accion.proxima_revision
      if (!proximaRevision) {
        // Crear fecha para mañana a las 9 AM
        const mañana = new Date()
        mañana.setDate(mañana.getDate() + 1)
        proximaRevision = `${mañana.toISOString().split('T')[0]}T09:00`
        
        // Actualizar la acción con la nueva fecha
        await c.env.DB.prepare(`
          UPDATE acciones SET proxima_revision = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `).bind(proximaRevision, accion.id).run()
      }
      
      // Sincronizar con agenda
      await sincronizarAccionConAgenda(
        c.env.DB, 
        accion.id,
        accion.titulo,
        accion.que_hacer,
        accion.como_hacerlo,
        accion.tipo,
        proximaRevision
      )
      
      sincronizadas++
    }
    
    console.log(`✅ Sincronización completa: ${sincronizadas} acciones sincronizadas`)
    
    return c.json({
      success: true,
      message: `Sincronización completa: ${sincronizadas} acciones sincronizadas con agenda`,
      sincronizadas
    })
  } catch (error) {
    console.error('❌ Error en sincronización:', error)
    return c.json({ 
      success: false, 
      error: 'Error al sincronizar agenda',
      details: error.message 
    }, 500)
  }
})

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

    // Calcular métricas con 3 estados
    const totalAcciones = acciones.results.length
    const completadas = acciones.results.filter((a: any) => a.estado === 'completada').length
    const enProgreso = acciones.results.filter((a: any) => a.estado === 'en_progreso').length
    const pendientes = acciones.results.filter((a: any) => a.estado === 'pendiente').length

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
          en_progreso: enProgreso,
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

// Crear nueva acción con soporte para sub-tareas simples
decretosRoutes.post('/:id/acciones', async (c) => {
  try {
    const decretoId = c.req.param('id')
    const requestData = await c.req.json()
    
    console.log('=== BACKEND: RECIBIENDO DATOS ===', {
      decretoId,
      requestDataKeys: Object.keys(requestData),
      hasSubtareas: 'subtareas' in requestData,
      subtareasLength: requestData.subtareas?.length || 0,
      subtareasData: requestData.subtareas
    })
    
    const { 
      titulo, 
      que_hacer, 
      como_hacerlo, 
      resultados, 
      tareas_pendientes, 
      tipo, 
      proxima_revision, 
      calificacion,
      decreto_tipo, // 🎯 NUEVO: Tipo de decreto obligatorio
      subtareas = [] // Sub-tareas simples
    } = requestData
    
    console.log('🎯 VALIDANDO TIPO DE DECRETO:', { decreto_tipo, decretoId })
    
    if (!titulo || !que_hacer) {
      return c.json({ success: false, error: 'Campos requeridos: titulo, que_hacer' }, 400)
    }
    
    // 🔴 VALIDACIÓN OBLIGATORIA: Tipo de decreto
    if (!decreto_tipo || !['Empresarial', 'Humano', 'Material'].includes(decreto_tipo)) {
      return c.json({ 
        success: false, 
        error: 'El tipo de decreto es obligatorio. Debe ser: Empresarial, Humano o Material' 
      }, 400)
    }
    
    // 🎯 CREAR O BUSCAR DECRETO DEL TIPO CORRECTO
    let decretoRealId = decretoId
    
    // Si no se especifica decreto (o es 'sin-decreto'), crear uno automático
    if (!decretoId || decretoId === 'sin-decreto' || decretoId === 'undefined') {
      console.log('🎯 Creando decreto automático tipo:', decreto_tipo)
      
      // Buscar si ya existe un decreto general de este tipo
      const decretoExistente = await c.env.DB.prepare(`
        SELECT id FROM decretos 
        WHERE area = ? AND titulo LIKE '%[Decreto General]%'
        LIMIT 1
      `).bind(decreto_tipo.toLowerCase()).first()
      
      if (decretoExistente) {
        decretoRealId = decretoExistente.id as string
        console.log('✅ Usando decreto existente:', decretoRealId)
      } else {
        // Crear nuevo decreto general
        decretoRealId = crypto.randomUUID().replace(/-/g, '').substring(0, 32)
        
        await c.env.DB.prepare(`
          INSERT INTO decretos (id, area, titulo, sueno_meta, descripcion)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          decretoRealId,
          decreto_tipo.toLowerCase(),
          `[Decreto General] ${decreto_tipo}`,
          `Mi meta es alcanzar el éxito en el área ${decreto_tipo.toLowerCase()}`,
          `Decreto automático para acciones del área ${decreto_tipo.toLowerCase()}`
        ).run()
        
        console.log('✅ Decreto automático creado:', decretoRealId)
      }
    }

    // Generar ID único para la acción principal
    const accionId = crypto.randomUUID().replace(/-/g, '').substring(0, 32)
    
    // Crear la acción principal usando el decreto correcto
    await c.env.DB.prepare(`
      INSERT INTO acciones (
        id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
        tareas_pendientes, tipo, proxima_revision, calificacion, origen
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual')
    `).bind(
      accionId, decretoRealId, titulo, que_hacer, como_hacerlo || '', resultados || '',
      JSON.stringify(tareas_pendientes || []), tipo || 'secundaria',
      proxima_revision || null, calificacion || null
    ).run()

    console.log('✅ Acción creada:', accionId)

    // FORZAR CREACIÓN EN AGENDA - SIEMPRE, SIN EXCUSAS
    if (proxima_revision) {
      console.log('🔥 FORZANDO creación en agenda para:', { accionId, titulo, proxima_revision })
      
      const fechaParte = proxima_revision.split('T')[0]
      const horaParte = proxima_revision.split('T')[1] || '09:00'
      
      try {
        const agendaResult = await c.env.DB.prepare(`
          INSERT INTO agenda_eventos (
            accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad, estado,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(
          accionId,
          `[Decreto] ${titulo}`,
          `${que_hacer}${como_hacerlo ? ' - ' + como_hacerlo : ''}`,
          fechaParte,
          horaParte,
          'media' // Prioridad por defecto para decretos
        ).run()
        
        console.log('🚀 AGENDA EVENTO CREADO EXITOSAMENTE:', agendaResult.meta.last_row_id)
      } catch (agendaError) {
        console.error('💥 ERROR CREANDO AGENDA EVENTO:', agendaError)
        // PERO NO FALLAR - la acción ya está creada
      }
    } else {
      console.log('⚠️ NO HAY FECHA DE REVISIÓN - NO SE CREA EVENTO AGENDA')
    }

    // Crear sub-tareas si las hay
    let subtareasCreadas = 0
    console.log('=== PROCESANDO SUB-TAREAS ===', {
      hasSubtareas: Boolean(subtareas),
      subtareasLength: subtareas?.length || 0,
      subtareasData: subtareas
    })
    
    if (subtareas && subtareas.length > 0) {
      console.log(`Procesando ${subtareas.length} sub-tareas...`)
      
      for (let i = 0; i < subtareas.length; i++) {
        const subtarea = subtareas[i]
        console.log(`Sub-tarea ${i + 1}:`, subtarea)
        
        if (subtarea.titulo) {
          const subtareaId = crypto.randomUUID().replace(/-/g, '').substring(0, 32)
          
          // Usar la fecha programada de la subtarea o calcular basada en la acción principal
          let fechaSubtarea = subtarea.fecha_programada
          if (!fechaSubtarea && proxima_revision) {
            // Si no tiene fecha específica, usar la misma de la acción principal
            fechaSubtarea = proxima_revision
          }
          
          console.log(`Creando sub-tarea ${i + 1} con ID: ${subtareaId}`, {
            titulo: subtarea.titulo,
            queHacer: subtarea.que_hacer,
            fecha: fechaSubtarea,
            padreId: accionId
          })
          
          // Crear la sub-tarea como acción independiente
          const subtareaResult = await c.env.DB.prepare(`
            INSERT INTO acciones (
              id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
              tipo, proxima_revision, origen, tarea_padre_id, nivel_jerarquia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            subtareaId, decretoId, subtarea.titulo, subtarea.que_hacer,
            subtarea.como_hacerlo || '', '', 'secundaria', fechaSubtarea, 'subtarea', accionId, 1
          ).run()
          
          console.log(`✅ Sub-tarea ${i + 1} creada en BD:`, {
            success: subtareaResult.success,
            changes: subtareaResult.changes
          })
          
          // Sincronizar sub-tarea con agenda si tiene fecha
          if (fechaSubtarea) {
            await sincronizarAccionConAgenda(c.env.DB, subtareaId, `[Sub] ${subtarea.titulo}`, 
              subtarea.que_hacer, subtarea.como_hacerlo, 'secundaria', fechaSubtarea)
            console.log(`✅ Sub-tarea ${i + 1} sincronizada con agenda`)
          }
          
          subtareasCreadas++
        } else {
          console.log(`⏭️ Sub-tarea ${i + 1} sin título, saltando`)
        }
      }
    } else {
      console.log('No hay sub-tareas para procesar')
    }
    
    console.log(`=== SUB-TAREAS COMPLETADAS: ${subtareasCreadas} ===`)

    console.log('=== RESPUESTA FINAL ===', {
      success: true,
      accionId,
      subtareasCreadas
    })

    return c.json({ 
      success: true, 
      id: accionId,
      data: {
        subtareas_creadas: subtareasCreadas
      }
    })
  } catch (error) {
    console.error('Error creating action:', error)
    return c.json({ success: false, error: `Error al crear acción: ${error.message}` }, 500)
  }
})

// Obtener detalles de una acción específica
decretosRoutes.get('/:decretoId/acciones/:accionId', async (c) => {
  try {
    const decretoId = c.req.param('decretoId')
    const accionId = c.req.param('accionId')
    
    // Obtener acción con información del decreto
    const accion = await c.env.DB.prepare(`
      SELECT 
        a.*,
        d.titulo as decreto_titulo,
        d.sueno_meta,
        d.descripcion as decreto_descripcion,
        d.area
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      WHERE a.id = ? AND a.decreto_id = ?
    `).bind(accionId, decretoId).first()

    if (!accion) {
      return c.json({ success: false, error: 'Acción no encontrada' }, 404)
    }

    // Parsear tareas_pendientes si existe
    if (accion.tareas_pendientes) {
      try {
        accion.tareas_pendientes = JSON.parse(accion.tareas_pendientes)
      } catch (e) {
        accion.tareas_pendientes = []
      }
    }

    return c.json({
      success: true,
      data: accion
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener detalles de la acción' }, 500)
  }
})

// Editar acción
decretosRoutes.put('/:decretoId/acciones/:accionId', async (c) => {
  try {
    const decretoId = c.req.param('decretoId')
    const accionId = c.req.param('accionId')
    const { 
      titulo,
      que_hacer,
      como_hacerlo,
      resultados,
      tipo,
      proxima_revision,
      calificacion
    } = await c.req.json()
    
    if (!titulo || !que_hacer) {
      return c.json({ 
        success: false, 
        error: 'Campos requeridos: titulo, que_hacer' 
      }, 400)
    }

    // Actualizar acción
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
      WHERE id = ? AND decreto_id = ?
    `).bind(
      titulo,
      que_hacer,
      como_hacerlo || '',
      resultados || '',
      tipo || 'secundaria',
      proxima_revision || null,
      calificacion || null,
      accionId,
      decretoId
    ).run()

    // Si hay evento de agenda asociado, actualizarlo también
    const agendaEvent = await c.env.DB.prepare(
      'SELECT id FROM agenda_eventos WHERE accion_id = ?'
    ).bind(accionId).first()

    if (agendaEvent && proxima_revision) {
      const fechaParte = proxima_revision.split('T')[0]
      const horaParte = proxima_revision.split('T')[1] || '09:00'
      
      await c.env.DB.prepare(`
        UPDATE agenda_eventos SET 
          titulo = ?,
          fecha_evento = ?,
          hora_evento = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE accion_id = ?
      `).bind(
        `[Decreto] ${titulo}`,
        fechaParte,
        horaParte,
        accionId
      ).run()
    }

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al editar acción' }, 500)
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

// Marcar acción como pendiente
decretosRoutes.put('/:decretoId/acciones/:accionId/pendiente', async (c) => {
  try {
    const accionId = c.req.param('accionId')
    
    await c.env.DB.prepare(
      'UPDATE acciones SET estado = "pendiente", fecha_cierre = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(accionId).run()

    // Marcar evento de agenda como pendiente
    await c.env.DB.prepare(
      'UPDATE agenda_eventos SET estado = "pendiente", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?'
    ).bind(accionId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al marcar acción como pendiente' }, 500)
  }
})

// Iniciar acción (marcar como en progreso)
decretosRoutes.put('/:decretoId/acciones/:accionId/iniciar', async (c) => {
  try {
    const accionId = c.req.param('accionId')
    
    await c.env.DB.prepare(
      'UPDATE acciones SET estado = "en_progreso", fecha_cierre = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(accionId).run()

    // Marcar evento de agenda como en progreso (o mantener pendiente)
    await c.env.DB.prepare(
      'UPDATE agenda_eventos SET estado = "pendiente", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?'
    ).bind(accionId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al iniciar acción' }, 500)
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

// Endpoint de seguimientos movido a archivo separado

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

// ===== FUNCIONES AUXILIARES PARA TAREAS DERIVADAS =====

// Crear tareas derivadas recursivamente (máximo 2 niveles)
async function crearTareasDerivadas(
  db: D1Database, 
  decretoId: string, 
  tareadPadreId: string, 
  tareasDerivadas: any[], 
  fechaBasePadre: string | null,
  nivelActual: number
) {
  if (nivelActual > 2) {
    console.warn('Máximo 2 niveles de derivadas alcanzado, ignorando niveles adicionales')
    return
  }

  for (let i = 0; i < tareasDerivadas.length; i++) {
    const derivada = tareasDerivadas[i]
    const accionDerivadaId = crypto.randomUUID().replace(/-/g, '').substring(0, 32)
    
    // Calcular fecha de la tarea derivada basada en offset
    const fechaDerivada = calcularFechaConOffset(fechaBasePadre, derivada.dias_offset || 0)
    
    // Verificar si esta derivada tiene sus propias derivadas
    const tieneSubderivadas = derivada.tareas_derivadas && derivada.tareas_derivadas.length > 0
    
    // Crear la acción derivada
    await db.prepare(`
      INSERT INTO acciones (
        id, decreto_id, titulo, que_hacer, como_hacerlo, resultados,
        tipo, proxima_revision, calificacion, origen,
        tarea_padre_id, nivel_jerarquia, tiene_derivadas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'derivada', ?, ?, ?)
    `).bind(
      accionDerivadaId,
      decretoId,
      derivada.titulo,
      derivada.que_hacer || `Subtarea derivada de: ${tareadPadreId}`,
      derivada.como_hacerlo || '',
      derivada.resultados || '',
      derivada.tipo || 'secundaria',
      fechaDerivada,
      derivada.calificacion || null,
      tareadPadreId,
      nivelActual,
      tieneSubderivadas ? 1 : 0
    ).run()

    // Crear relación en tabla tareas_derivadas
    await db.prepare(`
      INSERT INTO tareas_derivadas (
        tarea_padre_id, tarea_hija_id, nivel, orden, dias_offset, tipo_relacion
      ) VALUES (?, ?, ?, ?, ?, 'derivada')
    `).bind(
      tareadPadreId,
      accionDerivadaId, 
      nivelActual,
      i + 1,
      derivada.dias_offset || 0
    ).run()

    // Sincronizar con agenda
    await sincronizarAccionConAgenda(
      db, 
      accionDerivadaId, 
      `[Derivada] ${derivada.titulo}`, 
      derivada.que_hacer, 
      derivada.como_hacerlo,
      derivada.tipo || 'secundaria', 
      fechaDerivada
    )

    // Crear sub-derivadas si las hay (solo hasta nivel 2)
    if (tieneSubderivadas && nivelActual < 2) {
      await crearTareasDerivadas(
        db, 
        decretoId, 
        accionDerivadaId, 
        derivada.tareas_derivadas, 
        fechaDerivada,
        nivelActual + 1
      )
    }
  }
}

// Calcular fecha con offset de días
function calcularFechaConOffset(fechaBase: string | null, diasOffset: number): string | null {
  if (!fechaBase) return null
  
  const fecha = new Date(fechaBase)
  fecha.setDate(fecha.getDate() + diasOffset)
  
  return fecha.toISOString()
}



// Obtener árbol completo de tareas derivadas
decretosRoutes.get('/:decretoId/acciones/:accionId/arbol', async (c) => {
  try {
    const decretoId = c.req.param('decretoId')
    const accionId = c.req.param('accionId')
    
    // Obtener todas las tareas del árbol usando consulta recursiva
    const arbol = await c.env.DB.prepare(`
      WITH RECURSIVE arbol_completo AS (
        -- Tarea raíz
        SELECT 
          a.id, a.titulo, a.que_hacer, a.estado, a.nivel_jerarquia,
          a.tarea_padre_id, a.proxima_revision, a.tiene_derivadas,
          0 as profundidad, CAST(a.id AS TEXT) as path
        FROM acciones a
        WHERE a.id = ? AND a.decreto_id = ?
        
        UNION ALL
        
        -- Tareas derivadas
        SELECT 
          a.id, a.titulo, a.que_hacer, a.estado, a.nivel_jerarquia,
          a.tarea_padre_id, a.proxima_revision, a.tiene_derivadas,
          ac.profundidad + 1, ac.path || '/' || CAST(a.id AS TEXT)
        FROM acciones a
        JOIN arbol_completo ac ON a.tarea_padre_id = ac.id
        WHERE a.nivel_jerarquia <= 2
      )
      SELECT ac.*, td.dias_offset, td.orden, td.tipo_relacion
      FROM arbol_completo ac
      LEFT JOIN tareas_derivadas td ON td.tarea_hija_id = ac.id
      ORDER BY ac.profundidad, td.orden
    `).bind(accionId, decretoId).all()

    return c.json({
      success: true,
      data: {
        arbol: arbol.results,
        total_tareas: arbol.results.length
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener árbol de tareas' }, 500)
  }
})