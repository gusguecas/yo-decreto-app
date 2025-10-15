// Aplicación principal "Yo Decreto"

// Configuración global
const APP_CONFIG = {
  apiBase: '/api',
  defaultSection: 'decretos'
}

// Estado global de la aplicación
const AppState = {
  currentSection: 'decretos',
  user: null,
  decretos: [],
  selectedDate: dayjs().format('YYYY-MM-DD'),
  selectedDecreto: null,
  loading: false
}

// Utilidades
const Utils = {
  // Formatear fecha
  formatDate(date, format = 'DD/MM/YYYY') {
    return dayjs(date).format(format)
  },

  // Formatear fecha relativa
  formatRelativeDate(date) {
    const now = dayjs()
    const target = dayjs(date)
    const diffDays = target.diff(now, 'day')
    
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Mañana'
    if (diffDays === -1) return 'Ayer'
    if (diffDays > 1 && diffDays <= 7) return `En ${diffDays} días`
    if (diffDays < -1 && diffDays >= -7) return `Hace ${Math.abs(diffDays)} días`
    
    return target.format('DD/MM/YYYY')
  },

  // Mostrar toast
  showToast(message, type = 'info') {
    const toast = document.createElement('div')
    toast.className = `toast ${type} fixed top-4 right-4 z-50 p-4 mb-2 max-w-sm`
    toast.innerHTML = `
      <div class="flex items-center">
        <div class="flex-1">${message}</div>
        <button class="ml-2 text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, 5000)
  },

  // Generar ID único
  generateId() {
    return Math.random().toString(36).substr(2, 9)
  },

  // Debounce function
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Escapar HTML para prevenir inyección
  escapeHtml(text) {
    if (!text) return ''
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

// API Client
const API = {
  async request(endpoint, options = {}) {
    const url = `${APP_CONFIG.apiBase}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    }

    try {
      AppState.loading = true
      const response = await axios(url, config)
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      Utils.showToast(
        error.response?.data?.error || 'Error en la comunicación con el servidor',
        'error'
      )
      throw error
    } finally {
      AppState.loading = false
    }
  },

  // Decretos
  decretos: {
    getAll: () => API.request('/decretos'),
    get: (id) => API.request(`/decretos/${id}`),
    create: (data) => API.request('/decretos', { method: 'POST', data }),
    update: (id, data) => API.request(`/decretos/${id}`, { method: 'PUT', data }),
    delete: (id) => API.request(`/decretos/${id}`, { method: 'DELETE' }),
    getSugerencias: (id) => API.request(`/decretos/${id}/sugerencias`),
    
    // Acciones
    createAccion: (decretoId, data) => 
      API.request(`/decretos/${decretoId}/acciones`, { method: 'POST', data }),
    getAccion: (decretoId, accionId) => 
      API.request(`/decretos/${decretoId}/acciones/${accionId}`),
    updateAccion: (decretoId, accionId, data) => 
      API.request(`/decretos/${decretoId}/acciones/${accionId}`, { method: 'PUT', data }),
    completarAccion: (decretoId, accionId) => 
      API.request(`/decretos/${decretoId}/acciones/${accionId}/completar`, { method: 'PUT' }),
    marcarPendiente: (decretoId, accionId) => 
      API.request(`/decretos/${decretoId}/acciones/${accionId}/pendiente`, { method: 'PUT' }),
    deleteAccion: (decretoId, accionId) => 
      API.request(`/decretos/${decretoId}/acciones/${accionId}`, { method: 'DELETE' }),
    createSeguimiento: (decretoId, accionId, data) => 
      API.request(`/decretos/${decretoId}/acciones/${accionId}/seguimientos`, { method: 'POST', data }),
    
    // Tareas Derivadas
    getArbolTareas: (decretoId, accionId) => 
      API.request(`/decretos/${decretoId}/acciones/${accionId}/arbol`),
  },

  // Agenda
  agenda: {
    getMetricasDia: (fecha) => API.request(`/agenda/metricas/${fecha}`),
    getCalendario: (year, month) => API.request(`/agenda/calendario/${year}/${month}`),
    getTimeline: (fecha) => API.request(`/agenda/timeline/${fecha}`),
    getTimelineUnificado: (fecha) => API.request(`/agenda/timeline-unificado/${fecha}`),
    getEnfoque: (fecha) => API.request(`/agenda/enfoque/${fecha}`),
    setEnfoque: (fecha, tareaId) =>
      API.request(`/agenda/enfoque/${fecha}`, { method: 'PUT', data: { tarea_id: tareaId } }),
    createTarea: (data) => API.request('/agenda/tareas', { method: 'POST', data }),
    getTarea: (id) => API.request(`/agenda/tareas/${id}`),
    updateTarea: (id, data) => API.request(`/agenda/tareas/${id}`, { method: 'PUT', data }),
    completarTarea: (id) => API.request(`/agenda/tareas/${id}/completar`, { method: 'PUT' }),
    marcarPendiente: (id) => API.request(`/agenda/tareas/${id}/pendiente`, { method: 'PUT' }),
    deleteTarea: (id) => API.request(`/agenda/tareas/${id}`, { method: 'DELETE' }),
    getPendientes: (fecha) => API.request(`/agenda/pendientes/${fecha}`),
    filtrar: (params) => API.request('/agenda/filtros', { params }),
    createSeguimiento: (id, data) =>
      API.request(`/agenda/tareas/${id}/seguimiento`, { method: 'POST', data }),
    // 🎯 NUEVO: Panorámica de acciones pendientes
    getPanoramicaPendientes: (area = 'todos') =>
      API.request(`/agenda/panoramica-pendientes?area=${area}`)
  },

  // Progreso
  progreso: {
    getMetricas: () => API.request('/progreso/metricas'),
    getPorDecreto: () => API.request('/progreso/por-decreto'),
    getTimeline: (periodo) => API.request('/progreso/timeline', { params: { periodo } }),
    getEvolucion: (dias) => API.request('/progreso/evolucion', { params: { dias } }),
    getDistribucion: () => API.request('/progreso/distribucion'),
    getReporte: () => API.request('/progreso/reporte'),
    getEstadisticas: () => API.request('/progreso/estadisticas')
  },

  // Práctica
  practica: {
    getRutinas: () => API.request('/practica/rutinas'),
    getRutinasConFecha: (fecha) => API.request('/practica/rutinas', { params: { fecha_simulada: fecha } }),
    completarRutina: (id, data) => 
      API.request(`/practica/rutinas/${id}/completar`, { method: 'POST', data }),
    completarRutinaDetallada: (id, data) => 
      API.request(`/practica/rutinas/${id}/completar-detallado`, { method: 'POST', data }),
    getPreguntasRutina: (id) => 
      API.request(`/practica/rutinas/${id}/preguntas`),
    getAnalytics: (dias = 30) => 
      API.request('/practica/rutinas/analytics', { params: { dias } }),
    desmarcarRutina: (id) => 
      API.request(`/practica/rutinas/${id}/completar`, { method: 'DELETE' }),
    getProgresoRutinas: (dias) => 
      API.request('/practica/rutinas/progreso', { params: { dias } }),
    getProgresoDia: (fecha) => 
      API.request(`/practica/rutinas/progreso-dia/${fecha || new Date().toISOString().split('T')[0]}`),

    getAfirmaciones: (params) => API.request('/practica/afirmaciones', { params }),
    createAfirmacion: (data) => 
      API.request('/practica/afirmaciones', { method: 'POST', data }),
    toggleFavorita: (id, esFavorita) => 
      API.request(`/practica/afirmaciones/${id}/favorita`, { method: 'PUT', data: { es_favorita: esFavorita } }),
    usarAfirmacion: (id) => 
      API.request(`/practica/afirmaciones/${id}/usar`, { method: 'POST' }),
    deleteAfirmacion: (id) => 
      API.request(`/practica/afirmaciones/${id}`, { method: 'DELETE' }),
    generarAfirmacion: (data) => 
      API.request('/practica/afirmaciones/generar', { method: 'POST', data }),
    getAfirmacionesDelDia: () => API.request('/practica/afirmaciones/del-dia'),
    getEstadisticas: () => API.request('/practica/estadisticas')
  },

  // Configuración
  config: {
    get: () => API.request('/decretos/config'),
    update: (data) => API.request('/decretos/config', { method: 'PUT', data })
  },

  // Ritual SPEC
  ritual: {
    createSesion: (data) => API.request('/ritual/sesiones', { method: 'POST', data }),
    getSesiones: (fecha) => API.request(`/ritual/sesiones?fecha=${fecha}`),
    getSesion: (id) => API.request(`/ritual/sesiones/${id}`),
    updateSesion: (id, data) => API.request(`/ritual/sesiones/${id}`, { method: 'PUT', data }),
    deleteSesion: (id) => API.request(`/ritual/sesiones/${id}`, { method: 'DELETE' }),
    getEstadisticas: () => API.request('/ritual/estadisticas')
  },

  // Chatbot con Helene
  chatbot: {
    sendMessage: (message, conversationHistory = []) =>
      API.request('/chatbot/chat', {
        method: 'POST',
        data: { message, conversationHistory }
      }),
    getHistory: () => API.request('/chatbot/history'),
    clearHistory: () => API.request('/chatbot/history', { method: 'DELETE' })
  },

  // Rutina Diaria Tripartito
  rutina: {
    getToday: () => API.request('/rutina/today'),
    completeTask: (data) => API.request('/rutina/complete-task', { method: 'POST', data }),
    faithCheckin: (data) => API.request('/rutina/faith-checkin', { method: 'POST', data }),
    saveMeritCommitment: (data) => API.request('/rutina/merit-commitment', { method: 'POST', data }),
    completeRoutine: (data) => API.request('/rutina/routine', { method: 'POST', data }),
    getStats: () => API.request('/rutina/stats'),
    recordSignal: (data) => API.request('/rutina/signal', { method: 'POST', data }),
    swapPrimary: (data) => API.request('/rutina/swap-primary', { method: 'POST', data }),
    getDecretosByArea: (area) => API.request(`/rutina/decretos-by-area/${area}`)
  },

  // Google Calendar Integration
  googleCalendar: {
    getAuthUrl: () => API.request('/google-calendar/auth-url'),
    getStatus: () => API.request('/google-calendar/status'),
    disconnect: () => API.request('/google-calendar/disconnect', { method: 'POST' }),
    updateSettings: (data) => API.request('/google-calendar/settings', { method: 'PUT', data }),
    importEvents: (data) => API.request('/google-calendar/import', { method: 'POST', data }),
    getEvents: (params) => API.request('/google-calendar/events', { params }),
    exportRutina: (data) => API.request('/google-calendar/export-rutina', { method: 'POST', data }),
    exportDecretoPrimario: (data) => API.request('/google-calendar/export-decreto-primario', { method: 'POST', data }),
    exportAgendaEvento: (data) => API.request('/google-calendar/export-agenda-evento', { method: 'POST', data }),
    syncAll: () => API.request('/google-calendar/sync-all', { method: 'POST' })
  }
}

