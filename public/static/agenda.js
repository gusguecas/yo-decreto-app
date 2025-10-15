// Módulo de Agenda

const Agenda = {
  data: {
    selectedDate: dayjs().format('YYYY-MM-DD'),
    currentMonth: dayjs().format('YYYY-MM'),
    eventos: {},
    timeline: [],
    originalTimeline: [], // Timeline sin filtrar
    metricas: {},
    enfoque: null,
    filtros: {
      tareasHoy: true,
      tareasFuturas: true, // Cambiar a true para mostrar futuras por defecto
      completadas: true,
      pendientes: true,
      decreto: 'todos'
    }
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
      API.agenda.getTimelineUnificado(this.data.selectedDate),
      API.agenda.getMetricasDia(this.data.selectedDate),
      API.agenda.getEnfoque(this.data.selectedDate)
    ])

    this.data.eventos = calendario.data.estados
    this.data.originalTimeline = timeline.data
    this.data.timeline = [...timeline.data] // Copia para filtrar
    this.data.metricas = metricas.data
    this.data.enfoque = enfoque.data
    
    // Aplicar filtros después de cargar los datos
    this.aplicarFiltros()
  },

  renderAgendaView() {
    return `
      <div class="container mx-auto px-4 py-8">
        <!-- Header moderno -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-4xl font-bold mb-2 flex items-center">
              <span class="text-3xl mr-3">📅</span>
              <span class="text-gradient-green">Mi Agenda Ejecutiva</span>
            </h1>
            <p class="text-slate-300">Organiza y prioriza tus tareas diarias</p>
          </div>
          <div>
            <button onclick="Agenda.openGoogleCalendarSettings()" class="btn-primary px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg hover:shadow-blue-500/50 transition-all">
              <i class="fab fa-google text-xl"></i>
              <span>Conectar Google Calendar</span>
            </button>
          </div>
        </div>

        <!-- Google Calendar Settings Panel (hidden by default) -->
        <div id="google-calendar-panel" class="hidden mb-8">
          <div class="gradient-card rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold flex items-center">
                <i class="fab fa-google text-blue-400 mr-3"></i>
                Configuración de Google Calendar
              </h2>
              <button onclick="Agenda.closeGoogleCalendarSettings()" class="text-slate-400 hover:text-white transition-colors">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
            <div id="google-calendar-settings-container"></div>
          </div>
        </div>

        <!-- Enfoque del día -->
        ${this.renderEnfoqueDia()}

        <!-- Layout moderno horizontal -->
        <div class="space-y-8">
          
          <!-- Fila superior: Calendario + Progreso + Filtros (mismo ancho) -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Calendario -->
            <div>
              ${this.renderCalendarioCompacto()}
            </div>
            <!-- Progreso del día -->
            <div>
              ${this.renderMetricasVisuales()}
            </div>
            <!-- Filtros -->
            <div>
              ${this.renderFiltrosCompactos()}
            </div>
          </div>

          <!-- Fila principal: Timeline expandido -->
          <div class="w-full">
            ${this.renderTimelineExpandido()}
          </div>
          
        </div>

        <!-- Botón crear acción -->
        <div class="fixed bottom-6 right-6 z-50">
          <button 
            onclick="Decretos.openCreateAccionDetalleModal()"
            class="bg-accent-green hover:bg-green-600 text-black w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-xl font-bold transform hover:scale-110 transition-all duration-200 border-2 border-green-400"
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

  renderCalendarioCompacto() {
    const currentDate = dayjs(this.data.currentMonth)
    const today = dayjs()
    const selectedDate = dayjs(this.data.selectedDate)
    
    return `
      <div class="gradient-card p-4 rounded-xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg">📅 Calendario</h3>
          <div class="flex items-center space-x-2">
            <button 
              onclick="Agenda.previousMonth()" 
              class="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <i class="fas fa-chevron-left text-sm"></i>
            </button>
            <span class="text-sm font-medium min-w-[120px] text-center">
              ${currentDate.format('MMMM YYYY')}
            </span>
            <button 
              onclick="Agenda.nextMonth()" 
              class="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <i class="fas fa-chevron-right text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Mini calendario -->
        <div class="grid grid-cols-7 gap-1 text-xs">
          ${['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(day => `
            <div class="text-center text-slate-400 font-medium py-2">${day}</div>
          `).join('')}
          ${this.renderMiniCalendarDays()}
        </div>

        <!-- Leyenda compacta -->
        <div class="flex items-center justify-between mt-3 text-xs">
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-accent-green rounded"></div>
            <span>Completo</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-accent-orange rounded"></div>
            <span>Pendiente</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-accent-red rounded"></div>
            <span>Vencido</span>
          </div>
        </div>
      </div>
    `
  },

  renderMiniCalendarDays() {
    const currentDate = dayjs(this.data.currentMonth)
    const today = dayjs()
    const selectedDate = dayjs(this.data.selectedDate)
    
    const startOfMonth = currentDate.startOf('month')
    const endOfMonth = currentDate.endOf('month')
    const startCalendar = startOfMonth.startOf('week')
    
    let calendarHTML = ''
    let currentCalendarDate = startCalendar
    
    // Generar 6 semanas (42 días)
    for (let i = 0; i < 42; i++) {
      const dayKey = currentCalendarDate.format('YYYY-MM-DD')
      const dayState = this.data.eventos[dayKey]
      
      const isToday = currentCalendarDate.isSame(today, 'day')
      const isSelected = currentCalendarDate.isSame(selectedDate, 'day')
      const isCurrentMonth = currentCalendarDate.isSame(currentDate, 'month')
      
      let dayClasses = 'w-8 h-8 flex items-center justify-center cursor-pointer rounded transition-colors text-xs'
      
      if (!isCurrentMonth) {
        dayClasses += ' text-slate-500'
      } else if (isSelected) {
        dayClasses += ' bg-accent-green text-black font-bold'
      } else if (isToday) {
        dayClasses += ' bg-slate-700 text-white font-medium'
      } else {
        dayClasses += ' text-slate-300 hover:bg-slate-700'
      }
      
      // Color de estado
      if (dayState && isCurrentMonth) {
        if (dayState === 'completado') dayClasses += ' border border-accent-green'
        else if (dayState === 'pendiente') dayClasses += ' border border-accent-orange'
        else if (dayState === 'vencido') dayClasses += ' border border-accent-red'
      }
      
      calendarHTML += `
        <div 
          class="${dayClasses}"
          onclick="Agenda.selectDate('${dayKey}')"
        >
          ${currentCalendarDate.format('D')}
        </div>
      `
      
      currentCalendarDate = currentCalendarDate.add(1, 'day')
    }
    
    return calendarHTML
  },

  renderCalendarioCompacto() {
    const currentDate = dayjs(this.data.currentMonth)
    const today = dayjs()
    const selectedDate = dayjs(this.data.selectedDate)
    
    return `
      <div class="gradient-card p-4 rounded-xl h-fit">
        <!-- Header del calendario -->
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-sm text-slate-300">📅 ${currentDate.format('MMMM YYYY')}</h3>
          <div class="flex items-center space-x-1">
            <button onclick="Agenda.previousMonth()" class="p-1 hover:bg-slate-700 rounded text-xs">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button onclick="Agenda.nextMonth()" class="p-1 hover:bg-slate-700 rounded text-xs">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Mini calendario grid -->
        <div class="grid grid-cols-7 gap-1 text-xs">
          ${['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(day => `
            <div class="text-center text-slate-500 font-medium py-1 text-xs">${day}</div>
          `).join('')}
          ${this.renderMiniCalendarDays()}
        </div>
      </div>
    `
  },

  renderMiniCalendarDays() {
    const currentDate = dayjs(this.data.currentMonth)
    const today = dayjs()
    const selectedDate = dayjs(this.data.selectedDate)
    
    const startOfMonth = currentDate.startOf('month')
    const endOfMonth = currentDate.endOf('month')
    const startCalendar = startOfMonth.startOf('week')
    
    let calendarHTML = ''
    let currentCalendarDate = startCalendar
    
    // Generar días del calendario
    for (let i = 0; i < 42; i++) {
      const dayKey = currentCalendarDate.format('YYYY-MM-DD')
      const dayState = this.data.eventos[dayKey]
      
      const isToday = currentCalendarDate.isSame(today, 'day')
      const isSelected = currentCalendarDate.isSame(selectedDate, 'day')
      const isCurrentMonth = currentCalendarDate.isSame(currentDate, 'month')
      
      let dayClasses = 'w-6 h-6 flex items-center justify-center cursor-pointer rounded text-xs transition-all'
      
      if (!isCurrentMonth) {
        dayClasses += ' text-slate-600'
      } else if (isSelected) {
        dayClasses += ' bg-accent-green text-black font-bold'
      } else if (isToday) {
        dayClasses += ' bg-slate-700 text-white font-medium'
      } else {
        dayClasses += ' text-slate-300 hover:bg-slate-700'
      }
      
      // Indicadores de estado
      let indicator = ''
      if (dayState && isCurrentMonth) {
        if (dayState === 'completado') indicator = ' border border-accent-green'
        else if (dayState === 'pendiente') indicator = ' border border-accent-orange'
        else if (dayState === 'vencido') indicator = ' border border-accent-red'
      }
      
      calendarHTML += `
        <div class="${dayClasses}${indicator}" onclick="Agenda.selectDate('${dayKey}')">
          ${currentCalendarDate.format('D')}
        </div>
      `
      
      currentCalendarDate = currentCalendarDate.add(1, 'day')
    }
    
    return calendarHTML
  },

  renderCalendario() {
    const currentDate = dayjs(this.data.currentMonth)
    const firstDay = currentDate.startOf('month')
    const lastDay = currentDate.endOf('month')
    const startCalendar = firstDay.startOf('week')
    const endCalendar = lastDay.endOf('week')

    let calendarHTML = `
      <div class="gradient-card p-4 rounded-xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">📅 Calendario</h3>
          <div class="flex items-center space-x-2">
            <button onclick="Agenda.previousMonth()" class="text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded">
              <i class="fas fa-chevron-left text-sm"></i>
            </button>
            <span class="font-medium text-sm">${currentDate.format('MMM YYYY')}</span>
            <button onclick="Agenda.nextMonth()" class="text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded">
              <i class="fas fa-chevron-right text-sm"></i>
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-7 gap-1">
          <!-- Días de la semana -->
          <div class="text-center text-xs font-medium text-slate-400 p-1">D</div>
          <div class="text-center text-xs font-medium text-slate-400 p-1">L</div>
          <div class="text-center text-xs font-medium text-slate-400 p-1">M</div>
          <div class="text-center text-xs font-medium text-slate-400 p-1">X</div>
          <div class="text-center text-xs font-medium text-slate-400 p-1">J</div>
          <div class="text-center text-xs font-medium text-slate-400 p-1">V</div>
          <div class="text-center text-xs font-medium text-slate-400 p-1">S</div>
    `

    // Generar días del calendario
    let currentCalendarDate = startCalendar
    while (currentCalendarDate.isBefore(endCalendar) || currentCalendarDate.isSame(endCalendar)) {
      const dateStr = currentCalendarDate.format('YYYY-MM-DD')
      const isCurrentMonth = currentCalendarDate.isSame(currentDate, 'month')
      const isSelected = dateStr === this.data.selectedDate
      const isToday = currentCalendarDate.isSame(dayjs(), 'day')
      
      let dayClass = 'calendar-day p-1 text-center text-xs w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-slate-700 transition-colors'
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

  renderMetricasCompactas() {
    const metricas = this.data.metricas
    return `
      <div class="gradient-card p-4 rounded-xl">
        <h3 class="font-semibold text-sm mb-3 text-slate-300">📊 Resumen del Día</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">Total</span>
            <span class="font-bold text-lg">${metricas.total || 0}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">Progreso</span>
            <span class="font-bold text-lg text-accent-green">${metricas.progreso || 0}%</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">✅ Completas</span>
            <span class="font-bold text-accent-green">${metricas.completadas || 0}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">⏳ Pendientes</span>
            <span class="font-bold text-accent-orange">${metricas.pendientes || 0}</span>
          </div>
        </div>
      </div>
    `
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
    const filtros = this.data.filtros
    return `
      <div class="gradient-card p-6 rounded-xl">
        <h3 class="text-lg font-semibold mb-4 flex items-center justify-between">
          <span>Filtros</span>
          <button 
            onclick="Agenda.limpiarFiltros()"
            class="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Limpiar
          </button>
        </h3>
        
        <div class="space-y-3">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              class="toggle-checkbox" 
              ${filtros.tareasHoy ? 'checked' : ''}
              onchange="Agenda.cambiarFiltro('tareasHoy', this.checked)"
            >
            <span class="text-sm">Tareas de Hoy</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              class="toggle-checkbox"
              ${filtros.tareasFuturas ? 'checked' : ''}
              onchange="Agenda.cambiarFiltro('tareasFuturas', this.checked)"
            >
            <span class="text-sm">Tareas Futuras</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              class="toggle-checkbox" 
              ${filtros.completadas ? 'checked' : ''}
              onchange="Agenda.cambiarFiltro('completadas', this.checked)"
            >
            <span class="text-sm">Completadas</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              class="toggle-checkbox" 
              ${filtros.pendientes ? 'checked' : ''}
              onchange="Agenda.cambiarFiltro('pendientes', this.checked)"
            >
            <span class="text-sm">Pendientes</span>
          </label>
        </div>
        
        <div class="mt-6">
          <label class="block text-sm font-medium mb-2">Por Decreto</label>
          <select 
            class="form-select w-full px-3 py-2 text-sm"
            onchange="Agenda.cambiarFiltroDecreto(this.value)"
          >
            <option value="todos" ${filtros.decreto === 'todos' ? 'selected' : ''}>Todos</option>
            <option value="empresarial" ${filtros.decreto === 'empresarial' ? 'selected' : ''}>Empresarial</option>
            <option value="material" ${filtros.decreto === 'material' ? 'selected' : ''}>Material</option>
            <option value="humano" ${filtros.decreto === 'humano' ? 'selected' : ''}>Humano</option>
          </select>
        </div>
        
        <!-- Contador de resultados -->
        <div class="mt-4 text-xs text-slate-400 text-center">
          <span>${this.data.timeline.length} tareas mostradas</span>
        </div>
      </div>
    `
  },

  renderTimeline() {
    return `
      <div class="gradient-card p-6 rounded-xl">
        <h3 class="text-lg font-semibold mb-4 flex items-center justify-between">
          <div class="flex items-center">
            <span class="mr-2">⏰</span>
            Timeline del Día
          </div>
          <div class="text-sm text-slate-400">
            ${this.data.timeline.filter(t => t.estado === 'completada').length}/${this.data.timeline.length}
          </div>
        </h3>
        
        <div class="space-y-4">
          ${this.data.timeline.length > 0 ? this.data.timeline.map(tarea => `
            <div class="timeline-item pl-4 pb-4 ${tarea.estado === 'completada' ? 'opacity-75' : ''} border-l-2 ${
              tarea.estado === 'completada' ? 'border-accent-green' : 
              tarea.es_enfoque_dia ? 'border-accent-purple' : 'border-slate-600'
            }">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="text-accent-green font-medium text-sm">
                      ${tarea.hora_evento || '09:00'}
                    </span>
                    ${tarea.decreto_titulo ? `
                      <button 
                        onclick="Decretos.openDetalleDecreto('${tarea.decreto_id}'); Router.navigate('decretos')"
                        class="text-xs px-2 py-0.5 rounded-full bg-${
                          tarea.area === 'empresarial' ? 'accent-green' : 
                          tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
                        }/20 text-${
                          tarea.area === 'empresarial' ? 'accent-green' : 
                          tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
                        } border border-${
                          tarea.area === 'empresarial' ? 'accent-green' : 
                          tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
                        }/30 hover:bg-${
                          tarea.area === 'empresarial' ? 'accent-green' : 
                          tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
                        }/30 cursor-pointer"
                        title="Ir al decreto"
                      >
                        <i class="fas fa-bullseye mr-1"></i>
                        ${tarea.decreto_titulo}
                      </button>
                    ` : `
                      <span class="text-xs badge-general">General</span>
                    `}
                    ${tarea.es_enfoque_dia ? `
                      <span class="text-xs px-2 py-0.5 bg-accent-purple/20 text-accent-purple rounded-full border border-accent-purple/30">
                        <i class="fas fa-star mr-1"></i>Enfoque
                      </span>
                    ` : ''}
                  </div>
                  <h4 class="font-medium text-sm ${tarea.estado === 'completada' ? 'line-through text-slate-400' : 'text-white'} cursor-pointer hover:text-accent-blue transition-colors" onclick="Agenda.openDetalleTarea('${tarea.id}')">${tarea.titulo}</h4>
                  ${tarea.accion_titulo ? `
                    <p class="text-slate-400 text-xs mt-1">
                      <i class="fas fa-tasks mr-1"></i>
                      ${tarea.accion_titulo}
                    </p>
                  ` : ''}
                  ${tarea.que_hacer ? `
                    <p class="text-slate-500 text-xs mt-1">${tarea.que_hacer}</p>
                  ` : ''}
                  ${tarea.tipo ? `
                    <div class="mt-2 flex items-center space-x-2 text-xs">
                      <span class="inline-block w-2 h-2 bg-accent-blue rounded-full"></span>
                      <span class="text-accent-blue">
                        <i class="fas fa-sync-alt mr-1"></i>
                        Sincronizada con decreto
                      </span>
                      ${tarea.tipo === 'secundaria' ? `
                        <span class="text-slate-400">• Tarea diaria</span>
                      ` : `
                        <span class="text-slate-400">• Tarea semanal</span>
                      `}
                    </div>
                  ` : ''}
                </div>
                <div class="flex space-x-2">
                  ${tarea.decreto_id ? `
                    <button 
                      onclick="Decretos.openDetalleDecreto('${tarea.decreto_id}'); Router.navigate('decretos')"
                      class="group relative bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-400/50 text-blue-300 hover:text-blue-200 p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                      title="Ver decreto"
                    >
                      <i class="fas fa-external-link-alt text-sm"></i>
                      <div class="absolute -top-2 -right-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  ` : ''}
                  <button 
                    onclick="Agenda.openSeguimientoModal('${tarea.id}')"
                    class="group relative bg-gradient-to-r from-slate-500/20 to-slate-600/20 hover:from-slate-500/30 hover:to-slate-600/30 border border-slate-400/50 text-slate-300 hover:text-slate-200 p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/20"
                    title="Seguimiento"
                  >
                    <i class="fas fa-clipboard-list text-sm"></i>
                    <div class="absolute -top-2 -right-2 w-2 h-2 bg-slate-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  ${tarea.estado !== 'completada' ? `
                    <button 
                      onclick="Agenda.completarTarea('${tarea.id}')"
                      class="group relative bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-400/50 text-green-300 hover:text-green-200 p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
                      title="Completar"
                    >
                      <i class="fas fa-check text-sm"></i>
                      <div class="absolute -top-2 -right-2 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  ` : `
                    <button 
                      onclick="Agenda.marcarPendiente('${tarea.id}')"
                      class="group relative bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 border border-orange-400/50 text-orange-300 hover:text-orange-200 p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
                      title="Marcar como Pendiente"
                    >
                      <i class="fas fa-undo text-sm"></i>
                      <div class="absolute -top-2 -right-2 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  `}
                  <button 
                    onclick="Agenda.confirmarEliminarTarea('${tarea.id}')"
                    class="group relative bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-400/50 text-red-300 hover:text-red-200 p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                    title="Eliminar"
                  >
                    <i class="fas fa-trash text-sm"></i>
                    <div class="absolute -top-2 -right-2 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="text-center py-8 text-slate-400">
              <div class="text-4xl mb-2">📅</div>
              <p class="text-sm">No hay tareas para este día</p>
              <button 
                onclick="Agenda.openCreateTareaModal()"
                class="btn-primary px-4 py-2 rounded-lg text-sm mt-3"
              >
                <i class="fas fa-plus mr-2"></i>
                Crear primera tarea
              </button>
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
      ${this.renderDetalleTareaModal()}
      ${this.renderEditTareaModal()}
      ${this.renderSeguimientoModal()}
      ${Decretos.renderCreateAccionDetalleModal()}
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
          
          <div>
            <label class="block text-sm font-medium mb-2">🎯 Prioridad *</label>
            <select name="prioridad" required class="form-select w-full px-4 py-2">
              <option value="baja">🟢 Baja - Puede esperar</option>
              <option value="media" selected>🟡 Media - Importante</option>
              <option value="alta">🔴 Alta - Urgente</option>
            </select>
            <p class="text-xs text-slate-400 mt-1">Ayuda a organizar tu agenda por importancia</p>
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

  renderTareasPendientesParaEnfoque(tareas) {
    if (!tareas || tareas.length === 0) {
      return `
        <div class="text-center py-8">
          <div class="text-slate-400 mb-4">
            <i class="fas fa-check-circle text-6xl"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">No hay tareas pendientes</h3>
          <p class="text-slate-400 mb-6">Todas las tareas de hoy han sido completadas</p>
          <button onclick="Modal.close('selectorEnfoqueModal')" class="btn-secondary">
            Cerrar
          </button>
        </div>
      `
    }

    return `
      <div class="mb-4">
        <p class="text-slate-400 text-sm mb-4">
          Selecciona la tarea más importante en la que te enfocarás hoy:
        </p>
      </div>
      
      <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
        ${tareas.map(tarea => `
          <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-purple-500 transition-colors cursor-pointer"
               onclick="Agenda.seleccionarEnfoque('${tarea.id}')">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="font-medium text-white mb-1">${tarea.titulo}</h4>
                <div class="flex items-center space-x-3 text-sm text-slate-400">
                  <span class="flex items-center">
                    <i class="fas fa-clock mr-1"></i>
                    ${tarea.hora_evento}
                  </span>
                  ${tarea.decreto_titulo ? `
                    <span class="flex items-center">
                      <i class="fas fa-bullseye mr-1"></i>
                      ${tarea.decreto_titulo}
                    </span>
                  ` : ''}
                  ${tarea.area ? `
                    <span class="px-2 py-1 rounded-full text-xs ${
                      tarea.area === 'empresarial' ? 'bg-blue-500/20 text-blue-400' :
                      tarea.area === 'material' ? 'bg-green-500/20 text-green-400' :
                      'bg-purple-500/20 text-purple-400'
                    }">
                      ${tarea.area}
                    </span>
                  ` : ''}
                </div>
              </div>
              <div class="ml-4">
                <i class="fas fa-star text-purple-400"></i>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="flex space-x-3 pt-4 border-t border-slate-700">
        <button onclick="Modal.close('selectorEnfoqueModal')" class="btn-secondary flex-1">
          Cancelar
        </button>
      </div>
    `
  },

  renderDetalleTareaModal() {
    return UI.renderModal('detalleTareaModal', '📝 Detalles de la Tarea', `
      <div id="detalleTareaContainer">
        ${UI.renderLoading('Cargando detalles de la tarea...')}
      </div>
    `)
  },

  renderEditTareaModal() {
    return UI.renderModal('editTareaModal', '✏️ Editar Tarea', `
      <form id="editTareaForm" onsubmit="Agenda.handleEditTarea(event)" class="space-y-6">
        <input type="hidden" id="editTareaId">
        
        <!-- Título de la tarea -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Título de la tarea *
          </label>
          <input 
            type="text" 
            id="editTitulo"
            name="titulo" 
            class="form-input w-full px-4 py-3 text-base" 
            placeholder="Ej: Revisar métricas del trimestre"
            required
          >
        </div>

        <!-- Descripción / Qué quieres lograr -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Descripción / Qué quieres lograr
          </label>
          <textarea 
            id="editDescripcion"
            name="descripcion"
            class="form-textarea w-full h-24 px-4 py-3 text-base" 
            placeholder="Describe qué quieres lograr con esta tarea..."
          ></textarea>
        </div>

        <!-- Qué se debe hacer -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Qué se debe hacer
          </label>
          <textarea 
            id="editQueHacer"
            name="que_hacer" 
            class="form-textarea w-full h-24 px-4 py-3 text-base" 
            placeholder="Describe específicamente qué hay que hacer..."
          ></textarea>
        </div>

        <!-- Cómo hacerlo -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Cómo hacerlo
          </label>
          <textarea 
            id="editComoHacerlo"
            name="como_hacerlo" 
            class="form-textarea w-full h-24 px-4 py-3 text-base" 
            placeholder="Metodología, pasos, recursos necesarios..."
          ></textarea>
        </div>

        <!-- Resultados esperados -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Resultados esperados/obtenidos
          </label>
          <textarea 
            id="editResultados"
            name="resultados" 
            class="form-textarea w-full h-20 px-4 py-3 text-base" 
            placeholder="Qué resultados esperas o has obtenido..."
          ></textarea>
        </div>

        <!-- Fecha/hora y Tipo en la misma fila -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Fecha y hora -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Fecha y hora *
            </label>
            <input 
              type="datetime-local" 
              id="editFechaHora"
              name="fecha_hora"
              class="form-input w-full px-4 py-3 text-base"
              required
            >
          </div>

          <!-- Tipo -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Tipo de acción
            </label>
            <select id="editTipo" name="tipo" class="form-select w-full px-4 py-3 text-base">
              <option value="secundaria">Secundaria (diaria)</option>
              <option value="primaria">Primaria (semanal)</option>
            </select>
          </div>
        </div>

        <!-- Calificación del progreso -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-3">
            Calificación del progreso (1-10)
          </label>
          <div class="relative">
            <input 
              type="range" 
              id="editCalificacion"
              name="calificacion" 
              min="1" 
              max="10" 
              value="5" 
              class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              oninput="document.getElementById('editCalificacionValue').textContent = this.value"
            >
            <div class="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
            </div>
          </div>
          <div class="text-center mt-2">
            <span id="editCalificacionValue" class="text-2xl font-bold text-white">5</span>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex space-x-3 pt-6">
          <button 
            type="button" 
            onclick="Modal.close('editTareaModal')" 
            class="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors text-white"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn-primary flex-1 py-3 rounded-lg font-medium"
          >
            <i class="fas fa-save mr-2"></i>
            Guardar Cambios
          </button>
        </div>
      </form>
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
    
    try {
      console.log('🎯 Cargando tareas pendientes para selección de enfoque...')
      
      // Cargar tareas pendientes del día actual
      const pendientes = await API.agenda.getPendientes(this.data.selectedDate)
      console.log('✅ Tareas pendientes cargadas:', pendientes.data)
      
      // Actualizar el contenido del modal
      const container = document.getElementById('pendientesContainer')
      if (container) {
        container.innerHTML = this.renderTareasPendientesParaEnfoque(pendientes.data)
      }
      
    } catch (error) {
      console.error('❌ Error al cargar tareas pendientes:', error)
      const container = document.getElementById('pendientesContainer')
      if (container) {
        container.innerHTML = `
          <div class="text-center py-8">
            <div class="text-red-400 mb-4">
              <i class="fas fa-exclamation-triangle text-3xl"></i>
            </div>
            <p class="text-red-400">Error al cargar tareas pendientes</p>
            <button onclick="Agenda.openSelectorEnfoque()" class="btn-primary mt-4">
              <i class="fas fa-redo mr-2"></i>Reintentar
            </button>
          </div>
        `
      }
    }
  },

  async seleccionarEnfoque(tareaId) {
    try {
      console.log(`🎯 Seleccionando tarea como enfoque del día: ${tareaId}`)
      
      // Establecer la tarea como enfoque del día
      await API.agenda.setEnfoque(this.data.selectedDate, tareaId)
      
      // Cerrar modal
      Modal.close('selectorEnfoqueModal')
      
      // Mostrar mensaje de éxito
      Utils.showToast('🎯 Enfoque del día establecido exitosamente', 'success')
      
      // Recargar la vista para mostrar el nuevo enfoque
      await this.render()
      
    } catch (error) {
      console.error('❌ Error al seleccionar enfoque:', error)
      Utils.showToast('Error al establecer enfoque del día', 'error')
    }
  },

  async completarEnfoque() {
    try {
      if (!this.data.enfoque) {
        Utils.showToast('No hay enfoque seleccionado para completar', 'warning')
        return
      }
      
      console.log('✅ Completando enfoque del día...')
      
      // Completar la tarea que es el enfoque
      await API.agenda.completarTarea(this.data.enfoque.id)
      
      Utils.showToast('✅ ¡Enfoque del día completado!', 'success')
      
      // Recargar la vista
      await this.render()
      
    } catch (error) {
      console.error('❌ Error al completar enfoque:', error)
      Utils.showToast('Error al completar enfoque del día', 'error')
    }
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

  async marcarPendiente(id) {
    if (confirm('¿Estás seguro de marcar esta tarea como pendiente?')) {
      try {
        await API.agenda.marcarPendiente(id)
        Utils.showToast('Tarea marcada como pendiente', 'success')
        await this.render()
      } catch (error) {
        Utils.showToast('Error al marcar tarea como pendiente', 'error')
      }
    }
  },

  confirmarEliminarTarea(id) {
    const tarea = this.data.timeline.find(t => t.id === id)
    const mensaje = tarea?.accion_id 
      ? '⚠️ Esta tarea está sincronizada con un decreto. ¿Eliminar de agenda y decreto?'
      : '¿Estás seguro de eliminar esta tarea?'
    
    if (confirm(mensaje)) {
      this.eliminarTarea(id)
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

  // Función movida al final del archivo con la implementación completa

  // Funciones para modal de detalles y edición
  async openDetalleTarea(id) {
    try {
      Modal.open('detalleTareaModal')
      
      // Cargar detalles de la tarea
      const response = await API.agenda.getTarea(id)
      const tarea = response.data
      
      // Renderizar detalles
      const container = document.getElementById('detalleTareaContainer')
      container.innerHTML = this.renderDetalleTareaContent(tarea)
      
    } catch (error) {
      Utils.showToast('Error al cargar detalles de la tarea', 'error')
      Modal.close('detalleTareaModal')
    }
  },

  renderDetalleTareaContent(tarea) {
    const fechaHora = tarea.fecha_evento && tarea.hora_evento 
      ? `${tarea.fecha_evento} ${tarea.hora_evento}` 
      : 'No especificada'
    
    return `
      <div class="space-y-6">
        <!-- Información de decreto asociado -->
        ${tarea.decreto_titulo ? `
          <div class="bg-slate-800 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-lg">
                <i class="fas fa-bullseye mr-2 text-${
                  tarea.area === 'empresarial' ? 'accent-green' : 
                  tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
                }"></i>
                ${tarea.decreto_titulo}
              </h3>
              <span class="text-xs px-2 py-1 rounded-full bg-${
                tarea.area === 'empresarial' ? 'accent-green' : 
                tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
              }/20 text-${
                tarea.area === 'empresarial' ? 'accent-green' : 
                tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
              }">
                ${tarea.area === 'empresarial' ? '🏢 Empresarial' : 
                  tarea.area === 'material' ? '💰 Material' : '❤️ Humano'}
              </span>
            </div>
            ${tarea.sueno_meta ? `
              <p class="text-slate-300 text-sm">${tarea.sueno_meta}</p>
            ` : ''}
          </div>
        ` : ''}

        <!-- Información principal de la tarea -->
        <div class="bg-slate-800 rounded-lg p-4">
          <h3 class="font-semibold text-lg mb-4 flex items-center">
            <i class="fas fa-tasks mr-2 text-accent-blue"></i>
            Información de la Tarea
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Título</label>
              <p class="text-white font-medium">${tarea.titulo || 'Sin título'}</p>
            </div>
            
            <div>
              <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Estado</label>
              <p class="text-white">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  tarea.estado === 'completada' 
                    ? 'bg-green-900/30 text-green-400 border border-green-600/50' 
                    : 'bg-orange-900/30 text-orange-400 border border-orange-600/50'
                }">
                  <i class="fas fa-${tarea.estado === 'completada' ? 'check-circle' : 'clock'} mr-1"></i>
                  ${tarea.estado === 'completada' ? 'Completada' : 'Pendiente'}
                </span>
              </p>
            </div>

            <div>
              <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Fecha y Hora</label>
              <p class="text-white">${Utils.formatDate(fechaHora)}</p>
            </div>

            ${tarea.tipo ? `
              <div>
                <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Tipo</label>
                <p class="text-white">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-600/50">
                    ${tarea.tipo === 'secundaria' ? '📅 Diaria' : '📆 Semanal'}
                  </span>
                </p>
              </div>
            ` : ''}

            ${tarea.es_enfoque_dia ? `
              <div class="md:col-span-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/30 text-purple-400 border border-purple-600/50">
                  <i class="fas fa-star mr-2"></i>
                  Enfoque del Día
                </span>
              </div>
            ` : ''}
          </div>

          ${tarea.descripcion ? `
            <div class="mt-4">
              <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Descripción</label>
              <p class="text-slate-300 mt-1">${tarea.descripcion}</p>
            </div>
          ` : ''}
        </div>

        <!-- Detalles de ejecución -->
        ${(tarea.que_hacer || tarea.como_hacerlo || tarea.resultados) ? `
          <div class="bg-slate-800 rounded-lg p-4">
            <h3 class="font-semibold text-lg mb-4 flex items-center">
              <i class="fas fa-cogs mr-2 text-accent-green"></i>
              Detalles de Ejecución
            </h3>
            
            ${tarea.que_hacer ? `
              <div class="mb-4">
                <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Qué se debe hacer</label>
                <p class="text-slate-300 mt-1">${tarea.que_hacer}</p>
              </div>
            ` : ''}

            ${tarea.como_hacerlo ? `
              <div class="mb-4">
                <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Cómo hacerlo</label>
                <p class="text-slate-300 mt-1">${tarea.como_hacerlo}</p>
              </div>
            ` : ''}

            ${tarea.resultados ? `
              <div class="mb-4">
                <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Resultados esperados/obtenidos</label>
                <p class="text-slate-300 mt-1">${tarea.resultados}</p>
              </div>
            ` : ''}

            ${tarea.calificacion ? `
              <div>
                <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Calificación</label>
                <div class="flex items-center mt-1">
                  <div class="flex space-x-1 mr-3">
                    ${Array.from({length: 10}, (_, i) => {
                      const filled = (i + 1) <= (tarea.calificacion || 0)
                      return `<div class="w-3 h-3 rounded-full ${filled ? 'bg-accent-green' : 'bg-slate-600'}"></div>`
                    }).join('')}
                  </div>
                  <span class="text-xl font-bold text-accent-green">${tarea.calificacion}/10</span>
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Tareas pendientes -->
        ${tarea.tareas_pendientes && tarea.tareas_pendientes.length > 0 ? `
          <div class="bg-slate-800 rounded-lg p-4">
            <h3 class="font-semibold text-lg mb-4 flex items-center">
              <i class="fas fa-list-ul mr-2 text-accent-orange"></i>
              Tareas Pendientes
            </h3>
            <ul class="space-y-2">
              ${tarea.tareas_pendientes.map(pendiente => `
                <li class="flex items-center text-slate-300">
                  <i class="fas fa-arrow-right mr-2 text-accent-orange text-xs"></i>
                  ${pendiente}
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Botones de acción -->
        <div class="flex space-x-3">
          <button 
            onclick="Agenda.openEditTarea('${tarea.id}')" 
            class="btn-primary flex-1 py-3 rounded-lg font-medium"
          >
            <i class="fas fa-edit mr-2"></i>
            Editar Tarea
          </button>
          
          ${tarea.estado !== 'completada' ? `
            <button 
              onclick="Agenda.completarTarea('${tarea.id}'); Modal.close('detalleTareaModal')" 
              class="btn-success flex-1 py-3 rounded-lg font-medium"
            >
              <i class="fas fa-check mr-2"></i>
              Completar
            </button>
          ` : `
            <button 
              onclick="Modal.close('detalleTareaModal')" 
              class="btn-secondary flex-1 py-3 rounded-lg font-medium"
            >
              <i class="fas fa-times mr-2"></i>
              Cerrar
            </button>
          `}
        </div>
      </div>
    `
  },

  async openEditTarea(id) {
    try {
      Modal.close('detalleTareaModal')
      Modal.open('editTareaModal')
      
      // Cargar detalles de la tarea
      const response = await API.agenda.getTarea(id)
      const tarea = response.data
      
      // Rellenar formulario
      document.getElementById('editTareaId').value = tarea.id
      document.getElementById('editTitulo').value = tarea.titulo || ''
      document.getElementById('editDescripcion').value = tarea.descripcion || ''
      document.getElementById('editQueHacer').value = tarea.que_hacer || ''
      document.getElementById('editComoHacerlo').value = tarea.como_hacerlo || ''
      document.getElementById('editResultados').value = tarea.resultados || ''
      document.getElementById('editTipo').value = tarea.tipo || 'secundaria'
      document.getElementById('editCalificacion').value = tarea.calificacion || 5
      document.getElementById('editCalificacionValue').textContent = tarea.calificacion || 5
      
      // Manejar fecha/hora
      if (tarea.fecha_evento && tarea.hora_evento) {
        const fechaHora = `${tarea.fecha_evento}T${tarea.hora_evento}`
        document.getElementById('editFechaHora').value = fechaHora
      }
      
    } catch (error) {
      Utils.showToast('Error al cargar tarea para edición', 'error')
      Modal.close('editTareaModal')
    }
  },

  async handleEditTarea(event) {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())
    const tareaId = document.getElementById('editTareaId').value
    
    try {
      await API.agenda.updateTarea(tareaId, data)
      Modal.close('editTareaModal')
      Utils.showToast('Tarea actualizada exitosamente', 'success')
      await this.render() // Recargar agenda
    } catch (error) {
      Utils.showToast('Error al actualizar tarea', 'error')
    }
  },

  // Funciones de filtrado
  cambiarFiltro(tipoFiltro, valor) {
    this.data.filtros[tipoFiltro] = valor
    this.aplicarFiltros()
    this.actualizarTimeline()
  },

  cambiarFiltroDecreto(area) {
    this.data.filtros.decreto = area
    this.aplicarFiltros()
    this.actualizarTimeline()
  },

  limpiarFiltros() {
    this.data.filtros = {
      tareasHoy: true,
      tareasFuturas: true,
      completadas: true,
      pendientes: true,
      decreto: 'todos'
    }
    this.aplicarFiltros()
    this.render() // Re-renderizar para actualizar checkboxes
  },

  aplicarFiltros() {
    let tareasFiltradas = [...this.data.originalTimeline]
    const hoy = dayjs().format('YYYY-MM-DD')
    const fechaSeleccionada = this.data.selectedDate
    
    console.log('🔍 Aplicando filtros:', {
      hoy,
      fechaSeleccionada,
      filtros: this.data.filtros,
      totalTareas: tareasFiltradas.length
    })
    
    // Filtro por tipo de fecha
    tareasFiltradas = tareasFiltradas.filter(tarea => {
      const fechaTarea = dayjs(tarea.fecha_evento).format('YYYY-MM-DD')
      
      console.log('📅 Evaluando tarea:', {
        titulo: tarea.titulo,
        fechaTarea,
        esHoy: fechaTarea === hoy,
        esFutura: dayjs(fechaTarea).isAfter(hoy),
        esFechaSeleccionada: fechaTarea === fechaSeleccionada
      })
      
      // Si filtro "Tareas Hoy" está activo, mostrar tareas de hoy
      if (this.data.filtros.tareasHoy && fechaTarea === hoy) {
        console.log('✅ Tarea incluida: es de hoy')
        return true
      }
      
      // Si filtro "Tareas Futuras" está activo, mostrar tareas futuras (después de hoy)
      if (this.data.filtros.tareasFuturas && dayjs(fechaTarea).isAfter(hoy)) {
        console.log('✅ Tarea incluida: es futura')
        return true
      }
      
      console.log('❌ Tarea excluida por filtros de fecha')
      return false
    })
    
    // Filtro por estado
    tareasFiltradas = tareasFiltradas.filter(tarea => {
      if (tarea.estado === 'completada' && this.data.filtros.completadas) {
        return true
      }
      if (tarea.estado !== 'completada' && this.data.filtros.pendientes) {
        return true
      }
      return false
    })
    
    // Filtro por área/decreto
    if (this.data.filtros.decreto !== 'todos') {
      tareasFiltradas = tareasFiltradas.filter(tarea => {
        return tarea.area === this.data.filtros.decreto
      })
    }
    
    console.log('📋 Resultado del filtrado:', {
      tareasOriginales: this.data.originalTimeline.length,
      tareasFiltradas: tareasFiltradas.length,
      tareasFiltradas_titulos: tareasFiltradas.map(t => `${t.titulo} (${dayjs(t.fecha_evento).format('YYYY-MM-DD')})`)
    })
    
    this.data.timeline = tareasFiltradas
  },

  // Actualizar solo el timeline sin re-renderizar toda la página
  actualizarTimeline() {
    // Buscar timeline por contenido de texto específico
    const allCards = document.querySelectorAll('.gradient-card')
    let timelineContainer = null
    let filtrosContainer = null
    
    for (let card of allCards) {
      const h3 = card.querySelector('h3')
      if (h3 && h3.textContent.includes('Timeline del Día')) {
        timelineContainer = card
      }
      if (h3 && h3.textContent.includes('Filtros')) {
        filtrosContainer = card
      }
    }
    
    // Actualizar timeline
    if (timelineContainer) {
      const timelineHTML = this.renderTimeline()
      const parser = new DOMParser()
      const newDoc = parser.parseFromString(timelineHTML, 'text/html')
      const newTimeline = newDoc.body.firstChild
      
      timelineContainer.replaceWith(newTimeline)
    }
    
    // Actualizar panel de filtros para mostrar el contador actualizado
    if (filtrosContainer) {
      const filtrosHTML = this.renderFiltros()
      const parser = new DOMParser()
      const newDoc = parser.parseFromString(filtrosHTML, 'text/html')
      const newFiltros = newDoc.body.firstChild
      
      filtrosContainer.replaceWith(newFiltros)
    }
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
  },

  // === FUNCIONES DE SEGUIMIENTO ===

  renderSeguimientoModal() {
    return UI.renderModal('seguimientoModal', '📝 Seguimiento de Tarea', `
      <div id="seguimiento-subtitle" class="text-slate-400 text-sm mb-6"></div>
      
      <form id="seguimientoForm" onsubmit="Agenda.handleSeguimiento(event)" class="space-y-6">
        <!-- ¿Qué se hizo exactamente? -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            ¿Qué se hizo exactamente? *
          </label>
          <textarea 
            name="que_se_hizo" 
            class="form-textarea w-full h-24" 
            placeholder="Describe detalladamente las actividades realizadas..."
            required
          ></textarea>
        </div>

        <!-- ¿Cómo se hizo? (Metodología) -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            ¿Cómo se hizo? (Metodología)
          </label>
          <textarea 
            name="como_se_hizo" 
            class="form-textarea w-full h-24" 
            placeholder="Explica la metodología, herramientas o procesos utilizados..."
          ></textarea>
        </div>

        <!-- Resultados obtenidos -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Resultados obtenidos
          </label>
          <textarea 
            name="resultados" 
            class="form-textarea w-full h-24" 
            placeholder="¿Qué resultados concretos se obtuvieron? ¿Se cumplieron los objetivos?"
          ></textarea>
        </div>

        <!-- Tareas pendientes / Próximos pasos -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Tareas pendientes / Próximos pasos
          </label>
          <textarea 
            name="pendientes" 
            class="form-textarea w-full h-24" 
            placeholder="¿Qué queda por hacer? Una línea por tarea..."
          ></textarea>
          <div class="text-xs text-slate-500 mt-1">
            💡 Escribe una tarea por línea. Se crearán automáticamente como subtareas.
          </div>
        </div>

        <!-- Próxima revisión -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Próxima revisión
          </label>
          <input 
            type="date" 
            name="proxima_revision" 
            class="form-input w-full"
          />
        </div>

        <!-- Calificación del progreso -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Calificación del progreso
          </label>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-slate-400">Bajo</span>
            <input 
              type="range" 
              name="calificacion" 
              min="1" 
              max="10" 
              value="5" 
              class="flex-1"
              oninput="document.getElementById('calificacion-display').textContent = this.value"
            />
            <span class="text-sm text-slate-400">Alto</span>
            <span id="calificacion-display" class="text-lg font-bold text-accent-green ml-2">5</span>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700">
          <button type="button" onclick="Modal.close('seguimientoModal')" class="btn-secondary px-6 py-2 rounded-lg">
            Cancelar
          </button>
          <button type="submit" class="btn-primary px-6 py-2 rounded-lg">
            Guardar Seguimiento
          </button>
        </div>
      </form>
    `)
  },

  async openSeguimientoModal(tareaId) {
    console.log('🔍 Abriendo modal de seguimiento para tarea:', tareaId)
    
    const tarea = this.data.timeline.find(t => t.id === tareaId)
    if (!tarea) {
      console.error('❌ Tarea no encontrada:', tareaId)
      Utils.showToast('Tarea no encontrada', 'error')
      return
    }
    
    console.log('✅ Tarea encontrada:', tarea)
    
    // Esperar un poco para que el modal esté renderizado
    setTimeout(() => {
      // Actualizar subtítulo
      const subtitle = document.getElementById('seguimiento-subtitle')
      if (subtitle) {
        const fecha = new Date().toLocaleDateString('es-ES')
        subtitle.textContent = `${fecha} - ${tarea.titulo}`
      }
      
      // Configurar el formulario
      const form = document.getElementById('seguimientoForm')
      if (form) {
        form.dataset.tareaId = tareaId
        form.dataset.accionId = tarea.accion_id || '' // Usar accion_id si existe
        
        // Limpiar formulario
        form.reset()
        
        // Actualizar slider si existe
        const calificacionDisplay = document.getElementById('calificacion-display')
        if (calificacionDisplay) {
          calificacionDisplay.textContent = '5'
        }
        
        console.log('✅ Modal configurado correctamente')
      } else {
        console.error('❌ Formulario de seguimiento no encontrado')
      }
      
      Modal.open('seguimientoModal')
    }, 100)
  },

  async handleSeguimiento(event) {
    event.preventDefault()
    
    const form = event.target
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    
    const tareaId = form.dataset.tareaId
    const accionId = form.dataset.accionId
    
    console.log('📝 Enviando seguimiento:', { tareaId, accionId, data })
    
    try {
      // Si la tarea tiene accion_id (está sincronizada con decreto), usar el endpoint de decretos
      if (accionId) {
        // Parsear tareas pendientes
        const pendientes = data.pendientes || ''
        const nuevasTareas = this.parsearTareasPendientes(pendientes)
        
        // Buscar el decreto_id desde la tarea
        const tarea = this.data.timeline.find(t => t.id === tareaId)
        const decretoId = tarea?.decreto_id
        
        if (!decretoId) {
          Utils.showToast('No se pudo encontrar el decreto asociado', 'error')
          return
        }
        
        // Enviar seguimiento usando la API de decretos
        const seguimientoData = {
          que_se_hizo: data.que_se_hizo,
          como_se_hizo: data.como_se_hizo,
          resultados_obtenidos: data.resultados,
          tareas_pendientes: nuevasTareas,
          proxima_revision: data.proxima_revision || null,
          calificacion: parseInt(data.calificacion)
        }
        
        await API.decretos.createSeguimiento(decretoId, accionId, seguimientoData)
      } else {
        // Si no tiene accion_id, crear seguimiento directamente en agenda
        // (Este endpoint deberíamos implementarlo si es necesario)
        Utils.showToast('Seguimiento de tareas independientes no implementado aún', 'info')
        return
      }
      
      Utils.showToast('Seguimiento guardado exitosamente', 'success')
      Modal.close('seguimientoModal')
      
      // Refrescar la vista actual
      await this.render()
      
    } catch (error) {
      console.error('❌ Error al guardar seguimiento:', error)
      Utils.showToast('Error al guardar seguimiento', 'error')
    }
  },

  parsearTareasPendientes(textoPendientes) {
    if (!textoPendientes || textoPendientes.trim() === '') {
      return []
    }
    
    return textoPendientes
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 3) // Máximo 3 como en decretos
      .map(titulo => ({
        titulo: titulo,
        que_hacer: '',
        como_hacerlo: ''
      }))
  },

  renderFiltrosHorizontales() {
    return `
      <div class="gradient-card p-4 rounded-xl mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-slate-300">🔍 Filtros:</span>
            
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                ${this.data.filtros.tareasHoy ? 'checked' : ''} 
                onchange="Agenda.toggleFiltro('tareasHoy')"
                class="rounded border-slate-600"
              >
              <span class="text-sm">Hoy</span>
            </label>
            
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                ${this.data.filtros.tareasFuturas ? 'checked' : ''} 
                onchange="Agenda.toggleFiltro('tareasFuturas')"
                class="rounded border-slate-600"
              >
              <span class="text-sm">Futuras</span>
            </label>
            
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                ${this.data.filtros.completadas ? 'checked' : ''} 
                onchange="Agenda.toggleFiltro('completadas')"
                class="rounded border-slate-600"
              >
              <span class="text-sm text-accent-green">✅ Completadas</span>
            </label>
            
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                ${this.data.filtros.pendientes ? 'checked' : ''} 
                onchange="Agenda.toggleFiltro('pendientes')"
                class="rounded border-slate-600"
              >
              <span class="text-sm text-accent-orange">⏳ Pendientes</span>
            </label>
          </div>
          
          <div class="flex items-center space-x-2 ml-auto">
            <span class="text-sm text-slate-400">${this.data.selectedDate}</span>
            <button 
              onclick="Agenda.selectDate('${dayjs().format('YYYY-MM-DD')}')"
              class="btn-secondary text-sm px-3 py-1"
            >
              Hoy
            </button>
          </div>
        </div>
      </div>
    `
  },

  renderKanbanTareas() {
    const tareasPendientes = this.data.timeline.filter(t => t.estado !== 'completada')
    const tareasCompletadas = this.data.timeline.filter(t => t.estado === 'completada')
    
    return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Columna de Pendientes -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold flex items-center">
              <span class="w-3 h-3 bg-accent-orange rounded-full mr-3"></span>
              Pendientes (${tareasPendientes.length})
            </h3>
          </div>
          
          <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            ${tareasPendientes.length > 0 ? tareasPendientes.map(tarea => this.renderTareaNueva(tarea)).join('') : `
              <div class="text-center py-8 text-slate-400">
                <i class="fas fa-tasks text-4xl mb-4"></i>
                <p>No hay tareas pendientes</p>
                <p class="text-sm">¡Excelente trabajo! 🎉</p>
              </div>
            `}
          </div>
        </div>

        <!-- Columna de Completadas -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold flex items-center">
              <span class="w-3 h-3 bg-accent-green rounded-full mr-3"></span>
              Completadas (${tareasCompletadas.length})
            </h3>
          </div>
          
          <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            ${tareasCompletadas.length > 0 ? tareasCompletadas.map(tarea => this.renderTareaNueva(tarea)).join('') : `
              <div class="text-center py-8 text-slate-400">
                <i class="fas fa-check-circle text-4xl mb-4"></i>
                <p>No hay tareas completadas</p>
                <p class="text-sm">¡Comienza a completar tareas!</p>
              </div>
            `}
          </div>
        </div>
        
      </div>
    `
  },

  renderTareaNueva(tarea) {
    return `
      <div class="gradient-card p-4 rounded-xl hover-lift transition-all duration-200 border-l-4 ${
        tarea.estado === 'completada' ? 'border-accent-green opacity-75' : 
        tarea.es_enfoque_dia ? 'border-accent-purple' : 'border-accent-orange'
      }">
        
        <!-- Header de la tarea -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-2 flex-1">
            <span class="text-accent-green font-medium text-sm">
              ${tarea.hora_evento || '09:00'}
            </span>
            ${tarea.es_enfoque_dia ? `
              <span class="px-2 py-1 bg-accent-purple/20 text-accent-purple text-xs rounded-full border border-accent-purple/30">
                🎯 Enfoque
              </span>
            ` : ''}
            ${tarea.decreto_titulo ? `
              <button 
                onclick="Decretos.openDetalleDecreto('${tarea.decreto_id}'); Router.navigate('decretos')"
                class="text-xs px-2 py-0.5 rounded-full bg-${
                  tarea.area === 'empresarial' ? 'accent-green' : 
                  tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
                }/20 text-${
                  tarea.area === 'empresarial' ? 'accent-green' : 
                  tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
                } border border-${
                  tarea.area === 'empresarial' ? 'accent-green' : 
                  tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
                }/30 hover:bg-${
                  tarea.area === 'empresarial' ? 'accent-green' : 
                  tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
                }/30 cursor-pointer"
                title="Ir al decreto"
              >
                <i class="fas fa-bullseye mr-1"></i>
                ${tarea.decreto_titulo}
              </button>
            ` : `
              <span class="text-xs px-2 py-0.5 rounded-full bg-slate-600/30 text-slate-300 border border-slate-600">
                📝 General
              </span>
            `}
          </div>
          
          <div class="flex items-center space-x-1">
            ${tarea.estado !== 'completada' ? `
              <button 
                onclick="Agenda.completarTarea(${tarea.id})"
                class="p-1.5 text-accent-green hover:bg-accent-green/20 rounded transition-colors"
                title="Completar tarea"
              >
                <i class="fas fa-check text-sm"></i>
              </button>
            ` : `
              <button 
                onclick="Agenda.marcarPendiente(${tarea.id})"
                class="p-1.5 text-accent-orange hover:bg-accent-orange/20 rounded transition-colors"
                title="Marcar como pendiente"
              >
                <i class="fas fa-undo text-sm"></i>
              </button>
            `}
            
            ${tarea.accion_id ? `
              <button 
                onclick="Agenda.openSeguimientoModal(${tarea.id})"
                class="p-1.5 text-accent-blue hover:bg-accent-blue/20 rounded transition-colors"
                title="Seguimiento"
              >
                <i class="fas fa-chart-line text-sm"></i>
              </button>
            ` : ''}
            
            <button 
              onclick="Agenda.confirmarEliminarTarea(${tarea.id})"
              class="p-1.5 text-red-400 hover:bg-red-400/20 rounded transition-colors"
              title="Eliminar tarea"
            >
              <i class="fas fa-trash text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Contenido de la tarea -->
        <div class="space-y-2">
          <h4 class="font-medium text-white ${tarea.estado === 'completada' ? 'line-through' : ''}">${tarea.titulo}</h4>
          ${tarea.descripcion ? `
            <p class="text-sm text-slate-300 ${tarea.estado === 'completada' ? 'line-through' : ''}">${tarea.descripcion}</p>
          ` : ''}
          
          ${tarea.progreso_detalles ? `
            <div class="mt-3 p-3 bg-slate-700/50 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-slate-400">📊 Progreso</span>
                <span class="text-xs font-medium">${tarea.progreso_porcentaje || 0}%</span>
              </div>
              <div class="w-full bg-slate-600 rounded-full h-2">
                <div class="bg-accent-green h-2 rounded-full transition-all duration-300" style="width: ${tarea.progreso_porcentaje || 0}%"></div>
              </div>
              <p class="text-xs text-slate-300 mt-2">${tarea.progreso_detalles}</p>
            </div>
          ` : ''}
        </div>
        
      </div>
    `
  },

  renderMetricasVisuales() {
    const metricas = this.data.metricas
    const progreso = metricas.progreso || 0
    
    return `
      <div class="gradient-card p-4 rounded-xl h-fit">
        <h3 class="font-semibold text-sm text-slate-300 mb-4">📊 Progreso del Día</h3>
        
        <!-- Círculo de progreso visual -->
        <div class="flex items-center justify-center mb-4">
          <div class="relative w-20 h-20">
            <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" stroke="currentColor" stroke-width="4" fill="none" class="text-slate-600" />
              <circle 
                cx="40" cy="40" r="32" 
                stroke="currentColor" 
                stroke-width="4" 
                fill="none" 
                stroke-linecap="round"
                class="text-accent-green transition-all duration-500"
                stroke-dasharray="${2 * Math.PI * 32}"
                stroke-dashoffset="${2 * Math.PI * 32 * (1 - progreso / 100)}"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-lg font-bold text-white">${progreso}%</span>
            </div>
          </div>
        </div>

        <!-- Métricas en grid -->
        <div class="grid grid-cols-3 gap-3 text-center text-xs">
          <div>
            <div class="text-lg font-bold text-white">${metricas.total || 0}</div>
            <div class="text-slate-400">Total</div>
          </div>
          <div>
            <div class="text-lg font-bold text-accent-green">${metricas.completadas || 0}</div>
            <div class="text-slate-400">✅</div>
          </div>
          <div>
            <div class="text-lg font-bold text-accent-orange">${metricas.pendientes || 0}</div>
            <div class="text-slate-400">⏳</div>
          </div>
        </div>
      </div>
    `
  },

  renderFiltrosCompactos() {
    return `
      <div class="gradient-card p-4 rounded-xl h-fit">
        <h3 class="font-semibold text-sm text-slate-300 mb-3">🔍 Filtros</h3>
        <div class="space-y-2">
          <label class="flex items-center space-x-2 cursor-pointer text-sm">
            <input 
              type="checkbox" 
              ${this.data.filtros.tareasHoy ? 'checked' : ''} 
              onchange="Agenda.toggleFiltro('tareasHoy')"
              class="rounded border-slate-600 text-accent-green"
            >
            <span>Hoy</span>
          </label>
          
          <label class="flex items-center space-x-2 cursor-pointer text-sm">
            <input 
              type="checkbox" 
              ${this.data.filtros.tareasFuturas ? 'checked' : ''} 
              onchange="Agenda.toggleFiltro('tareasFuturas')"
              class="rounded border-slate-600 text-accent-green"
            >
            <span>Futuras</span>
          </label>
          
          <label class="flex items-center space-x-2 cursor-pointer text-sm">
            <input 
              type="checkbox" 
              ${this.data.filtros.completadas ? 'checked' : ''} 
              onchange="Agenda.toggleFiltro('completadas')"
              class="rounded border-slate-600 text-accent-green"
            >
            <span class="text-accent-green">✅ Completadas</span>
          </label>
          
          <label class="flex items-center space-x-2 cursor-pointer text-sm">
            <input 
              type="checkbox" 
              ${this.data.filtros.pendientes ? 'checked' : ''} 
              onchange="Agenda.toggleFiltro('pendientes')"
              class="rounded border-slate-600 text-accent-green"
            >
            <span class="text-accent-orange">⏳ Pendientes</span>
          </label>
        </div>
      </div>
    `
  },

  renderTimelineExpandido() {
    const tareasPendientes = this.data.timeline.filter(t => t.estado !== 'completada')
    const tareasCompletadas = this.data.timeline.filter(t => t.estado === 'completada')
    
    return `
      <div class="gradient-card p-6 rounded-xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold flex items-center">
            <span class="mr-3">⚡</span>
            Timeline del Día - ${dayjs(this.data.selectedDate).format('DD/MM/YYYY')}
          </h3>
          <div class="text-sm text-slate-400">
            ${this.data.timeline.filter(t => t.estado === 'completada').length}/${this.data.timeline.length} completadas
          </div>
        </div>

        <!-- Vista expandida en columnas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Columna Pendientes -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-semibold text-lg flex items-center">
                <span class="w-3 h-3 bg-accent-orange rounded-full mr-3"></span>
                Pendientes (${tareasPendientes.length})
              </h4>
            </div>
            
            <div class="space-y-3 max-h-96 overflow-y-auto">
              ${tareasPendientes.length > 0 ? tareasPendientes.map(tarea => this.renderTareaCompacta(tarea)).join('') : `
                <div class="text-center py-8 text-slate-400">
                  <i class="fas fa-check-circle text-3xl mb-3"></i>
                  <p>¡Sin tareas pendientes!</p>
                  <p class="text-sm">Excelente trabajo 🎉</p>
                </div>
              `}
            </div>
          </div>

          <!-- Columna Completadas -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-semibold text-lg flex items-center">
                <span class="w-3 h-3 bg-accent-green rounded-full mr-3"></span>
                Completadas (${tareasCompletadas.length})
              </h4>
            </div>
            
            <div class="space-y-3 max-h-96 overflow-y-auto">
              ${tareasCompletadas.length > 0 ? tareasCompletadas.map(tarea => this.renderTareaCompacta(tarea)).join('') : `
                <div class="text-center py-8 text-slate-400">
                  <i class="fas fa-tasks text-3xl mb-3"></i>
                  <p>Aún no hay tareas completadas</p>
                  <p class="text-sm">¡Comienza a trabajar!</p>
                </div>
              `}
            </div>
          </div>
          
        </div>
      </div>
    `
  },

  renderTareaCompacta(tarea) {
    return `
      <div class="bg-slate-800/50 p-3 rounded-lg hover:bg-slate-800/70 transition-colors border-l-3 ${
        tarea.estado === 'completada' ? 'border-accent-green opacity-75' : 
        tarea.es_enfoque_dia ? 'border-accent-purple' : 'border-accent-orange'
      }">
        
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-accent-green font-medium text-xs">
                ${tarea.hora_evento || '09:00'}
              </span>
              
              <!-- Indicador de prioridad -->
              <span class="px-1.5 py-0.5 text-xs rounded font-medium ${
                tarea.prioridad === 'alta' ? 'bg-red-500/20 text-red-400' :
                tarea.prioridad === 'baja' ? 'bg-green-500/20 text-green-400' :
                'bg-yellow-500/20 text-yellow-400'
              }" title="Prioridad: ${tarea.prioridad}">
                ${tarea.prioridad === 'alta' ? '🔴' : tarea.prioridad === 'baja' ? '🟢' : '🟡'}
              </span>
              
              ${tarea.es_enfoque_dia ? `
                <span class="px-1.5 py-0.5 bg-accent-purple/20 text-accent-purple text-xs rounded">
                  🎯
                </span>
              ` : ''}
              ${tarea.decreto_titulo ? `
                <span class="text-xs px-1.5 py-0.5 rounded bg-${
                  tarea.area === 'empresarial' ? 'accent-green' : 
                  tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
                }/20 text-${
                  tarea.area === 'empresarial' ? 'accent-green' : 
                  tarea.area === 'material' ? 'accent-orange' : 'accent-blue'
                }">
                  ${tarea.decreto_titulo}
                </span>
              ` : ''}
            </div>
            
            <h5 class="font-medium text-sm text-white mb-1 ${tarea.estado === 'completada' ? 'line-through' : ''}">${tarea.titulo}</h5>
            ${tarea.descripcion ? `
              <p class="text-xs text-slate-400 ${tarea.estado === 'completada' ? 'line-through' : ''}">${tarea.descripcion}</p>
            ` : ''}
            
            <!-- 📅 INFORMACIÓN DE FECHAS CLARIFICADA -->
            <div class="text-xs text-slate-500 mt-2 space-y-1">
              <!-- Mostrar fecha de creación (de acción o de tarea) -->
              ${tarea.accion_fecha_creacion ? `
                <div>📝 Creada: ${dayjs(tarea.accion_fecha_creacion).format('DD/MM/YYYY')}</div>
              ` : tarea.created_at ? `
                <div>📝 Creada: ${dayjs(tarea.created_at).format('DD/MM/YYYY HH:mm')}</div>
              ` : ''}
              
              <!-- Fecha de compromiso SIEMPRE visible -->
              <div class="text-blue-400">🎯 Compromiso: ${dayjs(tarea.fecha_evento + ' ' + (tarea.hora_evento || '09:00')).format('DD/MM/YYYY HH:mm')}</div>
              
              <!-- Fecha de realización si está completada -->
              ${tarea.estado === 'completada' && tarea.fecha_completada ? `
                <div class="text-green-400">✅ Realizada: ${dayjs(tarea.fecha_completada).format('DD/MM/YYYY HH:mm')}</div>
              ` : ''}
            </div>
          </div>
          
          <div class="flex items-center space-x-1 ml-2">
            ${tarea.estado !== 'completada' ? `
              <button 
                onclick="Agenda.completarTarea('${tarea.id}')"
                class="p-2 text-green-400 hover:bg-green-400/20 rounded transition-colors text-sm bg-slate-700/50"
                title="Completar Tarea"
                style="min-width: 32px; min-height: 32px;"
              >
                <i class="fas fa-check"></i>
              </button>
            ` : `
              <button 
                onclick="Agenda.marcarPendiente('${tarea.id}')"
                class="p-2 text-yellow-400 hover:bg-yellow-400/20 rounded transition-colors text-sm bg-slate-700/50"
                title="Marcar Pendiente"
                style="min-width: 32px; min-height: 32px;"
              >
                <i class="fas fa-undo"></i>
              </button>
            `}
            
            ${tarea.accion_id ? `
              <button 
                onclick="Agenda.openSeguimientoModal('${tarea.id}')"
                class="p-2 text-blue-400 hover:bg-blue-400/20 rounded transition-colors text-sm bg-slate-700/50"
                title="Ver Seguimiento"
                style="min-width: 32px; min-height: 32px;"
              >
                <i class="fas fa-chart-line"></i>
              </button>
            ` : ''}
            
            <button 
              onclick="Agenda.confirmarEliminarTarea('${tarea.id}')"
              class="p-2 text-red-400 hover:bg-red-400/20 rounded transition-colors text-sm bg-slate-700/50"
              title="Eliminar Tarea"
              style="min-width: 32px; min-height: 32px;"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
      </div>
    `
  },

  renderMetricasVisuales() {
    const metricas = this.data.metricas || { total: 0, completadas: 0, pendientes: 0, vencidas: 0 }
    const porcentaje = metricas.total > 0 ? Math.round((metricas.completadas / metricas.total) * 100) : 0
    
    return `
      <div class="gradient-card p-6 rounded-xl h-fit">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <span class="text-2xl mr-2">📊</span>
          Progreso del Día
        </h3>
        
        <!-- Círculo de progreso -->
        <div class="flex items-center space-x-6">
          <div class="relative w-20 h-20">
            <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <!-- Círculo de fondo -->
              <circle cx="40" cy="40" r="36" stroke="#374151" stroke-width="8" fill="none"/>
              <!-- Círculo de progreso -->
              <circle 
                cx="40" 
                cy="40" 
                r="36" 
                stroke="#10b981" 
                stroke-width="8" 
                fill="none"
                stroke-dasharray="${2 * Math.PI * 36}"
                stroke-dashoffset="${2 * Math.PI * 36 * (1 - porcentaje / 100)}"
                class="transition-all duration-1000"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xl font-bold text-accent-green">${porcentaje}%</span>
            </div>
          </div>
          
          <!-- Estadísticas -->
          <div class="flex-1 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-300">Total</span>
              <span class="font-semibold">${metricas.total}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-accent-green">Completadas</span>
              <span class="font-semibold text-accent-green">${metricas.completadas}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-accent-orange">Pendientes</span>
              <span class="font-semibold text-accent-orange">${metricas.pendientes}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-accent-red">Vencidas</span>
              <span class="font-semibold text-accent-red">${metricas.vencidas}</span>
            </div>
          </div>
        </div>
      </div>
    `
  },

  renderFiltrosCompactos() {
    return `
      <div class="gradient-card p-4 rounded-xl h-fit">
        <h3 class="text-lg font-semibold mb-4">🔍 Filtros</h3>
        
        <div class="space-y-3">
          <!-- Filtro por estado -->
          <div>
            <label class="text-xs text-slate-300 block mb-2">Estado</label>
            <select 
              id="filtro-estado" 
              onchange="Agenda.aplicarFiltros()"
              class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-accent-green"
            >
              <option value="">Todos</option>
              <option value="pendiente" ${this.data.filtros.estado === 'pendiente' ? 'selected' : ''}>Pendientes</option>
              <option value="completada" ${this.data.filtros.estado === 'completada' ? 'selected' : ''}>Completadas</option>
              <option value="vencida" ${this.data.filtros.estado === 'vencida' ? 'selected' : ''}>Vencidas</option>
            </select>
          </div>
          
          <!-- Filtro por prioridad -->
          <div>
            <label class="text-xs text-slate-300 block mb-2">Prioridad</label>
            <select 
              id="filtro-prioridad" 
              onchange="Agenda.aplicarFiltros()"
              class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-accent-green"
            >
              <option value="">Todas</option>
              <option value="alta" ${this.data.filtros.prioridad === 'alta' ? 'selected' : ''}>Alta</option>
              <option value="media" ${this.data.filtros.prioridad === 'media' ? 'selected' : ''}>Media</option>
              <option value="baja" ${this.data.filtros.prioridad === 'baja' ? 'selected' : ''}>Baja</option>
            </select>
          </div>
          
          <!-- Botón limpiar filtros -->
          <button 
            onclick="Agenda.limpiarFiltros()"
            class="w-full bg-slate-600 hover:bg-slate-500 text-white text-sm py-2 px-3 rounded transition-colors"
          >
            <i class="fas fa-eraser mr-2"></i>Limpiar
          </button>
        </div>
      </div>
    `
  },

  renderTimelineExpandido() {
    const timeline = this.data.timeline || []
    const pendientes = timeline.filter(t => t.estado === 'pendiente')
    const completadas = timeline.filter(t => t.estado === 'completada')
    
    return `
      <div class="gradient-card p-6 rounded-xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold flex items-center">
            <span class="text-2xl mr-3">📋</span>
            Timeline de Tareas - ${dayjs(this.data.selectedDate).format('DD/MM/YYYY')}
          </h3>
          <div class="text-sm text-slate-400">
            ${timeline.length} tareas total
          </div>
        </div>
        
        <!-- Vista de dos columnas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Columna izquierda: Pendientes -->
          <div>
            <h4 class="text-lg font-medium text-accent-orange mb-4 flex items-center">
              <i class="fas fa-clock mr-2"></i>
              Pendientes (${pendientes.length})
            </h4>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              ${pendientes.length > 0 ? 
                pendientes.map(tarea => this.renderTareaCompacta(tarea)).join('') :
                '<p class="text-slate-400 text-sm italic">No hay tareas pendientes</p>'
              }
            </div>
          </div>
          
          <!-- Columna derecha: Completadas -->
          <div>
            <h4 class="text-lg font-medium text-accent-green mb-4 flex items-center">
              <i class="fas fa-check-circle mr-2"></i>
              Completadas (${completadas.length})
            </h4>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              ${completadas.length > 0 ? 
                completadas.map(tarea => this.renderTareaCompacta(tarea)).join('') :
                '<p class="text-slate-400 text-sm italic">No hay tareas completadas</p>'
              }
            </div>
          </div>
        </div>
      </div>
    `
  },

  // 🔥 FUNCIONES PARA BOTONES DE ACCIÓN EN TIMELINE
  async completarTarea(tareaId) {
    try {
      console.log('🎯 Completando tarea:', tareaId)
      
      const response = await fetch(`/api/agenda/tareas/${tareaId}/completar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        showNotification('✅ Tarea completada', 'success')
        // Recargar la agenda para reflejar cambios
        await this.cargarEventos()
        this.render()
      } else {
        throw new Error('Error al completar tarea')
      }
    } catch (error) {
      console.error('❌ Error completando tarea:', error)
      showNotification('❌ Error al completar tarea', 'error')
    }
  },

  async marcarPendiente(tareaId) {
    try {
      console.log('🔄 Marcando tarea como pendiente:', tareaId)
      
      const response = await fetch(`/api/agenda/tareas/${tareaId}/pendiente`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        showNotification('🔄 Tarea marcada como pendiente', 'success')
        // Recargar la agenda para reflejar cambios
        await this.cargarEventos()
        this.render()
      } else {
        throw new Error('Error al marcar tarea como pendiente')
      }
    } catch (error) {
      console.error('❌ Error marcando tarea como pendiente:', error)
      showNotification('❌ Error al marcar tarea como pendiente', 'error')
    }
  },

  async confirmarEliminarTarea(tareaId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      await this.eliminarTarea(tareaId)
    }
  },

  async eliminarTarea(tareaId) {
    try {
      console.log('🗑️ Eliminando tarea:', tareaId)
      
      const response = await fetch(`/api/agenda/tareas/${tareaId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        showNotification('🗑️ Tarea eliminada', 'success')
        // Recargar la agenda para reflejar cambios
        await this.cargarEventos()
        this.render()
      } else {
        throw new Error('Error al eliminar tarea')
      }
    } catch (error) {
      console.error('❌ Error eliminando tarea:', error)
      showNotification('❌ Error al eliminar tarea', 'error')
    }
  },

  openSeguimientoModal(tareaId) {
    try {
      console.log('📊 Abriendo modal de seguimiento para tarea:', tareaId)

      // Buscar la tarea en los datos actuales
      const tarea = this.data.timeline?.find(t => t.id === tareaId)

      if (tarea && tarea.accion_id) {
        // Si tiene accion_id, abrir el modal de seguimiento de decretos
        if (typeof openSeguimiento === 'function') {
          openSeguimiento(tarea.accion_id)
        } else {
          console.warn('Función openSeguimiento no disponible')
          showNotification('⚠️ Función de seguimiento no disponible', 'warning')
        }
      } else {
        showNotification('ℹ️ Esta tarea no tiene seguimiento disponible', 'info')
      }
    } catch (error) {
      console.error('❌ Error abriendo seguimiento:', error)
      showNotification('❌ Error abriendo seguimiento', 'error')
    }
  },

  async openGoogleCalendarSettings() {
    console.log('🔗 Abriendo configuración de Google Calendar')
    const panel = document.getElementById('google-calendar-panel')
    const container = document.getElementById('google-calendar-settings-container')

    if (panel && container) {
      panel.classList.remove('hidden')

      // Initialize Google Calendar Settings module
      if (typeof GoogleCalendarSettings !== 'undefined') {
        container.innerHTML = UI.renderLoading('Cargando configuración...')

        // Initialize and load status
        await GoogleCalendarSettings.init()

        // Render the settings panel
        container.innerHTML = GoogleCalendarSettings.renderSettingsPanel()
      } else {
        container.innerHTML = `
          <div class="text-center py-8">
            <p class="text-red-400">⚠️ Módulo de Google Calendar no disponible</p>
            <p class="text-slate-400 text-sm mt-2">Por favor recarga la página</p>
          </div>
        `
      }
    }
  },

  closeGoogleCalendarSettings() {
    console.log('🔗 Cerrando configuración de Google Calendar')
    const panel = document.getElementById('google-calendar-panel')
    if (panel) {
      panel.classList.add('hidden')
    }
  }
}