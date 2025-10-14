import { Hono } from 'hono'
import type { AppContext } from '../types'

const aiRoutes = new Hono<AppContext>()

// ==================== CHATBOT CON GEMINI ====================
aiRoutes.post('/chat', async (c) => {
  try {
    const { message, includePortfolioContext, history } = await c.req.json()

    if (!message) {
      return c.json({ success: false, error: 'Mensaje requerido' }, 400)
    }

    const geminiApiKey = c.env?.GEMINI_API_KEY
    if (!geminiApiKey) {
      return c.json({
        success: false,
        error: 'Gemini API no configurado'
      }, 500)
    }

    // Obtener contexto del portafolio si se solicita
    let contextData = ''
    if (includePortfolioContext) {
      try {
        const userId = 'demo-user'

        // Obtener decretos
        const decretos = await c.env.DB.prepare(`
          SELECT titulo, area, sueno_meta, descripcion, estado, prioridad
          FROM decretos_primarios
          WHERE user_id = ?
          LIMIT 10
        `).bind(userId).all()

        // Obtener agenda del día
        const today = new Date().toISOString().split('T')[0]
        const agenda = await c.env.DB.prepare(`
          SELECT titulo, descripcion, prioridad
          FROM agenda_eventos
          WHERE user_id = ? AND fecha = ?
          LIMIT 10
        `).bind(userId, today).all()

        // Obtener rutinas completadas
        const rutinas = await c.env.DB.prepare(`
          SELECT nombre, completada_hoy
          FROM rutinas_diarias
          WHERE user_id = ?
        `).bind(userId).all()

        contextData = `
CONTEXTO DEL USUARIO:

Decretos activos:
${decretos.results.map((d: any) => `- ${d.titulo} (${d.area}): ${d.sueno_meta} - Estado: ${d.estado}`).join('\n')}

Agenda de hoy:
${agenda.results.map((a: any) => `- ${a.titulo}: ${a.descripcion || 'Sin descripción'}`).join('\n')}

Rutinas diarias:
${rutinas.results.map((r: any) => `- ${r.nombre}: ${r.completada_hoy ? 'Completada ✓' : 'Pendiente'}`).join('\n')}
`
      } catch (error) {
        console.error('Error obteniendo contexto:', error)
      }
    }

    // Sistema prompt como Helene Hadsell
    const systemPrompt = `Eres un asistente de la aplicación "Yo Decreto", una herramienta de manifestación y productividad basada en las enseñanzas de Helene Hadsell.

Tu personalidad:
- Entusiasta y positiva, pero práctica
- Experta en manifestación, ley de atracción y productividad
- Hablas en español de manera natural y cercana
- Motivas al usuario a tomar acción concreta
- Relacionas conceptos de manifestación con acciones prácticas

Capacidades:
- Ayudar con decretos y metas
- Sugerir rutinas y afirmaciones
- Dar consejos sobre la aplicación del método SPEC
- Responder preguntas sobre la app

${contextData}

Instrucciones especiales:
- Si el usuario pide crear algo (decreto, tarea, etc), responde con un JSON al final con esta estructura:
\`\`\`json
{
  "action": "create_decreto|create_evento|create_rutina",
  "data": { "titulo": "...", "descripcion": "...", etc }
}
\`\`\`

- Mantén respuestas concisas (máx 150 palabras)
- Usa emojis ocasionalmente para dar energía
`

    // Construir mensajes para Gemini
    const messages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: '¡Entendido! Estoy aquí para ayudarte con Yo Decreto. ¿En qué puedo apoyarte hoy?' }] },
    ]

    // Agregar historial previo
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        if (msg.role === 'user') {
          messages.push({ role: 'user', parts: [{ text: msg.content }] })
        } else if (msg.role === 'assistant') {
          messages.push({ role: 'model', parts: [{ text: msg.content }] })
        }
      })
    }

    // Agregar mensaje actual
    messages.push({ role: 'user', parts: [{ text: message }] })

    // Llamar a Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages.slice(1), // Skip system prompt in contents
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      })
    })

    const geminiData = await geminiResponse.json()

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', geminiData)
      return c.json({
        success: false,
        error: 'Error al procesar tu mensaje. Por favor intenta de nuevo.'
      }, 500)
    }

    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.'

    return c.json({
      success: true,
      response: responseText
    })

  } catch (error) {
    console.error('Error en /api/ai/chat:', error)
    return c.json({
      success: false,
      error: 'Error al procesar tu mensaje. Por favor intenta de nuevo.'
    }, 500)
  }
})

