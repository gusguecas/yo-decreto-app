import { Hono } from 'hono'
import type { AppContext } from '../types'

const logosRoutes = new Hono<AppContext>()

// Servir archivos desde R2
logosRoutes.get('/:filename', async (c) => {
  try {
    const filename = c.req.param('filename')

    if (!c.env?.R2) {
      console.error('R2 binding not found')
      return c.json({ error: 'R2 storage not configured' }, 500)
    }

    // Obtener archivo desde R2
    const object = await c.env.R2.get(filename)

    if (!object) {
      return c.json({ error: 'Image not found' }, 404)
    }

    // Determinar content type basado en la extensión
    const ext = filename.split('.').pop()?.toLowerCase()
    const contentTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'webp': 'image/webp'
    }
    const contentType = contentTypes[ext || ''] || 'application/octet-stream'

    // Retornar imagen
    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': object.httpEtag || '',
      }
    })

  } catch (error) {
    console.error('Error serving image from R2:', error)
    return c.json({ error: 'Failed to load image' }, 500)
  }
})

// Endpoint para subir imágenes
logosRoutes.post('/upload', async (c) => {
  try {
    if (!c.env?.R2) {
      return c.json({ error: 'R2 storage not configured' }, 500)
    }

    const formData = await c.req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only images are allowed.' }, 400)
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File too large. Maximum size is 5MB.' }, 400)
    }

    // Generar nombre único
    const ext = file.name.split('.').pop()
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const filename = `logo-${timestamp}-${random}.${ext}`

    // Subir a R2
    const arrayBuffer = await file.arrayBuffer()
    await c.env.R2.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type
      }
    })

    // Retornar URL
    const url = `/api/logos/${filename}`

    return c.json({
      success: true,
      url,
      filename
    })

  } catch (error) {
    console.error('Error uploading to R2:', error)
    return c.json({ error: 'Failed to upload image' }, 500)
  }
})

export default logosRoutes
