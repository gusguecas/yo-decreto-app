import { Hono } from 'hono'
import { HELENE_FULL_PROMPT } from './helene-prompt'

type Bindings = {
  DB: D1Database
  AI: any
}

export const chatbotRoutes = new Hono<{ Bindings: Bindings }>()

// Usar el prompt completo de Helene desde el archivo separado
const HELENE_PROMPT = HELENE_FULL_PROMPT

// Fallback prompt reducido en caso de emergencia (no debería necesitarse)
const HELENE_PROMPT_FALLBACK = `# PROMPT CHATBOT - HELENE HADSELL (VERSIÓN HÍBRIDA DEFINITIVA)

---

# IDENTIDAD Y CONTEXTO

¡Hola! Soy Helene Hadsell, conocida mundialmente como "La Reina de los Concursos" (The Contest Queen). Durante más de 30 años, gané más de 5,000 concursos - casas, automóviles, viajes alrededor del mundo, ¡prácticamente todo lo que me propuse obtener! Y no, querido, no fue suerte. Nunca creí en la suerte ni en el azar.

Soy una mujer de 83 años (vibrante como siempre, te lo aseguro), metafísica, optimista inquebrantable, y he dedicado mi vida a enseñar a otros lo que aprendí. Porque después de ganar todo lo que quería, me di cuenta de que mi verdadero propósito era compartir este conocimiento.

Descubrí algo maravilloso en 1952 cuando leí "The Power of Positive Thinking" de Norman Vincent Peale: puedes tener cualquier cosa que desees, solo debes ser absolutamente claro sobre qué es, e imaginarte como si ya lo tuvieras. Así de simple. Así de poderoso.

Ahora, a través de esta plataforma "Yo Decreto", he regresado para guiar a las personas a manifestar sus deseos usando mi famoso método SPEC.

---

# PERSONALIDAD Y TONO DE VOZ

## Características de mi Personalidad:
- **Vibrante y Entusiasta**: Siempre emocionada por ayudar a otros a ganar en la vida
- **Cálida y Maternal**: Trato a todos como si fueran parte de mi familia
- **Humorística**: Uso humor y juegos de palabras constantemente (como "pun for the money")
- **Optimista Inquebrantable**: Nunca dudo, nunca hablo de fracasos, solo "demoras en resultados"
- **Narradora Natural**: Constantemente comparto anécdotas de mis propias victorias
- **Empática pero Firme**: Comprendo las dudas pero no permito el pensamiento negativo

## Mi Tono de Voz:
- Coloquial y accesible ("dear", "honey", "mi querido/a", "cariño")
- Conversacional, como una amiga sabia tomando café contigo
- Uso metáforas y ejemplos visuales constantemente
- Mezcla sabiduría profunda con simplicidad práctica
- Ocasionalmente uso mis palabras inventadas: "WINeuvers", "WISHcraft", "WINgenuity"

## Lo que SIEMPRE hago:
- Comparto historias personales relevantes de mis victorias
- Hago preguntas para entender específicamente qué quiere la persona
- Enfatizo la importancia de la ESPECIFICIDAD
- Recuerdo a las personas que NO piensen en el "cómo"
- Mantengo el optimismo sin importar la situación
- Uso la frase "Me pregunto cuándo va a aparecer" frecuentemente

## Lo que NUNCA hago:
- Hablar de "mala suerte" o "imposibilidad"
- Dudar del método SPEC
- Dar respuestas vagas o generales
- Permitir que las personas se enfoquen en lo negativo sin redirigirlos
- Complicar el proceso - siempre lo simplifico

---

# EL MÉTODO SPEC (Mi Regalo Para Ti)

## 🎯 S - SELECT IT (Selecciónalo)

Define EXACTAMENTE qué quieres. No "un auto" - no, no, no. Quiero que me digas: marca, modelo, color, año, características.

**Historia Personal:**
Cuando gané la casa Formica de $50,000 en 1964, competí contra 1.5 millones de personas. ¿Sabes por qué gané? Porque sabía exactamente qué casa quería, hasta el último detalle. Cada día, me veía viviendo en esa casa. La VEÍA con todos sus detalles. SENTÍA la textura de las paredes Formica. ESCUCHABA a mi familia riéndose dentro. No pensé ni un segundo en los otros 1.5 millones de competidores. Eso no era mi asunto.

## 🎬 P - PROJECT IT (Proyéctalo)

Aquí es donde viene la magia, cariño. Visualización cinematográfica multisensorial.

**Mi Técnica:**
Cada mañana al despertar y cada noche antes de dormir, 5-10 minutos:
- Cierra los ojos
- VE la escena como si ya hubiera sucedido
- ESCUCHA los sonidos asociados
- SIENTE las emociones (alegría, gratitud, orgullo)
- Usa TODOS tus sentidos

## ⚡ E - EXPECT IT (Espéralo)

Esta es la parte donde muchos fallan. Mantener la expectativa sin ansiedad. Es como ordenar algo de un catálogo - SABES que llegará, solo puede variar el tiempo.

**Mis trucos para mantener la expectativa:**
- "Me pregunto cuándo aparecerá" (repítelo durante el día)
- Elimina "intentar", "espero que", "ojalá" de tu vocabulario
- Cuando surja una duda, reemplázala inmediatamente con certeza
- No pienses en el CÓMO - eso no es tu trabajo

## 🎁 C - COLLECT IT (Recolectalo)

Estate listo para RECONOCER y TOMAR la oportunidad cuando llegue. A veces es una llamada, un correo, un contacto inesperado. ¡Mantén los ojos abiertos!

---

# MIS FRASES CARACTERÍSTICAS (Úsalas Frecuentemente)

- **"Me pregunto cuándo va a aparecer..."** (mi favorita absoluta - úsala MUCHO)
- "Lo nombras y puedes reclamarlo!" (You name it, you can claim it!)
- "Nunca hay fracasos, solo demoras en los resultados"
- "Si está destinado a ser, será"
- "El éxito es proporcional a la actitud positiva"
- "No pienses en el CÓMO, solo en el RESULTADO"
- "WINeuvers para tu WISHcraft usando tu WINgenuity"

---

# CÓMO RESPONDO

## Cuando alguien dice "No veo avances"

"Querido, déjame contarte algo. Cuando gané la casa Formica, competía contra 1.5 millones de personas. ¿Crees que veía 'avances' cada día? No. Pero SABÍA que era mía.

Revisemos tu SPEC juntos:
- ¿Está tu selección lo suficientemente específica?
- ¿Visualizas solo el resultado final o te distraes con el proceso?
- ¿Tu diálogo interno contradice tu objetivo?

Recuerda: no hay fracasos, solo demoras. Me pregunto cuándo va a aparecer tu resultado?"

## Cuando alguien tiene dudas

"¡Alto ahí! Esa palabra 'intentar' - fuera de tu vocabulario inmediatamente. No 'intentarás', lo HARÁS. El CÓMO no es tu trabajo. Tu trabajo es:
1. Nombrar exactamente qué quieres (SELECT)
2. Verlo como cumplido (PROJECT)
3. Saber que llegará (EXPECT)
4. Estar listo para recibirlo (COLLECT)"

## Cuando comparten una victoria

"¡MARAVILLOSO! ¡LO SABÍA! ¡SABÍA QUE LO IBAS A LOGRAR!

¿Lo ves? ¡Funciona! Pero déjame decirte algo importante: esto NO fue suerte. No fue casualidad. Fuiste TÚ. Tu claridad, tu visualización, tu expectativa inquebrantable. TÚ lo manifestaste.

Ahora que sabes que funciona, querido, ¡el cielo es el límite!"

---

# RESPONDE SIEMPRE:
- En español (aunque uses frases ocasionales en inglés)
- Con calidez y entusiasmo
- Compartiendo historias relevantes
- Dando pasos específicos y accionables
- Con optimismo inquebrantable
- Preguntando detalles para ser más específico

Tu misión es hacer que cada persona se sienta VISTA, ESCUCHADA, INSPIRADA, y con ACCIÓN CLARA que tomar.

¡Adelante, dear! 💫👑`

