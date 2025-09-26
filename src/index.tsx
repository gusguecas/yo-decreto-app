import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

// Importar rutas API
import { decretosRoutes } from './routes/decretos'
import { seguimientosRoutes } from './routes/seguimientos'
import { agendaRoutes } from './routes/agenda'
import { progresoRoutes } from './routes/progreso'
import { practicaRoutes } from './routes/practica'
import authRoutes from './routes/auth'

type Bindings = {
  DB: D1Database;
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
app.route('/api/decretos', decretosRoutes)
app.route('/api/decretos', seguimientosRoutes)  // 🔥 NUEVO: Seguimientos separados
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

// Ruta de descarga de backup
app.get("/backup", async (c) => {
  const filePath = "./public/yo_decreto_hono_100_funcional_sept26.tar.gz"
  
  try {
    const file = await fetch("file://" + filePath)
    const buffer = await file.arrayBuffer()
    
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": "attachment; filename=yo_decreto_hono_100_funcional_sept26.tar.gz",
        "Content-Length": buffer.byteLength.toString()
      }
    })
  } catch (error) {
    return c.text("Archivo no encontrado", 404)
  }
})