// ==================== EJECUTAR ACCIONES ====================
aiRoutes.post('/action', async (c) => {
  try {
    const actionData = await c.req.json()
    const userId = 'demo-user'

    if (!actionData.action) {
      return c.json({ success: false, error: 'Acción no especificada' }, 400)
    }

    switch (actionData.action) {
      case 'create_decreto':
        await c.env.DB.prepare(`
          INSERT INTO decretos_primarios (user_id, titulo, area, sueno_meta, descripcion)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          userId,
          actionData.data.titulo,
          actionData.data.area || 'General',
          actionData.data.sueno_meta || '',
          actionData.data.descripcion || ''
        ).run()
        return c.json({ success: true, message: '✅ Decreto creado exitosamente' })

      case 'create_evento':
        await c.env.DB.prepare(`
          INSERT INTO agenda_eventos (user_id, titulo, descripcion, fecha, hora_inicio)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          userId,
          actionData.data.titulo,
          actionData.data.descripcion || '',
          actionData.data.fecha || new Date().toISOString().split('T')[0],
          actionData.data.hora || '09:00'
        ).run()
        return c.json({ success: true, message: '✅ Evento agregado a tu agenda' })

      case 'create_rutina':
        await c.env.DB.prepare(`
          INSERT INTO rutinas_diarias (user_id, nombre, descripcion, momento, tiempo_estimado)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          userId,
          actionData.data.nombre,
          actionData.data.descripcion || '',
          actionData.data.momento || 'manana',
          actionData.data.tiempo || 5
        ).run()
        return c.json({ success: true, message: '✅ Rutina agregada exitosamente' })

      default:
        return c.json({ success: false, error: 'Acción no reconocida' }, 400)
    }

  } catch (error) {
    console.error('Error en /api/ai/action:', error)
    return c.json({ success: false, error: 'Error al ejecutar la acción' }, 500)
  }
})

// ==================== GENERAR VISUALIZACIÓN CON FLUX ====================
aiRoutes.post('/generate-visualization', async (c) => {
  try {
    const { decretoId, titulo, sueno_meta, descripcion, area } = await c.req.json()

    if (!decretoId || !titulo) {
      return c.json({ success: false, error: 'Datos incompletos' }, 400)
    }

    const fluxApiKey = c.env?.FLUX_API_KEY || c.env?.REPLICATE_API_TOKEN
    if (!fluxApiKey) {
      return c.json({
        success: false,
        error: 'Servicio de generación de imágenes no configurado'
      }, 500)
    }

    // Crear prompt optimizado para visualización
    const visualPrompt = `A beautiful, inspiring, photorealistic visualization of: ${titulo}.
Context: ${sueno_meta || descripcion || 'achieving this goal'}.
Style: Uplifting, bright, successful, ${area} related.
High quality, 4K, cinematic lighting, motivational atmosphere.`

    console.log('🎨 Generando imagen con prompt:', visualPrompt)

    // Llamar a Replicate API (FLUX)
    const prediction = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${fluxApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'black-forest-labs/flux-schnell', // Modelo FLUX rápido
        input: {
          prompt: visualPrompt,
          num_outputs: 1,
          aspect_ratio: '16:9',
          output_format: 'jpg',
          output_quality: 90
        }
      })
    })

    const predictionData = await prediction.json()

    if (!prediction.ok) {
      console.error('Replicate API error:', predictionData)
      return c.json({
        success: false,
        error: 'Error al iniciar generación de imagen'
      }, 500)
    }

    const predictionId = predictionData.id
    let imageUrl = null
    let attempts = 0
    const maxAttempts = 30 // 30 segundos máximo

    // Polling para obtener el resultado
    while (attempts < maxAttempts && !imageUrl) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Esperar 1 segundo

      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${fluxApiKey}`,
          'Content-Type': 'application/json'
        }
      })

      const statusData = await statusResponse.json()

      if (statusData.status === 'succeeded') {
        imageUrl = statusData.output?.[0] || statusData.output
        break
      } else if (statusData.status === 'failed' || statusData.status === 'canceled') {
        return c.json({
          success: false,
          error: 'La generación de imagen falló'
        }, 500)
      }

      attempts++
    }

    if (!imageUrl) {
      return c.json({
        success: false,
        error: 'Tiempo de espera agotado. Intenta de nuevo.'
      }, 500)
    }

    // Actualizar decreto con la nueva imagen
    await c.env.DB.prepare(`
      UPDATE decretos_primarios
      SET imagen_visualizacion = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(imageUrl, decretoId).run()

    return c.json({
      success: true,
      imageUrl: imageUrl,
      message: '¡Imagen generada exitosamente!'
    })

  } catch (error) {
    console.error('Error en /api/ai/generate-visualization:', error)
    return c.json({
      success: false,
      error: 'Error al generar la visualización'
    }, 500)
  }
})

export default aiRoutes
