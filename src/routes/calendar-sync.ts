import { Hono } from 'hono'
import type { HonoEnv } from '../types'
import { google } from 'googleapis'

const calendarSyncRoutes = new Hono<HonoEnv>()

/**
 * Helper: Get authenticated Google Calendar client
 */
function getCalendarClient(serviceAccountJson: any) {
  const auth = new google.auth.JWT({
    email: serviceAccountJson.client_email,
    key: serviceAccountJson.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar']
  })

  return google.calendar({ version: 'v3', auth })
}

/**
 * POST /api/calendar-sync/export
 * Exporta evento a Google Calendar usando Service Account
 */
calendarSyncRoutes.post('/export', async (c) => {
  try {
    const serviceAccountJson = JSON.parse(c.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}')

    if (!serviceAccountJson.private_key) {
      return c.json({
        success: false,
        error: 'Service Account no configurado'
      }, 500)
    }

    const { titulo, descripcion, fecha, hora, duracion } = await c.req.json()

    if (!titulo || !fecha) {
      return c.json({
        success: false,
        error: 'Campos requeridos: titulo, fecha'
      }, 400)
    }

    const calendar = getCalendarClient(serviceAccountJson)

    // Preparar evento
    const startDateTime = hora
      ? `${fecha}T${hora}:00`
      : `${fecha}T09:00:00`

    const endTime = new Date(new Date(startDateTime).getTime() + (duracion || 60) * 60000)
    const endDateTime = endTime.toISOString().split('.')[0]

    const event = {
      summary: titulo,
      description: descripcion || '',
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Mexico_City'
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Mexico_City'
      },
      attendees: [
        { email: 'gusguecas@gmail.com' }
      ],
      colorId: '9' // Azul
    }

    // Crear evento en el calendario PRIMARY del Service Account
    // pero con gusguecas@gmail.com como asistente
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: 'all' // Enviar invitación por email
    })

    return c.json({
      success: true,
      data: {
        googleEventId: response.data.id,
        htmlLink: response.data.htmlLink
      }
    })

  } catch (error: any) {
    console.error('Error exporting to calendar:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al exportar a Google Calendar'
    }, 500)
  }
})

/**
 * GET /api/calendar-sync/test
 * Prueba la conexión con Google Calendar
 */
calendarSyncRoutes.get('/test', async (c) => {
  try {
    const serviceAccountJson = JSON.parse(c.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}')

    if (!serviceAccountJson.private_key) {
      return c.json({
        success: false,
        error: 'Service Account no configurado'
      }, 500)
    }

    const calendar = getCalendarClient(serviceAccountJson)

    // Obtener lista de calendarios
    const calendarListResponse = await calendar.calendarList.list()

    // Intentar leer eventos del calendario gusguecas@gmail.com
    let canAccessCalendar = false
    let eventsCount = 0
    try {
      const eventsResponse = await calendar.events.list({
        calendarId: 'gusguecas@gmail.com',
        maxResults: 10
      })
      canAccessCalendar = true
      eventsCount = eventsResponse.data.items?.length || 0
    } catch (error: any) {
      canAccessCalendar = false
    }

    return c.json({
      success: true,
      message: 'Conexión exitosa con Google Calendar',
      data: {
        calendars: calendarListResponse.data.items?.length || 0,
        calendarsList: calendarListResponse.data.items?.map(cal => ({
          id: cal.id,
          summary: cal.summary,
          accessRole: cal.accessRole
        })) || [],
        canAccessGusguecas: canAccessCalendar,
        eventsInGusguecas: eventsCount,
        serviceAccount: serviceAccountJson.client_email
      }
    })

  } catch (error: any) {
    console.error('Error testing calendar connection:', error)
    return c.json({
      success: false,
      error: error.message || 'Error al probar conexión'
    }, 500)
  }
})

export default calendarSyncRoutes
