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

// Crear nuevo decreto - VERSIÓN SUPER SIMPLIFICADA
decretosRoutes.post('/', async (c) => {
  try {
    console.log('POST /api/decretos llamado')
    
    const body = await c.req.json()
    console.log('Datos recibidos:', body)
    
    // Extraer contenido de cualquier campo posible
    const contenido = body.contenido || body.titulo || body.texto || 'Mi decreto'
    const area = body.area || 'humano'
    
    console.log('Procesando:', { contenido, area })
    
    // TEMPORALMENTE: Solo devolver success sin base de datos
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