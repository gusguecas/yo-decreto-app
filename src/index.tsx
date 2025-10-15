import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

// Importar rutas API
import { decretosRoutes } from './routes/decretos'
import { agendaRoutes } from './routes/agenda'
import { progresoRoutes } from './routes/progreso'
import { practicaRoutes } from './routes/practica'
import { chatbotRoutes } from './routes/chatbot'
import rutinaRoutes from './routes/rutina'
import authRoutes from './routes/auth'
import googleCalendarRoutes from './routes/google-calendar'
import aiRoutes from './routes/ai'
import logosRoutes from './routes/logos'
import ritualRoutes from './routes/ritual'

type Bindings = {
  DB: D1Database;
  R2: R2Bucket;
  AI: any;
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use(renderer)
app.use('/api/*', cors())

// Servir archivos estáticos
// En Cloudflare Pages, los archivos estáticos se sirven automáticamente desde public/
// Solo configuramos para desarrollo local
app.use('/static/*', serveStatic())

// Rutas API
app.route('/api/auth', authRoutes)  // 🔐 Rutas de autenticación PRIMERO
app.route('/api/logos', logosRoutes)  // 🖼️ Servir imágenes desde R2
app.route('/api/decretos', decretosRoutes)
app.route('/api/agenda', agendaRoutes)
app.route('/api/progreso', progresoRoutes)
app.route('/api/practica', practicaRoutes)
app.route('/api/chatbot', chatbotRoutes)
app.route('/api/rutina', rutinaRoutes)
app.route('/api/ritual', ritualRoutes)
app.route('/api/google-calendar', googleCalendarRoutes)
app.route('/api/ai', aiRoutes)

// Ruta principal - renderiza la SPA
app.get('/', (c) => {
  return c.render(
    <div>
      <div id="app">
        {/* El contenido será renderizado por JavaScript */}
        <div className="loading-screen">
          <img src="/static/logo-yo-decreto.png" alt="Yo Decreto" className="logo-yo-decreto logo-lg w-auto mx-auto mb-4" />
          <div className="loader"></div>
          <h2>Cargando...</h2>
        </div>
      </div>
    </div>
  )
})

// Catch-all para SPA routing
app.get('*', (c) => {
  return c.render(
    <div>
      <div id="app">
        <div className="loading-screen">
          <img src="/static/logo-yo-decreto.png" alt="Yo Decreto" className="logo-yo-decreto logo-lg w-auto mx-auto mb-4" />
          <div className="loader"></div>
          <h2>Cargando...</h2>
        </div>
      </div>
    </div>
  )
})

export default app
