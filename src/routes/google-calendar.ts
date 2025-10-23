import { Hono } from 'hono'
import type { HonoEnv } from '../types'

const googleCalendarRoutes = new Hono<HonoEnv>()

// ============================================
// 🔐 AUTENTICACIÓN Y CONFIGURACIÓN
// ============================================

/**
 * GET /api/google-calendar/auth-url
 * Genera la URL de autorización OAuth de Google
 */
googleCalendarRoutes.get('/auth-url', async (c) => {
  try {
    console.log('DEBUG: Starting auth-url endpoint')
    console.log('DEBUG: c.env:', c.env)
    console.log('DEBUG: typeof c.env:', typeof c.env)
    console.log('DEBUG: c.env keys:', c.env ? Object.keys(c.env) : 'c.env is null/undefined')

    // Obtener configuración de variables de entorno
    const clientId = c.env?.GOOGLE_CLIENT_ID
    const redirectUri = c.env?.GOOGLE_REDIRECT_URI || `${new URL(c.req.url).origin}/api/google-calendar/callback`

    console.log('DEBUG: clientId:', clientId ? 'SET' : 'NOT SET')
    console.log('DEBUG: redirectUri:', redirectUri)

    if (!clientId) {
      return c.json({
        success: false,
        error: 'Google Calendar no está configurado. Falta GOOGLE_CLIENT_ID.',
        debug: {
          hasEnv: !!c.env,
          envKeys: c.env ? Object.keys(c.env) : []
        }
      }, 500)
    }

    // Scopes necesarios para Google Calendar
    const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly'
    ].join(' ')

    // Generar URL de autorización
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', scopes)
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('prompt', 'consent')

    return c.json({
      success: true,
      data: { authUrl: authUrl.toString() }
    })
  } catch (error: any) {
    console.error('Error generating auth URL:', error)
    console.error('Error stack:', error.stack)
    return c.json({
      success: false,
      error: error.message || 'Error al generar URL de autenticación',
      errorType: error.constructor.name,
      errorStack: error.stack
    }, 500)
  }
})

/**
 * GET /api/google-calendar/callback
 * Callback de OAuth - intercambia código por tokens
 */
googleCalendarRoutes.get('/callback', async (c) => {
  try {
    const code = c.req.query('code')
    const error = c.req.query('error')

    if (error) {
      return c.redirect(`/?google_auth_error=${error}`)
    }

    if (!code) {
      return c.json({ success: false, error: 'No se recibió código de autorización' }, 400)
    }

    const db = c.env.DB
    const clientId = c.env.GOOGLE_CLIENT_ID
    const clientSecret = c.env.GOOGLE_CLIENT_SECRET
    const redirectUri = c.env.GOOGLE_REDIRECT_URI || `${new URL(c.req.url).origin}/api/google-calendar/callback`

    // Intercambiar código por tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || 'Error al obtener tokens')
    }

    // Calcular expiración del token
    const expiryDate = new Date(Date.now() + (tokens.expires_in * 1000)).toISOString()

    // Guardar tokens en la base de datos
    await db.prepare(`
      INSERT INTO user_integrations (
        user_id, google_access_token, google_refresh_token,
        google_token_expiry, sync_enabled, updated_at
      ) VALUES (?, ?, ?, ?, 1, datetime('now'))
      ON CONFLICT(user_id) DO UPDATE SET
        google_access_token = excluded.google_access_token,
        google_refresh_token = excluded.google_refresh_token,
        google_token_expiry = excluded.google_token_expiry,
        sync_enabled = 1,
        updated_at = datetime('now')
    `).bind(
      'demo-user',
      tokens.access_token,
      tokens.refresh_token,
      expiryDate
    ).run()

    // Redirigir a la página de configuración con éxito
    return c.redirect('/?google_auth_success=1')

  } catch (error: any) {
    console.error('Error in OAuth callback:', error)
    return c.redirect(`/?google_auth_error=${encodeURIComponent(error.message)}`)
  }
})

/**
 * GET /api/google-calendar/status
 * Obtiene el estado de la conexión con Google Calendar
 */
