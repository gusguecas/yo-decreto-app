// Módulo de Agenda
// CACHE BUST: 2025-10-20-13:05:00

const Agenda = {
  data: {
    selectedDate: (() => {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const formatted = `${year}-${month}-${day}`
      console.log('📅 Fecha inicial calculada:', formatted, '| Hora local:', today.toLocaleString())
      return formatted
    })(),
    currentMonth: dayjs().format('YYYY-MM'),
    eventos: {},
    timeline: [],
    originalTimeline: [], // Timeline sin filtrar
    metricas: {},
    enfoque: null,
    // 🎯 Vista activa: 'actual' o 'propuesta'
    vistaActiva: 'propuesta', // ✨ Por defecto mostrar Vista Propuesta con los 3 decretos del día
    // 🎯 NUEVO: 3 Decretos primarios del día desde Rutina Diaria
    decretosDelDia: null, // { empresarial: {...}, humano: {...}, material: {...} }
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
      console.error('Error al cargar agenda:', error)
      mainContent.innerHTML = this.renderError(error.message)
    }
  },

  async loadAgendaData() {
    const [year, month] = this.data.currentMonth.split('-')

    console.log('🔄 Cargando datos de agenda para fecha:', this.data.selectedDate)
    console.log('🆕🆕🆕 VERSION DEBUG 1.0.3 - FORCE CACHE BUST - Cargando Rutina Diaria...')

    // Cargar datos en paralelo (AGREGANDO Google Calendar Y Rutina Diaria)
    const [calendario, timeline, metricas, enfoque, panoramica, googleEvents, rutinaData] = await Promise.all([
      API.agenda.getCalendario(year, month),
      API.agenda.getTimeline(this.data.selectedDate),
      API.agenda.getMetricasDia(this.data.selectedDate),
      API.agenda.getEnfoque(this.data.selectedDate),
      // 🎯 NUEVO: Cargar panorámica de pendientes
      API.agenda.getPanoramicaPendientes(this.data.panoramicaPendientes.filtroArea, this.data.selectedDate),
      // 📅 NUEVO: Cargar eventos de Google Calendar
      API.googleCalendar.getEvents({
        startDate: this.data.selectedDate,
        endDate: dayjs(this.data.selectedDate).add(1, 'day').format('YYYY-MM-DD')
      }).catch(() => ({ success: false, data: [] })),
      // 🎯 NUEVO: Cargar 3 decretos primarios del día desde Rutina Diaria
      API.rutina.getToday().catch(() => ({ success: false, data: null }))
    ])

    console.log('📊 Respuesta timeline:', timeline)
    console.log('📅 Eventos timeline:', timeline.data)

    console.log('✅ Promise.all completado. Procesando rutinaData...')

    this.data.eventos = calendario.data.estados

    // 📅 Formatear eventos de Google Calendar
    const googleEventsFormatted = (googleEvents.success && googleEvents.data) ?
      googleEvents.data.map(evt => ({
        id: `gcal_${evt.id}`,
        titulo: `📅 ${evt.titulo}`,
        descripcion: evt.descripcion || '',
        fecha_evento: evt.fecha_inicio?.split('T')[0] || this.data.selectedDate,
        hora_evento: evt.fecha_inicio?.split('T')[1]?.substring(0, 5) || null,
        estado: 'pendiente',
        prioridad: 'media',
        tipo: 'google_calendar',
        decreto_titulo: 'Google Calendar',
        decreto_area: null
      })) : []

    // Combinar tareas locales + eventos de Google Calendar
    this.data.originalTimeline = [...timeline.data, ...googleEventsFormatted]
    this.data.timeline = [...this.data.originalTimeline] // Copia para filtrar
    this.data.metricas = metricas.data
    this.data.enfoque = enfoque.data

    // 🎯 NUEVO: Almacenar datos de panorámica
    if (panoramica.success) {
      this.data.panoramicaPendientes.acciones = panoramica.data.acciones || []
      this.data.panoramicaPendientes.estadisticas = panoramica.data.estadisticas || {}
      console.log('📊 Panorámica cargada:', {
        acciones: this.data.panoramicaPendientes.acciones.length,
        estadisticas: this.data.panoramicaPendientes.estadisticas
      })
    } else {
      console.error('❌ Error al cargar panorámica:', panoramica)
    }

    // 🎯 NUEVO: Almacenar datos de Rutina Diaria (3 decretos primarios del día)
    console.log('🔍 DEBUG: rutinaData recibido:', rutinaData)

    if (rutinaData && rutinaData.success && rutinaData.data) {
      this.data.decretosDelDia = rutinaData.data.primary || {}
      console.log('🎯 Decretos del día cargados:', {
        empresarial: this.data.decretosDelDia.empresarial?.titulo,
        humano: this.data.decretosDelDia.humano?.titulo,
        material: this.data.decretosDelDia.material?.titulo
      })
    } else {
      this.data.decretosDelDia = null
      console.warn('⚠️ No se pudieron cargar los decretos del día desde Rutina')
      console.warn('🔍 Razón:', {
        rutinaDataExists: !!rutinaData,
        success: rutinaData?.success,
        hasData: !!rutinaData?.data
      })
    }

    // Aplicar filtros después de cargar los datos
    this.aplicarFiltros()
  },

  renderAgendaView() {
    return `
      <div class="w-full px-6 py-8">
        <!-- Header moderno con toggle de vistas -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-4xl font-bold mb-2 flex items-center">
              <span class="text-3xl mr-3">📅</span>
              <span class="text-gradient-green">Mi Agenda Ejecutiva</span>
            </h1>
            <p class="text-slate-300">Organiza y prioriza tus tareas diarias</p>
          </div>

          <!-- 🎯 Toggle de Vistas -->
          <div class="flex items-center bg-slate-800 rounded-lg p-1">
            <button
              onclick="Agenda.cambiarVista('actual')"
              class="px-4 py-2 rounded-md transition-all ${this.data.vistaActiva === 'actual' ? 'bg-accent-green text-black font-semibold' : 'text-slate-300 hover:text-white'}"
            >
              Vista Actual
            </button>
            <button
              onclick="Agenda.cambiarVista('propuesta')"
              class="px-4 py-2 rounded-md transition-all ${this.data.vistaActiva === 'propuesta' ? 'bg-accent-purple text-white font-semibold' : 'text-slate-300 hover:text-white'}"
            >
              Vista Propuesta ✨
            </button>
          </div>
        </div>

        ${this.data.vistaActiva === 'actual' ? this.renderAgendaActual() : this.renderAgendaPropuesta()}
      </div>
    `
  },

  renderAgendaActual() {
    return `

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
          <div class="agenda-equal-heights">

            <!-- 📅 CALENDARIO ARTÍSTICO (1/4) -->
            <div style="flex: 1 !important;">
              ${this.renderCalendarioPremium()}
            </div>

            <!-- ⏰ TIMELINE CINEMATOGRÁFICO (MÁS ANCHO - 2.3x) -->
            <div style="flex: 2.3 !important;">
              ${this.renderTimelineCinematografico()}
            </div>

            <!-- 🎛️ PANEL DE CONTROL FUTURISTA (MÁS PEQUEÑO - 0.7x) -->
            <div style="flex: 0.7 !important;">
              ${this.renderPanelControlFuturista()}
            </div>

            <!-- 📝 RECORDATORIOS EXPRESS (1/4) -->
            <div style="flex: 1 !important;">
              ${this.renderRecordatoriosExpress()}
            </div>

          </div>

          <!-- 🎯 PANORÁMICA MAESTRA - Dashboard de Pendientes -->
          <div class="w-full mt-12" data-section="panoramica-pendientes">
            ${this.renderPanoramicaMaestra()}
          </div>
          
        </div>

        <!-- Botón crear acción -->
        <div class="fixed bottom-6 right-6 z-50">
          <button
            onclick="Decretos.openUniversalAccionModal()"
            class="bg-accent-green hover:bg-green-600 text-black w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-xl font-bold transform hover:scale-110 transition-all duration-200 border-2 border-green-400"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
    `
  },

  renderAgendaPropuesta() {
    return `
      <!-- 🎯 VISTA PROPUESTA: "Name It & Claim It" -->
      <div class="space-y-6">

        <!-- Enfoque del día DESTACADO -->
        ${this.renderEnfoqueDiaDestacado()}

        <!-- Grid de 3 columnas: Timeline | Primarias | Secundarias -->
        <div class="grid grid-cols-12 gap-6">

          <!-- COLUMNA 1: Timeline del día (40% = 5 cols) -->
          <div class="col-span-5">
            ${this.renderTimelinePropuesto()}
          </div>

          <!-- COLUMNA 2: Acciones Primarias (30% = 3.5 cols) -->
          <div class="col-span-3">
            ${this.renderAccionesPrimarias()}
          </div>

          <!-- COLUMNA 3: Acciones Secundarias (30% = 3.5 cols) -->
          <div class="col-span-4">
            ${this.renderAccionesSecundarias()}
          </div>

        </div>

        <!-- Progreso del día -->
        ${this.renderProgresoDia()}

        <!-- Panorámica de Acciones Pendientes (para arrastrar a secundarias) -->
        <div id="panoramica-container">
          ${this.renderPanoramicaMaestra()}
        </div>

        <!-- Botón crear acción -->
        <div class="fixed bottom-6 right-6 z-50">
          <button
            onclick="Decretos.openUniversalAccionModal()"
            class="bg-accent-purple hover:bg-purple-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-xl font-bold transform hover:scale-110 transition-all duration-200 border-2 border-purple-400"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    `
  },

  // Función para cambiar entre vistas
  async cambiarVista(vista) {
    this.data.vistaActiva = vista
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = this.renderAgendaView()

    // Ya no hacemos auto-agenda automáticamente
    // El usuario debe hacer click en el botón "Auto-agendar los 3 decretos"
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
    console.log('📅 Seleccionando fecha:', date)
    this.data.selectedDate = date

    // Cargar solo los datos necesarios del día
    const [timeline, metricas, enfoque, googleEvents] = await Promise.all([
      API.agenda.getTimeline(this.data.selectedDate),
      API.agenda.getMetricasDia(this.data.selectedDate),
      API.agenda.getEnfoque(this.data.selectedDate),
      API.googleCalendar.getEvents({
        startDate: this.data.selectedDate,
        endDate: dayjs(this.data.selectedDate).add(1, 'day').format('YYYY-MM-DD')
      }).catch(() => ({ success: false, data: [] }))
    ])

    // Formatear eventos de Google Calendar
    const googleEventsFormatted = (googleEvents.success && googleEvents.data) ?
      googleEvents.data.map(evt => ({
        id: `gcal_${evt.id}`,
        titulo: `📅 ${evt.titulo}`,
        descripcion: evt.descripcion || '',
        fecha_evento: evt.fecha_inicio?.split('T')[0] || this.data.selectedDate,
        hora_evento: evt.fecha_inicio?.split('T')[1]?.substring(0, 5) || null,
        estado: 'pendiente',
        prioridad: 'media',
        tipo: 'google_calendar',
        decreto_titulo: 'Google Calendar',
        decreto_area: null
      })) : []

    // Actualizar datos
    this.data.originalTimeline = [...timeline.data, ...googleEventsFormatted]
    this.data.timeline = [...this.data.originalTimeline]
    this.data.metricas = metricas.data
    this.data.enfoque = enfoque.data

    // Aplicar filtros
    this.aplicarFiltros()

    // 🎯 SIMPLIFICADO: Recargar la vista completa en lugar de actualizar secciones
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.innerHTML = this.renderAgendaView()
      return
    }

    // Fallback: Actualizar solo las secciones necesarias (Vista Actual)
    const timelineContainer = document.querySelector('[data-section="timeline"]')
    const panelControlContainer = document.querySelector('[data-section="panel-control"]')
    const recordatoriosContainer = document.querySelector('[data-section="recordatorios"]')
    const calendarioContainer = document.querySelector('[data-section="calendario"]')

    if (timelineContainer) {
      timelineContainer.outerHTML = this.renderTimelineCinematografico()
    }
    if (panelControlContainer) {
      panelControlContainer.outerHTML = this.renderPanelControlFuturista()
    }
    if (recordatoriosContainer) {
      recordatoriosContainer.outerHTML = this.renderRecordatoriosExpress()
    }
    if (calendarioContainer) {
      calendarioContainer.outerHTML = this.renderCalendarioPremium()
    }

    console.log('✅ Vista actualizada para:', date)
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

  renderError(message = '') {
    return `
      <div class="container mx-auto px-4 py-8 text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold mb-4">Error al cargar agenda</h2>
        <p class="text-slate-400 mb-6">No se pudo cargar la información de la agenda.</p>
        ${message ? `<p class="text-red-400 text-sm mb-4">Detalles: ${message}</p>` : ''}
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
            <!-- Navegación de fechas -->
            <button
              onclick="Agenda.selectDate('${dayjs(this.data.selectedDate).subtract(1, 'day').format('YYYY-MM-DD')}')"
              class="btn-secondary text-sm px-2 py-1 hover:bg-slate-700"
              title="Día anterior"
            >
              <i class="fas fa-chevron-left"></i>
            </button>

            <span class="text-sm font-medium text-slate-200 px-2">
              ${dayjs(this.data.selectedDate).locale('es').format('ddd, D MMM')}
            </span>

            <button
              onclick="Agenda.selectDate('${dayjs(this.data.selectedDate).add(1, 'day').format('YYYY-MM-DD')}')"
              class="btn-secondary text-sm px-2 py-1 hover:bg-slate-700"
              title="Día siguiente"
            >
              <i class="fas fa-chevron-right"></i>
            </button>

            <button
              onclick="Agenda.selectDate('${dayjs().format('YYYY-MM-DD')}')"
              class="btn-primary text-sm px-3 py-1 ml-2"
              title="Volver a hoy"
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
        Utils.showToast('🗑️ Tarea eliminada', 'success')
        // Recargar la agenda para reflejar cambios
        await this.loadAgendaData()
        const mainContent = document.getElementById('main-content')
        mainContent.innerHTML = this.renderAgendaView()
      } else {
        throw new Error('Error al eliminar tarea')
      }
    } catch (error) {
      console.error('❌ Error eliminando tarea:', error)
      Utils.showToast('❌ Error al eliminar tarea', 'error')
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

  async cambiarEstadoTarea(tareaId) {
    try {
      const tarea = this.data.timeline?.find(t => t.id === tareaId)
      if (!tarea) {
        Utils.showToast('❌ Tarea no encontrada', 'error')
        return
      }

      if (tarea.estado === 'completada') {
        // Si está completada, marcar como pendiente
        await this.marcarPendiente(tareaId)
      } else {
        // Si está pendiente o en progreso, completar
        await this.completarTarea(tareaId)
      }
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error)
      Utils.showToast('❌ Error al cambiar estado de tarea', 'error')
    }
  },

  confirmarBorrarTarea(tareaId) {
    const tarea = this.data.timeline?.find(t => t.id === tareaId)
    if (!tarea) return

    if (confirm(`¿Estás seguro de que quieres borrar la tarea "${tarea.titulo}"?`)) {
      this.eliminarTarea(tareaId)
    }
  },

  // Funciones para acciones en Panorámica
  openSeguimientoModalAccion(accionId) {
    try {
      console.log('📊 Abriendo modal de seguimiento para acción:', accionId)

      if (typeof Decretos !== 'undefined' && typeof Decretos.openSeguimientoModal === 'function') {
        Decretos.openSeguimientoModal(accionId)
      } else {
        console.warn('Función Decretos.openSeguimientoModal no disponible')
        Utils.showToast('⚠️ Función de seguimiento no disponible', 'warning')
      }
    } catch (error) {
      console.error('❌ Error abriendo seguimiento:', error)
      Utils.showToast('❌ Error abriendo seguimiento', 'error')
    }
  },

  async cambiarEstadoAccion(accionId) {
    try {
      const accion = this.data.panoramicaPendientes.acciones?.find(a => a.id === accionId)
      if (!accion) {
        Utils.showToast('❌ Acción no encontrada', 'error')
        return
      }

      if (typeof Decretos !== 'undefined' && typeof Decretos.cambiarEstadoAccion === 'function') {
        await Decretos.cambiarEstadoAccion(accionId)
        // Recargar panorámica
        await this.refrescarPanoramica()
        this.render()
      } else {
        console.warn('Función Decretos.cambiarEstadoAccion no disponible')
        Utils.showToast('⚠️ Función no disponible', 'warning')
      }
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error)
      Utils.showToast('❌ Error al cambiar estado de acción', 'error')
    }
  },

  confirmarBorrarAccion(accionId) {
    const accion = this.data.panoramicaPendientes.acciones?.find(a => a.id === accionId)
    if (!accion) return

    if (confirm(`¿Estás seguro de que quieres borrar la acción "${accion.titulo}"?`)) {
      this.borrarAccion(accionId)
    }
  },

  async borrarAccion(accionId) {
    try {
      console.log('🗑️ Borrando acción:', accionId)

      // Llamar directamente al endpoint de agenda
      await API.agenda.deleteTarea(accionId)

      Utils.showToast('🗑️ Acción eliminada', 'success')

      // Recargar agenda
      await this.loadAgendaData()
      const mainContent = document.getElementById('main-content')
      mainContent.innerHTML = this.renderAgendaView()
    } catch (error) {
      console.error('❌ Error al borrar acción:', error)
      Utils.showToast('❌ Error al borrar acción', 'error')
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
              onclick="Agenda.autoAgendarDia()"
              class="btn-success px-3 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700"
              title="Auto-agenda acciones en espacios libres de tu Google Calendar"
            >
              <i class="fas fa-magic mr-2"></i>Auto-agendar mi día
            </button>
            <button
              onclick="Agenda.exportarPendientes()"
              class="btn-secondary px-3 py-2 text-sm rounded-lg"
            >
              <i class="fas fa-download mr-2"></i>Exportar
            </button>
            <button
              onclick="Decretos.openUniversalAccionModal()"
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
      <div
        class="border-l-4 ${colorClass} p-4 rounded-r-lg hover:bg-slate-700/50 transition-colors group cursor-move"
        draggable="true"
        ondragstart="Agenda.onDragStartAccion(event, '${accion.id}')"
        ondragend="Agenda.onDragEndAccion(event)"
      >
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
              onclick="Agenda.openDetalleTarea('${accion.id}')"
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
      const panoramica = await API.agenda.getPanoramicaPendientes(area, this.data.selectedDate)
      
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
      const panoramica = await API.agenda.getPanoramicaPendientes(area, this.data.selectedDate)
      
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

  // 🤖 ============ AUTO-SCHEDULING ============

  async autoAgendarDia() {
    console.log('🤖 Iniciando auto-scheduling')

    try {
      // Mostrar confirmación con opciones
      const confirmar = confirm(
        '🤖 Auto-agendar mi día\n\n' +
        'Esto analizará tu Google Calendar y agendará automáticamente tus acciones pendientes en los espacios libres.\n\n' +
        '¿Deseas continuar?'
      )

      if (!confirmar) {
        return
      }

      // Mostrar loading
      Utils.showToast('🤖 Analizando tu calendario...', 'info')

      const fecha = this.data.selectedDate || dayjs().format('YYYY-MM-DD')

      // Llamar al endpoint
      const result = await API.agenda.autoSchedule({
        fecha: fecha,
        horaInicio: '08:00',
        horaFin: '20:00',
        exportToGoogle: confirm(
          '📅 ¿Deseas exportar las acciones agendadas a Google Calendar?\n\n' +
          'Esto creará eventos automáticamente en tu calendario.'
        )
      })

      if (result.success) {
        const data = result.data

        // Mostrar resultado
        const mensaje = `
✅ Auto-scheduling completado!

📊 Resultados:
• ${data.accionesAgendadas} acciones agendadas
• ${data.accionesNoAgendadas} acciones sin espacio
• ${data.espaciosLibresEncontrados} espacios libres encontrados
${data.accionesExportadas > 0 ? `• ${data.accionesExportadas} acciones exportadas a Google Calendar` : ''}

${data.detalles && data.detalles.length > 0 ? '\n📋 Acciones agendadas:\n' + data.detalles.map(a => `• ${a.titulo} - ${a.hora}`).join('\n') : ''}
        `.trim()

        Utils.showToast(mensaje, 'success')

        // Recargar la vista
        await this.loadAgendaData(fecha)

      } else {
        Utils.showToast(`❌ Error: ${result.error}`, 'error')
      }

    } catch (error) {
      console.error('❌ Error en auto-scheduling:', error)
      Utils.showToast('❌ Error al auto-agendar. Verifica tu conexión con Google Calendar.', 'error')
    }
  },

  // 🎨 ============ COMPONENTES DE DISEÑO PREMIUM ============

  renderCalendarioPremium() {
    const currentDate = dayjs(this.data.currentMonth)
    const today = dayjs()
    const selectedDate = dayjs(this.data.selectedDate)

    return `
      <div class="glassmorphism-card premium-shadow" data-section="calendario" style="height: 480px !important; min-height: 480px !important; max-height: 480px !important; overflow: hidden !important; border: 2px solid #10b981 !important; display: flex !important; flex-direction: column !important;">
        <!-- Header Elegante con Glassmorphism -->
        <div class="p-4 border-b border-white/10" style="flex-shrink: 0;">
          <div class="flex items-center justify-between mb-2">
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
        </div>

        <!-- Grid del Calendario con Efectos Premium -->
        <div class="px-3 pb-3 flex-1" style="display: flex; flex-direction: column;">
          <div class="grid grid-cols-7 gap-1 mb-2" style="flex-shrink: 0;">
            ${['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(day => `
              <div class="text-center text-sm font-bold text-slate-400 py-2 tracking-wider">${day}</div>
            `).join('')}
          </div>

          <div class="grid grid-cols-7 gap-2 flex-1" style="grid-auto-rows: 1fr;">
            ${this.renderCalendarioDiasPremium()}
          </div>

          <!-- Leyenda Premium -->
          <div class="mt-2 pt-2 border-t border-white/10" style="flex-shrink: 0;">
            <div class="flex items-center justify-center space-x-3 text-xs">
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 rounded-full bg-accent-green premium-pulse"></div>
                <span class="text-slate-400">Completo</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 rounded-full bg-accent-orange premium-pulse"></div>
                <span class="text-slate-400">Pendiente</span>
              </div>
              <div class="flex items-center space-x-1">
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
      
      // Estilos especiales para el día seleccionado
      let dayStyle = 'min-height: 50px; display: flex; align-items: center; justify-content: center; position: relative;'
      if (isSelected && isCurrentMonth) {
        dayStyle += ' background: #10b981; color: white; font-weight: bold; border-radius: 8px;'
      } else if (isToday && isCurrentMonth) {
        dayStyle += ' border: 2px solid #10b981; color: #10b981; font-weight: bold; border-radius: 8px;'
      }

      calendarHTML += `
        <div
          class="${dayClasses}"
          onclick="Agenda.selectDate('${dayKey}')"
          style="${dayStyle}"
        >
          <span class="relative z-10 text-lg font-semibold">${currentCalendarDate.format('D')}</span>
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

    return `
      <div class="glassmorphism-card premium-shadow" data-section="timeline" style="height: 480px !important; min-height: 480px !important; max-height: 480px !important; overflow: hidden !important; border: 2px solid #10b981 !important;">
        <!-- Header Cinematográfico -->
        <div class="p-4 border-b border-white/10">
          <div class="flex items-center space-x-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center premium-glow">
              <i class="fas fa-clock text-white text-sm"></i>
            </div>
            <div>
              <h3 class="font-bold text-white tracking-tight">Timeline Hoy</h3>
              <p class="text-xs text-slate-400 font-medium capitalize">${hoyFormatted}</p>
            </div>
          </div>

          <!-- Navegación de fechas -->
          <div class="flex items-center justify-center space-x-2 mt-3">
            <button
              onclick="Agenda.selectDate('${dayjs(this.data.selectedDate).subtract(1, 'day').format('YYYY-MM-DD')}')"
              class="btn-secondary text-xs px-2 py-1 hover:bg-slate-700"
              title="Día anterior"
            >
              <i class="fas fa-chevron-left"></i>
            </button>

            <span class="text-xs font-medium text-slate-200 px-2">
              ${dayjs(this.data.selectedDate).locale('es').format('ddd, D MMM')}
            </span>

            <button
              onclick="Agenda.selectDate('${dayjs(this.data.selectedDate).add(1, 'day').format('YYYY-MM-DD')}')"
              class="btn-secondary text-xs px-2 py-1 hover:bg-slate-700"
              title="Día siguiente"
            >
              <i class="fas fa-chevron-right"></i>
            </button>

            <button
              onclick="Agenda.selectDate('${dayjs().format('YYYY-MM-DD')}')"
              class="btn-primary text-xs px-2 py-1 ml-2"
              title="Volver a hoy"
            >
              Hoy
            </button>
          </div>
        </div>

        <!-- Timeline Vertical con Scroll -->
        <div class="h-80 overflow-y-auto premium-scroll p-4">
          ${timeline.length === 0 ? `
            <div class="flex flex-col items-center justify-center h-full text-center">
              <div class="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
                <i class="fas fa-calendar-check text-slate-600 text-xl"></i>
              </div>
              <p class="text-slate-400 text-base font-medium">No hay tareas programadas</p>
              <p class="text-slate-500 text-sm">para este día</p>
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
            onclick="Decretos.openUniversalAccionModal()"
            class="w-full premium-btn-primary"
          >
            <i class="fas fa-plus mr-2"></i>
            Nueva Acción
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

    // Determinar ÁREA/ORIGEN (color + icono)
    let areaConfig = {
      color: '#6b7280', // gris por defecto
      icon: '📋',
      nombre: 'General'
    }

    if (tarea.tipo === 'google_calendar') {
      areaConfig = {
        color: '#8b5cf6', // Morado
        icon: '📅',
        nombre: 'Google Calendar'
      }
    } else if (tarea.area === 'empresarial') {
      areaConfig = {
        color: '#10b981', // Verde
        icon: '💼',
        nombre: 'Empresarial'
      }
    } else if (tarea.area === 'material') {
      areaConfig = {
        color: '#f59e0b', // Amarillo
        icon: '💰',
        nombre: 'Material'
      }
    } else if (tarea.area === 'humano') {
      areaConfig = {
        color: '#3b82f6', // Azul
        icon: '❤️',
        nombre: 'Humana'
      }
    }

    // Determinar si es PRIMARIA o SECUNDARIA
    const esPrimaria = tarea.tipo === 'primaria'
    const bordeGrosor = esPrimaria ? '4px' : '2px'

    return `
      <div class="timeline-item-cinematografico ${estadoClass} fade-in-timeline" style="animation-delay: ${index * 0.1}s">
        <!-- Línea Temporal -->
        <div class="timeline-connector"></div>

        <!-- Card de Tarea -->
        <div class="timeline-card cursor-pointer" data-evento-id="${tarea.id}"
             onclick="Agenda.openDetalleTarea('${tarea.id}')"
             style="border-left: ${bordeGrosor} solid ${areaConfig.color}; position: relative; background: transparent !important; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 16px; margin-bottom: 16px;">

          <!-- Badge de PRIMARIA (solo si es primaria) -->
          ${esPrimaria ? `
            <div class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold"
                 style="background: ${areaConfig.color}; color: white;">
              ⭐ PRIMARIA
            </div>
          ` : ''}

          <div class="flex items-start space-x-3">
            <!-- Icono de Área -->
            <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-2xl">
              ${areaConfig.icon}
            </div>

            <!-- Contenido -->
            <div class="flex-1 min-w-0">
              <!-- Hora -->
              <div class="text-sm font-mono font-bold mb-1" style="color: ${areaConfig.color};">
                ${horaFormateada}
              </div>

              <!-- Título -->
              <div class="flex items-center space-x-2 mb-1">
                <span class="text-base">${prioridadIcon}</span>
                <h4 class="font-medium text-white text-base truncate hover:text-accent-green transition-colors">${tarea.titulo}</h4>
              </div>

              ${tarea.decreto_titulo ? `
                <p class="text-sm text-slate-400 truncate mb-1">${tarea.decreto_titulo}</p>
              ` : ''}

              <!-- Área/Origen -->
              <p class="text-xs font-semibold mb-1" style="color: ${areaConfig.color};">
                ${areaConfig.nombre}
              </p>

              ${tarea.descripcion ? `
                <p class="text-sm text-slate-500 line-clamp-2">${tarea.descripcion}</p>
              ` : ''}
            </div>
          </div>

          <!-- Actions Flotantes - Movidos debajo del badge cuando es primaria -->
          <div class="flex justify-end space-x-2 mt-2 pr-2">
            <button
              onclick="event.stopPropagation(); Agenda.openSeguimientoModal('${tarea.id}')"
              class="group relative bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-400/50 text-green-300 hover:text-green-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
              title="Seguimiento"
            >
              <i class="fas fa-lock text-sm"></i>
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button
              onclick="event.stopPropagation(); Agenda.cambiarEstadoTarea('${tarea.id}')"
              class="group relative bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-400/50 text-purple-300 hover:text-purple-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              title="${tarea.estado === 'completada' ? 'Marcar pendiente' : 'Completar tarea'}"
            >
              <i class="fas fa-${tarea.estado === 'completada' ? 'undo' : 'check'} text-sm"></i>
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button
              onclick="event.stopPropagation(); Agenda.confirmarBorrarTarea('${tarea.id}')"
              class="group relative bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-400/50 text-red-300 hover:text-red-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
              title="Borrar"
            >
              <i class="fas fa-trash text-sm"></i>
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
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
      <div class="glassmorphism-card premium-shadow" data-section="panel-control" style="height: 480px !important; min-height: 480px !important; max-height: 480px !important; overflow: hidden !important; display: flex !important; flex-direction: column !important; border: 2px solid #10b981 !important;">
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

    console.log('🎨 Renderizando Panorámica Maestra:', {
      acciones: acciones?.length,
      estadisticas,
      data: this.data.panoramicaPendientes
    })

    if (!acciones || acciones.length === 0) {
      return `
        <div class="glassmorphism-card premium-shadow text-center p-12">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center mx-auto mb-6 premium-glow">
            <i class="fas fa-trophy text-white text-2xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">¡Sin Acciones Pendientes!</h3>
          <p class="text-slate-300 text-lg">No hay acciones sin agendar disponibles</p>
          <p class="text-slate-400 text-sm mt-2">Todas tus acciones están agendadas o completadas 🎉</p>
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

        <!-- Grid por Áreas: 3 columnas -->
        <div class="p-6">
          <div class="mb-4 text-center">
            <p class="text-sm text-slate-400 italic">💡 Arrastra acciones hacia la columna de <span class="text-accent-green font-semibold">Acciones Secundarias</span> arriba</p>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Columna Empresarial -->
            <div class="space-y-4 border-2 border-green-500/30 rounded-lg p-4">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <i class="fas fa-briefcase text-white"></i>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">Empresarial</h3>
                  <p class="text-xs text-slate-400">${acciones.filter(a => a.area === 'empresarial').length} pendientes</p>
                </div>
              </div>
              ${acciones.filter(a => a.area === 'empresarial').length > 0
                ? acciones.filter(a => a.area === 'empresarial').map((accion, index) => this.renderAccionMaestra(accion, index)).join('')
                : '<p class="text-slate-400 text-sm text-center py-8">✨ Sin pendientes</p>'
              }
            </div>

            <!-- Columna Material -->
            <div class="space-y-4 border-2 border-green-500/30 rounded-lg p-4">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <i class="fas fa-coins text-white"></i>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">Material</h3>
                  <p class="text-xs text-slate-400">${acciones.filter(a => a.area === 'material').length} pendientes</p>
                </div>
              </div>
              ${acciones.filter(a => a.area === 'material').length > 0
                ? acciones.filter(a => a.area === 'material').map((accion, index) => this.renderAccionMaestra(accion, index)).join('')
                : '<p class="text-slate-400 text-sm text-center py-8">✨ Sin pendientes</p>'
              }
            </div>

            <!-- Columna Humana -->
            <div class="space-y-4 border-2 border-green-500/30 rounded-lg p-4">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <i class="fas fa-heart text-white"></i>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">Humana</h3>
                  <p class="text-xs text-slate-400">${acciones.filter(a => a.area === 'humano').length} pendientes</p>
                </div>
              </div>
              ${acciones.filter(a => a.area === 'humano').length > 0
                ? acciones.filter(a => a.area === 'humano').map((accion, index) => this.renderAccionMaestra(accion, index)).join('')
                : '<p class="text-slate-400 text-sm text-center py-8">✨ Sin pendientes</p>'
              }
            </div>
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
    const stats = [
      { 
        label: 'Total Pendientes', 
        value: estadisticas.total || 0, 
        icon: 'fas fa-tasks',
        gradient: 'from-accent-green to-emerald-600',
        glow: 'premium-glow-green'
      },
      { 
        label: 'Días Promedio', 
        value: estadisticas.antiguedad_promedio || 0, 
        icon: 'fas fa-calendar-day',
        gradient: 'from-accent-orange to-orange-600',
        glow: 'premium-glow-orange'
      },
      { 
        label: 'Con Revisión', 
        value: estadisticas.con_revision_pendiente || 0, 
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

    // Determinar color del decreto por área
    let decretoColor = '#3b82f6' // azul por defecto
    if (accion.area === 'empresarial') {
      decretoColor = '#10b981' // verde
    } else if (accion.area === 'material') {
      decretoColor = '#f59e0b' // amarillo
    } else if (accion.area === 'humano') {
      decretoColor = '#3b82f6' // azul
    }
    
    return `
      <div class="accion-maestra-card ${config.pulse} fade-in-masonry cursor-move"
           style="animation-delay: ${index * 0.05}s; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 16px; margin-bottom: 16px;"
           draggable="true"
           ondragstart="Agenda.onDragStartAccion(event, '${accion.id}')"
           ondragend="Agenda.onDragEndAccion(event)">

        <!-- Header de la Acción -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-2">
            <span class="text-lg ${config.pulse}">${config.icon}</span>
            <div class="text-xs text-slate-400">
              <span class="font-mono">#${(index + 1).toString().padStart(2, '0')}</span>
            </div>
          </div>
          <div class="text-xs text-slate-500">${accion.dias_desde_creacion}d</div>
        </div>

        <!-- Título y Decreto -->
        <div class="mb-3 cursor-pointer" onclick="Agenda.openDetalleTarea('${accion.id}')">
          <h4 class="text-lg font-bold text-white mb-1 line-clamp-2 hover:text-accent-green transition-colors">
            ${accion.titulo}
          </h4>
          <p class="text-xs line-clamp-1 text-slate-400" style="color: ${decretoColor};">${accion.decreto_titulo}</p>
        </div>

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

        <!-- Acciones -->
        <div class="flex justify-end space-x-2 mt-2 pr-2">
          <button
            onclick="Agenda.openSeguimientoModalAccion('${accion.id}')"
            class="group relative bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-400/50 text-green-300 hover:text-green-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
            title="Seguimiento"
          >
            <i class="fas fa-lock text-sm"></i>
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          <button
            onclick="Agenda.cambiarEstadoAccion('${accion.id}')"
            class="group relative bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-400/50 text-purple-300 hover:text-purple-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            title="${accion.estado === 'completada' ? 'Marcar pendiente' : 'Completar'}"
          >
            <i class="fas fa-${accion.estado === 'completada' ? 'undo' : 'check'} text-sm"></i>
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          <button
            onclick="Agenda.confirmarBorrarAccion('${accion.id}')"
            class="group relative bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-400/50 text-red-300 hover:text-red-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
            title="Borrar"
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
      <div class="glassmorphism-card premium-shadow" style="height: 480px !important; min-height: 480px !important; max-height: 480px !important; overflow: hidden !important; display: flex !important; flex-direction: column !important; border: 2px solid #10b981 !important;">
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
      <div class="glassmorphism-card premium-shadow" data-section="recordatorios" style="height: 480px !important; min-height: 480px !important; max-height: 480px !important; overflow: hidden !important; display: flex !important; flex-direction: column !important; border: 2px solid #10b981 !important;">
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

  // =====================================================
  // 🎯 FUNCIONES RENDER PARA VISTA PROPUESTA
  // =====================================================

  renderEnfoqueDiaDestacado() {
    const decretos = this.data.decretosDelDia

    // Si no hay decretos del día, mostrar mensaje
    if (!decretos) {
      return `
        <div class="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-500 rounded-xl p-6 shadow-2xl">
          <div class="flex items-center space-x-3 mb-4">
            <span class="text-4xl">⚠️</span>
            <div>
              <h2 class="text-2xl font-bold text-white">No se encontraron decretos del día</h2>
              <p class="text-red-300 text-sm">Ve a "Rutina Diaria" para generar tus 3 decretos del día</p>
            </div>
          </div>
          <button
            onclick="Router.navigate('rutina')"
            class="btn-primary px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700"
          >
            Ir a Rutina Diaria
          </button>
        </div>
      `
    }

    return `
      <div class="bg-gradient-to-r from-green-900/40 to-purple-900/40 border-2 border-accent-green rounded-xl p-6 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <span class="text-4xl">🎯</span>
            <div>
              <h2 class="text-2xl font-bold text-white">Mis 3 Enfoques del Día</h2>
              <p class="text-accent-green text-sm font-semibold">"Lo que nombro, lo reclamo"</p>
            </div>
          </div>
          <button
            onclick="Router.navigate('rutina')"
            class="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
          >
            Cambiar en Rutina
          </button>
        </div>

        <!-- Grid de 3 decretos -->
        <div class="grid grid-cols-3 gap-4">
          <!-- 💼 EMPRESARIAL -->
          <div class="bg-slate-800/80 rounded-lg p-4 border-l-4 border-blue-500">
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-3xl">💼</span>
              <div>
                <h3 class="font-bold text-white text-sm">EMPRESARIAL</h3>
                <p class="text-xs text-slate-400">Construcción Estratégica</p>
              </div>
            </div>
            ${decretos.empresarial ? `
              <h4 class="text-sm font-semibold text-white mb-2">${decretos.empresarial.titulo}</h4>
              <div class="flex items-center justify-between text-xs text-slate-300 mb-3">
                <span>⏰ ${decretos.empresarial.duracion_minutos || 30} min</span>
                <span class="px-2 py-1 bg-blue-600 rounded">Estratégico</span>
              </div>
              <button
                onclick="Agenda.completarDecretoDelDia('${decretos.empresarial.id}', 'empresarial')"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all text-xs"
              >
                ✅ Completar
              </button>
            ` : `
              <p class="text-xs text-slate-500 italic">No asignado</p>
            `}
          </div>

          <!-- ❤️ HUMANO -->
          <div class="bg-slate-800/80 rounded-lg p-4 border-l-4 border-pink-500">
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-3xl">❤️</span>
              <div>
                <h3 class="font-bold text-white text-sm">HUMANO</h3>
                <p class="text-xs text-slate-400">Relaciones & Bienestar</p>
              </div>
            </div>
            ${decretos.humano ? `
              <h4 class="text-sm font-semibold text-white mb-2">${decretos.humano.titulo}</h4>
              <div class="flex items-center justify-between text-xs text-slate-300 mb-3">
                <span>⏰ ${decretos.humano.duracion_minutos || 30} min</span>
                <span class="px-2 py-1 bg-pink-600 rounded">Personal</span>
              </div>
              <button
                onclick="Agenda.completarDecretoDelDia('${decretos.humano.id}', 'humano')"
                class="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-lg transition-all text-xs"
              >
                ✅ Completar
              </button>
            ` : `
              <p class="text-xs text-slate-500 italic">No asignado</p>
            `}
          </div>

          <!-- 💎 MATERIAL -->
          <div class="bg-slate-800/80 rounded-lg p-4 border-l-4 border-yellow-500">
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-3xl">💎</span>
              <div>
                <h3 class="font-bold text-white text-sm">MATERIAL</h3>
                <p class="text-xs text-slate-400">Abundancia & Recursos</p>
              </div>
            </div>
            ${decretos.material ? `
              <h4 class="text-sm font-semibold text-white mb-2">${decretos.material.titulo}</h4>
              <div class="flex items-center justify-between text-xs text-slate-300 mb-3">
                <span>⏰ ${decretos.material.duracion_minutos || 30} min</span>
                <span class="px-2 py-1 bg-yellow-600 rounded">Recursos</span>
              </div>
              <button
                onclick="Agenda.completarDecretoDelDia('${decretos.material.id}', 'material')"
                class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 rounded-lg transition-all text-xs"
              >
                ✅ Completar
              </button>
            ` : `
              <p class="text-xs text-slate-500 italic">No asignado</p>
            `}
          </div>
        </div>

        <!-- Botón de Auto-agendar -->
        <div class="mt-4 text-center">
          <button
            onclick="Agenda.autoAgendarDecretosDelDia()"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-lg"
          >
            🤖 Auto-agendar los 3 decretos en espacios libres
          </button>
        </div>
      </div>
    `
  },

  renderTimelinePropuesto() {
    const timeline = this.data.timeline || []
    const fecha = dayjs(this.data.selectedDate)

    // Separar eventos por tipo
    const eventosGoogle = timeline.filter(t => t.tipo === 'google_calendar')
    const tareasAgendadas = timeline.filter(t => t.tipo !== 'google_calendar' && t.hora_evento)
    const enfoque = this.data.enfoque

    // Crear timeline de 6am a 10pm
    const horas = []
    for (let h = 6; h <= 22; h++) {
      horas.push(`${String(h).padStart(2, '0')}:00`)
    }

    return `
      <div class="gradient-card p-5 rounded-xl h-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold flex items-center">
            <span class="mr-2">⏰</span>
            MI DÍA
          </h3>
          <button
            onclick="Agenda.autoAgendarDia()"
            class="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
          >
            🤖 Auto-agendar
          </button>
        </div>

        <!-- Navegación de fechas y filtros -->
        ${this.renderFiltrosHorizontales()}

        <div class="space-y-2 overflow-y-auto" style="max-height: 600px;">
          ${horas.map(hora => {
            // Buscar eventos en esta hora
            const eventosEnHora = [
              ...eventosGoogle.filter(e => e.hora_evento?.startsWith(hora.substring(0, 2))),
              ...tareasAgendadas.filter(e => e.hora_evento?.startsWith(hora.substring(0, 2)))
            ]

            const esEnfoque = enfoque && enfoque.hora_evento?.startsWith(hora.substring(0, 2))

            return `
              <div
                class="border-l-2 ${eventosEnHora.length > 0 || esEnfoque ? 'border-accent-green' : 'border-slate-700'} pl-3 py-2 drop-zone"
                data-hora="${hora}"
                ondragover="Agenda.onDragOver(event)"
                ondrop="Agenda.onDrop(event, '${hora}')"
              >
                <div class="text-xs font-mono text-slate-400 mb-1">${hora}</div>
                ${esEnfoque ? `
                  <div class="bg-green-900/40 border border-accent-green rounded p-2 mb-1 cursor-pointer hover:bg-green-900/60 transition-all"
                       onclick="Agenda.openDetalleTarea('${enfoque.id}')">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-sm font-bold text-white hover:text-accent-green transition-colors">🎯 ${enfoque.titulo}</div>
                        <div class="text-xs text-accent-green">${enfoque.duracion_minutos || 60} min</div>
                      </div>
                      <input type="checkbox" class="w-4 h-4" onclick="event.stopPropagation()" />
                    </div>
                  </div>
                ` : ''}
                ${eventosEnHora.map(evento => `
                  <div
                    class="bg-slate-800 rounded p-2 mb-1 cursor-pointer ${evento.tipo === 'google_calendar' ? 'border-l-2 border-blue-400' : 'hover:bg-slate-700 transition-all'}"
                    onclick="Agenda.openDetalleTarea('${evento.id}')"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div class="flex items-center space-x-2">
                          ${evento.tipo !== 'google_calendar' ? `
                            <span
                              class="text-slate-500 cursor-move"
                              draggable="true"
                              ondragstart="Agenda.onDragStart(event, '${evento.id}', '${evento.hora_evento}')"
                              ondragend="Agenda.onDragEnd(event)"
                              onclick="event.stopPropagation()"
                            >⋮⋮</span>
                          ` : ''}
                          <div class="text-sm ${evento.tipo === 'google_calendar' ? 'text-blue-300 hover:text-blue-200' : 'text-white hover:text-accent-green'} transition-colors">${evento.titulo}</div>
                        </div>
                        <div class="text-xs text-slate-400">${evento.decreto_titulo || ''}</div>
                        ${evento.hora_evento ? `<div class="text-xs text-accent-green mt-1">⏰ ${evento.hora_evento}</div>` : ''}
                      </div>
                      <div class="flex items-center space-x-2">
                        ${evento.tipo !== 'google_calendar' ? `
                          <button
                            onclick="event.stopPropagation(); Agenda.editarHoraEvento('${evento.id}', '${evento.hora_evento}')"
                            class="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded transition-all"
                            title="Editar hora manualmente"
                          >
                            <i class="fas fa-clock"></i>
                          </button>
                          <input type="checkbox" class="w-4 h-4" onclick="event.stopPropagation()" />
                        ` : ''}
                      </div>
                    </div>
                  </div>
                `).join('')}
                ${eventosEnHora.length === 0 && !esEnfoque ? `
                  <div class="text-xs text-slate-600 italic">Espacio libre</div>
                ` : ''}
              </div>
            `
          }).join('')}
        </div>
      </div>
    `
  },

  renderAccionesPrimarias() {
    const decretos = this.data.decretosDelDia

    // Si no hay decretos del día, mostrar mensaje
    if (!decretos || (!decretos.empresarial && !decretos.humano && !decretos.material)) {
      return `
        <div class="gradient-card p-5 rounded-xl h-full">
          <div class="mb-4">
            <h3 class="text-lg font-bold flex items-center">
              <span class="mr-2">🎯</span>
              MIS 3 DECRETOS DEL DÍA
            </h3>
            <p class="text-xs text-slate-400">"Lo que nombro, lo reclamo"</p>
          </div>
          <div class="text-center py-8 text-slate-500">
            <div class="mb-4">
              <span class="text-5xl">⚠️</span>
            </div>
            <p class="text-sm mb-4">No se han generado los 3 decretos del día</p>
            <button
              onclick="Router.navigate('rutina')"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
            >
              Ir a Rutina Diaria
            </button>
          </div>
        </div>
      `
    }

    return `
      <div class="gradient-card p-5 rounded-xl h-full">
        <div class="mb-4">
          <h3 class="text-lg font-bold flex items-center">
            <span class="mr-2">🎯</span>
            MIS 3 DECRETOS DEL DÍA
          </h3>
          <p class="text-xs text-slate-400">"Lo que nombro, lo reclamo"</p>
        </div>

        <div class="space-y-3">
          <!-- 💼 EMPRESARIAL -->
          ${decretos.empresarial ? `
            <div class="bg-slate-800 rounded-lg p-4 border-l-4 border-blue-500">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-2xl">💼</span>
                <div class="flex-1">
                  <h4 class="text-sm font-bold text-white">EMPRESARIAL</h4>
                  <p class="text-xs text-slate-400">${decretos.empresarial.titulo}</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs mb-3">
                <span class="text-slate-400">⏰ ${decretos.empresarial.duracion_minutos || 30} min</span>
                <span class="px-2 py-1 bg-blue-600 rounded text-white">Estratégico</span>
              </div>
              <button
                onclick="Agenda.completarDecretoDelDia('${decretos.empresarial.id}', 'empresarial')"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all text-sm"
              >
                ✅ Completar
              </button>
            </div>
          ` : '<div class="bg-slate-800 rounded-lg p-4 text-center text-slate-500 text-sm">💼 No asignado</div>'}

          <!-- ❤️ HUMANO -->
          ${decretos.humano ? `
            <div class="bg-slate-800 rounded-lg p-4 border-l-4 border-pink-500">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-2xl">❤️</span>
                <div class="flex-1">
                  <h4 class="text-sm font-bold text-white">HUMANO</h4>
                  <p class="text-xs text-slate-400">${decretos.humano.titulo}</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs mb-3">
                <span class="text-slate-400">⏰ ${decretos.humano.duracion_minutos || 30} min</span>
                <span class="px-2 py-1 bg-pink-600 rounded text-white">Personal</span>
              </div>
              <button
                onclick="Agenda.completarDecretoDelDia('${decretos.humano.id}', 'humano')"
                class="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-lg transition-all text-sm"
              >
                ✅ Completar
              </button>
            </div>
          ` : '<div class="bg-slate-800 rounded-lg p-4 text-center text-slate-500 text-sm">❤️ No asignado</div>'}

          <!-- 💎 MATERIAL -->
          ${decretos.material ? `
            <div class="bg-slate-800 rounded-lg p-4 border-l-4 border-yellow-500">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-2xl">💎</span>
                <div class="flex-1">
                  <h4 class="text-sm font-bold text-white">MATERIAL</h4>
                  <p class="text-xs text-slate-400">${decretos.material.titulo}</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs mb-3">
                <span class="text-slate-400">⏰ ${decretos.material.duracion_minutos || 30} min</span>
                <span class="px-2 py-1 bg-yellow-600 rounded text-white">Recursos</span>
              </div>
              <button
                onclick="Agenda.completarDecretoDelDia('${decretos.material.id}', 'material')"
                class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 rounded-lg transition-all text-sm"
              >
                ✅ Completar
              </button>
            </div>
          ` : '<div class="bg-slate-800 rounded-lg p-4 text-center text-slate-500 text-sm">💎 No asignado</div>'}
        </div>

        <!-- Botón de Auto-agendar -->
        <div class="mt-4">
          <button
            onclick="Agenda.autoAgendarDecretosDelDia()"
            class="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-lg text-sm"
          >
            🤖 Auto-agendar en espacios libres
          </button>
        </div>
      </div>
    `
  },

  renderAccionesSecundarias() {
    const secundarias = this.data.timeline.filter(t =>
      t.tipo === 'secundaria' &&
      t.estado === 'pendiente'
    )

    const completadas = secundarias.filter(s => s.estado === 'completada').length
    const total = secundarias.length

    return `
      <div class="gradient-card p-5 rounded-xl h-full">
        <div class="mb-4">
          <h3 class="text-lg font-bold flex items-center">
            <span class="mr-2">✅</span>
            ACCIONES SECUNDARIAS
          </h3>
          <p class="text-xs text-slate-400">Disciplina Diaria (Hábitos)</p>
          <div class="text-xs text-accent-green mt-1">
            ${completadas}/${total} completadas
          </div>
          <div class="mt-2 text-xs text-slate-500 italic">
            💡 Arrastra acciones desde la Panorámica hacia aquí
          </div>
        </div>

        <div
          id="drop-zone-secundarias"
          class="space-y-2 overflow-y-auto min-h-[200px] p-2 rounded-lg transition-all"
          style="max-height: 550px;"
          ondragover="Agenda.onDragOverSecundarias(event)"
          ondragleave="Agenda.onDragLeaveSecundarias(event)"
          ondrop="Agenda.onDropSecundarias(event)"
        >
          ${secundarias.length === 0 ? `
            <div class="text-center py-8 text-slate-500">
              <p class="text-sm">No hay acciones secundarias pendientes</p>
              <button
                onclick="Decretos.openUniversalAccionModal()"
                class="mt-3 text-xs px-3 py-1 bg-green-600 hover:bg-green-700 rounded transition-all"
              >
                + Crear Acción Secundaria
              </button>
            </div>
          ` : secundarias.map(accion => `
            <div class="bg-slate-800 rounded-lg p-3 hover:bg-slate-700 transition-colors">
              <div class="flex items-center space-x-3 mb-2">
                <div class="flex-1 cursor-pointer" onclick="Agenda.openDetalleTarea('${accion.id}')">
                  <div class="text-sm ${accion.estado === 'completada' ? 'line-through text-slate-500' : 'text-white'} hover:text-accent-green transition-colors">
                    ${accion.titulo}
                  </div>
                  <div class="text-xs text-slate-500">
                    ${accion.duracion_minutos ? `⏰ ${accion.duracion_minutos} min` : ''}
                  </div>
                </div>
              </div>
              <div class="flex justify-end space-x-2">
                <button
                  onclick="event.stopPropagation(); Agenda.openSeguimientoModal('${accion.id}')"
                  class="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 rounded transition-all"
                  title="Seguimiento"
                >
                  <i class="fas fa-lock"></i>
                </button>
                <button
                  onclick="event.stopPropagation(); Agenda.cambiarEstadoTarea('${accion.id}')"
                  class="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded transition-all"
                  title="${accion.estado === 'completada' ? 'Marcar pendiente' : 'Completar'}"
                >
                  <i class="fas fa-${accion.estado === 'completada' ? 'undo' : 'check'}"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  renderProgresoDia() {
    const enfoque = this.data.enfoque
    const primarias = this.data.timeline.filter(t => t.tipo === 'primaria')
    const secundarias = this.data.timeline.filter(t => t.tipo === 'secundaria')

    const primariasCompletadas = primarias.filter(p => p.estado === 'completada').length
    const secundariasCompletadas = secundarias.filter(s => s.estado === 'completada').length

    const progresoEnfoque = enfoque && enfoque.estado === 'completada' ? 100 : 0
    const progresoPrimarias = primarias.length > 0 ? (primariasCompletadas / primarias.length * 100) : 0
    const progresoSecundarias = secundarias.length > 0 ? (secundariasCompletadas / secundarias.length * 100) : 0

    return `
      <div class="gradient-card p-6 rounded-xl">
        <h3 class="text-xl font-bold mb-4">📊 MI PROGRESO HOY</h3>

        <div class="space-y-4">
          <!-- Enfoque -->
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-white">🎯 Enfoque del Día</span>
              <span class="text-accent-green font-bold">${progresoEnfoque}%</span>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                class="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-500"
                style="width: ${progresoEnfoque}%"
              ></div>
            </div>
          </div>

          <!-- Primarias -->
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-white">📌 Primarias</span>
              <span class="text-accent-purple font-bold">${Math.round(progresoPrimarias)}% (${primariasCompletadas}/${primarias.length})</span>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                class="bg-gradient-to-r from-purple-500 to-purple-400 h-full transition-all duration-500"
                style="width: ${progresoPrimarias}%"
              ></div>
            </div>
          </div>

          <!-- Secundarias -->
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-white">✅ Secundarias</span>
              <span class="text-accent-blue font-bold">${Math.round(progresoSecundarias)}% (${secundariasCompletadas}/${secundarias.length})</span>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                class="bg-gradient-to-r from-blue-500 to-blue-400 h-full transition-all duration-500"
                style="width: ${progresoSecundarias}%"
              ></div>
            </div>
          </div>
        </div>

        ${progresoEnfoque === 100 ? `
          <div class="mt-4 p-4 bg-green-900/40 border border-accent-green rounded-lg text-center">
            <p class="text-accent-green font-bold">🎉 ¡COMPLETASTE TU ENFOQUE DEL DÍA!</p>
            <p class="text-sm text-white mt-1">Lo nombraste y lo reclamaste</p>
          </div>
        ` : ''}
      </div>
    `
  },

  getAreaIcon(area) {
    const icons = {
      'Empresarial': '🏢',
      'Humano': '👨‍👩‍👧‍👦',
      'Material': '💰'
    }
    return icons[area] || '📋'
  },

  // ===================================================================
  // 🎯 FUNCIONES PARA VISTA PROPUESTA CON DECRETOS DEL DÍA
  // ===================================================================

  /**
   * Auto-agenda los 3 decretos del día desde Rutina Diaria
   * Respeta Google Calendar y bloquea 2-4pm para comida
   */
  async autoAgendarDecretosDelDia() {
    console.log('🤖 Auto-agendando los 3 decretos del día')

    if (!this.data.decretosDelDia) {
      Utils.showToast('⚠️ Primero ve a Rutina Diaria para generar tus decretos del día', 'warning')
      return
    }

    try {
      const ahora = dayjs()
      const hoy = dayjs().format('YYYY-MM-DD')
      let fecha = this.data.selectedDate || hoy
      let horaInicio = '08:00'
      let mensajeConfirm = '🤖 Auto-agendar mis 3 decretos del día\n\n'

      // Si es tarde (después de las 6 PM), agendar para mañana automáticamente
      if (fecha === hoy && ahora.hour() >= 18) {
        fecha = ahora.add(1, 'day').format('YYYY-MM-DD')
        const fechaFormateada = dayjs(fecha).format('DD/MM/YYYY')
        horaInicio = '08:00'
        mensajeConfirm += `🌙 Ya es tarde. Se agendará para MAÑANA (${fechaFormateada}) desde las 8:00 AM\n\n`
        console.log(`🌅 Agendando para mañana: ${fecha} desde ${horaInicio}`)
      } else if (fecha === hoy) {
        // Es hoy pero temprano
        const proximaHora = ahora.add(30, 'minutes')
        horaInicio = proximaHora.format('HH:mm')
        mensajeConfirm += `⏰ Se agendará para HOY desde las ${horaInicio}\n\n`
        console.log(`⏰ Es hoy, agendando desde: ${horaInicio}`)
      } else {
        mensajeConfirm += `📅 Se agendará para ${dayjs(fecha).format('DD/MM/YYYY')} desde las 8:00 AM\n\n`
      }

      mensajeConfirm += '✅ Respeta eventos de Google Calendar\n'
      mensajeConfirm += '✅ Bloquea 2-4pm para comida\n\n'
      mensajeConfirm += '¿Deseas continuar?'

      const confirmar = confirm(mensajeConfirm)
      if (!confirmar) return

      Utils.showToast('🤖 Analizando espacios libres...', 'info')

      // Preguntar sobre exportar a Google Calendar
      const exportToGoogle = confirm('📅 ¿Exportar a Google Calendar?\n\nCreará 3 eventos automáticamente.')

      // Llamar al endpoint con los 3 decretos del día
      const result = await API.agenda.autoSchedule({
        fecha: fecha,
        horaInicio: horaInicio,
        horaFin: '20:00',
        bloqueoComida: true, // 🍽️ Bloquear 2-4pm
        decretosPrioritarios: [
          this.data.decretosDelDia.empresarial?.id,
          this.data.decretosDelDia.humano?.id,
          this.data.decretosDelDia.material?.id
        ].filter(Boolean),
        exportToGoogle: exportToGoogle
      })

      if (result.success) {
        const data = result.data
        Utils.showToast(
          `✅ ${data.accionesAgendadas} decretos agendados!\n` +
          `${data.accionesExportadas > 0 ? `📅 ${data.accionesExportadas} exportados a Google Calendar` : ''}`,
          'success'
        )

        // Cambiar a la fecha donde se agendaron las acciones
        this.data.selectedDate = fecha
        console.log(`📅 Cambiando a la fecha agendada: ${fecha}`)

        // Recargar la vista con la nueva fecha
        await this.loadAgendaData()
        const mainContent = document.getElementById('main-content')
        mainContent.innerHTML = this.renderAgendaView()
      } else {
        Utils.showToast(`❌ Error: ${result.error}`, 'error')
      }
    } catch (error) {
      console.error('❌ Error:', error)
      Utils.showToast('❌ Error al auto-agendar decretos del día', 'error')
    }
  },

  /**
   * Completa un decreto del día desde la Vista Propuesta
   */
  async completarDecretoDelDia(decretoId, area) {
    console.log('✅ Completando decreto del día:', { decretoId, area })

    try {
      // Marcar como completado en Rutina Diaria
      await API.rutina.completeTask({
        decretoId: decretoId,
        taskType: 'primary',
        minutesSpent: 30,
        notes: `Completado desde Agenda (Vista Propuesta) - Área: ${area}`
      })

      Utils.showToast(`✅ Decreto ${area} completado!`, 'success')

      // Recargar datos
      await this.loadAgendaData()
      const mainContent = document.getElementById('main-content')
      mainContent.innerHTML = this.renderAgendaView()

    } catch (error) {
      console.error('❌ Error al completar decreto:', error)
      Utils.showToast('❌ Error al completar decreto del día', 'error')
    }
  },

  /**
   * Editar hora de un evento agendado
   */
  async editarHoraEvento(accionId, horaActual) {
    console.log('✏️ Editando hora de evento:', { accionId, horaActual })

    const nuevaHora = prompt('🕐 Nueva hora\n\nEjemplos:\n• 14:30\n• 2:30 pm\n• 08:00', horaActual || '08:00')

    if (!nuevaHora) {
      console.log('❌ Usuario canceló la edición')
      return
    }

    // Convertir a formato 24h si viene en formato 12h (con am/pm)
    let horaFinal = nuevaHora.trim()

    // Detectar formato 12h con am/pm
    const formato12h = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i.test(horaFinal)

    if (formato12h) {
      const match = horaFinal.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i)
      let horas = parseInt(match[1])
      const minutos = match[2]
      const periodo = match[3].toLowerCase()

      // Convertir a formato 24h
      if (periodo === 'pm' && horas !== 12) {
        horas += 12
      } else if (periodo === 'am' && horas === 12) {
        horas = 0
      }

      horaFinal = `${String(horas).padStart(2, '0')}:${minutos}`
      console.log(`🔄 Convertido de 12h a 24h: ${nuevaHora} → ${horaFinal}`)
    }

    // Validar formato HH:MM (24 horas)
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horaFinal)) {
      console.log('❌ Formato de hora inválido:', nuevaHora, '→', horaFinal)
      Utils.showToast('⚠️ Formato inválido. Usa:\n• 14:30 (formato 24h)\n• 2:30 pm (formato 12h)', 'error')
      return
    }

    try {
      console.log('🔍 Obteniendo datos de la tarea:', accionId)
      Utils.showToast('⏰ Actualizando hora...', 'info')

      // Primero obtener la tarea completa
      const tarea = await API.agenda.getTarea(accionId)
      console.log('📦 Tarea obtenida:', tarea)

      if (!tarea || !tarea.success) {
        console.error('❌ No se pudo obtener la tarea:', tarea)
        Utils.showToast('❌ No se pudo obtener la tarea', 'error')
        return
      }

      const tareaData = tarea.data
      console.log('📋 Datos de la tarea:', tareaData)

      // Construir fecha_hora en formato ISO (YYYY-MM-DDTHH:MM)
      const fechaHora = `${tareaData.fecha_evento || this.data.selectedDate}T${horaFinal}`
      console.log('📅 Fecha/hora construida:', fechaHora)

      // Actualizar con todos los campos requeridos
      const updateData = {
        titulo: tareaData.titulo,
        descripcion: tareaData.que_hacer || tareaData.descripcion || '',
        fecha_hora: fechaHora,
        que_hacer: tareaData.que_hacer || '',
        como_hacerlo: tareaData.como_hacerlo || '',
        resultados: tareaData.resultados || '',
        tipo: tareaData.tipo || 'diaria',
        prioridad: tareaData.prioridad || 'media',
        duracion_minutos: tareaData.duracion_minutos || 30
      }
      console.log('📤 Enviando actualización:', updateData)

      const result = await API.agenda.updateTarea(accionId, updateData)
      console.log('📥 Respuesta de actualización:', result)

      if (result.success) {
        console.log('✅ Actualización exitosa, recargando agenda...')
        Utils.showToast('✅ Hora actualizada correctamente', 'success')

        // Recargar datos y vista completa
        await this.loadAgendaData()
        console.log('📊 Datos recargados')

        const mainContent = document.getElementById('main-content')
        mainContent.innerHTML = this.renderAgendaView()
        console.log('🎨 Vista renderizada')
      } else {
        console.error('❌ Error en la actualización:', result.error)
        Utils.showToast(`❌ Error: ${result.error}`, 'error')
      }
    } catch (error) {
      console.error('❌ Error capturado:', error)
      Utils.showToast('❌ Error al actualizar la hora', 'error')
    }
  },

  /**
   * 🎯 DRAG & DROP - Funciones para arrastrar y soltar eventos
   */
  draggedEvent: null, // Variable para almacenar el evento que se está arrastrando

  onDragStart(event, eventoId, horaActual) {
    console.log('🎯 Iniciando drag:', { eventoId, horaActual })
    this.draggedEvent = { id: eventoId, horaOriginal: horaActual }
    event.dataTransfer.effectAllowed = 'move'
    // Agregar efecto visual
    event.target.style.opacity = '0.4'
  },

  onDragEnd(event) {
    console.log('🎯 Finalizando drag')
    event.target.style.opacity = '1'
  },

  onDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    // Agregar efecto visual a la zona de drop
    const dropZone = event.currentTarget
    dropZone.classList.add('bg-purple-900/20')
  },

  async onDrop(event, horaDestino) {
    event.preventDefault()
    console.log('🎯 Drop evento:', { horaDestino, draggedEvent: this.draggedEvent })

    // Remover efecto visual
    const dropZones = document.querySelectorAll('.drop-zone')
    dropZones.forEach(zone => zone.classList.remove('bg-purple-900/20'))

    if (!this.draggedEvent) {
      console.error('❌ No hay evento siendo arrastrado')
      return
    }

    const { id, horaOriginal } = this.draggedEvent
    const nuevaHora = horaDestino.substring(0, 5) // Extraer HH:MM

    if (nuevaHora === horaOriginal) {
      console.log('⏭️ Misma hora, no hacer nada')
      this.draggedEvent = null
      return
    }

    console.log(`📦 Moviendo evento ${id} de ${horaOriginal} a ${nuevaHora}`)
    Utils.showToast(`⏰ Moviendo a las ${nuevaHora}...`, 'info')

    try {
      // Obtener la tarea completa
      const tarea = await API.agenda.getTarea(id)
      if (!tarea || !tarea.success) {
        Utils.showToast('❌ No se pudo obtener la tarea', 'error')
        this.draggedEvent = null
        return
      }

      const tareaData = tarea.data
      const fechaHora = `${tareaData.fecha_evento || this.data.selectedDate}T${nuevaHora}`

      // Actualizar en el backend
      const result = await API.agenda.updateTarea(id, {
        titulo: tareaData.titulo,
        descripcion: tareaData.que_hacer || tareaData.descripcion || '',
        fecha_hora: fechaHora,
        que_hacer: tareaData.que_hacer || '',
        como_hacerlo: tareaData.como_hacerlo || '',
        resultados: tareaData.resultados || '',
        tipo: tareaData.tipo || 'diaria',
        prioridad: tareaData.prioridad || 'media',
        duracion_minutos: tareaData.duracion_minutos || 30
      })

      if (result.success) {
        console.log('✅ Evento movido exitosamente')
        Utils.showToast(`✅ Movido a las ${nuevaHora}`, 'success')

        // Recargar la vista
        await this.loadAgendaData()
        const mainContent = document.getElementById('main-content')
        mainContent.innerHTML = this.renderAgendaView()
      } else {
        console.error('❌ Error moviendo evento:', result.error)
        Utils.showToast(`❌ Error: ${result.error}`, 'error')
      }
    } catch (error) {
      console.error('❌ Error en drag & drop:', error)
      Utils.showToast('❌ Error al mover el evento', 'error')
    }

    this.draggedEvent = null
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

  // ========================================
  // DRAG & DROP: Acciones desde Panorámica a Secundarias
  // ========================================

  draggedAccionId: null,

  onDragStartAccion(event, accionId) {
    this.draggedAccionId = accionId
    event.target.style.opacity = '0.5'
    console.log('🎯 Arrastrando acción:', accionId)
  },

  onDragEndAccion(event) {
    event.target.style.opacity = '1'
  },

  onDragOverSecundarias(event) {
    event.preventDefault()
    const dropZone = document.getElementById('drop-zone-secundarias')
    if (dropZone) {
      dropZone.classList.add('bg-green-900/20', 'border-2', 'border-green-500', 'border-dashed')
    }
  },

  onDragLeaveSecundarias(event) {
    const dropZone = document.getElementById('drop-zone-secundarias')
    if (dropZone) {
      dropZone.classList.remove('bg-green-900/20', 'border-2', 'border-green-500', 'border-dashed')
    }
  },

  async onDropSecundarias(event) {
    event.preventDefault()

    const dropZone = document.getElementById('drop-zone-secundarias')
    if (dropZone) {
      dropZone.classList.remove('bg-green-900/20', 'border-2', 'border-green-500', 'border-dashed')
    }

    if (!this.draggedAccionId) {
      console.warn('⚠️ No hay acción arrastrándose')
      return
    }

    console.log('📥 Acción soltada en secundarias:', this.draggedAccionId)

    try {
      // Buscar la acción en panorámica
      const accion = this.data.panoramicaPendientes.acciones?.find(a => a.id === this.draggedAccionId)

      if (!accion) {
        this.mostrarNotificacion('❌ Acción no encontrada', 'error')
        return
      }

      // Crear tarea en agenda como secundaria
      const tareaData = {
        nombre: accion.titulo,
        descripcion: accion.que_hacer || '',
        tipo: 'secundaria',
        decreto_id: accion.decreto_id,
        accion_id: accion.id,
        fecha: this.data.fechaActual,
        estado: 'pendiente',
        hora_inicio: null,
        hora_fin: null,
        duracion_minutos: null
      }

      console.log('📝 Creando tarea secundaria:', tareaData)

      const result = await API.agenda.createTarea(tareaData)

      if (result.success) {
        this.mostrarNotificacion(`✅ "${accion.titulo}" agregada a secundarias`, 'success')

        // Recargar timeline
        await this.cargarTimeline()

        // Re-renderizar solo la columna de secundarias
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.innerHTML = this.renderAgendaView()
        }
      } else {
        this.mostrarNotificacion('❌ Error al agregar acción', 'error')
      }

    } catch (error) {
      console.error('❌ Error al agregar acción a secundarias:', error)
      this.mostrarNotificacion('❌ Error al agregar acción', 'error')
    } finally {
      this.draggedAccionId = null
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
}// Force upload 1760595266
// Update $(date +%s)
// Update $(date +%s)
// Update $(date +%s)
// Update 1760597809
// Update 1760598068
// Update 1760598444
// Update 1760598601
// Update 1760598749
// Update 1760598966
