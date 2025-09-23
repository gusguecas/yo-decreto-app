import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

export const practicaRoutes = new Hono<{ Bindings: Bindings }>()

// RUTINAS MATUTINAS

// Obtener todas las rutinas matutinas
practicaRoutes.get('/rutinas', async (c) => {
  try {
    const rutinas = await c.env.DB.prepare(`
      SELECT * FROM rutinas_matutinas 
      WHERE activa = 1 
      ORDER BY orden_display ASC
    `).all()

    // Para cada rutina, verificar si fue completada hoy
    const fecha_hoy = new Date().toISOString().split('T')[0]
    const rutinasConEstado = []

    for (const rutina of rutinas.results as any[]) {
      const completadaHoy = await c.env.DB.prepare(`
        SELECT * FROM rutinas_completadas 
        WHERE rutina_id = ? AND fecha_completada = ?
      `).bind(rutina.id, fecha_hoy).first()

      rutinasConEstado.push({
        ...rutina,
        completada_hoy: !!completadaHoy,
        detalle_hoy: completadaHoy || null
      })
    }

    return c.json({
      success: true,
      data: rutinasConEstado
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener rutinas' }, 500)
  }
})

// Marcar rutina como completada
practicaRoutes.post('/rutinas/:id/completar', async (c) => {
  try {
    const rutinaId = c.req.param('id')
    const { tiempo_invertido, notas } = await c.req.json()
    
    const fecha_hoy = new Date().toISOString().split('T')[0]

    // Insertar o actualizar completada
    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_completadas 
      (rutina_id, fecha_completada, tiempo_invertido, notas)
      VALUES (?, ?, ?, ?)
    `).bind(rutinaId, fecha_hoy, tiempo_invertido || null, notas || '').run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al completar rutina' }, 500)
  }
})

// Desmarcar rutina del día
practicaRoutes.delete('/rutinas/:id/completar', async (c) => {
  try {
    const rutinaId = c.req.param('id')
    const fecha_hoy = new Date().toISOString().split('T')[0]

    await c.env.DB.prepare(`
      DELETE FROM rutinas_completadas 
      WHERE rutina_id = ? AND fecha_completada = ?
    `).bind(rutinaId, fecha_hoy).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al desmarcar rutina' }, 500)
  }
})

// Obtener progreso de rutinas (últimos días)
practicaRoutes.get('/rutinas/progreso', async (c) => {
  try {
    const { dias = 7 } = c.req.query()
    
    // Obtener rutinas completadas en los últimos X días
    const progreso = await c.env.DB.prepare(`
      SELECT 
        rm.nombre,
        rm.icono,
        COUNT(rc.id) as dias_completados,
        ? as dias_totales,
        ROUND((COUNT(rc.id) * 100.0) / ?, 1) as porcentaje_completado
      FROM rutinas_matutinas rm
      LEFT JOIN rutinas_completadas rc ON rm.id = rc.rutina_id
        AND rc.fecha_completada >= date('now', '-' || ? || ' days')
      WHERE rm.activa = 1
      GROUP BY rm.id, rm.nombre, rm.icono
      ORDER BY porcentaje_completado DESC
    `).bind(dias, dias, dias).all()

    return c.json({
      success: true,
      data: progreso.results
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener progreso de rutinas' }, 500)
  }
})

// Obtener progreso global de rutinas (barra de progreso total del día)
practicaRoutes.get('/rutinas/progreso-dia', async (c) => {
  try {
    const fecha = new Date().toISOString().split('T')[0]
    
    const totalRutinas = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1'
    ).first()

    const completadasHoy = await c.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(fecha).first()

    const total = totalRutinas?.total || 0
    const completadas = completadasHoy?.completadas || 0
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0

    return c.json({
      success: true,
      data: {
        total_rutinas: total,
        completadas_hoy: completadas,
        porcentaje_progreso: porcentaje,
        fecha
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener progreso del día' }, 500)
  }
})

practicaRoutes.get('/rutinas/progreso-dia/:fecha', async (c) => {
  try {
    const fecha = c.req.param('fecha') || new Date().toISOString().split('T')[0]
    
    const totalRutinas = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1'
    ).first()

    const completadasHoy = await c.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(fecha).first()

    const total = totalRutinas?.total || 0
    const completadas = completadasHoy?.completadas || 0
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0

    return c.json({
      success: true,
      data: {
        total_rutinas: total,
        completadas_hoy: completadas,
        porcentaje_progreso: porcentaje,
        fecha
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener progreso del día' }, 500)
  }
})

// AFIRMACIONES

// Obtener todas las afirmaciones
practicaRoutes.get('/afirmaciones', async (c) => {
  try {
    const { categoria, favoritas } = c.req.query()
    
    let query = 'SELECT * FROM afirmaciones WHERE 1=1'
    const params: any[] = []
    
    if (categoria && categoria !== 'todas') {
      query += ' AND categoria = ?'
      params.push(categoria)
    }
    
    if (favoritas === 'true') {
      query += ' AND es_favorita = 1'
    }
    
    query += ' ORDER BY es_favorita DESC, veces_usada DESC, created_at DESC'
    
    const afirmaciones = await c.env.DB.prepare(query).bind(...params).all()

    return c.json({
      success: true,
      data: afirmaciones.results
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener afirmaciones' }, 500)
  }
})

// Crear nueva afirmación
practicaRoutes.post('/afirmaciones', async (c) => {
  try {
    const { texto, categoria } = await c.req.json()
    
    if (!texto || !categoria) {
      return c.json({ success: false, error: 'Texto y categoría son requeridos' }, 400)
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(texto, categoria).run()

    return c.json({ success: true, id: result.meta.last_row_id })
  } catch (error) {
    return c.json({ success: false, error: 'Error al crear afirmación' }, 500)
  }
})

// Marcar/desmarcar afirmación como favorita
practicaRoutes.put('/afirmaciones/:id/favorita', async (c) => {
  try {
    const afirmacionId = c.req.param('id')
    const { es_favorita } = await c.req.json()
    
    await c.env.DB.prepare(`
      UPDATE afirmaciones SET 
        es_favorita = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(es_favorita ? 1 : 0, afirmacionId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al actualizar favorita' }, 500)
  }
})

// Marcar afirmación como usada/recitada
practicaRoutes.post('/afirmaciones/:id/usar', async (c) => {
  try {
    const afirmacionId = c.req.param('id')
    
    await c.env.DB.prepare(`
      UPDATE afirmaciones SET 
        veces_usada = veces_usada + 1,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(afirmacionId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al marcar como usada' }, 500)
  }
})

// Eliminar afirmación
practicaRoutes.delete('/afirmaciones/:id', async (c) => {
  try {
    const afirmacionId = c.req.param('id')
    
    await c.env.DB.prepare('DELETE FROM afirmaciones WHERE id = ?').bind(afirmacionId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Error al eliminar afirmación' }, 500)
  }
})

// Obtener afirmaciones sugeridas del día (mezcla automática)
practicaRoutes.get('/afirmaciones/del-dia', async (c) => {
  try {
    // Obtener mix de afirmaciones: favoritas + algunas aleatorias
    const favoritas = await c.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 1 
      ORDER BY RANDOM() 
      LIMIT 2
    `).all()

    const aleatorias = await c.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 0 
      ORDER BY RANDOM() 
      LIMIT 3
    `).all()

    const afirmacionesDelDia = [
      ...favoritas.results,
      ...aleatorias.results
    ]

    return c.json({
      success: true,
      data: afirmacionesDelDia
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener afirmaciones del día' }, 500)
  }
})

// Generar nueva afirmación usando IA
practicaRoutes.post('/afirmaciones/generar', async (c) => {
  try {
    const { categoria = 'general' } = await c.req.json()
    
    // Plantillas de afirmaciones por categoría
    const plantillas = {
      empresarial: [
        "Soy un líder natural que inspira confianza y respeto en mi equipo",
        "Mis ideas innovadoras transforman mi empresa y generan abundantes resultados",
        "Tengo la capacidad de tomar decisiones sabias que impulsan mi éxito empresarial",
        "Mi negocio crece exponencialmente mientras mantengo mi integridad y valores",
        "Soy un imán para las oportunidades de negocio perfectas en el momento ideal",
        "Mi visión empresarial se materializa con facilidad y genera impacto positivo",
        "Lidero con sabiduría y compasión, creando un ambiente de trabajo próspero",
        "Mis habilidades de comunicación abren puertas a alianzas estratégicas valiosas"
      ],
      material: [
        "La abundancia fluye hacia mí desde múltiples fuentes de manera constante",
        "Soy un canal abierto para recibir prosperidad en todas sus formas",
        "Mi relación con el dinero es saludable, positiva y equilibrada",
        "Tengo todo lo que necesito y más para vivir una vida plena y próspera",
        "Las oportunidades de generar ingresos aparecen naturalmente en mi camino",
        "Merece vivir en abundancia y celebro cada manifestación de prosperidad",
        "Mi valor y talento se compensan generosamente en el mercado",
        "Creo riqueza mientras contribuyo positivamente al bienestar de otros"
      ],
      humano: [
        "Soy digno/a de amor incondicional y atraigo relaciones armoniosas a mi vida",
        "Mi corazón está abierto para dar y recibir amor en todas sus formas",
        "Cultivo relaciones basadas en el respeto mutuo, la comprensión y la alegría",
        "Me rodeo de personas que me apoyan y celebran mi crecimiento personal",
        "Comunico mis sentimientos con claridad, compasión y autenticidad",
        "Mi presencia inspira calma, alegría y confianza en quienes me rodean",
        "Perdono fácilmente y libero cualquier resentimiento que no me sirve",
        "Cada día fortalezco los vínculos importantes en mi vida con amor y gratitud"
      ],
      general: [
        "Cada día me convierto en la mejor versión de mí mismo/a con alegría y gratitud",
        "Confío plenamente en mi sabiduría interior para guiar mis decisiones",
        "Soy resiliente y transformo cada desafío en una oportunidad de crecimiento",
        "Mi vida está llena de propósito, significado y experiencias enriquecedoras",
        "Irradio paz, amor y luz positiva donde quiera que vaya",
        "Soy el/la arquitecto/a consciente de mi realidad y creo con intención clara",
        "Mi mente es clara, mi corazón está abierto y mi espíritu es libre",
        "Celebro mis logros y aprendo valiosas lecciones de cada experiencia"
      ]
    }

    // Obtener plantillas de la categoría
    const afirmacionesCategoria = plantillas[categoria] || plantillas.general
    
    // Seleccionar una afirmación aleatoria
    const afirmacionTexto = afirmacionesCategoria[Math.floor(Math.random() * afirmacionesCategoria.length)]
    
    // Crear la nueva afirmación
    const result = await c.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(afirmacionTexto, categoria).run()

    // Obtener la afirmación creada
    const nuevaAfirmacion = await c.env.DB.prepare(`
      SELECT * FROM afirmaciones WHERE rowid = ?
    `).bind(result.meta.last_row_id).first()

    return c.json({
      success: true,
      data: nuevaAfirmacion
    })
  } catch (error) {
    console.error('Error al generar afirmación:', error)
    return c.json({ success: false, error: 'Error al generar afirmación' }, 500)
  }
})

// Obtener progreso del día para rutinas
practicaRoutes.get('/rutinas/progreso-dia/:fecha', async (c) => {
  try {
    const fecha = c.req.param('fecha')
    
    // Obtener todas las rutinas activas
    const totalRutinas = await c.env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM rutinas_matutinas
      WHERE activa = 1
    `).first()

    // Obtener rutinas completadas en la fecha especificada
    const rutinasCompletadas = await c.env.DB.prepare(`
      SELECT COUNT(*) as completadas
      FROM rutinas_completadas
      WHERE fecha_completada = ?
    `).bind(fecha).first()

    const total = totalRutinas?.total || 0
    const completadas = rutinasCompletadas?.completadas || 0
    const porcentaje_progreso = total > 0 ? Math.round((completadas / total) * 100) : 0

    return c.json({
      success: true,
      data: {
        fecha,
        total_rutinas: total,
        rutinas_completadas: completadas,
        rutinas_pendientes: total - completadas,
        porcentaje_progreso
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener progreso del día' }, 500)
  }
})

// Obtener estadísticas de práctica
practicaRoutes.get('/estadisticas', async (c) => {
  try {
    // Racha actual de rutinas (días consecutivos completando al menos 1 rutina)
    const rachaActual = await c.env.DB.prepare(`
      WITH RECURSIVE fecha_serie AS (
        SELECT date('now') as fecha
        UNION ALL
        SELECT date(fecha, '-1 day')
        FROM fecha_serie
        WHERE fecha >= date('now', '-30 days')
      ),
      dias_con_rutinas AS (
        SELECT DISTINCT fecha_completada
        FROM rutinas_completadas
        WHERE fecha_completada >= date('now', '-30 days')
      )
      SELECT COUNT(*) as racha
      FROM fecha_serie fs
      WHERE fs.fecha IN (SELECT fecha_completada FROM dias_con_rutinas)
      AND NOT EXISTS (
        SELECT 1 FROM fecha_serie fs2
        WHERE fs2.fecha > fs.fecha 
        AND fs2.fecha NOT IN (SELECT fecha_completada FROM dias_con_rutinas)
      )
    `).first()

    // Total de afirmaciones por categoría
    const afirmacionesPorCategoria = await c.env.DB.prepare(`
      SELECT categoria, COUNT(*) as cantidad
      FROM afirmaciones
      GROUP BY categoria
      ORDER BY cantidad DESC
    `).all()

    // Rutina más completada
    const rutinaMasCompletada = await c.env.DB.prepare(`
      SELECT 
        rm.nombre,
        rm.icono,
        COUNT(rc.id) as veces_completada
      FROM rutinas_matutinas rm
      LEFT JOIN rutinas_completadas rc ON rm.id = rc.rutina_id
      WHERE rm.activa = 1
      GROUP BY rm.id, rm.nombre, rm.icono
      ORDER BY veces_completada DESC
      LIMIT 1
    `).first()

    // Progreso semanal
    const progresoSemana = await c.env.DB.prepare(`
      SELECT 
        fecha_completada,
        COUNT(DISTINCT rutina_id) as rutinas_completadas
      FROM rutinas_completadas
      WHERE fecha_completada >= date('now', '-7 days')
      GROUP BY fecha_completada
      ORDER BY fecha_completada
    `).all()

    return c.json({
      success: true,
      data: {
        racha_actual: rachaActual?.racha || 0,
        afirmaciones_por_categoria: afirmacionesPorCategoria.results,
        rutina_mas_completada: rutinaMasCompletada,
        progreso_semanal: progresoSemana.results
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Error al obtener estadísticas' }, 500)
  }
})