// Definir las herramientas/funciones que Helene puede usar
const HELENE_TOOLS = [
  {
    name: 'get_all_decretos',
    description: 'Obtiene todos los decretos del usuario con información completa (título, descripción, categoría, estado, nivel de fe, días desde último primario, señales registradas)',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_decreto_details',
    description: 'Obtiene detalles completos de un decreto específico incluyendo: tareas completadas, check-ins de fe, señales/sincronicidades, tiempo dedicado',
    parameters: {
      type: 'object',
      properties: {
        decreto_id: {
          type: 'number',
          description: 'ID del decreto'
        }
      },
      required: ['decreto_id']
    }
  },
  {
    name: 'create_decreto',
    description: 'Crea un nuevo decreto para el usuario',
    parameters: {
      type: 'object',
      properties: {
        titulo: {
          type: 'string',
          description: 'Título del decreto (ej: "Casa Nueva en la Playa")'
        },
        descripcion: {
          type: 'string',
          description: 'Descripción detallada y específica del decreto'
        },
        categoria: {
          type: 'string',
          enum: ['material', 'humano', 'empresarial'],
          description: 'Categoría del decreto'
        }
      },
      required: ['titulo', 'descripcion', 'categoria']
    }
  },
  {
    name: 'update_decreto',
    description: 'Actualiza un decreto existente',
    parameters: {
      type: 'object',
      properties: {
        decreto_id: {
          type: 'number',
          description: 'ID del decreto a actualizar'
        },
        titulo: {
          type: 'string',
          description: 'Nuevo título (opcional)'
        },
        descripcion: {
          type: 'string',
          description: 'Nueva descripción (opcional)'
        }
      },
      required: ['decreto_id']
    }
  },
  {
    name: 'delete_decreto',
    description: 'Elimina un decreto',
    parameters: {
      type: 'object',
      properties: {
        decreto_id: {
          type: 'number',
          description: 'ID del decreto a eliminar'
        }
      },
      required: ['decreto_id']
    }
  },
  {
    name: 'get_agenda_events',
    description: 'Obtiene los eventos de la agenda del usuario en un rango de fechas',
    parameters: {
      type: 'object',
      properties: {
        start_date: {
          type: 'string',
          description: 'Fecha inicial en formato YYYY-MM-DD'
        },
        end_date: {
          type: 'string',
          description: 'Fecha final en formato YYYY-MM-DD'
        }
      },
      required: ['start_date', 'end_date']
    }
  },
  {
    name: 'create_agenda_event',
    description: 'Crea un evento en la agenda del usuario',
    parameters: {
      type: 'object',
      properties: {
        decreto_id: {
          type: 'number',
          description: 'ID del decreto relacionado (opcional)'
        },
        titulo: {
          type: 'string',
          description: 'Título del evento'
        },
        descripcion: {
          type: 'string',
          description: 'Descripción del evento'
        },
        fecha: {
          type: 'string',
          description: 'Fecha del evento en formato YYYY-MM-DD'
        },
        hora: {
          type: 'string',
          description: 'Hora del evento en formato HH:MM'
        },
        tipo: {
          type: 'string',
          enum: ['trabajo_decreto', 'reunion', 'deadline', 'otro'],
          description: 'Tipo de evento'
        }
      },
      required: ['titulo', 'fecha', 'hora', 'tipo']
    }
  },
  {
    name: 'delete_agenda_event',
    description: 'Elimina un evento de la agenda',
    parameters: {
      type: 'object',
      properties: {
        event_id: {
          type: 'number',
          description: 'ID del evento a eliminar'
        }
      },
      required: ['event_id']
    }
  },
  {
    name: 'register_faith_checkin',
    description: 'Registra un check-in de nivel de fe para un decreto',
    parameters: {
      type: 'object',
      properties: {
        decreto_id: {
          type: 'number',
          description: 'ID del decreto'
        },
        faith_level: {
          type: 'number',
          description: 'Nivel de fe del 1 al 10'
        },
        notes: {
          type: 'string',
          description: 'Notas sobre el nivel de fe (opcional)'
        }
      },
      required: ['decreto_id', 'faith_level']
    }
  },
  {
    name: 'record_signal',
    description: 'Registra una señal, sincronicidad u oportunidad relacionada con un decreto',
    parameters: {
      type: 'object',
      properties: {
        decreto_id: {
          type: 'number',
          description: 'ID del decreto'
        },
        description: {
          type: 'string',
          description: 'Descripción de la señal o sincronicidad'
        },
        signal_type: {
          type: 'string',
          enum: ['señal', 'sincronicidad', 'oportunidad'],
          description: 'Tipo de evento'
        },
        emotional_impact: {
          type: 'number',
          description: 'Impacto emocional del 1 al 10'
        }
      },
      required: ['decreto_id', 'description', 'signal_type']
    }
  },
  {
    name: 'get_rutina_today',
    description: 'Obtiene la rutina diaria del usuario incluyendo los 3 decretos primarios del día, tareas completadas, check-ins de fe pendientes',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    }
  }
]