// Componentes UI
const UI = {
  // Renderizar encabezado
  renderHeader() {
    return `
      <header class="gradient-dark border-b border-slate-700 sticky top-0 z-40">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center space-x-4">
              <img src="/static/logo-yo-decreto.png" alt="Yo Decreto" class="logo-yo-decreto logo-header w-auto" />
            </div>
            <nav class="flex space-x-2">
              ${this.renderNavTabs()}
            </nav>
          </div>
        </div>
      </header>
    `
  },

  renderNavTabs() {
    const tabs = [
      { id: 'decretos', icon: 'fas fa-bullseye', label: 'Mis Decretos' },
      { id: 'rutina', icon: 'fas fa-sun', label: 'Rutina Diaria' },
      { id: 'agenda', icon: 'fas fa-calendar-alt', label: 'Agenda Diaria' },
      { id: 'progreso', icon: 'fas fa-chart-line', label: 'Mi Progreso' },
      { id: 'practica', icon: 'fas fa-star', label: 'Mi Práctica' },
      { id: 'chatbot', icon: 'fas fa-comments', label: 'Chat con Helene' },
      { id: 'acerca', icon: 'fas fa-info-circle', label: 'Acerca de' }
    ]

    return tabs.map(tab => {
      // Si estamos en detalle-decreto, marcar decretos como activo
      const isActive = AppState.currentSection === tab.id || 
                      (AppState.currentSection === 'detalle-decreto' && tab.id === 'decretos')
      
      return `
        <button 
          class="nav-tab px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
            isActive ? 'active' : 'text-slate-300 hover:text-white'
          }"
          onclick="Router.navigate('${tab.id}')"
        >
          <i class="${tab.icon}"></i>
          <span class="hidden sm:inline">${tab.label}</span>
        </button>
      `
    }).join('')
  },

  // Loading spinner
  renderLoading(message = 'Cargando...') {
    return `
      <div class="flex items-center justify-center p-8">
        <div class="text-center">
          <div class="loader mx-auto mb-4"></div>
          <p class="text-slate-400">${message}</p>
        </div>
      </div>
    `
  },

  // Modal base
  renderModal(id, title, content, size = 'md') {
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl'
    }

    return `
      <div id="${id}" class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4" style="display: none;">
        <div class="modal-content w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-slate-600">
            <h2 class="text-xl font-semibold">${title}</h2>
            <button class="text-slate-400 hover:text-white" onclick="Modal.close('${id}')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-6">
            ${content}
          </div>
        </div>
      </div>
    `
  },

  // Generar opciones de select
  renderSelectOptions(options, selected = '') {
    return options.map(option => {
      const value = typeof option === 'string' ? option : option.value
      const label = typeof option === 'string' ? option : option.label
      return `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`
    }).join('')
  }
}