googleCalendarRoutes.get('/status', async (c) => {
  try {
    const db = c.env.DB
    const userId = 'demo-user'

    const integration = await db.prepare(`
      SELECT
        sync_enabled,
        google_calendar_id,
        auto_import,
        auto_export,
        export_rutinas,
        export_decretos_primarios,
        export_agenda_eventos,
        last_import,
        timezone,
        CASE
          WHEN google_access_token IS NOT NULL THEN 1
          ELSE 0
        END as is_connected
      FROM user_integrations
      WHERE user_id = ?
    `).bind(userId).first()

    return c.json({
      success: true,
      data: integration || { is_connected: 0 }
    })
  } catch (error: any) {
    console.error('Error getting integration status:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al obtener estado de integración'
    }, 500)
  }
})

/**
 * POST /api/google-calendar/disconnect
 * Desconecta Google Calendar
 */
googleCalendarRoutes.post('/disconnect', async (c) => {
  try {
    const db = c.env.DB
    const userId = 'demo-user'

    await db.prepare(`
      UPDATE user_integrations
      SET
        google_access_token = NULL,
        google_refresh_token = NULL,
        google_token_expiry = NULL,
        sync_enabled = 0,
        updated_at = datetime('now')
      WHERE user_id = ?
    `).bind(userId).run()

    return c.json({
      success: true,
      message: 'Google Calendar desconectado exitosamente'
    })
  } catch (error: any) {
    console.error('Error disconnecting Google Calendar:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al desconectar Google Calendar'
    }, 500)
  }
})

/**
 * PUT /api/google-calendar/settings
 * Actualiza configuración de sincronización
 */
googleCalendarRoutes.put('/settings', async (c) => {
  try {
    const db = c.env.DB
    const userId = 'demo-user'
    const settings = await c.req.json()

    const {
      auto_import,
      auto_export,
      export_rutinas,
      export_decretos_primarios,
      export_agenda_eventos,
      export_acciones,
      conflict_resolution,
      timezone
    } = settings

    await db.prepare(`
      UPDATE user_integrations
      SET
        auto_import = COALESCE(?, auto_import),
        auto_export = COALESCE(?, auto_export),
        export_rutinas = COALESCE(?, export_rutinas),
        export_decretos_primarios = COALESCE(?, export_decretos_primarios),
        export_agenda_eventos = COALESCE(?, export_agenda_eventos),
        export_acciones = COALESCE(?, export_acciones),
        conflict_resolution = COALESCE(?, conflict_resolution),
        timezone = COALESCE(?, timezone),
        updated_at = datetime('now')
      WHERE user_id = ?
    `).bind(
      auto_import,
      auto_export,
      export_rutinas,
      export_decretos_primarios,
      export_agenda_eventos,
      export_acciones,
      conflict_resolution,
      timezone,
      userId
    ).run()

    return c.json({
      success: true,
      message: 'Configuración actualizada exitosamente'
    })
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al actualizar configuración'
    }, 500)
  }
})

// ============================================
// 📥 IMPORTACIÓN DE EVENTOS
// ============================================

/**
 * Helper: Refresca el access token si está expirado
 */
async function refreshAccessToken(c: any, userId: string) {
  const db = c.env.DB
  const clientId = c.env.GOOGLE_CLIENT_ID
  const clientSecret = c.env.GOOGLE_CLIENT_SECRET

  const integration = await db.prepare(`
    SELECT google_refresh_token, google_token_expiry
    FROM user_integrations
    WHERE user_id = ?
  `).bind(userId).first() as any

  if (!integration?.google_refresh_token) {
    throw new Error('No refresh token available')
  }

  // Verificar si el token ha expirado
  const now = new Date()
  const expiry = new Date(integration.google_token_expiry)

  if (now < expiry) {
    // Token aún válido
    return null
  }

  // Refrescar token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: integration.google_refresh_token,
      grant_type: 'refresh_token'
    })
  })

  const tokens = await response.json()

  if (!response.ok) {
    throw new Error(tokens.error_description || 'Error refreshing token')
  }

  // Actualizar token en DB
  const expiryDate = new Date(Date.now() + (tokens.expires_in * 1000)).toISOString()

  await db.prepare(`
    UPDATE user_integrations
    SET
      google_access_token = ?,
      google_token_expiry = ?,
      updated_at = datetime('now')
    WHERE user_id = ?
  `).bind(tokens.access_token, expiryDate, userId).run()

  return tokens.access_token
}