// Funciones que ejecutan las herramientas
async function executeTool(toolName: string, args: any, db: D1Database, userId: string) {
  const today = new Date().toISOString().split('T')[0]

  switch (toolName) {
    case 'get_all_decretos':
      const decretos = await db.prepare(`
        SELECT
          d.*,
          COALESCE(
            julianday(?) - julianday(d.last_primary_date),
            julianday(?) - julianday(d.created_at)
          ) as days_since_primary,
          COUNT(DISTINCT s.id) as total_signals
        FROM decretos d
        LEFT JOIN signals s ON d.id = s.decreto_id
        WHERE d.user_id = ?
        GROUP BY d.id
        ORDER BY d.created_at DESC
      `).bind(today, today, userId).all()
      return decretos.results

    case 'get_decreto_details':
      const decreto = await db.prepare(`SELECT * FROM decretos WHERE id = ? AND user_id = ?`)
        .bind(args.decreto_id, userId).first()

      if (!decreto) return { error: 'Decreto no encontrado' }

      const tasks = await db.prepare(`
        SELECT * FROM daily_tasks
        WHERE decreto_id = ? AND completed = 1
        ORDER BY completed_at DESC LIMIT 10
      `).bind(args.decreto_id).all()

      const faithCheckins = await db.prepare(`
        SELECT * FROM faith_checkins
        WHERE decreto_id = ?
        ORDER BY created_at DESC LIMIT 10
      `).bind(args.decreto_id).all()

      const signals = await db.prepare(`
        SELECT * FROM signals
        WHERE decreto_id = ?
        ORDER BY created_at DESC LIMIT 10
      `).bind(args.decreto_id).all()

      return {
        decreto,
        tasks: tasks.results,
        faithCheckins: faithCheckins.results,
        signals: signals.results
      }

    case 'create_decreto':
      const newDecreto = await db.prepare(`
        INSERT INTO decretos (user_id, titulo, descripcion, categoria, estado, faith_level, created_at)
        VALUES (?, ?, ?, ?, 'activo', 5, CURRENT_TIMESTAMP)
        RETURNING *
      `).bind(userId, args.titulo, args.descripcion, args.categoria).first()
      return newDecreto

    case 'update_decreto':
      const updates = []
      const bindings = []
      if (args.titulo) {
        updates.push('titulo = ?')
        bindings.push(args.titulo)
      }
      if (args.descripcion) {
        updates.push('descripcion = ?')
        bindings.push(args.descripcion)
      }
      if (updates.length === 0) return { error: 'No hay campos para actualizar' }

      bindings.push(args.decreto_id, userId)
      await db.prepare(`
        UPDATE decretos SET ${updates.join(', ')} WHERE id = ? AND user_id = ?
      `).bind(...bindings).run()
      return { success: true, message: 'Decreto actualizado' }

    case 'delete_decreto':
      await db.prepare(`DELETE FROM decretos WHERE id = ? AND user_id = ?`)
        .bind(args.decreto_id, userId).run()
      return { success: true, message: 'Decreto eliminado' }

    case 'get_agenda_events':
      const events = await db.prepare(`
        SELECT ae.*, d.titulo as decreto_titulo
        FROM agenda_events ae
        LEFT JOIN decretos d ON ae.decreto_id = d.id
        WHERE ae.user_id = ? AND ae.fecha BETWEEN ? AND ?
        ORDER BY ae.fecha, ae.hora
      `).bind(userId, args.start_date, args.end_date).all()
      return events.results

    case 'create_agenda_event':
      const newEvent = await db.prepare(`
        INSERT INTO agenda_events (user_id, decreto_id, titulo, descripcion, fecha, hora, tipo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        RETURNING *
      `).bind(
        userId,
        args.decreto_id || null,
        args.titulo,
        args.descripcion || '',
        args.fecha,
        args.hora,
        args.tipo
      ).first()
      return newEvent

    case 'delete_agenda_event':
      await db.prepare(`DELETE FROM agenda_events WHERE id = ? AND user_id = ?`)
        .bind(args.event_id, userId).run()
      return { success: true, message: 'Evento eliminado' }

    case 'register_faith_checkin':
      const checkin = await db.prepare(`
        INSERT INTO faith_checkins (user_id, decreto_id, faith_level, notes, check_in_time, created_at)
        VALUES (?, ?, ?, ?, '10am', CURRENT_TIMESTAMP)
        RETURNING *
      `).bind(userId, args.decreto_id, args.faith_level, args.notes || '').first()

      // Actualizar faith_level del decreto
      await db.prepare(`UPDATE decretos SET faith_level = ? WHERE id = ?`)
        .bind(args.faith_level, args.decreto_id).run()

      return checkin

    case 'record_signal':
      const signal = await db.prepare(`
        INSERT INTO signals (user_id, decreto_id, description, signal_type, emotional_impact, created_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        RETURNING *
      `).bind(
        userId,
        args.decreto_id,
        args.description,
        args.signal_type,
        args.emotional_impact || 5
      ).first()
      return signal

    case 'get_rutina_today':
      const rutina = await db.prepare(`
        SELECT
          dr.*,
          dm.titulo as material_titulo,
          dm.descripcion as material_description,
          dh.titulo as humano_titulo,
          dh.descripcion as humano_description,
          de.titulo as empresarial_titulo,
          de.descripcion as empresarial_description
        FROM daily_rotation dr
        LEFT JOIN decretos dm ON dr.decreto_material_id = dm.id
        LEFT JOIN decretos dh ON dr.decreto_humano_id = dh.id
        LEFT JOIN decretos de ON dr.decreto_empresarial_id = de.id
        WHERE dr.user_id = ? AND dr.date = ?
      `).bind(userId, today).first()

      const completedTasks = await db.prepare(`
        SELECT * FROM daily_tasks WHERE user_id = ? AND date = ?
      `).bind(userId, today).all()

      return {
        rutina,
        completedTasks: completedTasks.results
      }

    default:
      return { error: 'Herramienta no encontrada' }
  }
}

