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
    completarAccion: (decretoId, accionId) => 
      API.request(`/decretos/${decretoId}/acciones/${accionId}/completar`, { method: 'PUT' }),
    deleteAccion: (decretoId, accionId) => 
      API.request(`/decretos/${decretoId}/acciones/${accionId}`, { method: 'DELETE' }),
    createSeguimiento: (decretoId, accionId, data) => 
      API.request(`/decretos/${decretoId}/acciones/${accionId}/seguimientos`, { method: 'POST', data }),
  },

  // Agenda
  agenda: {
    getMetricasDia: (fecha) => API.request(`/agenda/metricas/${fecha}`),
    getCalendario: (year, month) => API.request(`/agenda/calendario/${year}/${month}`),
    getTimeline: (fecha) => API.request(`/agenda/timeline/${fecha}`),
    getEnfoque: (fecha) => API.request(`/agenda/enfoque/${fecha}`),
    setEnfoque: (fecha, tareaId) => 
      API.request(`/agenda/enfoque/${fecha}`, { method: 'PUT', data: { tarea_id: tareaId } }),
    createTarea: (data) => API.request('/agenda/tareas', { method: 'POST', data }),
    completarTarea: (id) => API.request(`/agenda/tareas/${id}/completar`, { method: 'PUT' }),
    deleteTarea: (id) => API.request(`/agenda/tareas/${id}`, { method: 'DELETE' }),
    getPendientes: (fecha) => API.request(`/agenda/pendientes/${fecha}`),
    filtrar: (params) => API.request('/agenda/filtros', { params }),
    createSeguimiento: (id, data) => 
      API.request(`/agenda/tareas/${id}/seguimiento`, { method: 'POST', data })
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
    completarRutina: (id, data) => 
      API.request(`/practica/rutinas/${id}/completar`, { method: 'POST', data }),
    desmarcarRutina: (id) => 
      API.request(`/practica/rutinas/${id}/completar`, { method: 'DELETE' }),
    getProgresoRutinas: (dias) => 
      API.request('/practica/rutinas/progreso', { params: { dias } }),
    getProgresoDia: (fecha) => 
      API.request(`/practica/rutinas/progreso-dia/${fecha || ''}`),

    getAfirmaciones: (params) => API.request('/practica/afirmaciones', { params }),
    createAfirmacion: (data) => 
      API.request('/practica/afirmaciones', { method: 'POST', data }),
    toggleFavorita: (id, esFavorita) => 
      API.request(`/practica/afirmaciones/${id}/favorita`, { method: 'PUT', data: { es_favorita: esFavorita } }),
    usarAfirmacion: (id) => 
      API.request(`/practica/afirmaciones/${id}/usar`, { method: 'POST' }),
    deleteAfirmacion: (id) => 
      API.request(`/practica/afirmaciones/${id}`, { method: 'DELETE' }),
    getAfirmacionesDelDia: () => API.request('/practica/afirmaciones/del-dia'),
    getEstadisticas: () => API.request('/practica/estadisticas')
  },

  // Configuración
  config: {
    get: () => API.request('/decretos/config'),
    update: (data) => API.request('/decretos/config', { method: 'PUT', data })
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
              <div class="text-2xl">🎯</div>
              <h1 class="text-xl font-bold text-gradient-green">Yo Decreto</h1>
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
      { id: 'agenda', icon: 'fas fa-calendar-alt', label: 'Agenda Diaria' },
      { id: 'progreso', icon: 'fas fa-chart-line', label: 'Mi Progreso' },
      { id: 'practica', icon: 'fas fa-star', label: 'Mi Práctica' }
    ]

    return tabs.map(tab => `
      <button 
        class="nav-tab px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
          AppState.currentSection === tab.id ? 'active' : 'text-slate-300 hover:text-white'
        }"
        onclick="Router.navigate('${tab.id}')"
      >
        <i class="${tab.icon}"></i>
        <span class="hidden sm:inline">${tab.label}</span>
      </button>
    `).join('')
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

    // Leer sección inicial de la URL
    const initialSection = this.getSectionFromHash()
    AppState.currentSection = initialSection
    
    // Renderizar aplicación inicial
    this.renderApp()
  },

  getSectionFromHash() {
    const hash = window.location.hash.slice(1)
    const validSections = ['decretos', 'agenda', 'progreso', 'practica']
    return validSections.includes(hash) ? hash : 'decretos'
  },

  renderApp() {
    const app = document.getElementById('app')
    app.innerHTML = `
      ${UI.renderHeader()}
      <main id="main-content" class="min-h-screen bg-slate-900">
        ${UI.renderLoading('Inicializando aplicación...')}
      </main>
    `
    
    this.renderCurrentSection()
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
      case 'agenda':
        Agenda.render()
        break
      case 'progreso':
        Progreso.render()
        break
      case 'practica':
        Practica.render()
        break
      default:
        mainContent.innerHTML = '<div class="p-8 text-center">Sección no encontrada</div>'
    }
  }
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎯 Iniciando Yo Decreto...')
  
  try {
    // Configurar extensiones de dayjs
    dayjs.extend(dayjs_plugin_customParseFormat)
    dayjs.extend(dayjs_plugin_isSameOrAfter) 
    dayjs.extend(dayjs_plugin_isSameOrBefore)
    
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