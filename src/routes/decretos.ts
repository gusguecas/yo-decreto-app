import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

export const decretosRoutes = new Hono<{ Bindings: Bindings }>()

// Middleware para log
decretosRoutes.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`)
  await next()
})

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
  console.log('GET /api/decretos called')
  
  // Por ahora devolver datos simples hasta que funcione
  return c.json({
    success: true,
    data: {
      decretos: [],
      contadores: { total: 0, empresarial: 0, material: 0, humano: 0 },
      porcentajes: { empresarial: 0, material: 0, humano: 0 }
    }
  })
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
    
    try {
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
    } catch (dbError) {
      console.error('Error de base de datos:', dbError)
      return c.json({ 
        error: 'Base de datos no configurada. Crear tabla decretos primero.' 
      }, 500)
    }
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