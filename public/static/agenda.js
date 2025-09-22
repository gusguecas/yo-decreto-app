// Módulo de Agenda

const Agenda = {
  data: {
    selectedDate: dayjs().format('YYYY-MM-DD'),
    currentMonth: dayjs().format('YYYY-MM'),
    eventos: {},
    timeline: [],
    metricas: {},
    enfoque: null
  },

  async render() {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = UI.renderLoading('Cargando agenda...')
    
    try {
      await this.loadAgendaData()
      mainContent.innerHTML = this.renderAgendaView()
      this.renderModals()
    } catch (error) {
      mainContent.innerHTML = this.renderError()
    }
  },

  async loadAgendaData() {
    const [year, month] = this.data.currentMonth.split('-')
    
    // Cargar datos en paralelo
    const [calendario, timeline, metricas, enfoque] = await Promise.all([
      API.agenda.getCalendario(year, month),
      API.agenda.getTimeline(this.data.selectedDate),
      API.agenda.getMetricasDia(this.data.selectedDate),
      API.agenda.getEnfoque(this.data.selectedDate)
    ])

    this.data.eventos = calendario.data.estados
    this.data.timeline = timeline.data
    this.data.metricas = metricas.data
    this.data.enfoque = enfoque.data
  },

  renderAgendaView() {
    return `
      <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold mb-2 flex items-center justify-center">
            <span class="text-3xl mr-3">📅</span>
            <span class="text-gradient-green">Mi Agenda Ejecutiva</span>
          </h1>
          <p class="text-slate-300">Organiza y prioriza tus tareas diarias</p>
        </div>

        <!-- Enfoque del día -->
        ${this.renderEnfoqueDia()}

        <!-- Layout principal -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Calendario + Métricas -->
          <div class="lg:col-span-2 space-y-6">
            ${this.renderCalendario()}
            ${this.renderMetricasDia()}
          </div>

          <!-- Sidebar: Filtros + Timeline -->
          <div class="space-y-6">
            ${this.renderFiltros()}
            ${this.renderTimeline()}
          </div>
        </div>

        <!-- Botón crear tarea -->
        <div class="fixed bottom-6 right-6">
          <button 
            onclick="Agenda.openCreateTareaModal()"
            class="btn-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl hover-lift"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    `
  },

  renderEnfoqueDia() {
    const enfoque = this.data.enfoque
    return `
      <div class="gradient-card p-6 rounded-xl mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">🎯</span>
            <div>
              <h3 class="text-xl font-semibold">Mi Enfoque del Día</h3>
              <p class="text-slate-300 text-sm">Selecciona tu tarea más importante</p>
            </div>
          </div>
          <div class="flex space-x-3">
            <button 
              onclick="Agenda.openSelectorEnfoque()"
              class="btn-primary px-4 py-2 rounded-lg text-sm"
            >
              Seleccionar Tarea
            </button>
            ${enfoque ? `
              <button 
                onclick="Agenda.completarEnfoque()"
                class="btn-primary px-4 py-2 rounded-lg text-sm bg-accent-green"
              >
                ✅ Completar
              </button>
            ` : ''}
          </div>
        </div>
        
        ${enfoque ? `
          <div class="mt-4 p-4 bg-slate-800 rounded-lg">
            <h4 class="font-medium">${enfoque.titulo}</h4>
            <p class="text-slate-300 text-sm">${enfoque.decreto_titulo}</p>
          </div>
        ` : `
          <div class="mt-4 p-4 bg-slate-800 rounded-lg text-center text-slate-400">
            No has seleccionado un enfoque para hoy
          </div>
        `}
      </div>
    `
  },

  renderCalendario() {
    const currentDate = dayjs(this.data.currentMonth)
    const firstDay = currentDate.startOf('month')
    const lastDay = currentDate.endOf('month')
    const startCalendar = firstDay.startOf('week')
    const endCalendar = lastDay.endOf('week')

    let calendarHTML = `
      <div class="gradient-card p-6 rounded-xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold">Calendario</h3>
          <div class="flex items-center space-x-4">
            <button onclick="Agenda.previousMonth()" class="text-slate-400 hover:text-white">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="font-medium">${currentDate.format('MMMM YYYY')}</span>
            <button onclick="Agenda.nextMonth()" class="text-slate-400 hover:text-white">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-7 gap-2">
          <!-- Días de la semana -->
          <div class="text-center text-xs font-medium text-slate-400 p-2">Dom</div>
          <div class="text-center text-xs font-medium text-slate-400 p-2">Lun</div>
          <div class="text-center text-xs font-medium text-slate-400 p-2">Mar</div>
          <div class="text-center text-xs font-medium text-slate-400 p-2">Mié</div>
          <div class="text-center text-xs font-medium text-slate-400 p-2">Jue</div>
          <div class="text-center text-xs font-medium text-slate-400 p-2">Vie</div>
          <div class="text-center text-xs font-medium text-slate-400 p-2">Sáb</div>
    `

    // Generar días del calendario
    let currentCalendarDate = startCalendar
    while (currentCalendarDate.isBefore(endCalendar) || currentCalendarDate.isSame(endCalendar)) {
      const dateStr = currentCalendarDate.format('YYYY-MM-DD')
      const isCurrentMonth = currentCalendarDate.isSame(currentDate, 'month')
      const isSelected = dateStr === this.data.selectedDate
      const isToday = currentCalendarDate.isSame(dayjs(), 'day')
      
      let dayClass = 'calendar-day p-2 text-center text-sm'
      if (!isCurrentMonth) dayClass += ' text-slate-600'
      if (isSelected) dayClass += ' selected'
      if (isToday) dayClass += ' border border-accent-green'
      
      // Estado del día basado en eventos
      if (this.data.eventos[dateStr]) {
        dayClass += ` ${this.data.eventos[dateStr]}`
      }

      calendarHTML += `
        <div 
          class="${dayClass}"
          onclick="Agenda.selectDate('${dateStr}')"
        >
          ${currentCalendarDate.format('D')}
        </div>
      `
      
      currentCalendarDate = currentCalendarDate.add(1, 'day')
    }

    calendarHTML += `
        </div>
        
        <div class="flex items-center justify-center space-x-6 mt-4 text-xs">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-accent-green rounded"></div>
            <span>Completado</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-accent-orange rounded"></div>
            <span>Pendiente</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-accent-red rounded"></div>
            <span>Vencido</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-slate-600 rounded"></div>
            <span>Sin tareas</span>
          </div>
        </div>
      </div>
    `

    return calendarHTML
  },

  renderMetricasDia() {
    const metricas = this.data.metricas
    return `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="metric-card p-4 text-center">
          <div class="text-2xl font-bold">${metricas.total || 0}</div>
          <div class="text-slate-300 text-sm">Total</div>
        </div>
        <div class="metric-card p-4 text-center">
          <div class="text-2xl font-bold text-accent-green">${metricas.progreso || 0}%</div>
          <div class="text-slate-300 text-sm">Progreso</div>
        </div>
        <div class="metric-card p-4 text-center">
          <div class="text-2xl font-bold text-accent-green">${metricas.completadas || 0}</div>
          <div class="text-slate-300 text-sm">Completadas</div>
        </div>
        <div class="metric-card p-4 text-center">
          <div class="text-2xl font-bold text-accent-orange">${metricas.pendientes || 0}</div>
          <div class="text-slate-300 text-sm">Pendientes</div>
        </div>
      </div>
    `
  },

  renderFiltros() {
    return `
      <div class="gradient-card p-6 rounded-xl">
        <h3 class="text-lg font-semibold mb-4">Filtros</h3>
        
        <div class="space-y-3">
          <label class="flex items-center space-x-3">
            <input type="checkbox" class="toggle-checkbox" checked>
            <span class="text-sm">Tareas de Hoy</span>
          </label>
          <label class="flex items-center space-x-3">
            <input type="checkbox" class="toggle-checkbox">
            <span class="text-sm">Tareas Futuras</span>
          </label>
          <label class="flex items-center space-x-3">
            <input type="checkbox" class="toggle-checkbox" checked>
            <span class="text-sm">Completadas</span>
          </label>
          <label class="flex items-center space-x-3">
            <input type="checkbox" class="toggle-checkbox" checked>
            <span class="text-sm">Pendientes</span>
          </label>
        </div>
        
        <div class="mt-6">
          <label class="block text-sm font-medium mb-2">Por Decreto</label>
          <select class="form-select w-full px-3 py-2 text-sm">
            <option value="todos">Todos</option>
            <option value="empresarial">Empresarial</option>
            <option value="material">Material</option>
            <option value="humano">Humano</option>
          </select>
        </div>
      </div>
    `
  },

  renderTimeline() {
    return `
      <div class="gradient-card p-6 rounded-xl">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <span class="mr-2">⏰</span>
          Timeline del Día
        </h3>
        
        <div class="space-y-4">
          ${this.data.timeline.length > 0 ? this.data.timeline.map(tarea => `
            <div class="timeline-item pl-4 pb-4 ${tarea.estado}">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="text-accent-green font-medium text-sm">
                      ${tarea.hora_evento || '09:00'}
                    </span>
                    <span class="text-xs badge-${tarea.area || 'general'}">${tarea.decreto_titulo || 'General'}</span>
                  </div>
                  <h4 class="font-medium text-sm">${tarea.titulo}</h4>
                  ${tarea.accion_titulo ? `<p class="text-slate-400 text-xs">${tarea.accion_titulo}</p>` : ''}
                </div>
                <div class="flex space-x-1">
                  <button 
                    onclick="Agenda.openSeguimientoModal('${tarea.id}')"
                    class="btn-secondary p-1 rounded text-xs"
                    title="Seguimiento"
                  >
                    <i class="fas fa-clipboard-list"></i>
                  </button>
                  <button 
                    onclick="Agenda.completarTarea('${tarea.id}')"
                    class="btn-primary p-1 rounded text-xs"
                    title="Completar"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button 
                    onclick="Agenda.eliminarTarea('${tarea.id}')"
                    class="btn-danger p-1 rounded text-xs"
                    title="Eliminar"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="text-center py-8 text-slate-400">
              <div class="text-4xl mb-2">📅</div>
              <p class="text-sm">No hay tareas para este día</p>
            </div>
          `}
        </div>
      </div>
    `
  },

  renderModals() {
    const modalsContainer = document.getElementById('modals') || (() => {
      const container = document.createElement('div')
      container.id = 'modals'
      document.body.appendChild(container)
      return container
    })()

    modalsContainer.innerHTML += `
      ${this.renderCreateTareaModal()}
      ${this.renderSelectorEnfoqueModal()}
    `
  },

  renderCreateTareaModal() {
    return UI.renderModal('createTareaModal', '➕ Crear Nueva Tarea', `
      <form onsubmit="Agenda.handleCreateTarea(event)">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Decreto *</label>
            <select name="decreto_id" required class="form-select w-full px-4 py-2">
              <option value="">Selecciona un decreto</option>
              <!-- Se llenarán dinámicamente -->
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Nombre de la tarea *</label>
            <input 
              type="text" 
              name="nombre" 
              required 
              class="form-input w-full px-4 py-2"
              placeholder="Ej: Revisar métricas del trimestre"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Descripción / Qué quieres lograr</label>
            <textarea 
              name="descripcion"
              rows="3"
              class="form-textarea w-full px-4 py-2"
              placeholder="Describe qué quieres lograr con esta tarea..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Fecha y hora *</label>
              <input 
                type="datetime-local" 
                name="fecha_hora"
                required
                class="form-input w-full px-4 py-2"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Tipo</label>
              <select name="tipo" class="form-select w-full px-4 py-2">
                <option value="secundaria">Secundaria (diaria)</option>
                <option value="primaria">Primaria (semanal)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4 mt-8">
          <button 
            type="button" 
            onclick="Modal.close('createTareaModal')"
            class="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="btn-primary px-6 py-2 rounded-lg"
          >
            💾 Guardar Tarea
          </button>
        </div>
      </form>
    `)
  },

  renderSelectorEnfoqueModal() {
    return UI.renderModal('selectorEnfoqueModal', '🎯 Seleccionar Enfoque del Día', `
      <div id="pendientesContainer">
        ${UI.renderLoading('Cargando tareas pendientes...')}
      </div>
    `)
  },

  // Event handlers
  async selectDate(date) {
    this.data.selectedDate = date
    await this.loadAgendaData()
    await this.render()
  },

  async previousMonth() {
    const current = dayjs(this.data.currentMonth)
    this.data.currentMonth = current.subtract(1, 'month').format('YYYY-MM')
    await this.render()
  },

  async nextMonth() {
    const current = dayjs(this.data.currentMonth)
    this.data.currentMonth = current.add(1, 'month').format('YYYY-MM')
    await this.render()
  },

  openCreateTareaModal() {
    // TODO: Cargar decretos para el selector
    Modal.open('createTareaModal')
  },

  async openSelectorEnfoque() {
    Modal.open('selectorEnfoqueModal')
    // TODO: Cargar tareas pendientes del día
  },

  async handleCreateTarea(event) {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())
    
    try {
      await API.agenda.createTarea(data)
      Modal.close('createTareaModal')
      Utils.showToast('Tarea creada exitosamente', 'success')
      await this.render()
    } catch (error) {
      Utils.showToast('Error al crear tarea', 'error')
    }
  },

  async completarTarea(id) {
    try {
      await API.agenda.completarTarea(id)
      Utils.showToast('Tarea completada', 'success')
      await this.render()
    } catch (error) {
      Utils.showToast('Error al completar tarea', 'error')
    }
  },

  async eliminarTarea(id) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await API.agenda.deleteTarea(id)
        Utils.showToast('Tarea eliminada', 'success')
        await this.render()
      } catch (error) {
        Utils.showToast('Error al eliminar tarea', 'error')
      }
    }
  },

  openSeguimientoModal(id) {
    // TODO: Implementar modal de seguimiento
    Utils.showToast('Seguimiento próximamente', 'info')
  },

  renderError() {
    return `
      <div class="container mx-auto px-4 py-8 text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold mb-4">Error al cargar agenda</h2>
        <p class="text-slate-400 mb-6">No se pudo cargar la información de la agenda.</p>
        <button onclick="Agenda.render()" class="btn-primary px-6 py-2 rounded-lg">
          Reintentar
        </button>
      </div>
    `
  }
}