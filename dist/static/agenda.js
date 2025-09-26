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
    // 🎯 NUEVO: Datos para panorámica de pendientes
    panoramicaPendientes: {
      acciones: [],
      estadisticas: {},
      filtroArea: 'todos' // todos, empresarial, materiales, humanos
    },
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
    const [calendario, timeline, metricas, enfoque, panoramica] = await Promise.all([
      API.agenda.getCalendario(year, month),
      API.agenda.getTimeline(this.data.selectedDate),
      API.agenda.getMetricasDia(this.data.selectedDate),
      API.agenda.getEnfoque(this.data.selectedDate),
      // 🎯 NUEVO: Cargar panorámica de pendientes
      API.agenda.getPanoramicaPendientes(this.data.panoramicaPendientes.filtroArea)
    ])

    this.data.eventos = calendario.data.estados
    this.data.originalTimeline = timeline.data
    this.data.timeline = [...timeline.data] // Copia para filtrar
    this.data.metricas = metricas.data
    this.data.enfoque = enfoque.data
    
    // 🎯 NUEVO: Almacenar datos de panorámica
    if (panoramica.success) {
      this.data.panoramicaPendientes.acciones = panoramica.data.acciones
      this.data.panoramicaPendientes.estadisticas = panoramica.data.estadisticas
    }
    
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
        </div>

        <!-- Enfoque del día -->
        ${this.renderEnfoqueDia()}

        <!-- 🎨 LAYOUT REVOLUCIONARIO - GRID PREMIUM -->
        <style>
          /* CSS ULTRA ESPECÍFICO PARA VENCER CUALQUIER CONFLICTO */
          [data-agenda-layout] {
            display: flex !important;
            flex-direction: row !important;
            gap: 1.5rem !important;
            width: 100% !important;
          }
          [data-agenda-layout] > div {
            flex: 1 1 33.333% !important;
            width: 33.333% !important;
            min-width: calc(33.333% - 1rem) !important;
            max-width: calc(33.333% - 1rem) !important;
            box-sizing: border-box !important;
          }
        </style>
        <div class="space-y-8">
          
          <!-- 🎯 FILA SUPERIOR: Grid Perfectamente Balanceado -->
          <style>
            /* CSS PARA 5 COLUMNAS EXTENDIDAS A TODO EL ANCHO */
            .agenda-equal-heights {
              display: flex !important;
              flex-direction: row !important;
              gap: 16px !important;
              width: 100% !important;
              align-items: stretch !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .agenda-equal-heights > div {
              flex: 1 !important;
              min-width: 0 !important;
              height: 480px !important;
              min-height: 480px !important;
              max-height: 480px !important;
              overflow: hidden !important;
              box-sizing: border-box !important;
              display: flex !important;
              flex-direction: column !important;
            }
            .agenda-equal-heights > div > * {
              flex-shrink: 0 !important;
            }
          </style>
          <!-- 🔄 NUEVO LAYOUT: Sin Centro de Comando, Timeline más grande -->
          <style>
            .agenda-new-layout {
              display: flex !important;
              flex-direction: row !important;
              gap: 16px !important;
              width: 100% !important;
              align-items: stretch !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .agenda-new-layout .calendar-col {
              flex: 0 0 22% !important;
              min-width: 22% !important;
              max-width: 22% !important;
            }
            .agenda-new-layout .timeline-col {
              flex: 0 0 40% !important;
              min-width: 40% !important;
              max-width: 40% !important;
            }
            .agenda-new-layout .panel-col {
              flex: 0 0 19% !important;
              min-width: 19% !important;
              max-width: 19% !important;
            }
            .agenda-new-layout .recordatorios-col {
              flex: 0 0 19% !important;
              min-width: 19% !important;
              max-width: 19% !important;
            }
            .agenda-new-layout > div {
              height: 480px !important;
              min-height: 480px !important;
              max-height: 480px !important;
              overflow: hidden !important;
              box-sizing: border-box !important;
              display: flex !important;
              flex-direction: column !important;
            }
          </style>
          
          <div class="agenda-new-layout">
            
            <!-- 📅 CALENDARIO (22%) -->
            <div class="calendar-col">
              ${this.renderCalendarioPremium()}
            </div>
            
            <!-- ⏰ TIMELINE AMPLIADO (40%) -->
            <div class="timeline-col">
              ${this.renderTimelineCinematografico()}
            </div>
            
            <!-- 🎛️ PANEL DE CONTROL (19%) -->
            <div class="panel-col">
              ${this.renderPanelControlFuturista()}
            </div>

            <!-- 📝 RECORDATORIOS (19%) -->
            <div class="recordatorios-col">
              ${this.renderRecordatoriosExpress()}
            </div>
            
          </div>

          <!-- 🎯 PANORÁMICA MAESTRA - Dashboard de Pendientes -->
          <div class="w-full mt-12" data-section="panoramica-pendientes">
            ${this.renderPanoramicaPendientes()}
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
                  <h4 class="font-medium text-sm ${tarea.estado === 'completada' ? 'line-through text-slate-400' : 'text-white'} cursor-pointer hover:text-accent-blue transition-colors" onclick="Agenda.abrirModalAccionComoDecretos('${tarea.accion_id}', '${tarea.decreto_id}')">${tarea.titulo}</h4>
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
              onclick="Agenda.marcarPendiente('${tarea.id}'); Modal.close('detalleTareaModal')" 
              class="btn-warning flex-1 py-3 rounded-lg font-medium"
            >
              <i class="fas fa-undo mr-2"></i>
              Marcar Pendiente
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
              <!-- Mostrar fecha de creación (de acción, tarea o fecha del evento como fallback) -->
              ${tarea.accion_fecha_creacion ? `
                <div>📝 Creada: ${dayjs(tarea.accion_fecha_creacion).format('DD/MM/YYYY')}</div>
              ` : tarea.created_at ? `
                <div>📝 Creada: ${dayjs(tarea.created_at).format('DD/MM/YYYY HH:mm')}</div>
              ` : `
                <div>📝 Programada: ${dayjs(tarea.fecha_evento).format('DD/MM/YYYY')}</div>
              `}
              
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

  // 🎯 ============ NUEVA FUNCIONALIDAD: PANORÁMICA DE PENDIENTES ============
  
  renderPanoramicaPendientes() {
    const { acciones, estadisticas } = this.data.panoramicaPendientes
    const filtroActual = this.data.panoramicaPendientes.filtroArea
    
    if (!acciones || acciones.length === 0) {
      return `
        <div class="gradient-card p-8 rounded-xl text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-xl font-semibold mb-2">¡Excelente trabajo!</h3>
          <p class="text-slate-300">No hay acciones pendientes en este momento</p>
        </div>
      `
    }

    return `
      <div class="gradient-card p-6 rounded-xl">
        <!-- Header creativo -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <span class="text-3xl">🎯</span>
            <div>
              <h3 class="text-2xl font-bold text-gradient-green">Panorámica de Pendientes</h3>
              <p class="text-slate-300">Vista cronológica de todas tus acciones • ${estadisticas.total || 0} tareas</p>
            </div>
          </div>
          
          <!-- Filtro por área -->
          <div class="flex items-center space-x-3">
            <label class="text-sm text-slate-300">Filtrar por:</label>
            <select 
              id="panoramica-filtro-area"
              onchange="Agenda.cambiarFiltroArea(this.value)"
              class="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-accent-green focus:outline-none"
            >
              <option value="todos" ${filtroActual === 'todos' ? 'selected' : ''}>Todos los decretos</option>
              <option value="empresarial" ${filtroActual === 'empresarial' ? 'selected' : ''}>Empresariales</option>
              <option value="material" ${filtroActual === 'material' ? 'selected' : ''}>Materiales</option>
              <option value="humano" ${filtroActual === 'humano' ? 'selected' : ''}>Humanos</option>
            </select>
            <button 
              onclick="Agenda.refrescarPanoramica()"
              class="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              title="Refrescar vista"
            >
              <i class="fas fa-sync-alt text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Estadísticas rápidas -->
        ${this.renderEstadisticasPanoramica(estadisticas)}

        <!-- Lista de acciones pendientes -->
        <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
          ${acciones.map((accion, index) => this.renderAccionPendiente(accion, index)).join('')}
        </div>

        <!-- Footer con acciones -->
        <div class="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
          <div class="text-sm text-slate-400">
            Ordenado cronológicamente: más antigua → más reciente
          </div>
          <div class="flex space-x-2">
            <button 
              onclick="Agenda.exportarPendientes()"
              class="btn-secondary px-3 py-2 text-sm rounded-lg"
            >
              <i class="fas fa-download mr-2"></i>Exportar
            </button>
            <button 
              onclick="Decretos.openCreateAccionDetalleModal()"
              class="btn-primary px-3 py-2 text-sm rounded-lg"
            >
              <i class="fas fa-plus mr-2"></i>Nueva Acción
            </button>
          </div>
        </div>
      </div>
    `
  },

  renderEstadisticasPanoramica(estadisticas) {
    const areas = Object.entries(estadisticas.por_area || {})
    
    return `
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Total -->
        <div class="bg-slate-800 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-accent-green">${estadisticas.total || 0}</div>
          <div class="text-xs text-slate-300">Total Pendientes</div>
        </div>
        
        <!-- Antigüedad promedio -->
        <div class="bg-slate-800 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-accent-orange">${estadisticas.antiguedad_promedio || 0}</div>
          <div class="text-xs text-slate-300">Días Promedio</div>
        </div>
        
        <!-- Con revisión -->
        <div class="bg-slate-800 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-accent-blue">${estadisticas.con_revision_pendiente || 0}</div>
          <div class="text-xs text-slate-300">Con Revisión</div>
        </div>
        
        <!-- Sin revisión -->
        <div class="bg-slate-800 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-slate-400">${estadisticas.sin_revision || 0}</div>
          <div class="text-xs text-slate-300">Sin Revisión</div>
        </div>
      </div>
      
      ${areas.length > 0 ? `
        <div class="flex flex-wrap gap-2 mb-4">
          ${areas.map(([area, cantidad]) => `
            <div class="px-3 py-1 bg-slate-700 rounded-full text-sm flex items-center space-x-2">
              <span class="capitalize">${area}:</span>
              <span class="font-medium text-accent-green">${cantidad}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `
  },

  renderAccionPendiente(accion, index) {
    // Determinar color de urgencia
    const urgenciaColors = {
      'vencida': 'border-l-accent-red bg-red-900/20',
      'urgente': 'border-l-accent-orange bg-orange-900/20',
      'importante': 'border-l-accent-orange bg-yellow-900/20',
      'muy_antigua': 'border-l-purple-500 bg-purple-900/20',
      'antigua': 'border-l-blue-500 bg-blue-900/20',
      'normal': 'border-l-slate-600 bg-slate-800/50'
    }
    
    const urgenciaIcons = {
      'vencida': '🔴',
      'urgente': '🟠', 
      'importante': '🟡',
      'muy_antigua': '🟣',
      'antigua': '🔵',
      'normal': '⚪'
    }
    
    const colorClass = urgenciaColors[accion.urgencia] || urgenciaColors.normal
    const urgenciaIcon = urgenciaIcons[accion.urgencia] || urgenciaIcons.normal
    
    return `
      <div class="border-l-4 ${colorClass} p-4 rounded-r-lg hover:bg-slate-700/50 transition-colors group">
        <div class="flex items-start justify-between">
          <!-- Contenido principal -->
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-lg">${urgenciaIcon}</span>
              <span class="text-sm font-mono text-slate-400">#${index + 1}</span>
              <span class="text-xs px-2 py-1 bg-slate-700 rounded-full capitalize">${accion.area || 'sin área'}</span>
              <span class="text-xs text-slate-500">${accion.dias_desde_creacion} días</span>
            </div>
            
            <h4 class="font-medium text-white mb-1 group-hover:text-accent-green transition-colors">
              ${accion.titulo}
            </h4>
            
            <p class="text-sm text-slate-300 mb-2">
              <span class="text-accent-blue">${accion.decreto_titulo}</span>
            </p>
            
            ${accion.que_hacer ? `
              <p class="text-xs text-slate-400 mb-2 line-clamp-2">${accion.que_hacer}</p>
            ` : ''}
            
            <!-- Fechas -->
            <div class="flex flex-wrap gap-3 text-xs text-slate-500">
              <span>📅 Creada: ${accion.fecha_creacion_formatted}</span>
              ${accion.proxima_revision_formatted ? `
                <span class="text-accent-orange">⏰ Revisión: ${accion.proxima_revision_formatted}</span>
              ` : ''}
              ${accion.calificacion ? `
                <span class="text-yellow-400">⭐ ${accion.calificacion}/10</span>
              ` : ''}
            </div>
          </div>
          
          <!-- Acciones -->
          <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            ${accion.evento_agenda_id ? `
              <button 
                onclick="Agenda.verEnTimeline('${accion.evento_agenda_id}')"
                class="p-2 bg-slate-700 hover:bg-accent-blue rounded-lg text-xs"
                title="Ver en timeline"
              >
                <i class="fas fa-calendar"></i>
              </button>
            ` : ''}
            <button 
              onclick="Decretos.openAccionModal('${accion.decreto_id}', '${accion.id}')"
              class="p-2 bg-slate-700 hover:bg-accent-green rounded-lg text-xs"
              title="Ver detalles"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button 
              onclick="Agenda.programarAccion('${accion.id}')"
              class="p-2 bg-slate-700 hover:bg-accent-orange rounded-lg text-xs"
              title="Programar en agenda"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `
  },

  // Funciones de control para panorámica
  async cambiarFiltroArea(area) {
    console.log('🔄 Cambiando filtro de área a:', area)
    
    try {
      this.data.panoramicaPendientes.filtroArea = area
      
      // Recargar datos con el nuevo filtro
      const panoramica = await API.agenda.getPanoramicaPendientes(area)
      
      if (panoramica.success) {
        this.data.panoramicaPendientes.acciones = panoramica.data.acciones
        this.data.panoramicaPendientes.estadisticas = panoramica.data.estadisticas
        
        // Re-renderizar solo la sección de panorámica
        const panoramicaContainer = document.querySelector('[data-section="panoramica-pendientes"]')
        if (panoramicaContainer) {
          panoramicaContainer.innerHTML = this.renderPanoramicaPendientes()
        } else {
          // Si no encuentra el contenedor, re-renderizar toda la agenda
          this.render()
        }
        
        showNotification(`✅ Filtro aplicado: ${area}`, 'success')
      }
    } catch (error) {
      console.error('❌ Error cambiando filtro:', error)
      showNotification('❌ Error al cambiar filtro', 'error')
    }
  },

  async refrescarPanoramica() {
    console.log('🔄 Refrescando panorámica de pendientes')
    
    try {
      const area = this.data.panoramicaPendientes.filtroArea
      const panoramica = await API.agenda.getPanoramicaPendientes(area)
      
      if (panoramica.success) {
        this.data.panoramicaPendientes.acciones = panoramica.data.acciones
        this.data.panoramicaPendientes.estadisticas = panoramica.data.estadisticas
        
        // Re-renderizar toda la vista para estar seguros
        this.render()
        
        showNotification('✅ Panorámica actualizada', 'success')
      }
    } catch (error) {
      console.error('❌ Error refrescando panorámica:', error)
      showNotification('❌ Error al refrescar', 'error')
    }
  },

  verEnTimeline(eventoId) {
    console.log('📅 Navegando a evento en timeline:', eventoId)
    
    try {
      // Buscar el evento en el timeline actual
      const evento = this.data.timeline.find(t => t.id === eventoId)
      
      if (evento) {
        // Si el evento está en una fecha diferente, navegar a esa fecha
        if (evento.fecha_evento !== this.data.selectedDate) {
          this.selectDate(evento.fecha_evento)
          return
        }
        
        // Hacer scroll hasta el evento y resaltarlo
        setTimeout(() => {
          const eventoElement = document.querySelector(`[data-evento-id="${eventoId}"]`)
          if (eventoElement) {
            eventoElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            eventoElement.classList.add('highlight-flash')
            
            setTimeout(() => {
              eventoElement.classList.remove('highlight-flash')
            }, 2000)
          }
        }, 100)
        
        showNotification('📅 Navegado al evento en timeline', 'info')
      } else {
        showNotification('ℹ️ Este evento no está programado en agenda', 'info')
      }
    } catch (error) {
      console.error('❌ Error navegando al timeline:', error)
      showNotification('❌ Error al navegar', 'error')
    }
  },

  programarAccion(accionId) {
    console.log('📅 Programando acción en agenda:', accionId)
    
    try {
      // Buscar la acción en los datos de panorámica
      const accion = this.data.panoramicaPendientes.acciones.find(a => a.id === accionId)
      
      if (!accion) {
        showNotification('❌ Acción no encontrada', 'error')
        return
      }
      
      // Pre-llenar modal de creación de tarea con datos de la acción
      const modalData = {
        nombre: accion.titulo,
        descripcion: accion.que_hacer || '',
        tipo: accion.tipo || 'secundaria',
        decreto_id: accion.decreto_id,
        accion_origen: accionId
      }
      
      // Abrir modal de creación de tarea
      this.openCreateTareaModal(modalData)
      
    } catch (error) {
      console.error('❌ Error programando acción:', error)
      showNotification('❌ Error al programar acción', 'error')
    }
  },

  exportarPendientes() {
    console.log('📥 Exportando acciones pendientes')
    
    try {
      const { acciones, estadisticas } = this.data.panoramicaPendientes
      
      if (!acciones || acciones.length === 0) {
        showNotification('ℹ️ No hay acciones para exportar', 'info')
        return
      }
      
      // Crear CSV con las acciones
      const headers = [
        'Título', 'Área', 'Decreto', 'Qué Hacer', 'Fecha Creación', 
        'Próxima Revisión', 'Días Antigüedad', 'Urgencia', 'Calificación'
      ]
      
      const csvContent = [
        headers.join(','),
        ...acciones.map(accion => [
          `"${accion.titulo}"`,
          `"${accion.area || 'Sin área'}"`,
          `"${accion.decreto_titulo}"`,
          `"${(accion.que_hacer || '').replace(/"/g, '""')}"`,
          accion.fecha_creacion,
          accion.proxima_revision || '',
          accion.dias_desde_creacion,
          accion.urgencia,
          accion.calificacion || ''
        ].join(','))
      ].join('\n')
      
      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `acciones-pendientes-${dayjs().format('YYYY-MM-DD')}.csv`
      link.click()
      
      showNotification('📥 Archivo exportado correctamente', 'success')
      
    } catch (error) {
      console.error('❌ Error exportando:', error)
      showNotification('❌ Error al exportar', 'error')
    }
  },

  // 🎨 ============ COMPONENTES DE DISEÑO PREMIUM ============
  
  renderCalendarioPremium() {
    const currentDate = dayjs(this.data.currentMonth)
    const today = dayjs()
    const selectedDate = dayjs(this.data.selectedDate)
    
    return `
      <div class="glassmorphism-card premium-shadow" style="height: 480px !important; min-height: 480px !important; max-height: 480px !important; overflow: hidden !important;">
        <!-- Header Elegante con Glassmorphism -->
        <div class="flex items-center justify-between p-4 border-b border-white/10">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center premium-glow">
              <i class="fas fa-calendar-alt text-white text-sm"></i>
            </div>
            <div>
              <h3 class="font-bold text-white tracking-tight">${currentDate.format('MMMM')}</h3>
              <p class="text-xs text-slate-400 font-medium">${currentDate.format('YYYY')}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-1">
            <button 
              onclick="Agenda.previousMonth()" 
              class="premium-btn-nav group"
              title="Mes anterior"
            >
              <i class="fas fa-chevron-left text-xs transition-transform group-hover:-translate-x-0.5"></i>
            </button>
            <button 
              onclick="Agenda.nextMonth()" 
              class="premium-btn-nav group"
              title="Siguiente mes"
            >
              <i class="fas fa-chevron-right text-xs transition-transform group-hover:translate-x-0.5"></i>
            </button>
          </div>
        </div>

        <!-- Grid del Calendario con Efectos Premium -->
        <div class="p-4">
          <div class="grid grid-cols-7 gap-1 mb-2">
            ${['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(day => `
              <div class="text-center text-xs font-bold text-slate-500 py-2 tracking-wider">${day}</div>
            `).join('')}
          </div>
          
          <div class="grid grid-cols-7 gap-1">
            ${this.renderCalendarioDiasPremium()}
          </div>

          <!-- Leyenda Premium -->
          <div class="mt-4 pt-3 border-t border-white/10">
            <div class="flex items-center justify-center space-x-4 text-xs">
              <div class="flex items-center space-x-1.5">
                <div class="w-2 h-2 rounded-full bg-accent-green premium-pulse"></div>
                <span class="text-slate-400">Completo</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <div class="w-2 h-2 rounded-full bg-accent-orange premium-pulse"></div>
                <span class="text-slate-400">Pendiente</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <div class="w-2 h-2 rounded-full bg-accent-red premium-pulse"></div>
                <span class="text-slate-400">Vencido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  renderCalendarioDiasPremium() {
    const currentDate = dayjs(this.data.currentMonth)
    const today = dayjs()
    const selectedDate = dayjs(this.data.selectedDate)
    
    const startOfMonth = currentDate.startOf('month')
    const startCalendar = startOfMonth.startOf('week')
    
    let calendarHTML = ''
    let currentCalendarDate = startCalendar
    
    // Generar días con efectos premium
    for (let i = 0; i < 42; i++) {
      const dayKey = currentCalendarDate.format('YYYY-MM-DD')
      const dayState = this.data.eventos[dayKey]
      
      const isToday = currentCalendarDate.isSame(today, 'day')
      const isSelected = currentCalendarDate.isSame(selectedDate, 'day')
      const isCurrentMonth = currentCalendarDate.isSame(currentDate, 'month')
      
      let dayClasses = 'calendario-dia-premium'
      
      if (!isCurrentMonth) {
        dayClasses += ' opacity-30'
      } else if (isSelected) {
        dayClasses += ' dia-seleccionado'
      } else if (isToday) {
        dayClasses += ' dia-hoy'
      }
      
      // Estados con efectos LED
      let ledIndicator = ''
      if (dayState && isCurrentMonth) {
        if (dayState === 'completado') ledIndicator = '<div class="led-indicator led-green"></div>'
        else if (dayState === 'pendiente') ledIndicator = '<div class="led-indicator led-orange"></div>'
        else if (dayState === 'vencido') ledIndicator = '<div class="led-indicator led-red"></div>'
      }
      
      calendarHTML += `
        <div 
          class="${dayClasses}"
          onclick="Agenda.selectDate('${dayKey}')"
        >
          <span class="relative z-10">${currentCalendarDate.format('D')}</span>
          ${ledIndicator}
        </div>
      `
      
      currentCalendarDate = currentCalendarDate.add(1, 'day')
    }
    
    return calendarHTML
  },

  renderTimelineCinematografico() {
    const timeline = this.data.timeline || []
    const hoyFormatted = dayjs(this.data.selectedDate).format('dddd, D [de] MMMM')
    const completadas = timeline.filter(t => t.estado === 'completada').length
    const total = timeline.length
    
    return `
      <div class="glassmorphism-card premium-shadow" style="height: 480px !important; min-height: 480px !important; max-height: 480px !important; overflow: hidden !important;">
        <!-- Header Cinematográfico Ampliado -->
        <div class="p-4 border-b border-white/10">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center premium-glow">
                <i class="fas fa-clock text-white text-sm"></i>
              </div>
              <div>
                <h3 class="font-bold text-white tracking-tight">Timeline Detallado</h3>
                <p class="text-xs text-slate-400 font-medium capitalize">${hoyFormatted}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-accent-green">${completadas}/${total}</div>
              <div class="text-xs text-slate-400">Completadas</div>
            </div>
          </div>
          
          <!-- Progress Bar -->
          ${total > 0 ? `
            <div class="w-full bg-slate-700 rounded-full h-2 mb-2">
              <div class="bg-gradient-to-r from-accent-green to-green-400 h-2 rounded-full" style="width: ${Math.round((completadas / total) * 100)}%"></div>
            </div>
          ` : ''}
        </div>

        <!-- Timeline Vertical Ampliado con Scroll -->
        <div class="h-96 overflow-y-auto premium-scroll p-4">
          ${timeline.length === 0 ? `
            <div class="flex flex-col items-center justify-center h-full text-center">
              <div class="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
                <i class="fas fa-calendar-check text-slate-600 text-xl"></i>
              </div>
              <p class="text-slate-400 text-sm font-medium">No hay tareas programadas</p>
              <p class="text-slate-500 text-xs">para este día</p>
            </div>
          ` : `
            <div class="timeline-cinematografico">
              ${timeline.map((tarea, index) => this.renderTareaCinematografica(tarea, index)).join('')}
            </div>
          `}
        </div>

        <!-- Footer con Actions -->
        <div class="p-3 border-t border-white/10">
          <button 
            onclick="Decretos.openCreateAccionDetalleModal()"
            class="w-full premium-btn-primary"
          >
            <i class="fas fa-plus mr-2"></i>
            Agregar Tarea
          </button>
        </div>
      </div>
    `
  },

  renderTareaCinematografica(tarea, index) {
    const horaFormateada = tarea.hora_evento || '09:00'
    const prioridadIcon = {
      'alta': '🔥',
      'media': '⭐',  
      'baja': '📌'
    }[tarea.prioridad] || '📌'
    
    const estadoClass = {
      'completada': 'tarea-completada',
      'pendiente': 'tarea-pendiente'
    }[tarea.estado] || 'tarea-pendiente'

    return `
      <div class="timeline-item-cinematografico ${estadoClass} fade-in-timeline" style="animation-delay: ${index * 0.1}s">
        <!-- Línea Temporal -->
        <div class="timeline-connector"></div>
        
        <!-- Card de Tarea -->
        <div class="timeline-card cursor-pointer" data-evento-id="${tarea.id}" onclick="Agenda.abrirModalAccionComoDecretos('${tarea.accion_id}', '${tarea.decreto_id}')" style="transition: all 0.3s ease; cursor: pointer;"
          onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'"
          onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
        >
          <div class="flex items-start space-x-3">
            <!-- Hora Digital -->
            <div class="hora-digital">
              <div class="text-xs font-mono font-bold text-accent-green">${horaFormateada}</div>
            </div>
            
            <!-- Contenido -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                <span class="text-sm">${prioridadIcon}</span>
                <h4 class="font-medium text-white text-sm truncate">${tarea.titulo}</h4>
              </div>
              
              ${tarea.decreto_titulo ? `
                <p class="text-xs text-slate-400 truncate mb-1">${tarea.decreto_titulo}</p>
              ` : ''}
              
              ${tarea.descripcion ? `
                <p class="text-xs text-slate-500 line-clamp-2">${tarea.descripcion}</p>
              ` : ''}
            </div>
            
            <!-- Actions Flotantes -->
            <div class="timeline-actions">
              <button 
                onclick="${tarea.estado === 'completada' ? `Agenda.marcarPendiente('${tarea.id}')` : `Agenda.completarTarea('${tarea.id}')`}" 
                class="timeline-action-btn ${tarea.estado === 'completada' ? 'action-completed' : 'action-complete'}"
                title="${tarea.estado === 'completada' ? 'Marcar pendiente' : 'Completar tarea'}"
              >
                <i class="fas ${tarea.estado === 'completada' ? 'fa-undo' : 'fa-check'} text-xs"></i>
              </button>
              <button 
                onclick="Agenda.openEditTareaModal('${tarea.id}')" 
                class="timeline-action-btn action-edit"
                title="Editar tarea"
              >
                <i class="fas fa-edit text-xs"></i>
              </button>
              <button 
                onclick="Agenda.deleteTarea('${tarea.id}')" 
                class="timeline-action-btn action-delete"
                title="Eliminar tarea"
              >
                <i class="fas fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  },

  renderPanelControlFuturista() {
    const { total, completadas, pendientes, progreso } = this.data.metricas || {}
    const filtroActual = this.data.panoramicaPendientes.filtroArea
    
    return `
      <!-- 🎛️ PANEL PRINCIPAL CON ALTURA FIJA -->
      <div class="glassmorphism-card premium-shadow" style="height: 480px !important; min-height: 480px !important; max-height: 480px !important; overflow: hidden !important; display: flex !important; flex-direction: column !important;">
          <div class="p-4">
            
            <!-- Header del Panel -->
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-purple-600 flex items-center justify-center premium-glow">
                <i class="fas fa-sliders-h text-white text-xs"></i>
              </div>
              <h3 class="font-bold text-white text-sm tracking-tight">Panel de Control</h3>
            </div>

            <!-- Progreso Circular Premium -->
            <div class="flex items-center justify-center mb-4">
              ${this.renderProgresoCircularPremium(progreso || 0, total || 0, completadas || 0)}
            </div>

            <!-- Filtros Futuristas -->
            <div class="space-y-2">
              <label class="text-xs font-medium text-slate-400 uppercase tracking-wider">Filtrar Vista</label>
              <div class="grid grid-cols-2 gap-1">
                ${this.renderFiltroChips()}
              </div>
            </div>

            
            <!-- 📊 STATS INTEGRADOS -->
            <div class="mt-4 pt-4 border-t border-white/10">
              <div class="text-center">
                <div class="text-lg font-bold text-accent-green">${pendientes || 0}</div>
                <div class="text-xs text-slate-400">Pendientes</div>
              </div>
            </div>

          </div>
        </div>
    `
  },

  renderProgresoCircularPremium(progreso, total, completadas) {
    const radius = 35
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progreso / 100) * circumference
    
    return `
      <div class="relative w-20 h-20">
        <!-- SVG Circular Progress -->
        <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
          <!-- Background Circle -->
          <circle
            cx="40"
            cy="40"
            r="${radius}"
            stroke="currentColor"
            stroke-width="4"
            fill="transparent"
            class="text-slate-700"
          />
          <!-- Progress Circle -->
          <circle
            cx="40"
            cy="40"
            r="${radius}"
            stroke="url(#gradient-green)"
            stroke-width="4"
            fill="transparent"
            stroke-dasharray="${circumference} ${circumference}"
            stroke-dashoffset="${offset}"
            stroke-linecap="round"
            class="transition-all duration-500 ease-in-out"
          />
          <!-- Gradient Definition -->
          <defs>
            <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
        
        <!-- Centro con Stats -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="text-lg font-bold text-white">${progreso || 0}%</div>
          <div class="text-xs text-slate-400">${completadas}/${total}</div>
        </div>
      </div>
    `
  },

  renderFiltroChips() {
    const filtros = [
      { key: 'todos', label: 'Todos', icon: '🎯' },
      { key: 'empresarial', label: 'Empresa', icon: '💼' },
      { key: 'material', label: 'Material', icon: '💎' },
      { key: 'humano', label: 'Humano', icon: '👤' }
    ]
    
    const filtroActual = this.data.panoramicaPendientes.filtroArea
    
    return filtros.map(filtro => {
      const isActive = filtroActual === filtro.key
      return `
        <button 
          onclick="Agenda.cambiarFiltroArea('${filtro.key}')"
          class="filtro-chip ${isActive ? 'filtro-chip-active' : 'filtro-chip-inactive'}"
        >
          <span class="text-xs mr-1">${filtro.icon}</span>
          <span class="text-xs font-medium">${filtro.label}</span>
        </button>
      `
    }).join('')
  },

  renderPanoramicaMaestra() {
    const { acciones, estadisticas } = this.data.panoramicaPendientes
    
    // 🐛 DEBUG: Log para depurar el problema de KPIs
    console.log('🔍 DEBUG - Panorámica Maestra:', { 
      acciones: acciones?.length, 
      estadisticas,
      dataCompleta: this.data.panoramicaPendientes 
    })
    
    if (!acciones || acciones.length === 0) {
      return `
        <div class="glassmorphism-card premium-shadow text-center p-12">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center mx-auto mb-6 premium-glow">
            <i class="fas fa-trophy text-white text-2xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">¡Misión Cumplida!</h3>
          <p class="text-slate-300 text-lg">No hay acciones pendientes</p>
          <p class="text-slate-400 text-sm mt-2">Eres increíble, Gus 🎉</p>
        </div>
      `
    }

    return `
      <div class="glassmorphism-card premium-shadow">
        
        <!-- Header Maestra con Estadísticas -->
        <div class="p-6 border-b border-white/10">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-purple-600 flex items-center justify-center premium-glow">
                <i class="fas fa-list-check text-white text-lg"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-white tracking-tight">Panorámica de Pendientes</h2>
                <p class="text-slate-300">Vista maestra de todas tus acciones • ${estadisticas.total || 0} tareas</p>
              </div>
            </div>
            
            <button 
              onclick="Agenda.refrescarPanoramica()"
              class="premium-btn-secondary"
              title="Refrescar vista"
            >
              <i class="fas fa-sync-alt mr-2"></i>Actualizar
            </button>
          </div>

          <!-- Dashboard de Estadísticas -->
          ${this.renderDashboardEstadisticas(estadisticas)}
        </div>

        <!-- Grid Masonry de Acciones -->
        <div class="p-6">
          <div class="masonry-grid">
            ${acciones.map((accion, index) => this.renderAccionMaestra(accion, index)).join('')}
          </div>
        </div>

        <!-- Footer con Acciones Globales -->
        <div class="p-4 border-t border-white/10 bg-slate-900/50">
          <div class="flex justify-between items-center">
            <div class="text-sm text-slate-400">
              <i class="fas fa-sort-amount-down mr-2"></i>
              Ordenado: más antigua → más reciente
            </div>
            <div class="flex space-x-3">
              <button 
                onclick="Agenda.exportarPendientes()"
                class="premium-btn-outline"
              >
                <i class="fas fa-download mr-2"></i>Exportar
              </button>
              <button 
                onclick="Decretos.openCreateAccionDetalleModal()"
                class="premium-btn-primary"
              >
                <i class="fas fa-plus mr-2"></i>Nueva Acción
              </button>
            </div>
          </div>
        </div>

      </div>
    `
  },

  renderDashboardEstadisticas(estadisticas) {
    // 🐛 DEBUG: Log para depurar el problema de KPIs
    console.log('🔍 DEBUG - Renderizando estadísticas dashboard:', estadisticas)
    
    const stats = [
      { 
        label: 'Total Pendientes', 
        value: estadisticas?.total || 0, 
        icon: 'fas fa-tasks',
        gradient: 'from-accent-green to-emerald-600',
        glow: 'premium-glow-green'
      },
      { 
        label: 'Días Promedio', 
        value: estadisticas?.antiguedad_promedio || 0, 
        icon: 'fas fa-calendar-day',
        gradient: 'from-accent-orange to-orange-600',
        glow: 'premium-glow-orange'
      },
      { 
        label: 'Con Revisión', 
        value: estadisticas?.con_revision_pendiente || 0, 
        icon: 'fas fa-clock',
        gradient: 'from-accent-blue to-blue-600',
        glow: 'premium-glow-blue'
      },
      { 
        label: 'Sin Planificar', 
        value: estadisticas.sin_revision || 0, 
        icon: 'fas fa-question-circle',
        gradient: 'from-slate-600 to-slate-700',
        glow: 'premium-glow-gray'
      }
    ]

    return `
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${stats.map(stat => `
          <div class="stat-card bg-gradient-to-br ${stat.gradient} ${stat.glow}">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <i class="${stat.icon} text-white text-sm"></i>
              </div>
              <div>
                <div class="text-2xl font-bold text-white">${stat.value}</div>
                <div class="text-xs text-white/80">${stat.label}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `
  },

  renderAccionMaestra(accion, index) {
    const urgenciaConfig = {
      'vencida': { color: 'border-accent-red', bg: 'bg-red-900/20', icon: '🔴', pulse: 'premium-pulse-red' },
      'urgente': { color: 'border-accent-orange', bg: 'bg-orange-900/20', icon: '🟠', pulse: 'premium-pulse-orange' },
      'importante': { color: 'border-yellow-400', bg: 'bg-yellow-900/20', icon: '🟡', pulse: 'premium-pulse-yellow' },
      'muy_antigua': { color: 'border-purple-500', bg: 'bg-purple-900/20', icon: '🟣', pulse: 'premium-pulse-purple' },
      'antigua': { color: 'border-accent-blue', bg: 'bg-blue-900/20', icon: '🔵', pulse: 'premium-pulse-blue' },
      'normal': { color: 'border-slate-600', bg: 'bg-slate-800/50', icon: '⚪', pulse: '' }
    }
    
    const config = urgenciaConfig[accion.urgencia] || urgenciaConfig.normal
    
    return `
      <div class="accion-maestra-card border-l-4 ${config.color} ${config.bg} ${config.pulse} fade-in-masonry cursor-pointer" 
           style="animation-delay: ${index * 0.05}s"
           data-accion-id="${accion.id}"
           onclick="Agenda.abrirModalAccionComoDecretos('${accion.id}', '${accion.decreto_id}')"
           onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'"
           onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
           title="Ver detalles de: ${accion.titulo}">
        
        <!-- Header de la Acción -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-2">
            <span class="text-lg ${config.pulse}">${config.icon}</span>
            <div class="text-xs text-slate-400">
              <span class="font-mono">#${(index + 1).toString().padStart(2, '0')}</span>
              <span class="mx-1">•</span>
              <span class="capitalize">${accion.area || 'sin área'}</span>
            </div>
          </div>
          <div class="text-xs text-slate-500">${accion.dias_desde_creacion}d</div>
        </div>

        <!-- Título y Decreto -->
        <div class="mb-3">
          <h4 class="font-semibold text-white mb-1 line-clamp-2 hover:text-accent-green transition-colors cursor-pointer"
              onclick="Agenda.abrirModalAccionComoDecretos('${accion.id}', '${accion.decreto_id}')"
              title="Ver detalles de la acción">
            ${accion.titulo}
          </h4>
          <p class="text-sm text-accent-blue line-clamp-1">${accion.decreto_titulo}</p>
        </div>

        <!-- Descripción -->
        ${accion.que_hacer ? `
          <p class="text-sm text-slate-400 mb-3 line-clamp-2">${accion.que_hacer}</p>
        ` : ''}

        <!-- Metadatos -->
        <div class="flex flex-wrap gap-2 text-xs text-slate-500 mb-4">
          <span class="inline-flex items-center">
            <i class="fas fa-calendar-plus mr-1"></i>
            ${accion.fecha_creacion_formatted}
          </span>
          ${accion.proxima_revision_formatted ? `
            <span class="inline-flex items-center text-accent-orange">
              <i class="fas fa-clock mr-1"></i>
              ${accion.proxima_revision_formatted}
            </span>
          ` : ''}
          ${accion.calificacion ? `
            <span class="inline-flex items-center text-yellow-400">
              <i class="fas fa-star mr-1"></i>
              ${accion.calificacion}/10
            </span>
          ` : ''}
        </div>

        <!-- Acciones - 4 Botones Fijos Unificados -->
        <div class="flex space-x-2">
          <!-- Botón 1: Ir a Decretos -->
          <button 
            onclick="event.stopPropagation(); Agenda.verEnDecretos('${accion.id}')"
            class="group relative bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-400/50 text-blue-300 hover:text-blue-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
            title="Ver en Decretos"
          >
            <i class="fas fa-scroll text-sm"></i>
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <!-- Botón 2: Seguimiento -->
          <button 
            onclick="event.stopPropagation(); Agenda.abrirSeguimiento('${accion.id}')"
            class="group relative bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-400/50 text-green-300 hover:text-green-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
            title="Seguimiento"
          >
            <i class="fas fa-lock text-sm"></i>
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <!-- Botón 3: Cambiar Estado -->
          <button 
            onclick="event.stopPropagation(); Agenda.cambiarEstadoAccion('${accion.id}')"
            class="group relative bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-400/50 text-purple-300 hover:text-purple-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            title="${accion.estado === 'pendiente' ? 'Iniciar' : accion.estado === 'en_progreso' ? 'Completar' : 'Reiniciar'}"
          >
            <i class="fas fa-${accion.estado === 'pendiente' ? 'play' : accion.estado === 'en_progreso' ? 'check' : 'undo'} text-sm"></i>
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <!-- Botón 4: Borrar -->
          <button 
            onclick="event.stopPropagation(); Agenda.confirmarBorrarAccion('${accion.id}')"
            class="group relative bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-400/50 text-red-300 hover:text-red-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
            title="Borrar Acción"
          >
            <i class="fas fa-trash text-sm"></i>
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

      </div>
    `
  },

  // 🚀 CENTRO DE COMANDO EJECUTIVO COMPACTO - Versión 4ta Columna
  renderCentroComandoEjecutivoCompacto() {
    return `
      <div class="glassmorphism-card premium-shadow" style="height: 480px !important; min-height: 480px !important; max-height: 480px !important; overflow: hidden !important; display: flex !important; flex-direction: column !important;">
        <div class="p-4 flex-1">
          
          <!-- 🚀 Header Compacto -->
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center premium-glow">
              <i class="fas fa-rocket text-white text-sm"></i>
            </div>
            <h3 class="text-sm font-bold text-white tracking-tight">Comando</h3>
          </div>

          <!-- ⚡ ACCIONES COMPACTAS -->
          <div class="grid grid-cols-2 gap-2 mb-4">
            
            <!-- 🎯 Decreto Express -->
            <button onclick="ComandoEjecutivo.decretoExpress()" class="comando-btn-compacto comando-btn-green">
              <div class="flex flex-col items-center space-y-1 p-2">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center">
                  <i class="fas fa-bolt text-white text-xs"></i>
                </div>
                <div class="text-center">
                  <div class="font-bold text-white text-xs">Decreto</div>
                  <div class="text-xs text-slate-400">Express</div>
                </div>
              </div>
            </button>

            <!-- 📞 Reunión -->
            <button onclick="ComandoEjecutivo.reunionRapida()" class="comando-btn-compacto comando-btn-blue">
              <div class="flex flex-col items-center space-y-1 p-2">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center">
                  <i class="fas fa-video text-white text-xs"></i>
                </div>
                <div class="text-center">
                  <div class="font-bold text-white text-xs">Reunión</div>
                  <div class="text-xs text-slate-400">Express</div>
                </div>
              </div>
            </button>

            <!-- 🔒 Enfoque -->
            <button onclick="ComandoEjecutivo.tiempoProfundo()" class="comando-btn-compacto comando-btn-purple">
              <div class="flex flex-col items-center space-y-1 p-2">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-purple-600 flex items-center justify-center">
                  <i class="fas fa-brain text-white text-xs"></i>
                </div>
                <div class="text-center">
                  <div class="font-bold text-white text-xs">Enfoque</div>
                  <div class="text-xs text-slate-400">Profundo</div>
                </div>
              </div>
            </button>

            <!-- 📋 Review -->
            <button onclick="ComandoEjecutivo.reviewUrgente()" class="comando-btn-compacto comando-btn-orange">
              <div class="flex flex-col items-center space-y-1 p-2">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-orange to-amber-600 flex items-center justify-center">
                  <i class="fas fa-search text-white text-xs"></i>
                </div>
                <div class="text-center">
                  <div class="font-bold text-white text-xs">Review</div>
                  <div class="text-xs text-slate-400">Urgente</div>
                </div>
              </div>
            </button>

          </div>

          <!-- 📊 MÉTRICAS COMPACTAS -->
          <div class="space-y-2 mb-4">
            
            <div class="glassmorphism-card-inner p-2 text-center">
              <div class="text-lg font-bold text-accent-green">${this.calcularProductividadHoy()}%</div>
              <div class="text-xs text-slate-400">Productividad</div>
            </div>

            <div class="glassmorphism-card-inner p-2 text-center">
              <div class="text-lg font-bold text-accent-blue">${this.data.metricas?.completadas || 0}/${this.data.metricas?.total || 0}</div>
              <div class="text-xs text-slate-400">Decretos Hoy</div>
            </div>

          </div>

          <!-- 🔥 CRÍTICOS COMPACTOS -->
          <div class="mb-4">
            <h4 class="text-xs font-bold text-white mb-2 flex items-center">
              <i class="fas fa-fire text-accent-red mr-1"></i>
              Top Críticos
            </h4>
            <div class="space-y-1">
              ${this.renderTop3CriticosCompactos()}
            </div>
          </div>

          <!-- 🌍 CONTEXTO MINI -->
          <div class="text-xs text-slate-300 space-y-1">
            <div class="flex justify-between">
              <span>🌤️ 24°C</span>
              <span>📈 +2.1%</span>
            </div>
            <div class="text-center text-accent-green text-xs">
              💡 "Enfócate en lo importante"
            </div>
          </div>

        </div>
      </div>
    `
  },

  renderTop3CriticosCompactos() {
    const criticos = [
      { titulo: "Junta Directiva", tiempo: "30m" },
      { titulo: "Reporte Q3", tiempo: "2h" },
      { titulo: "Cliente Premium", tiempo: "15m" }
    ]

    return criticos.map((item, index) => `
      <div class="flex items-center justify-between p-2 bg-slate-800/20 rounded text-xs">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 rounded-full bg-gradient-to-br from-accent-red to-red-600 flex items-center justify-center text-white text-xs font-bold">
            ${index + 1}
          </div>
          <span class="text-white truncate">${item.titulo}</span>
        </div>
        <span class="text-slate-400">⏰ ${item.tiempo}</span>
      </div>
    `).join('')
  },

  // 🚀 CENTRO DE COMANDO EJECUTIVO ORIGINAL - LA JOYA DE LA CORONA
  renderCentroComandoEjecutivo() {
    return `
      <div class="glassmorphism-card premium-shadow">
        <div class="p-6">
          
          <!-- 🚀 Header Épico -->
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center premium-glow">
              <i class="fas fa-rocket text-white text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-white tracking-tight">Centro de Comando Ejecutivo</h2>
          </div>

          <!-- ⚡ ACCIONES RÁPIDAS EJECUTIVAS -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            
            <!-- 🎯 Decreto Express -->
            <button onclick="ComandoEjecutivo.decretoExpress()" class="comando-btn comando-btn-green">
              <div class="flex flex-col items-center space-y-2 p-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center premium-glow">
                  <i class="fas fa-bolt text-white text-lg"></i>
                </div>
                <div class="text-center">
                  <div class="font-bold text-white text-sm">Decreto Express</div>
                  <div class="text-xs text-slate-400">Crear en 30s</div>
                </div>
              </div>
            </button>

            <!-- 📞 Reunión Rápida -->
            <button onclick="ComandoEjecutivo.reunionRapida()" class="comando-btn comando-btn-blue">
              <div class="flex flex-col items-center space-y-2 p-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center premium-glow">
                  <i class="fas fa-video text-white text-lg"></i>
                </div>
                <div class="text-center">
                  <div class="font-bold text-white text-sm">Reunión Express</div>
                  <div class="text-xs text-slate-400">15/30/60 min</div>
                </div>
              </div>
            </button>

            <!-- 🔒 Tiempo Profundo -->
            <button onclick="ComandoEjecutivo.tiempoProfundo()" class="comando-btn comando-btn-purple">
              <div class="flex flex-col items-center space-y-2 p-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-purple-600 flex items-center justify-center premium-glow">
                  <i class="fas fa-brain text-white text-lg"></i>
                </div>
                <div class="text-center">
                  <div class="font-bold text-white text-sm">Tiempo Profundo</div>
                  <div class="text-xs text-slate-400">Bloquear 2-4h</div>
                </div>
              </div>
            </button>

            <!-- 📋 Review Urgente -->
            <button onclick="ComandoEjecutivo.reviewUrgente()" class="comando-btn comando-btn-orange">
              <div class="flex flex-col items-center space-y-2 p-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-orange to-amber-600 flex items-center justify-center premium-glow">
                  <i class="fas fa-search text-white text-lg"></i>
                </div>
                <div class="text-center">
                  <div class="font-bold text-white text-sm">Review Urgente</div>
                  <div class="text-xs text-slate-400">Analizar críticos</div>
                </div>
              </div>
            </button>

          </div>

          <!-- 📊 MÉTRICAS EJECUTIVAS LIVE -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            
            <!-- Productividad del Día -->
            <div class="glassmorphism-card-inner p-4 text-center">
              <div class="text-2xl font-bold text-accent-green">${this.calcularProductividadHoy()}%</div>
              <div class="text-xs text-slate-400">Productividad Hoy</div>
              <div class="text-xs text-accent-green">↗️ +12% vs ayer</div>
            </div>

            <!-- Decretos Completados -->
            <div class="glassmorphism-card-inner p-4 text-center">
              <div class="text-2xl font-bold text-accent-blue">${this.data.metricas?.completadas || 0}/${this.data.metricas?.total || 0}</div>
              <div class="text-xs text-slate-400">Decretos Hoy</div>
              <div class="text-xs text-accent-blue">🎯 ${Math.round((this.data.metricas?.completadas || 0) / Math.max(this.data.metricas?.total || 1, 1) * 100)}% completado</div>
            </div>

            <!-- Tiempo en Reuniones -->
            <div class="glassmorphism-card-inner p-4 text-center">
              <div class="text-2xl font-bold text-accent-purple">${this.calcularTiempoReuniones()}</div>
              <div class="text-xs text-slate-400">Reuniones Hoy</div>
              <div class="text-xs text-accent-purple">⏰ 2h enfoque restante</div>
            </div>

          </div>

          <!-- 🔥 TOP 3 CRÍTICOS -->
          <div class="mb-6">
            <h3 class="text-sm font-bold text-white mb-3 flex items-center">
              <i class="fas fa-fire text-accent-red mr-2"></i>
              Top 3 Críticos Hoy
            </h3>
            <div class="space-y-2">
              ${this.renderTop3Criticos()}
            </div>
          </div>

          <!-- 🌍 CONTEXTO EJECUTIVO -->
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center space-x-4 text-slate-300">
              <span>🌤️ 24°C</span>
              <span>📈 NASDAQ ↗️ 2.1%</span>
              <span>⏰ NY: ${this.obtenerHoraNY()}</span>
            </div>
            <div class="text-accent-green text-xs">
              💡 "El éxito es la suma de pequeños esfuerzos repetidos día tras día"
            </div>
          </div>

        </div>
      </div>
    `
  },

  // 📊 Funciones auxiliares para métricas
  calcularProductividadHoy() {
    const completadas = this.data.metricas?.completadas || 0
    const total = this.data.metricas?.total || 1
    return Math.round((completadas / total) * 100)
  },

  calcularTiempoReuniones() {
    // Simulación - en producción sería calculado real
    return "3.5h"
  },

  obtenerHoraNY() {
    const now = new Date()
    const nyTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}))
    return nyTime.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})
  },

  renderTop3Criticos() {
    // Por ahora simulación - en producción vendría de la base de datos
    const criticos = [
      { titulo: "Reunión Junta Directiva", tiempo: "30 min", urgencia: "alta" },
      { titulo: "Reporte Q3 Financial", tiempo: "2 horas", urgencia: "media" },
      { titulo: "Call Cliente Premium", tiempo: "15 min", urgencia: "alta" }
    ]

    return criticos.map((item, index) => `
      <div class="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 rounded-full bg-gradient-to-br from-accent-red to-red-600 flex items-center justify-center text-white text-xs font-bold">
            ${index + 1}
          </div>
          <div>
            <div class="text-white text-sm font-medium">${item.titulo}</div>
            <div class="text-slate-400 text-xs">⏰ ${item.tiempo}</div>
          </div>
        </div>
        <div class="text-${item.urgencia === 'alta' ? 'accent-red' : 'accent-orange'} text-xs font-medium">
          ${item.urgencia === 'alta' ? '🔥 URGENTE' : '⚠️ IMPORTANTE'}
        </div>
      </div>
    `).join('')
  },

  // 📝 RECORDATORIOS EXPRESS - Libreta Digital
  renderRecordatoriosExpress() {
    return `
      <div class="glassmorphism-card premium-shadow" style="height: 480px !important; min-height: 480px !important; max-height: 480px !important; overflow: hidden !important; display: flex !important; flex-direction: column !important;">
        <div class="p-4 flex-1 flex flex-col">
          
          <!-- 📝 Header -->
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-orange to-amber-600 flex items-center justify-center premium-glow">
              <i class="fas fa-sticky-note text-white text-sm"></i>
            </div>
            <h3 class="text-sm font-bold text-white tracking-tight">Recordatorios</h3>
          </div>

          <!-- ➕ Input Rápido -->
          <div class="mb-4">
            <div class="relative">
              <input 
                type="text" 
                id="nuevoRecordatorio"
                placeholder="Agregar recordatorio..."
                class="w-full p-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm placeholder-slate-400 focus:border-accent-orange focus:outline-none"
                onkeypress="if(event.key==='Enter') Recordatorios.agregar()"
              />
              <button 
                onclick="Recordatorios.agregar()"
                class="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-accent-orange to-amber-600 rounded-lg text-white text-xs hover:shadow-lg transition-all"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <!-- 🔍 Filtros Rápidos -->
          <div class="flex space-x-1 mb-3">
            <button 
              onclick="Recordatorios.filtrar('todos')" 
              class="filtro-btn filtro-activo text-xs px-2 py-1 rounded"
              data-filtro="todos"
            >
              Todos
            </button>
            <button 
              onclick="Recordatorios.filtrar('pendientes')" 
              class="filtro-btn text-xs px-2 py-1 rounded"
              data-filtro="pendientes"
            >
              Pendientes
            </button>
            <button 
              onclick="Recordatorios.filtrar('completados')" 
              class="filtro-btn text-xs px-2 py-1 rounded"
              data-filtro="completados"
            >
              ✅ Listos
            </button>
          </div>

          <!-- 📋 Lista de Recordatorios -->
          <div class="flex-1 overflow-y-auto pr-2" id="listaRecordatorios">
            ${this.renderListaRecordatorios()}
          </div>

          <!-- 📊 Contador -->
          <div class="pt-3 mt-3 border-t border-white/10 text-center">
            <div class="text-xs text-slate-400">
              <span id="contadorPendientes">${this.contarPendientes()}</span> pendientes
            </div>
          </div>

        </div>
      </div>
    `
  },

  renderListaRecordatorios() {
    // Simulación inicial - en producción vendría de localStorage o base de datos
    const recordatorios = this.obtenerRecordatorios()
    
    if (recordatorios.length === 0) {
      return `
        <div class="flex flex-col items-center justify-center h-full text-slate-400 text-center">
          <i class="fas fa-clipboard-list text-3xl mb-2 opacity-30"></i>
          <div class="text-xs">No hay recordatorios</div>
          <div class="text-xs opacity-70">Agrega uno arriba 👆</div>
        </div>
      `
    }

    return recordatorios.map(item => `
      <div class="recordatorio-item ${item.completado ? 'completado' : ''} mb-2 p-2 bg-slate-800/20 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all" data-id="${item.id}">
        <div class="flex items-center space-x-2">
          
          <!-- ✅ Checkbox -->
          <button 
            onclick="Recordatorios.toggle('${item.id}')"
            class="w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${item.completado ? 'bg-accent-green border-accent-green' : 'border-slate-500 hover:border-accent-green'}"
          >
            ${item.completado ? '<i class="fas fa-check text-white text-xs"></i>' : ''}
          </button>

          <!-- 📌 Prioridad -->
          <button 
            onclick="Recordatorios.togglePrioridad('${item.id}')"
            class="w-4 h-4 flex items-center justify-center transition-all ${item.prioridad ? 'text-accent-orange' : 'text-slate-600 hover:text-accent-orange'}"
          >
            <i class="fas fa-star text-xs"></i>
          </button>

          <!-- 📝 Texto -->
          <div class="flex-1 text-sm ${item.completado ? 'line-through text-slate-500' : 'text-white'}">
            ${item.texto}
          </div>

          <!-- 🗑️ Eliminar -->
          <button 
            onclick="Recordatorios.eliminar('${item.id}')"
            class="w-4 h-4 flex items-center justify-center text-slate-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
          >
            <i class="fas fa-times text-xs"></i>
          </button>

        </div>
      </div>
    `).join('')
  },

  obtenerRecordatorios() {
    // Simulación inicial
    return JSON.parse(localStorage.getItem('recordatorios') || '[]')
  },

  contarPendientes() {
    const recordatorios = this.obtenerRecordatorios()
    return recordatorios.filter(r => !r.completado).length
  },

  // 🔧 ARREGLO: Función para abrir modal de acciones igual que en decretos
  async abrirModalAccionComoDecretos(accionId, decretoId) {
    if (!accionId || !decretoId) {
      Utils.showToast('❌ Información de acción no disponible', 'error')
      return
    }
    
    try {
      console.log('🎯 Abriendo modal de acción desde agenda:', { accionId, decretoId })
      
      // Cambiar temporalmente a la sección de decretos
      const seccionAnterior = AppState.currentSection
      AppState.currentSection = 'decretos'
      
      // Cargar el decreto en decretos (necesario para que funcione el modal)
      await Decretos.openDetalleDecreto(decretoId)
      
      // Abrir el modal de seguimiento de la acción específica
      setTimeout(() => {
        if (typeof Decretos !== 'undefined' && Decretos.openSeguimientoModal) {
          Decretos.openSeguimientoModal(accionId)
        } else {
          console.error('❌ Función openSeguimientoModal no disponible')
          Utils.showToast('❌ Error al abrir detalles de acción', 'error')
        }
      }, 300)
      
    } catch (error) {
      console.error('❌ Error abriendo modal de acción:', error)
      Utils.showToast('❌ Error al cargar detalles de la acción', 'error')
    }
  }
}

// 🚀 COMANDO EJECUTIVO - Funciones de acción rápida
const ComandoEjecutivo = {
  
  async decretoExpress() {
    console.log('🎯 Decreto Express activado')
    
    // Crear modal express para decreto rápido
    const titulo = prompt('🎯 DECRETO EXPRESS\n\n¿Qué quieres decretar ahora?', '')
    if (!titulo) return
    
    const area = prompt('📂 Área del decreto:\n\n1️⃣ Empresarial\n2️⃣ Material  \n3️⃣ Humano\n\nEscribe el número:', '1')
    const areaMap = { '1': 'empresariales', '2': 'materiales', '3': 'humanos' }
    const areaFinal = areaMap[area] || 'empresariales'
    
    try {
      await Decretos.crearDecreto({
        titulo: `⚡ ${titulo}`,
        area: areaFinal,
        prioridad: 'alta',
        express: true
      })
      
      this.mostrarNotificacion('🎯 Decreto Express creado exitosamente!', 'success')
      Agenda.cargarDatos() // Recargar datos
      
    } catch (error) {
      console.error('Error creando decreto express:', error)
      this.mostrarNotificacion('❌ Error creando decreto', 'error')
    }
  },

  reunionRapida() {
    console.log('📞 Reunión Rápida activada')
    
    const opciones = `📞 REUNIÓN EXPRESS
    
1️⃣ Quick Call (15 min)
2️⃣ Reunión Estándar (30 min) 
3️⃣ Sesión Profunda (60 min)

¿Qué tipo de reunión?`
    
    const tipo = prompt(opciones, '2')
    const duraciones = { '1': 15, '2': 30, '3': 60 }
    const minutos = duraciones[tipo] || 30
    
    const titulo = prompt(`📞 Título de la reunión (${minutos} min):`, '')
    if (!titulo) return
    
    // Crear evento en calendario
    const ahora = new Date()
    const inicio = new Date(ahora.getTime() + (5 * 60000)) // En 5 minutos
    const fin = new Date(inicio.getTime() + (minutos * 60000))
    
    this.crearEventoRapido({
      titulo: `📞 ${titulo}`,
      inicio: inicio.toISOString(),
      fin: fin.toISOString(),
      tipo: 'reunion'
    })
  },

  tiempoProfundo() {
    console.log('🔒 Tiempo Profundo activado')
    
    const opciones = `🔒 TIEMPO PROFUNDO
    
1️⃣ Sprint Corto (2 horas)
2️⃣ Sesión Media (3 horas)
3️⃣ Deep Work (4 horas)

¿Cuánto tiempo necesitas?`
    
    const tipo = prompt(opciones, '2')
    const duraciones = { '1': 2, '2': 3, '3': 4 }
    const horas = duraciones[tipo] || 3
    
    const enfoque = prompt(`🧠 ¿En qué te vas a enfocar (${horas}h)?`, '')
    if (!enfoque) return
    
    // Bloquear tiempo en calendario
    const ahora = new Date()
    const inicio = new Date(ahora.getTime() + (10 * 60000)) // En 10 minutos
    const fin = new Date(inicio.getTime() + (horas * 3600000))
    
    this.crearEventoRapido({
      titulo: `🔒 ENFOQUE: ${enfoque}`,
      inicio: inicio.toISOString(),
      fin: fin.toISOString(),
      tipo: 'enfoque'
    })
  },

  reviewUrgente() {
    console.log('📋 Review Urgente activado')
    
    this.mostrarNotificacion('📋 Analizando decretos urgentes...', 'info')
    
    // Simular análisis
    setTimeout(() => {
      const mensaje = `📋 REVIEW URGENTE COMPLETADO
      
✅ 3 decretos requieren atención inmediata
🔄 2 decretos están en progreso  
⚠️ 1 decreto vence mañana

¿Quieres ver los detalles?`
      
      if (confirm(mensaje)) {
        // Abrir panorámica de pendientes
        document.querySelector('[data-section="panoramica-pendientes"]')?.scrollIntoView({ 
          behavior: 'smooth' 
        })
      }
    }, 1500)
  },

  async crearEventoRapido(evento) {
    try {
      // Aquí se conectaría con la API real
      console.log('Creando evento:', evento)
      
      this.mostrarNotificacion(`✅ ${evento.titulo} programado exitosamente!`, 'success')
      
      // Recargar calendario
      setTimeout(() => {
        Agenda.cargarDatos()
      }, 1000)
      
    } catch (error) {
      console.error('Error creando evento:', error)
      this.mostrarNotificacion('❌ Error programando evento', 'error')
    }
  },

  mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear notificación premium
    const notif = document.createElement('div')
    notif.className = `fixed top-4 right-4 z-50 p-4 rounded-lg border backdrop-blur-sm transition-all duration-500 transform translate-x-full`
    
    const colores = {
      success: 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100',
      error: 'bg-red-900/90 border-red-500/50 text-red-100', 
      info: 'bg-blue-900/90 border-blue-500/50 text-blue-100'
    }
    
    notif.className += ` ${colores[tipo] || colores.info}`
    notif.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="text-lg">
          ${tipo === 'success' ? '✅' : tipo === 'error' ? '❌' : 'ℹ️'}
        </div>
        <div class="font-medium">${mensaje}</div>
      </div>
    `
    
    document.body.appendChild(notif)
    
    // Animación de entrada
    setTimeout(() => {
      notif.style.transform = 'translateX(0)'
    }, 100)
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
      notif.style.transform = 'translateX(100%)'
      setTimeout(() => {
        document.body.removeChild(notif)
      }, 500)
    }, 4000)
  },

  // 🎯 FUNCIÓN PARA EDITAR ACCIÓN (como en Decretos)
  async editarAccion(accionId) {
    try {
      // Redirigir a Decretos para editar la acción
      Utils.showToast('🔄 Redirigiendo a editar acción...', 'info')
      
      // Cambiar a la sección Decretos
      App.currentSection = 'decretos'
      App.renderNavigation()
      
      // Cargar Decretos y abrir modal de edición
      await Decretos.init()
      
      // Buscar y abrir modal de edición
      setTimeout(() => {
        // Buscar la acción en la vista de Decretos y abrir su detalle
        const accionElement = document.querySelector(`[data-accion-id="${accionId}"]`)
        if (accionElement) {
          accionElement.click()
        } else {
          // Si no encuentra el elemento, intentar abrir directamente
          Decretos.openDetalleAccionModal(accionId)
        }
      }, 500)
      
    } catch (error) {
      console.error('Error al editar acción:', error)
      Utils.showToast('❌ Error al abrir edición de acción', 'error')
    }
  },

  // 🗑️ FUNCIÓN PARA CONFIRMAR BORRAR ACCIÓN (como en Decretos)
  confirmarBorrarAccion(accionId) {
    if (confirm('⚠️ ¿Estás seguro de que quieres eliminar esta acción?\n\nEsta acción no se puede deshacer.')) {
      this.borrarAccion(accionId)
    }
  },

  // 🗑️ FUNCIÓN PARA BORRAR ACCIÓN
  async borrarAccion(accionId) {
    try {
      const response = await fetch(`/api/decretos/acciones/${accionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        Utils.showToast('✅ Acción eliminada correctamente', 'success')
        // Recargar la vista actual
        this.loadPanoramicaPendientes()
      } else {
        const errorData = await response.json()
        Utils.showToast(`❌ Error: ${errorData.error || 'No se pudo eliminar la acción'}`, 'error')
      }
    } catch (error) {
      console.error('Error al borrar acción:', error)
      Utils.showToast('❌ Error de conexión al borrar acción', 'error')
    }
  },

  // 📜 VER EN DECRETOS - Mostrar acción específica en decretos
  verEnDecretos(accionId) {
    try {
      console.log('📜 Navegando a decretos para acción:', accionId)
      
      // Usar Router para navegar (método seguro)
      if (typeof Router !== 'undefined' && Router.navigate) {
        Router.navigate('decretos')
        
        // Buscar y resaltar después de que cargue
        setTimeout(() => {
          if (typeof Decretos !== 'undefined' && Decretos.resaltarAccionEnDecretos) {
            Decretos.resaltarAccionEnDecretos(accionId)
          }
        }, 1000)
        
        Utils.showToast('📜 Mostrando en decretos...', 'info')
      } else {
        // Fallback
        window.location.hash = '#decretos'
        Utils.showToast('📜 Redirigiendo a decretos...', 'info')
      }
      
    } catch (error) {
      console.error('❌ Error al ver en decretos:', error)
      Utils.showToast('❌ Error al abrir decretos', 'error')
    }
  },

  // 🔒 ABRIR SEGUIMIENTO - Redirigir a decretos para seguimiento  
  abrirSeguimiento(accionId) {
    try {
      console.log('🔒 Abriendo seguimiento para acción:', accionId)
      
      // Usar Router para navegar
      if (typeof Router !== 'undefined' && Router.navigate) {
        Router.navigate('decretos')
        
        // Abrir modal de seguimiento después de cargar
        setTimeout(() => {
          if (typeof Decretos !== 'undefined' && Decretos.openSeguimientoModal) {
            Decretos.openSeguimientoModal(accionId)
          }
        }, 1000)
        
        Utils.showToast('🔒 Abriendo seguimiento...', 'info')
      } else {
        Utils.showToast('❌ Error: Sistema de navegación no disponible', 'error')
      }
      
    } catch (error) {
      console.error('❌ Error al abrir seguimiento:', error)
      Utils.showToast('❌ Error al abrir seguimiento', 'error')
    }
  },

  // ⚡ CAMBIAR ESTADO - Botón inteligente como en Decretos
  async cambiarEstadoAccion(accionId) {
    try {
      // Buscar la acción en los datos actuales
      let accion = null
      
      // Buscar en panorámica de pendientes
      if (this.data.panoramicaPendientes && this.data.panoramicaPendientes.acciones) {
        accion = this.data.panoramicaPendientes.acciones.find(a => a.id === accionId)
      }
      
      // Si no se encuentra, buscar en timeline
      if (!accion && this.data.timeline) {
        accion = this.data.timeline.find(t => t.id === accionId)
      }
      
      if (!accion) {
        Utils.showToast('❌ Acción no encontrada', 'error')
        return
      }

      // Lógica de cambio de estado igual que en Decretos
      switch (accion.estado) {
        case 'pendiente':
          console.log('▶️ Iniciando acción desde agenda:', accionId)
          await API.decretos.iniciarAccion(accion.decreto_id, accionId)
          Utils.showToast('▶️ Acción iniciada - En Progreso', 'success')
          break
          
        case 'en_progreso':
          console.log('✅ Completando acción desde agenda:', accionId)
          await API.decretos.completarAccion(accion.decreto_id, accionId)
          Utils.showToast('✅ Acción completada', 'success')
          break
          
        case 'completada':
          if (confirm('¿Estás seguro de reiniciar esta acción? Volverá a estado pendiente.')) {
            console.log('🔄 Reiniciando acción desde agenda:', accionId)
            await API.decretos.marcarPendiente(accion.decreto_id, accionId)
            Utils.showToast('🔄 Acción reiniciada - Pendiente', 'success')
          } else {
            return
          }
          break
          
        default:
          Utils.showToast('❌ Estado de acción no reconocido', 'error')
          return
      }
      
      // Recargar vista actual
      this.loadPanoramicaPendientes()
      
    } catch (error) {
      console.error('❌ Error al cambiar estado desde agenda:', error)
      Utils.showToast('❌ Error al cambiar estado de acción', 'error')
    }
  }
}

// 📝 RECORDATORIOS EXPRESS - Sistema de notas rápidas
const Recordatorios = {
  
  filtroActual: 'todos',

  agregar() {
    const input = document.getElementById('nuevoRecordatorio')
    const texto = input.value.trim()
    
    if (!texto) return
    
    const recordatorios = this.obtener()
    const nuevo = {
      id: Date.now().toString(),
      texto: texto,
      completado: false,
      prioridad: false,
      fecha: new Date().toISOString()
    }
    
    recordatorios.unshift(nuevo) // Agregar al inicio
    this.guardar(recordatorios)
    
    input.value = ''
    input.focus()
    
    this.actualizar()
    this.mostrarNotificacion('📝 Recordatorio agregado', 'success')
  },

  toggle(id) {
    const recordatorios = this.obtener()
    const item = recordatorios.find(r => r.id === id)
    
    if (item) {
      item.completado = !item.completado
      this.guardar(recordatorios)
      this.actualizar()
      
      if (item.completado) {
        this.mostrarNotificacion('✅ Recordatorio completado', 'success')
      }
    }
  },

  togglePrioridad(id) {
    const recordatorios = this.obtener()
    const item = recordatorios.find(r => r.id === id)
    
    if (item) {
      item.prioridad = !item.prioridad
      this.guardar(recordatorios)
      this.actualizar()
    }
  },

  eliminar(id) {
    if (!confirm('¿Eliminar este recordatorio?')) return
    
    const recordatorios = this.obtener().filter(r => r.id !== id)
    this.guardar(recordatorios)
    this.actualizar()
    this.mostrarNotificacion('🗑️ Recordatorio eliminado', 'info')
  },

  filtrar(tipo) {
    this.filtroActual = tipo
    
    // Actualizar botones
    document.querySelectorAll('.filtro-btn').forEach(btn => {
      btn.classList.remove('filtro-activo')
    })
    document.querySelector(`[data-filtro="${tipo}"]`).classList.add('filtro-activo')
    
    this.actualizar()
  },

  actualizar() {
    const container = document.getElementById('listaRecordatorios')
    const contador = document.getElementById('contadorPendientes')
    
    if (container) {
      container.innerHTML = this.renderLista()
    }
    
    if (contador) {
      contador.textContent = this.contarPendientes()
    }
  },

  renderLista() {
    const todos = this.obtener()
    let recordatorios = todos
    
    // Aplicar filtro
    if (this.filtroActual === 'pendientes') {
      recordatorios = todos.filter(r => !r.completado)
    } else if (this.filtroActual === 'completados') {
      recordatorios = todos.filter(r => r.completado)
    }
    
    // Ordenar por prioridad y fecha
    recordatorios.sort((a, b) => {
      if (a.prioridad && !b.prioridad) return -1
      if (!a.prioridad && b.prioridad) return 1
      return new Date(b.fecha) - new Date(a.fecha)
    })
    
    if (recordatorios.length === 0) {
      const mensajes = {
        todos: 'No hay recordatorios',
        pendientes: 'Todo completado! 🎉',
        completados: 'Ninguno completado aún'
      }
      
      return `
        <div class="flex flex-col items-center justify-center h-full text-slate-400 text-center">
          <i class="fas fa-clipboard-list text-3xl mb-2 opacity-30"></i>
          <div class="text-xs">${mensajes[this.filtroActual]}</div>
          <div class="text-xs opacity-70">Agrega uno arriba 👆</div>
        </div>
      `
    }

    return recordatorios.map(item => `
      <div class="recordatorio-item ${item.completado ? 'completado' : ''} group mb-2 p-2 bg-slate-800/20 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all" data-id="${item.id}">
        <div class="flex items-center space-x-2">
          
          <!-- ✅ Checkbox -->
          <button 
            onclick="Recordatorios.toggle('${item.id}')"
            class="w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${item.completado ? 'bg-accent-green border-accent-green' : 'border-slate-500 hover:border-accent-green'}"
          >
            ${item.completado ? '<i class="fas fa-check text-white text-xs"></i>' : ''}
          </button>

          <!-- 📌 Prioridad -->
          <button 
            onclick="Recordatorios.togglePrioridad('${item.id}')"
            class="w-4 h-4 flex items-center justify-center transition-all ${item.prioridad ? 'text-accent-orange' : 'text-slate-600 hover:text-accent-orange'}"
          >
            <i class="fas fa-star text-xs"></i>
          </button>

          <!-- 📝 Texto -->
          <div class="flex-1 text-xs ${item.completado ? 'line-through text-slate-500' : 'text-white'}" title="${item.texto}">
            ${item.texto.length > 25 ? item.texto.substring(0, 25) + '...' : item.texto}
          </div>

          <!-- 🗑️ Eliminar -->
          <button 
            onclick="Recordatorios.eliminar('${item.id}')"
            class="w-4 h-4 flex items-center justify-center text-slate-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
          >
            <i class="fas fa-times text-xs"></i>
          </button>

        </div>
      </div>
    `).join('')
  },

  obtener() {
    return JSON.parse(localStorage.getItem('recordatorios') || '[]')
  },

  guardar(recordatorios) {
    localStorage.setItem('recordatorios', JSON.stringify(recordatorios))
  },

  contarPendientes() {
    return this.obtener().filter(r => !r.completado).length
  },

  mostrarNotificacion(mensaje, tipo = 'info') {
    // Reutilizar la función de ComandoEjecutivo
    if (typeof ComandoEjecutivo !== 'undefined') {
      ComandoEjecutivo.mostrarNotificación(mensaje, tipo)
    }
  }
}