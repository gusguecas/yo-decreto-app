import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Yo Decreto - Gustavo Adolfo Guerrero Castaños</title>
        
        {/* Favicon */}
        <link rel="icon" href="/static/logo-yo-decreto.png" type="image/png" />
        
        {/* Fuentes */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        
        {/* FontAwesome Icons */}
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        
        {/* Chart.js para gráficos */}
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        
        {/* Day.js para fechas */}
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrAfter.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrBefore.js"></script>
        
        {/* Axios para HTTP */}
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        
        {/* Estilos personalizados con cache busting */}
        <link href={`/static/styles.css?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`} rel="stylesheet" />
        
        {/* Configuración de Tailwind personalizada */}
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    'sans': ['Inter', 'system-ui', 'sans-serif'],
                  },
                  colors: {
                    primary: {
                      50: '#f0f9ff',
                      100: '#e0f2fe',
                      200: '#bae6fd',
                      300: '#7dd3fc',
                      400: '#38bdf8',
                      500: '#0ea5e9',
                      600: '#0284c7',
                      700: '#0369a1',
                      800: '#075985',
                      900: '#0c4a6e',
                    },
                    accent: {
                      green: '#10b981',
                      purple: '#8b5cf6',
                      red: '#ef4444',
                      orange: '#f59e0b',
                      blue: '#3b82f6'
                    }
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body className="bg-slate-900 text-white font-sans">
        {children}
        
        {/* 🔐 SISTEMA DE AUTENTICACIÓN PRIMERO */}
        <script src={`/static/auth.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}></script>
        
        {/* Scripts principales con cache busting agresivo */}
        <script src={`/static/app.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}></script>
        <script src={`/static/decretos.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}></script>
        <script src={`/static/rutina.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}></script>
        <script src={`/static/agenda.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}></script>
        <script src={`/static/progreso.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}></script>
        <script src={`/static/practica.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}></script>
        <script src={`/static/chatbot.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}></script>
        <script src={`/static/acerca.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}></script>
      </body>
    </html>
  )
})
