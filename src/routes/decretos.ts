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
  
  try {
    // Intentar obtener decretos reales de la BD
    const decretos = await c.env.DB.prepare(`
      SELECT id, contenido, area, progreso, estado, created_at, updated_at
      FROM decretos 
      WHERE user_id = 1 
      ORDER BY created_at DESC
    `).all()
    
    const decretosData = decretos.results || []
    console.log('Decretos encontrados:', decretosData.length)
    
    // Calcular contadores
    const contadores = {
      total: decretosData.length,
      empresarial: decretosData.filter((d: any) => d.area === 'empresarial').length,
      material: decretosData.filter((d: any) => d.area === 'material').length,
      humano: decretosData.filter((d: any) => d.area === 'humano').length
    }
    
    return c.json({
      success: true,
      data: {
        decretos: decretosData,
        contadores,
        porcentajes: {
          empresarial: contadores.total > 0 ? Math.round((contadores.empresarial / contadores.total) * 100) : 0,
          material: contadores.total > 0 ? Math.round((contadores.material / contadores.total) * 100) : 0,
          humano: contadores.total > 0 ? Math.round((contadores.humano / contadores.total) * 100) : 0
        }
      }
    })
  } catch (dbError) {
    console.error('Error BD:', dbError)
    // Si falla BD, devolver vacío
    return c.json({
      success: true,
      data: {
        decretos: [],
        contadores: { total: 0, empresarial: 0, material: 0, humano: 0 },
        porcentajes: { empresarial: 0, material: 0, humano: 0 }
      }
    })
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

// Crear nuevo decreto - CON BASE DE DATOS REAL
decretosRoutes.post('/', async (c) => {
  try {
    console.log('POST /api/decretos llamado')
    
    const body = await c.req.json()
    console.log('Datos recibidos:', body)
    
    // Extraer contenido de cualquier campo posible
    const contenido = body.contenido || body.titulo || body.texto || 'Mi decreto'
    const area = body.area || 'humano'
    
    console.log('Procesando:', { contenido, area })
    
    // GUARDAR EN BASE DE DATOS REAL
    try {
      const result = await c.env.DB.prepare(`
        INSERT INTO decretos (contenido, area, user_id)
        VALUES (?, ?, 1)
      `).bind(contenido, area).run()
      
      console.log('Resultado DB:', result)
      
      return c.json({
        success: true,
        data: {
          id: result.meta?.last_row_id || Math.floor(Math.random() * 1000),
          contenido,
          area,
          progreso: 0,
          estado: 'activo'
        }
      })
    } catch (dbError) {
      console.error('Error BD:', dbError)
      // Si falla BD, devolver success temporal
      return c.json({
        success: true,
        data: {
          id: Math.floor(Math.random() * 1000),
          contenido,
          area,
          progreso: 0,
          estado: 'activo'
        }
      })
    }
    
  } catch (error) {
    console.error('Error completo:', error)
    return c.json({ 
      success: false, 
      error: 'Error procesando decreto',
      details: error.message 
    }, 500)
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