// Ruta para chatear con Helene
chatbotRoutes.post('/chat', async (c) => {
  try {
    const { message, conversationHistory = [] } = await c.req.json()

    if (!message) {
      return c.json({ success: false, error: 'Mensaje requerido' }, 400)
    }

    // Obtener información del usuario si está logueado (opcional)
    const userId = c.req.header('X-User-ID') || 'demo-user'
    const isAuthenticated = c.req.header('X-User-ID') !== undefined

    // Construir el historial de conversación para Gemini
    let systemPrompt = HELENE_PROMPT || HELENE_PROMPT_FALLBACK

    if (isAuthenticated) {
      systemPrompt += `

HERRAMIENTAS DISPONIBLES:
Tienes acceso a herramientas para ayudar al usuario. Puedes leer sus decretos, crear nuevos, agregar eventos a la agenda, registrar señales, etc.

IMPORTANTE:
- Cuando el usuario te pida información sobre sus decretos, usa get_all_decretos o get_decreto_details
- Si el usuario quiere crear un decreto, asegúrate de que sea ESPECÍFICO (método SPEC) y luego usa create_decreto
- Si el usuario menciona una sincronicidad o señal, pregunta detalles y usa record_signal
- Si el usuario quiere agregar algo a su agenda, usa create_agenda_event
- Siempre da feedback al usuario sobre lo que hiciste

Sé proactiva y usa las herramientas cuando sea apropiado para ayudar mejor al usuario.`
    }

    const messages = [
      {
        role: 'user',
        content: systemPrompt
      },
      {
        role: 'assistant',
        content: '¡Hola dear! Soy Helene Hadsell, La Reina de los Concursos. Estoy aquí para ayudarte a manifestar tus sueños usando mi método SPEC. ¿Qué quieres crear en tu vida?'
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ]

    console.log('🤖 Enviando mensaje a Groq con Llama 3.1...')

    const GROQ_API_KEY = (c.env as any).GROQ_API_KEY || ''

    if (!GROQ_API_KEY) {
      return c.json({
        success: false,
        error: 'API key de Groq no configurada'
      }, 500)
    }

    // Convertir herramientas al formato de Groq/OpenAI (solo si está autenticado)
    const groqTools = isAuthenticated ? HELENE_TOOLS.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    })) : undefined

    // Loop de function calling
    let groqMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
    let finalResponse = ''
    let maxIterations = 5
    let iteration = 0
    const toolCalls: any[] = []

    while (iteration < maxIterations) {
      iteration++

      // Preparar el body de la request para Groq (formato OpenAI)
      const requestBody: any = {
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        temperature: 0.9,
        max_tokens: 2048,
        top_p: 0.95,
      }

      // IMPORTANTE: No usar tools si el mensaje menciona "sugiere acciones" o "Analiza este decreto"
      // Esto es para la función "Sugerir con IA" que solo necesita generar texto JSON
      const lastUserMessage = groqMessages[groqMessages.length - 1]?.content || ''
      const isSuggestionRequest = lastUserMessage.includes('Analiza este decreto') ||
                                  lastUserMessage.includes('sugiere acciones') ||
                                  lastUserMessage.includes('FORMATO DE RESPUESTA (JSON)')

      // Solo agregar tools si está autenticado Y NO es una petición de sugerencias
      if (groqTools && groqTools.length > 0 && !isSuggestionRequest) {
        requestBody.tools = groqTools
        requestBody.tool_choice = 'auto'
      }

      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify(requestBody)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error('❌ Error de Groq:', data)
        return c.json({
          success: false,
          error: 'Error al procesar mensaje con IA',
          details: data
        }, 500)
      }

      const choice = data.choices[0]
      const assistantMessage = choice.message

      // Verificar si hay tool calls
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        console.log(`🔧 Helene quiere usar ${assistantMessage.tool_calls.length} herramienta(s)`)

        // Agregar mensaje del asistente al historial
        groqMessages.push(assistantMessage)

        // Ejecutar cada tool call
        for (const toolCall of assistantMessage.tool_calls) {
          const toolName = toolCall.function.name
          const toolArgs = JSON.parse(toolCall.function.arguments || '{}')

          console.log(`   Ejecutando: ${toolName}`, toolArgs)

          try {
            const result = await executeTool(toolName, toolArgs, c.env.DB, userId)

            // Agregar resultado al historial
            groqMessages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              name: toolName,
              content: JSON.stringify(result)
            })

            toolCalls.push({
              tool: toolName,
              args: toolArgs,
              result
            })
          } catch (error) {
            console.error(`❌ Error ejecutando ${toolName}:`, error)
            groqMessages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              name: toolName,
              content: JSON.stringify({ error: error instanceof Error ? error.message : 'Error desconocido' })
            })
          }
        }

        // Continuar el loop para que Groq genere una respuesta con los resultados
        continue
      }

      // Si no hay tool calls, extraer la respuesta de texto
      if (assistantMessage.content) {
        finalResponse = assistantMessage.content
        break
      }

      // Si llegamos aquí sin respuesta, algo salió mal
      break
    }

    if (!finalResponse) {
      finalResponse = 'Lo siento dear, tuve un problema procesando tu solicitud. ¿Podrías intentar de nuevo?'
    }

    console.log('✅ Respuesta de Helene generada con', toolCalls.length, 'acciones ejecutadas')

    // Guardar conversación en BD
    await c.env.DB.prepare(`
      INSERT INTO chatbot_conversaciones (user_id, mensaje_usuario, respuesta_helene, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(userId, message, finalResponse).run()

    return c.json({
      success: true,
      data: {
        message: finalResponse,
        conversationHistory: [
          ...conversationHistory,
          { role: 'user', content: message },
          { role: 'assistant', content: finalResponse }
        ],
        toolCalls // Incluir las acciones ejecutadas para debugging
      }
    })

  } catch (error) {
    console.error('❌ Error en chatbot:', error)
    return c.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : String(error)
    }, 500)
  }
})

// Obtener historial de conversaciones del usuario
chatbotRoutes.get('/history', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')

    if (!userId) {
      return c.json({ success: false, error: 'Usuario no autenticado' }, 401)
    }

    const conversations = await c.env.DB.prepare(`
      SELECT mensaje_usuario, respuesta_helene, created_at
      FROM chatbot_conversaciones
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).bind(userId).all()

    return c.json({
      success: true,
      data: conversations.results
    })

  } catch (error) {
    console.error('❌ Error al obtener historial:', error)
    return c.json({ success: false, error: 'Error al obtener historial' }, 500)
  }
})

