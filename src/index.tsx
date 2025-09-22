import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

// Importar rutas API
import { decretosRoutes } from './routes/decretos'
import { agendaRoutes } from './routes/agenda'
import { progresoRoutes } from './routes/progreso'
import { practicaRoutes } from './routes/practica'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use(renderer)
app.use('/api/*', cors())

// Servir archivos estáticos
app.use('/static/*', serveStatic({ root: './public' }))

// Rutas API
app.route('/api/decretos', decretosRoutes)
app.route('/api/agenda', agendaRoutes)
app.route('/api/progreso', progresoRoutes)
app.route('/api/practica', practicaRoutes)

// Ruta principal - renderiza la SPA
app.get('/', (c) => {
  return c.render(
    <div>
      <div id="app">
        {/* El contenido será renderizado por JavaScript */}
        <div className="loading-screen">
          <div className="loader"></div>
          <h2>Cargando Yo Decreto...</h2>
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
          <div className="loader"></div>
          <h2>Cargando Yo Decreto...</h2>
        </div>
      </div>
    </div>
  )
})

export default app
