import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

export const decretosRoutes = new Hono<{ Bindings: Bindings }>()

// Obtener configuración del usuario
decretosRoutes.get('/config', async (c) => {
  return c.json({
    success: true,
    data: {
      nombre_usuario: 'Gustavo Adolfo Guerrero Castaños',
      frase_vida: '✨ Creo en la abundancia y manifiesto mis sueños ✨'
    }
  })
})

// Actualizar configuración del usuario
decretosRoutes.put('/config', async (c) => {
  return c.json({ success: true })
})

// Obtener todos los decretos con contadores
decretosRoutes.get('/', async (c) => {
  try {
    // Obtener decretos del usuario (por ahora user_id = 1)
    const decretos = await c.env.DB.prepare(`
      SELECT id, contenido, area, progreso, estado, created_at, updated_at
      FROM decretos 
      WHERE user_id = 1 
      ORDER BY created_at DESC
    `).all()
    
    const decretosData = decretos.results || []
    
    // Calcular contadores
    const contadores = {
      total: decretosData.length,
      empresarial: decretosData.filter((d: any) => d.area === 'empresarial').length,
      material: decretosData.filter((d: any) => d.area === 'material').length,
      humano: decretosData.filter((d: any) => d.area === 'humano').length
    }
    
    // Calcular porcentajes
    const porcentajes = {
      empresarial: contadores.total > 0 ? Math.round((contadores.empresarial / contadores.total) * 100) : 0,
      material: contadores.total > 0 ? Math.round((contadores.material / contadores.total) * 100) : 0,
      humano: contadores.total > 0 ? Math.round((contadores.humano / contadores.total) * 100) : 0
    }
    
    return c.json({
      success: true,
      data: {
        decretos: decretosData,
        contadores,
        porcentajes
      }
    })
  } catch (error) {
    console.error('Error obteniendo decretos:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// Obtener un decreto específico
decretosRoutes.get('/:id', async (c) => {
  return c.json({
    success: true,
    data: {
      decreto: {
        id: c.req.param('id'),
        contenido: 'Decreto de ejemplo',
        area: 'humano',
        progreso: 0
      },
      acciones: [],
      metricas: {
        totalAcciones: 0,
        completadas: 0,
        pendientes: 0,
        progreso: 0
      }
    }
  })
})

// Crear nuevo decreto
decretosRoutes.post('/', async (c) => {
  try {
    const { contenido, area } = await c.req.json()
    
    // Validar datos
    if (!contenido || !area) {
      return c.json({ error: 'Contenido y área son requeridos' }, 400)
    }
    
    if (!['empresarial', 'material', 'humano'].includes(area)) {
      return c.json({ error: 'Área debe ser empresarial, material o humano' }, 400)
    }
    
    // Por ahora usar user_id = 1 (primer usuario)
    const result = await c.env.DB.prepare(`
      INSERT INTO decretos (contenido, area, user_id)
      VALUES (?, ?, 1)
    `).bind(contenido, area).run()
    
    if (!result.success) {
      return c.json({ error: 'Error al crear decreto' }, 500)
    }
    
    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        contenido,
        area,
        progreso: 0,
        estado: 'activo'
      }
    })
  } catch (error) {
    console.error('Error creando decreto:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// Actualizar decreto
decretosRoutes.put('/:id', async (c) => {
  return c.json({ success: true })
})

// Eliminar decreto
decretosRoutes.delete('/:id', async (c) => {
  return c.json({ success: true })
})

// Crear nueva acción
decretosRoutes.post('/:id/acciones', async (c) => {
  return c.json({
    success: true,
    data: {
      id: Math.floor(Math.random() * 1000),
      message: 'Acción creada exitosamente'
    }
  })
})

// Actualizar acción
decretosRoutes.put('/:decreto_id/acciones/:id', async (c) => {
  return c.json({ success: true })
})

// Eliminar acción
decretosRoutes.delete('/:decreto_id/acciones/:id', async (c) => {
  return c.json({ success: true })
})