// Modal Manager
const Modal = {
  open(id) {
    const modal = document.getElementById(id)
    if (modal) {
      modal.style.display = 'flex'
      document.body.style.overflow = 'hidden'
    }
  },

  close(id) {
    const modal = document.getElementById(id)
    if (modal) {
      modal.style.display = 'none'
      document.body.style.overflow = 'auto'
    }
  },

  closeAll() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.style.display = 'none'
    })
    document.body.style.overflow = 'auto'
  }
}

// Router simple
const Router = {
  navigate(section) {
    if (AppState.currentSection === section) return

    AppState.currentSection = section
    
    // Actualizar URL sin recargar
    window.history.pushState({ section }, '', `#${section}`)
    
    // Renderizar sección
    this.renderCurrentSection()
  },

  init() {
    // Manejar navegación del navegador
    window.addEventListener('popstate', (e) => {
      const section = e.state?.section || this.getSectionFromHash()
      AppState.currentSection = section
      this.renderCurrentSection()
    })

    // Event listeners para formularios de decretos
    this.setupDecretosEventListeners()

    // Leer sección inicial de la URL
    const initialSection = this.getSectionFromHash()
    AppState.currentSection = initialSection
    
    // Renderizar aplicación inicial
    this.renderApp()
  },

  setupDecretosEventListeners() {
    // Event listener para el formulario de seguimiento
    document.addEventListener('submit', async (e) => {
      if (e.target.id === 'seguimientoForm') {
        e.preventDefault()
        
        const form = e.target
        const accionId = form.dataset.accionId
        
        // Validar formulario
        const queSeHizo = form.que_se_hizo.value.trim()
        const comoSeHizo = form.como_se_hizo.value.trim()
        const resultados = form.resultados.value.trim()
        
        if (!queSeHizo && !comoSeHizo && !resultados) {
          Utils.showToast('Debes completar al menos uno de los campos: qué se hizo, cómo se hizo o resultados obtenidos', 'error')
          return
        }
        
        if (resultados && !form.calificacion.value) {
          Utils.showToast('Si describes resultados obtenidos, la calificación es obligatoria', 'error')
          return
        }
        
        // Recopilar datos del formulario
        const formData = {
          que_se_hizo: queSeHizo,
          como_se_hizo: comoSeHizo,
          resultados: resultados,
          pendientes: form.pendientes.value.trim(),
          proxima_revision: form.proxima_revision.value || null,
          calificacion: parseInt(form.calificacion.value)
        }
        
        // Enviar seguimiento
        await Decretos.submitSeguimiento(formData, accionId)
      }
      
      // Event listener para crear acción en detalle
      if (e.target.id === 'createAccionDetalleForm') {
        e.preventDefault()
        
        const form = e.target
        const decretoId = form.dataset.decretoId
        const formData = new FormData(form)
        
        if (!decretoId) {
          Utils.showToast('Error: No se encontró el ID del decreto', 'error')
          return
        }
        
        const accionData = {
          titulo: formData.get('titulo'),
          que_hacer: formData.get('que_hacer'), 
          como_hacerlo: formData.get('como_hacerlo'),
          resultados: formData.get('resultados_esperados'), // Mapear a 'resultados' para el backend
          tipo: formData.get('tipo'),
          proxima_revision: formData.get('proxima_revision') || null,
          calificacion: parseInt(formData.get('calificacion')) || null
        }
        
        try {
          await API.decretos.createAccion(decretoId, accionData)
          
          // Mensaje personalizado según el tipo de acción
          const tipoTexto = accionData.tipo === 'primaria' ? 'semanal' : 'diaria'
          const mensajeSync = accionData.tipo === 'secundaria' || accionData.proxima_revision 
            ? ' y automáticamente sincronizada con tu agenda' 
            : ''
          
          Utils.showToast(`✅ Acción ${tipoTexto} creada${mensajeSync}`, 'success')
          
          // Notificación adicional para acciones diarias
          if (accionData.tipo === 'secundaria') {
            setTimeout(() => {
              Utils.showToast('📅 Esta acción diaria ya está disponible en tu agenda', 'info')
            }, 2000)
          }
          
          Modal.close('createAccionDetalleModal')
          Decretos.openDetalleDecreto(decretoId)
        } catch (error) {
          console.error('Error al crear acción:', error)
          Utils.showToast('Error al crear la acción', 'error')
        }
      }
    })
    
    // Event listener para cambios en radio buttons de tipo de acción
    document.addEventListener('change', (e) => {
      if (e.target.name === 'tipo' && e.target.closest('#createAccionDetalleForm')) {
        // Actualizar estilo visual de las tarjetas
        const cards = document.querySelectorAll('.tipo-accion-card')
        cards.forEach(card => {
          card.classList.remove('border-accent-green', 'border-accent-blue', 'bg-accent-green/10', 'bg-accent-blue/10')
          card.classList.add('border-slate-600')
        })
        
        const selectedCard = e.target.closest('label').querySelector('.tipo-accion-card')
        if (e.target.value === 'primaria') {
          selectedCard.classList.remove('border-slate-600')
          selectedCard.classList.add('border-accent-green', 'bg-accent-green/10')
        } else {
          selectedCard.classList.remove('border-slate-600')
          selectedCard.classList.add('border-accent-blue', 'bg-accent-blue/10')
        }
      }
    })
  },

  getSectionFromHash() {
    const hash = window.location.hash.slice(1)
    const validSections = ['decretos', 'rutina', 'agenda', 'progreso', 'practica', 'chatbot']
    return validSections.includes(hash) ? hash : 'decretos'
  },

  renderApp() {
    const app = document.getElementById('app')
    app.innerHTML = `
      ${UI.renderHeader()}
      <main id="main-content" class="min-h-screen bg-slate-900">
        ${UI.renderLoading('Inicializando aplicación...')}
      </main>
      ${this.renderFooter()}
    `
    
    this.renderCurrentSection()
  },

  renderFooter() {
    return `
      <footer class="bg-slate-800 border-t border-slate-700 mt-16">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div class="text-sm text-slate-400 text-center md:text-left">
              <p>© ${new Date().getFullYear()} <strong>www.yo-decreto.com</strong> - Todos los derechos reservados</p>
              <p class="text-xs mt-1">Aplicación desarrollada independientemente para uso personal</p>
            </div>
            <div class="flex items-center space-x-4 text-xs text-slate-500">
              <span>📧 info@yo-decreto.com</span>
              <span>⚖️ Términos de uso aplicables</span>
            </div>
          </div>
        </div>
      </footer>
    `
  },

  renderCurrentSection() {
    const mainContent = document.getElementById('main-content')
    
    // Actualizar header activo
    const header = document.querySelector('header')
    if (header) {
      header.outerHTML = UI.renderHeader()
    }
    
    // Renderizar sección correspondiente
    switch (AppState.currentSection) {
      case 'decretos':
        Decretos.render()
        break
      case 'detalle-decreto':
        // La vista de detalle se maneja desde Decretos.openDetalleDecreto()
        // No hacer nada aquí, ya se renderizó
        break
      case 'rutina':
        Rutina.render()
        break
      case 'agenda':
        Agenda.render()
        break
      case 'progreso':
        Progreso.render()
        break
      case 'practica':
        Practica.render()
        break
      case 'chatbot':
        Chatbot.render()
        break
      case 'acerca':
        Acerca.render()
        break
      default:
        mainContent.innerHTML = '<div class="p-8 text-center">Sección no encontrada</div>'
    }
  }
}