// Limpiar historial de conversaciones
chatbotRoutes.delete('/history', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')

    if (!userId) {
      return c.json({ success: false, error: 'Usuario no autenticado' }, 401)
    }

    await c.env.DB.prepare(`
      DELETE FROM chatbot_conversaciones
      WHERE user_id = ?
    `).bind(userId).run()

    return c.json({ success: true })

  } catch (error) {
    console.error('❌ Error al limpiar historial:', error)
    return c.json({ success: false, error: 'Error al limpiar historial' }, 500)
  }
})

// Ruta especializada SOLO para sugerir acciones (sin el prompt largo de Helene)
chatbotRoutes.post('/suggest', async (c) => {
  try {
    const { decreto } = await c.req.json()

    if (!decreto) {
      return c.json({ success: false, error: 'Decreto requerido' }, 400)
    }

    // Prompt corto y enfocado solo en generar sugerencias
    const promptCorto = `Eres Helene Hadsell, experta en el método SPEC. Analiza este decreto y sugiere acciones concretas:

DECRETO: "${decreto.titulo}"
DESCRIPCIÓN: "${decreto.descripcion}"
CATEGORÍA: ${decreto.categoria}

Sugiere:
- 3 ACCIONES PRIMARIAS (semanales, estratégicas, 1-3 horas)
- 5 ACCIONES SECUNDARIAS (diarias, 5-30 min, mantienen fe)

RESPONDE SOLO CON JSON (sin texto adicional):
{
  "primarias": [
    {"titulo": "...", "descripcion": "...", "dia_sugerido": "lunes|miércoles|viernes"}
  ],
  "secundarias": [
    {"titulo": "...", "descripcion": "...", "momento": "mañana|tarde|noche"}
  ]
}`

    const GROQ_API_KEY = (c.env as any).GROQ_API_KEY || ''

    if (!GROQ_API_KEY) {
      return c.json({
        success: false,
        error: 'API key de Groq no configurada'
      }, 500)
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: promptCorto
            }
          ],
          temperature: 0.9,
          max_tokens: 2048,
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Error de Groq:', data)
      return c.json({
        success: false,
        error: 'Error al procesar sugerencias con IA',
        details: data
      }, 500)
    }

    const message = data.choices[0]?.message?.content || ''

    return c.json({
      success: true,
      data: {
        message
      }
    })

  } catch (error) {
    console.error('❌ Error en suggest:', error)
    return c.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : String(error)
    }, 500)
  }
})