/**
 * Helper: Obtiene el access token válido
 */
async function getValidAccessToken(c: any, userId: string): Promise<string> {
  const db = c.env.DB

  // Intentar refrescar si es necesario
  const newToken = await refreshAccessToken(c, userId)
  if (newToken) {
    return newToken
  }

  // Obtener token actual
  const integration = await db.prepare(`
    SELECT google_access_token
    FROM user_integrations
    WHERE user_id = ?
  `).bind(userId).first() as any

  if (!integration?.google_access_token) {
    throw new Error('No access token available. Please reconnect Google Calendar.')
  }

  return integration.google_access_token
}

/**
 * POST /api/google-calendar/import
 * Importa eventos de Google Calendar
 */
googleCalendarRoutes.post('/import', async (c) => {
  try {
    const db = c.env.DB
    const userId = 'demo-user'
    const { startDate, endDate } = await c.req.json()

    // Crear log de sincronización
    const logResult = await db.prepare(`
      INSERT INTO sync_log (user_id, sync_type, sync_direction, started_at)
      VALUES (?, 'import', 'google_to_local', datetime('now'))
    `).bind(userId).run()

    const logId = logResult.meta.last_row_id

    try {
      // Obtener token válido
      const accessToken = await getValidAccessToken(c, userId)

      // Obtener configuración
      const integration = await db.prepare(`
        SELECT google_calendar_id, timezone
        FROM user_integrations
        WHERE user_id = ?
      `).bind(userId).first() as any

      const calendarId = integration?.google_calendar_id || 'primary'

      // Construir URL de Google Calendar API
      const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`)
      url.searchParams.set('timeMin', startDate || new Date().toISOString())
      url.searchParams.set('timeMax', endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
      url.searchParams.set('singleEvents', 'true')
      url.searchParams.set('orderBy', 'startTime')

      // Llamar a Google Calendar API
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error fetching events from Google Calendar')
      }

      const events = data.items || []
      let created = 0
      let updated = 0

      // Procesar cada evento
      for (const event of events) {
        const start = event.start?.dateTime || event.start?.date
        const end = event.end?.dateTime || event.end?.date
        const allDay = !event.start?.dateTime

        // Insertar o actualizar evento
        const result = await db.prepare(`
          INSERT INTO google_events (
            google_event_id, user_id, titulo, descripcion,
            fecha_inicio, fecha_fin, all_day, location,
            attendees, color_id, recurring, recurring_event_id,
            synced_at, deleted
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 0)
          ON CONFLICT(google_event_id) DO UPDATE SET
            titulo = excluded.titulo,
            descripcion = excluded.descripcion,
            fecha_inicio = excluded.fecha_inicio,
            fecha_fin = excluded.fecha_fin,
            all_day = excluded.all_day,
            location = excluded.location,
            attendees = excluded.attendees,
            color_id = excluded.color_id,
            synced_at = datetime('now'),
            deleted = 0,
            updated_at = datetime('now')
        `).bind(
          event.id,
          userId,
          event.summary || '(Sin título)',
          event.description || null,
          start,
          end,
          allDay ? 1 : 0,
          event.location || null,
          event.attendees ? JSON.stringify(event.attendees) : null,
          event.colorId || null,
          event.recurringEventId ? 1 : 0,
          event.recurringEventId || null
        ).run()

        if (result.meta.changes > 0) {
          // Check if it was an insert or update based on row count
          const existing = await db.prepare(`
            SELECT id FROM google_events WHERE google_event_id = ?
          `).bind(event.id).first()

          if (existing) {
            updated++
          } else {
            created++
          }
        }
      }

      // Actualizar log
      await db.prepare(`
        UPDATE sync_log
        SET
          events_processed = ?,
          events_created = ?,
          events_updated = ?,
          completed_at = datetime('now'),
          status = 'completed'
        WHERE id = ?
      `).bind(events.length, created, updated, logId).run()

      // Actualizar last_import
      await db.prepare(`
        UPDATE user_integrations
        SET last_import = datetime('now')
        WHERE user_id = ?
      `).bind(userId).run()

      return c.json({
        success: true,
        data: {
          eventsProcessed: events.length,
          eventsCreated: created,
          eventsUpdated: updated
        }
      })

    } catch (error: any) {
      // Actualizar log con error
      await db.prepare(`
        UPDATE sync_log
        SET
          status = 'failed',
          errors = 1,
          error_details = ?,
          completed_at = datetime('now')
        WHERE id = ?
      `).bind(JSON.stringify({ message: error.message }), logId).run()

      throw error
    }

  } catch (error: any) {
    console.error('Error importing events:', error)
    console.error('Error stack:', error.stack)
    return c.json({
      success: false,
      error: error.message || 'Error al importar eventos de Google Calendar',
      details: error.stack || String(error)
    }, 500)
  }
})

/**
 * GET /api/google-calendar/events
 * Obtiene eventos importados de Google Calendar
 */
googleCalendarRoutes.get('/events', async (c) => {
  try {
    const db = c.env.DB
    const userId = 'demo-user'
    const startDate = c.req.query('startDate')
    const endDate = c.req.query('endDate')

    let query = `
      SELECT
        id, google_event_id, titulo, descripcion,
        fecha_inicio, fecha_fin, all_day, location,
        color_id, recurring, synced_at
      FROM google_events
      WHERE user_id = ? AND deleted = 0
    `

    const params: any[] = [userId]

    if (startDate) {
      query += ` AND fecha_inicio >= ?`
      params.push(startDate)
    }

    if (endDate) {
      query += ` AND fecha_inicio <= ?`
      params.push(endDate)
    }

    query += ` ORDER BY fecha_inicio ASC`

    const { results } = await db.prepare(query).bind(...params).all()

    return c.json({
      success: true,
      data: results
    })
  } catch (error: any) {
    console.error('Error fetching Google events:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al obtener eventos de Google Calendar'
    }, 500)
  }
})

// ============================================
// 📤 EXPORTACIÓN DE EVENTOS
// ============================================

/**
 * Helper: Crear evento en Google Calendar
 */
async function createGoogleCalendarEvent(accessToken: string, event: any) {
  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error creating event in Google Calendar')
  }

  return response.json()
}

/**
 * Helper: Actualizar evento en Google Calendar
 */
async function updateGoogleCalendarEvent(accessToken: string, eventId: string, event: any) {
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error updating event in Google Calendar')
  }

  return response.json()
}

/**
 * Helper: Eliminar evento de Google Calendar
 */
async function deleteGoogleCalendarEvent(accessToken: string, eventId: string) {
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!response.ok && response.status !== 404) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error deleting event from Google Calendar')
  }

  return true
}

/**
 * POST /api/google-calendar/export-rutina
 * Exporta rutina matutina/vespertina a Google Calendar
 */
googleCalendarRoutes.post('/export-rutina', async (c) => {
  try {
    const db = c.env.DB
    const userId = 'demo-user'
    const { date, routineType } = await c.req.json()

    // Verificar que auto_export y export_rutinas estén habilitados
    const integration = await db.prepare(`
      SELECT auto_export, export_rutinas
      FROM user_integrations
      WHERE user_id = ?
    `).bind(userId).first() as any

    if (!integration?.auto_export || !integration?.export_rutinas) {
      return c.json({
        success: false,
        error: 'Exportación de rutinas no habilitada'
      }, 400)
    }

    // Obtener token válido
    const accessToken = await getValidAccessToken(c, userId)

    // Definir horarios y títulos
    const routineConfig = {
      morning: {
        title: '🌅 Rutina Matutina - Yo Decreto',
        startTime: '06:00',
        duration: 10,
        description: '10 minutos de rutina matutina:\n- Gratitud (3 cosas)\n- Intención del día\n- Visualización multisensorial (5 min)'
      },
      evening: {
        title: '🌙 Rutina Vespertina - Yo Decreto',
        startTime: '21:00',
        duration: 10,
        description: '10 minutos de rutina vespertina:\n- Revisión del día\n- Registro de señales\n- Gratitud final'
      }
    }

    const config = routineConfig[routineType as 'morning' | 'evening']
    const startDateTime = `${date}T${config.startTime}:00`
    const endDateTime = new Date(new Date(startDateTime).getTime() + config.duration * 60000).toISOString()

    // Verificar si ya existe mapping
    const existingMapping = await db.prepare(`
      SELECT google_event_id
      FROM event_sync_mapping
      WHERE user_id = ? AND local_event_type = 'routine' AND local_event_id = ?
    `).bind(userId, `${date}_${routineType}`).first() as any

    let googleEvent

    if (existingMapping) {
      // Actualizar evento existente
      googleEvent = await updateGoogleCalendarEvent(accessToken, existingMapping.google_event_id, {
        summary: config.title,
        description: config.description,
        start: { dateTime: startDateTime, timeZone: 'America/Mexico_City' },
        end: { dateTime: endDateTime, timeZone: 'America/Mexico_City' },
        colorId: '9' // Azul
      })
    } else {
      // Crear nuevo evento
      googleEvent = await createGoogleCalendarEvent(accessToken, {
        summary: config.title,
        description: config.description,
        start: { dateTime: startDateTime, timeZone: 'America/Mexico_City' },
        end: { dateTime: endDateTime, timeZone: 'America/Mexico_City' },
        colorId: '9', // Azul
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 10 }
          ]
        }
      })

      // Guardar mapping
      await db.prepare(`
        INSERT INTO event_sync_mapping (user_id, local_event_type, local_event_id, google_event_id, sync_direction)
        VALUES (?, 'routine', ?, ?, 'export')
      `).bind(userId, `${date}_${routineType}`, googleEvent.id).run()
    }

    return c.json({
      success: true,
      data: { googleEventId: googleEvent.id }
    })

  } catch (error: any) {
    console.error('Error exporting rutina:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al exportar rutina a Google Calendar'
    }, 500)
  }
})

/**
 * POST /api/google-calendar/export-decreto-primario
 * Exporta bloque de trabajo de decreto primario a Google Calendar
 */
googleCalendarRoutes.post('/export-decreto-primario', async (c) => {
  try {
    const db = c.env.DB
    const userId = 'demo-user'
    const { date, decretoId, categoria, titulo, startTime } = await c.req.json()

    // Verificar configuración
    const integration = await db.prepare(`
      SELECT auto_export, export_decretos_primarios
      FROM user_integrations
      WHERE user_id = ?
    `).bind(userId).first() as any

    if (!integration?.auto_export || !integration?.export_decretos_primarios) {
      return c.json({
        success: false,
        error: 'Exportación de decretos primarios no habilitada'
      }, 400)
    }

    // Obtener token válido
    const accessToken = await getValidAccessToken(c, userId)

    // Emojis por categoría
    const emojis = { material: '🏆', humano: '❤️', empresarial: '💼' }
    const colorIds = { material: '5', humano: '11', empresarial: '1' } // Amarillo, Rojo, Azul

    const eventTitle = `${emojis[categoria as keyof typeof emojis]} Trabajar: ${titulo}`
    const startDateTime = `${date}T${startTime || '09:00'}:00`
    const endDateTime = new Date(new Date(startDateTime).getTime() + 40 * 60000).toISOString()

    // Verificar mapping existente
    const existingMapping = await db.prepare(`
      SELECT google_event_id
      FROM event_sync_mapping
      WHERE user_id = ? AND local_event_type = 'daily_rotation' AND local_event_id = ?
    `).bind(userId, `${date}_${decretoId}`).first() as any

    let googleEvent

    if (existingMapping) {
      googleEvent = await updateGoogleCalendarEvent(accessToken, existingMapping.google_event_id, {
        summary: eventTitle,
        description: `Decreto Primario del día (${categoria})\n\nDedica 30-40 minutos a trabajar en este decreto.\n\n🎯 Aplicación: Yo Decreto`,
        start: { dateTime: startDateTime, timeZone: 'America/Mexico_City' },
        end: { dateTime: endDateTime, timeZone: 'America/Mexico_City' },
        colorId: colorIds[categoria as keyof typeof colorIds]
      })
    } else {
      googleEvent = await createGoogleCalendarEvent(accessToken, {
        summary: eventTitle,
        description: `Decreto Primario del día (${categoria})\n\nDedica 30-40 minutos a trabajar en este decreto.\n\n🎯 Aplicación: Yo Decreto`,
        start: { dateTime: startDateTime, timeZone: 'America/Mexico_City' },
        end: { dateTime: endDateTime, timeZone: 'America/Mexico_City' },
        colorId: colorIds[categoria as keyof typeof colorIds],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 10 }
          ]
        }
      })

      await db.prepare(`
        INSERT INTO event_sync_mapping (user_id, local_event_type, local_event_id, google_event_id, sync_direction)
        VALUES (?, 'daily_rotation', ?, ?, 'export')
      `).bind(userId, `${date}_${decretoId}`, googleEvent.id).run()
    }

    return c.json({
      success: true,
      data: { googleEventId: googleEvent.id }
    })

  } catch (error: any) {
    console.error('Error exporting decreto primario:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al exportar decreto a Google Calendar'
    }, 500)
  }
})

/**
 * POST /api/google-calendar/export-agenda-evento
 * Exporta evento de agenda a Google Calendar
 */
googleCalendarRoutes.post('/export-agenda-evento', async (c) => {
  try {
    const db = c.env.DB
    const userId = 'demo-user'
    const { eventoId } = await c.req.json()

    // Verificar configuración
    const integration = await db.prepare(`
      SELECT auto_export, export_agenda_eventos
      FROM user_integrations
      WHERE user_id = ?
    `).bind(userId).first() as any

    if (!integration?.auto_export || !integration?.export_agenda_eventos) {
      return c.json({
        success: false,
        error: 'Exportación de eventos de agenda no habilitada'
      }, 400)
    }

    // Obtener evento de agenda
    const evento = await db.prepare(`
      SELECT id, titulo, descripcion, fecha_evento, hora_evento
      FROM agenda_eventos
      WHERE id = ?
    `).bind(eventoId).first() as any

    if (!evento) {
      return c.json({ success: false, error: 'Evento no encontrado' }, 404)
    }

    // Obtener token válido
    const accessToken = await getValidAccessToken(c, userId)

    // Preparar fechas
    const startDateTime = evento.hora_evento
      ? `${evento.fecha_evento}T${evento.hora_evento}:00`
      : evento.fecha_evento

    const endDateTime = evento.hora_evento
      ? new Date(new Date(startDateTime).getTime() + 60 * 60000).toISOString() // 1 hora por defecto
      : evento.fecha_evento

    // Verificar mapping existente
    const existingMapping = await db.prepare(`
      SELECT google_event_id
      FROM event_sync_mapping
      WHERE user_id = ? AND local_event_type = 'agenda_evento' AND local_event_id = ?
    `).bind(userId, eventoId).first() as any

    let googleEvent

    const eventData: any = {
      summary: `📋 ${evento.titulo}`,
      description: evento.descripcion ? `${evento.descripcion}\n\n🎯 Desde: Yo Decreto` : '🎯 Desde: Yo Decreto',
      colorId: '7' // Cyan
    }

    if (evento.hora_evento) {
      eventData.start = { dateTime: startDateTime, timeZone: 'America/Mexico_City' }
      eventData.end = { dateTime: endDateTime, timeZone: 'America/Mexico_City' }
    } else {
      eventData.start = { date: evento.fecha_evento }
      eventData.end = { date: evento.fecha_evento }
    }

    if (existingMapping) {
      googleEvent = await updateGoogleCalendarEvent(accessToken, existingMapping.google_event_id, eventData)
    } else {
      googleEvent = await createGoogleCalendarEvent(accessToken, eventData)

      await db.prepare(`
        INSERT INTO event_sync_mapping (user_id, local_event_type, local_event_id, google_event_id, sync_direction)
        VALUES (?, 'agenda_evento', ?, ?, 'export')
      `).bind(userId, eventoId, googleEvent.id).run()
    }

    return c.json({
      success: true,
      data: { googleEventId: googleEvent.id }
    })

  } catch (error: any) {
    console.error('Error exporting agenda evento:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al exportar evento a Google Calendar'
    }, 500)
  }
})

/**
 * POST /api/google-calendar/sync-all
 * Sincroniza todos los eventos del día actual a Google Calendar
 */
googleCalendarRoutes.post('/sync-all', async (c) => {
  try {
    const db = c.env.DB
    const userId = 'demo-user'
    const today = new Date().toISOString().split('T')[0]

    // Verificar configuración
    const integration = await db.prepare(`
      SELECT auto_export, export_rutinas, export_decretos_primarios, export_agenda_eventos
      FROM user_integrations
      WHERE user_id = ?
    `).bind(userId).first() as any

    if (!integration?.auto_export) {
      return c.json({
        success: false,
        error: 'Exportación automática no habilitada'
      }, 400)
    }

    const results = {
      rutinas: 0,
      decretosPrimarios: 0,
      agendaEventos: 0,
      errors: [] as string[]
    }

    // Exportar rutinas si está habilitado
    if (integration.export_rutinas) {
      try {
        // Rutina matutina
        await fetch(`${new URL(c.req.url).origin}/api/google-calendar/export-rutina`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: today, routineType: 'morning' })
        })
        results.rutinas++

        // Rutina vespertina
        await fetch(`${new URL(c.req.url).origin}/api/google-calendar/export-rutina`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: today, routineType: 'evening' })
        })
        results.rutinas++
      } catch (error: any) {
        results.errors.push(`Rutinas: ${error.message}`)
      }
    }

    // Exportar decretos primarios si está habilitado
    if (integration.export_decretos_primarios) {
      try {
        const rotation = await db.prepare(`
          SELECT decreto_material_id, decreto_humano_id, decreto_empresarial_id
          FROM daily_rotation
          WHERE user_id = ? AND date = ?
        `).bind(userId, today).first() as any

        if (rotation) {
          // Material
          const material = await db.prepare(`SELECT id, titulo FROM decretos WHERE id = ?`).bind(rotation.decreto_material_id).first() as any
          if (material) {
            await fetch(`${new URL(c.req.url).origin}/api/google-calendar/export-decreto-primario`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                date: today,
                decretoId: material.id,
                categoria: 'material',
                titulo: material.titulo,
                startTime: '10:00'
              })
            })
            results.decretosPrimarios++
          }

          // Humano
          const humano = await db.prepare(`SELECT id, titulo FROM decretos WHERE id = ?`).bind(rotation.decreto_humano_id).first() as any
          if (humano) {
            await fetch(`${new URL(c.req.url).origin}/api/google-calendar/export-decreto-primario`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                date: today,
                decretoId: humano.id,
                categoria: 'humano',
                titulo: humano.titulo,
                startTime: '14:00'
              })
            })
            results.decretosPrimarios++
          }

          // Empresarial
          const empresarial = await db.prepare(`SELECT id, titulo FROM decretos WHERE id = ?`).bind(rotation.decreto_empresarial_id).first() as any
          if (empresarial) {
            await fetch(`${new URL(c.req.url).origin}/api/google-calendar/export-decreto-primario`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                date: today,
                decretoId: empresarial.id,
                categoria: 'empresarial',
                titulo: empresarial.titulo,
                startTime: '17:00'
              })
            })
            results.decretosPrimarios++
          }
        }
      } catch (error: any) {
        results.errors.push(`Decretos primarios: ${error.message}`)
      }
    }

    return c.json({
      success: true,
      data: results
    })

  } catch (error: any) {
    console.error('Error syncing all:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al sincronizar todos los eventos'
    }, 500)
  }
})

export default googleCalendarRoutes
