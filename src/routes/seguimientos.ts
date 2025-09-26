import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const seguimientosRoutes = new Hono<{ Bindings: Bindings }>()

// Crear seguimiento - VERSIÓN COMPLETAMENTE NUEVA
seguimientosRoutes.post('/:decretoId/acciones/:accionId/seguimientos', async (c) => {
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
    
    // Validación simple
    if (!que_se_hizo || que_se_hizo.trim() === '') {
      return c.json({ 
        success: false, 
        error: 'Campo requerido: ¿Qué se hizo exactamente?' 
      }, 400)
    }

    // Insertar seguimiento usando defaults de BD
    await c.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      accionId, 
      que_se_hizo, 
      como_se_hizo || '', 
      resultados_obtenidos || '',
      JSON.stringify(tareas_pendientes || '[]'), 
      proxima_revision || null, 
      calificacion || 5
    ).run()

    // ¡CREAR NUEVAS TAREAS AUTOMÁTICAMENTE!
    let nuevasTareas = 0
    if (tareas_pendientes && Array.isArray(tareas_pendientes) && tareas_pendientes.length > 0) {
      for (const tarea of tareas_pendientes) {
        if (typeof tarea === 'string' && tarea.trim()) {
          const textoTarea = tarea.trim()
          
          // Obtener decreto_id de la acción original
          const accionOriginal = await c.env.DB.prepare(
            'SELECT decreto_id FROM acciones WHERE id = ?'
          ).bind(accionId).first()

          if (accionOriginal) {
            // Crear nueva acción automáticamente
            // Calcular fecha de próxima revisión (mañana por defecto)
            const mañana = new Date()
            mañana.setDate(mañana.getDate() + 1)
            const proximaRevision = mañana.toISOString()

            const resultNuevaAccion = await c.env.DB.prepare(`
              INSERT INTO acciones (
                decreto_id, titulo, que_hacer, como_hacerlo, tipo, 
                proxima_revision, origen
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
              RETURNING id
            `).bind(
              accionOriginal.decreto_id,
              textoTarea,
              `Tarea generada desde seguimiento`,
              `Completar: ${textoTarea}`,
              'secundaria',
              proximaRevision,
              `seguimiento:${accionId}`
            ).first()

            if (resultNuevaAccion) {
              const nuevaAccionId = resultNuevaAccion.id

              // Crear evento en agenda automáticamente
              const fechaEvento = new Date().toISOString().split('T')[0]
              const horaEvento = '09:00'
              
              const agendaResult = await c.env.DB.prepare(`
                INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad)
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING id
              `).bind(
                nuevaAccionId,
                textoTarea,
                `[Auto-generada] ${textoTarea}`,
                fechaEvento,
                horaEvento,
                'media'
              ).first()
              
              if (agendaResult) {
                // Actualizar la acción con el agenda_event_id
                await c.env.DB.prepare(`
                  UPDATE acciones SET agenda_event_id = ? WHERE id = ?
                `).bind(agendaResult.id, nuevaAccionId).run()
              }
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
    return c.json({ 
      success: false, 
      error: 'Error al crear seguimiento',
      details: error.message 
    }, 500)
  }
})

export { seguimientosRoutes }