// Endpoint para ayudar a completar "¿Qué hacer?" en acciones
chatbotRoutes.post('/accion-helper', async (c) => {
  try {
    const { decreto, tituloAccion } = await c.req.json()

    if (!decreto || !tituloAccion) {
      return c.json({ success: false, error: 'Decreto y título de acción requeridos' }, 400)
    }

    const GROQ_API_KEY = c.env.GROQ_API_KEY
    if (!GROQ_API_KEY) {
      return c.json({ success: false, error: 'API key no configurada' }, 500)
    }

    const promptHelper = `Eres Helene Hadsell, experta en manifestación. Un usuario está creando una acción para su decreto.

DECRETO: "${decreto.titulo}"
DESCRIPCIÓN: "${decreto.descripcion}"
TÍTULO DE LA ACCIÓN: "${tituloAccion}"

Genera un "¿Qué hacer?" específico, práctico y accionable (máximo 2-3 frases).
Debe ser concreto y fácil de ejecutar.

Responde SOLO con el texto del "qué hacer", sin explicaciones adicionales.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: promptHelper }],
        temperature: 0.7,
        max_tokens: 200,
      })
    })

    const data = await response.json()
    const sugerencia = data.choices[0]?.message?.content?.trim() || ''

    return c.json({
      success: true,
      data: { sugerencia }
    })
  } catch (error) {
    console.error('Error en accion-helper:', error)
    return c.json({
      success: false,
      error: 'Error al generar sugerencia',
      details: error instanceof Error ? error.message : String(error)
    }, 500)
  }
})
