import { Hono } from 'hono'
import type { HonoEnv } from '../types'

const calendarSyncRoutes = new Hono<HonoEnv>()

/**
 * Helper: Generate JWT for Google Service Account
 */
async function generateJWT(serviceAccountJson: any): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: serviceAccountJson.client_email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  const signatureInput = `${encodedHeader}.${encodedPayload}`

  // Import private key
  const privateKey = serviceAccountJson.private_key
  const pemHeader = '-----BEGIN PRIVATE KEY-----'
  const pemFooter = '-----END PRIVATE KEY-----'
  const pemContents = privateKey.substring(
    pemHeader.length,
    privateKey.length - pemFooter.length
  ).replace(/\s/g, '')

  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signatureInput)
  )

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${signatureInput}.${encodedSignature}`
}

/**
 * Helper: Get access token using service account
 */
async function getServiceAccountAccessToken(serviceAccountJson: any): Promise<string> {
  const jwt = await generateJWT(serviceAccountJson)

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error_description || 'Error getting access token')
  }

  return data.access_token
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

    // Obtener access token
    const accessToken = await getServiceAccountAccessToken(serviceAccountJson)

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
      colorId: '9' // Azul
    }

    // Crear evento en Google Calendar
    const calendarResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }
    )

    const eventData = await calendarResponse.json()

    if (!calendarResponse.ok) {
      throw new Error(eventData.error?.message || 'Error al crear evento en Google Calendar')
    }

    return c.json({
      success: true,
      data: {
        googleEventId: eventData.id,
        htmlLink: eventData.htmlLink
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

    // Obtener access token
    const accessToken = await getServiceAccountAccessToken(serviceAccountJson)

    // Obtener lista de calendarios
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error al conectar con Google Calendar')
    }

    return c.json({
      success: true,
      message: 'Conexión exitosa con Google Calendar',
      data: {
        calendars: data.items?.length || 0,
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
