import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'

type Bindings = {
  DB: D1Database
}

interface AuthUser {
  id: number
  email: string
  name: string
  password_hash: string
  is_active: boolean
  last_login: string | null
}

interface SessionData {
  user_id: number
  session_token: string
  expires_at: string
}

const auth = new Hono<{ Bindings: Bindings }>()

// Utilidades de autenticación
const AuthUtils = {
  // Generar token de sesión
  generateToken(): string {
    return Math.random().toString(36).substr(2) + Date.now().toString(36)
  },

  // Verificar contraseña (simple para desarrollo)
  verifyPassword(password: string, storedPassword: string): boolean {
    // Comparación directa para desarrollo
    // En producción usar bcrypt o Web Crypto API
    return password === storedPassword
  },

  // Hash de contraseña (simulado)
  hashPassword(password: string): string {
    // En producción usar bcrypt
    return '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  },

  // Validar formato de email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Crear sesión en base de datos
  async createSession(db: D1Database, userId: number, remember: boolean): Promise<string> {
    const token = this.generateToken()
    const expiresAt = new Date()
    
    // Si remember = true, sesión por 30 días, sino 24 horas
    const hours = remember ? 30 * 24 : 24
    expiresAt.setHours(expiresAt.getHours() + hours)
    
    await db.prepare(`
      INSERT INTO auth_sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `).bind(userId, token, expiresAt.toISOString()).run()
    
    return token
  },

  // Validar sesión
  async validateSession(db: D1Database, token: string): Promise<AuthUser | null> {
    const session = await db.prepare(`
      SELECT s.*, u.id, u.email, u.name, u.is_active
      FROM auth_sessions s
      JOIN auth_users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `).bind(token).first<SessionData & AuthUser>()
    
    if (!session || !session.is_active) {
      return null
    }
    
    return {
      id: session.id,
      email: session.email,
      name: session.name,
      password_hash: '',
      is_active: session.is_active,
      last_login: session.last_login
    }
  },

  // Limpiar sesiones expiradas
  async cleanExpiredSessions(db: D1Database): Promise<void> {
    await db.prepare(`
      DELETE FROM auth_sessions 
      WHERE expires_at <= datetime('now')
    `).run()
  }
}

// 📝 POST /api/auth/register - Crear nueva cuenta
auth.post('/register', async (c) => {
  try {
    const { name, email, password } = await c.req.json()
    
    // Validar datos de entrada
    if (!name || !email || !password) {
      return c.json({ error: 'Nombre, email y contraseña son requeridos' }, 400)
    }
    
    if (!AuthUtils.isValidEmail(email)) {
      return c.json({ error: 'Formato de email inválido' }, 400)
    }
    
    if (password.length < 6) {
      return c.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, 400)
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await c.env.DB.prepare(`
      SELECT id FROM auth_users WHERE email = ?
    `).bind(email).first()
    
    if (existingUser) {
      return c.json({ error: 'Ya existe una cuenta con este email' }, 409)
    }
    
    // Crear nuevo usuario
    const result = await c.env.DB.prepare(`
      INSERT INTO auth_users (email, password_hash, name, is_active)
      VALUES (?, ?, ?, 1)
    `).bind(email, password, name).run()
    
    if (!result.success) {
      return c.json({ error: 'Error al crear la cuenta' }, 500)
    }
    
    return c.json({
      success: true,
      message: 'Cuenta creada exitosamente',
      user: {
        id: result.meta.last_row_id,
        email,
        name
      }
    })
    
  } catch (error) {
    console.error('Error en registro:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// 🔐 POST /api/auth/login - Iniciar sesión
auth.post('/login', async (c) => {
  try {
    const { email, password, remember = false } = await c.req.json()
    
    // Validar datos de entrada
    if (!email || !password) {
      return c.json({ error: 'Email y contraseña son requeridos' }, 400)
    }
    
    if (!AuthUtils.isValidEmail(email)) {
      return c.json({ error: 'Formato de email inválido' }, 400)
    }
    
    // Buscar usuario en la base de datos
    const user = await c.env.DB.prepare(`
      SELECT id, email, name, password_hash, is_active, last_login
      FROM auth_users 
      WHERE email = ?
    `).bind(email).first<AuthUser>()
    
    if (!user || !user.is_active) {
      return c.json({ error: 'Credenciales incorrectas' }, 401)
    }
    
    // Verificar contraseña
    if (!AuthUtils.verifyPassword(password, user.password_hash)) {
      return c.json({ error: 'Credenciales incorrectas' }, 401)
    }
    
    // Actualizar último login
    await c.env.DB.prepare(`
      UPDATE auth_users 
      SET last_login = datetime('now')
      WHERE id = ?
    `).bind(user.id).run()
    
    // Crear sesión
    const token = await AuthUtils.createSession(c.env.DB, user.id, remember)
    
    // Limpiar sesiones expiradas (mantenimiento)
    await AuthUtils.cleanExpiredSessions(c.env.DB)
    
    // Configurar cookie si remember = true
    if (remember) {
      setCookie(c, 'yo-decreto-token', token, {
        maxAge: 30 * 24 * 60 * 60, // 30 días
        httpOnly: false, // Permitir acceso desde JS
        secure: false, // En producción debería ser true con HTTPS
        sameSite: 'Lax'
      })
    }
    
    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        last_login: user.last_login
      }
    })
    
  } catch (error) {
    console.error('Error en login:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// 🔍 GET /api/auth/validate - Validar sesión existente
auth.get('/validate', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const cookieToken = getCookie(c, 'yo-decreto-token')
    
    let token = null
    
    // Buscar token en header Authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else if (cookieToken) {
      token = cookieToken
    }
    
    if (!token) {
      return c.json({ error: 'Token no proporcionado' }, 401)
    }
    
    // Validar sesión
    const user = await AuthUtils.validateSession(c.env.DB, token)
    
    if (!user) {
      return c.json({ error: 'Sesión inválida o expirada' }, 401)
    }
    
    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        last_login: user.last_login
      }
    })
    
  } catch (error) {
    console.error('Error validando sesión:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// 🚪 POST /api/auth/logout - Cerrar sesión
auth.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const cookieToken = getCookie(c, 'yo-decreto-token')
    
    let token = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else if (cookieToken) {
      token = cookieToken
    }
    
    if (token) {
      // Eliminar sesión de la base de datos
      await c.env.DB.prepare(`
        DELETE FROM auth_sessions 
        WHERE session_token = ?
      `).bind(token).run()
      
      // Eliminar cookie
      setCookie(c, 'yo-decreto-token', '', {
        maxAge: 0
      })
    }
    
    return c.json({ success: true, message: 'Sesión cerrada correctamente' })
    
  } catch (error) {
    console.error('Error en logout:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// 👤 GET /api/auth/me - Obtener usuario actual
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const cookieToken = getCookie(c, 'yo-decreto-token')
    
    let token = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else if (cookieToken) {
      token = cookieToken
    }
    
    if (!token) {
      return c.json({ error: 'Token no proporcionado' }, 401)
    }
    
    const user = await AuthUtils.validateSession(c.env.DB, token)
    
    if (!user) {
      return c.json({ error: 'Sesión inválida' }, 401)
    }
    
    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        last_login: user.last_login
      }
    })
    
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// 🔧 GET /api/auth/stats - Estadísticas de sesiones (para debug)
auth.get('/stats', async (c) => {
  try {
    const stats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN expires_at > datetime('now') THEN 1 END) as active_sessions,
        COUNT(CASE WHEN expires_at <= datetime('now') THEN 1 END) as expired_sessions
      FROM auth_sessions
    `).first()
    
    const users = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users
      FROM auth_users
    `).first()
    
    return c.json({
      success: true,
      stats: {
        sessions: stats,
        users: users
      }
    })
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

export default auth