// Inicialización de la aplicación CON AUTENTICACIÓN
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎯 Iniciando Yo Decreto...')
  
  // 🔐 VERIFICAR AUTENTICACIÓN PRIMERO
  const isAuthenticated = await Auth.init()
  if (!isAuthenticated) {
    console.log('❌ Usuario no autenticado, mostrando login')
    return // Auth.init() ya mostró la pantalla de login
  }
  
  console.log('✅ Usuario autenticado, cargando aplicación...')
  
  try {
    // Configurar extensiones de dayjs (si están disponibles)
    if (typeof window.dayjs_plugin_customParseFormat !== 'undefined') {
      dayjs.extend(window.dayjs_plugin_customParseFormat)
    }
    if (typeof window.dayjs_plugin_isSameOrAfter !== 'undefined') {
      dayjs.extend(window.dayjs_plugin_isSameOrAfter)
    }
    if (typeof window.dayjs_plugin_isSameOrBefore !== 'undefined') {
      dayjs.extend(window.dayjs_plugin_isSameOrBefore)
    }
    
    // Cargar configuración inicial
    const config = await API.config.get()
    AppState.user = config.data
    
    // Inicializar router
    Router.init()
    
    Utils.showToast('¡Aplicación cargada exitosamente!', 'success')
  } catch (error) {
    console.error('Error al inicializar:', error)
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen bg-slate-900 flex items-center justify-center">
        <div class="text-center">
          <div class="text-6xl mb-4">⚠️</div>
          <h1 class="text-2xl font-bold mb-2">Error al cargar la aplicación</h1>
          <p class="text-slate-400 mb-4">No se pudo conectar con el servidor</p>
          <button onclick="window.location.reload()" class="btn-primary px-6 py-2 rounded-lg">
            Reintenta
          </button>
        </div>
      </div>
    `
  }
})

// Cerrar modales con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    Modal.closeAll()
  }
})

// Cerrar modales al hacer clic fuera
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    const modalId = e.target.id
    Modal.close(modalId)
  }
})