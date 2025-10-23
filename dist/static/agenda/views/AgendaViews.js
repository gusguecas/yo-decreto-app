/**
 * 🎨 AGENDA VIEWS MODULE
 * Gestiona el renderizado de todas las vistas principales de la agenda
 */

export const AgendaViews = {
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
                  <div class="bg-green-900/40 border border-accent-green rounded p-2 mb-1">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-sm font-bold text-white">🎯 ${enfoque.titulo}</div>
                        <div class="text-xs text-accent-green">${enfoque.duracion_minutos || 60} min</div>
                      </div>
                      <input type="checkbox" class="w-4 h-4" />
                    </div>
                  </div>
                ` : ''}
                ${eventosEnHora.map(evento => `
                  <div
                    class="bg-slate-800 rounded p-2 mb-1 ${evento.tipo === 'google_calendar' ? 'border-l-2 border-blue-400' : 'hover:bg-slate-700 transition-all cursor-move'}"
                    ${evento.tipo !== 'google_calendar' ? `draggable="true"` : ''}
                    ondragstart="Agenda.onDragStart(event, '${evento.id}', '${evento.hora_evento}')"
                    ondragend="Agenda.onDragEnd(event)"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div class="flex items-center space-x-2">
                          ${evento.tipo !== 'google_calendar' ? `<span class="text-slate-500">⋮⋮</span>` : ''}
                          <div class="text-sm ${evento.tipo === 'google_calendar' ? 'text-blue-300' : 'text-white'}">${evento.titulo}</div>
                        </div>
                        <div class="text-xs text-slate-400">${evento.decreto_titulo || ''}</div>
                        ${evento.hora_evento ? `<div class="text-xs text-accent-green mt-1">⏰ ${evento.hora_evento}</div>` : ''}
                      </div>
                      <div class="flex items-center space-x-2">
                        ${evento.tipo !== 'google_calendar' ? `
                          <button
                            onclick="Agenda.editarHoraEvento('${evento.id}', '${evento.hora_evento}')"
                            class="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded transition-all"
                            title="Editar hora manualmente"
                          >
                            <i class="fas fa-clock"></i>
                          </button>
                          <input type="checkbox" class="w-4 h-4" />
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
    // 🎯 Mostrar decretos secundarios disponibles + acciones secundarias creadas
    const decretosSecundarios = this.data.decretosSecundarios || []

    // Acciones secundarias del timeline
    const accionesSecundarias = this.data.timeline.filter(t =>
      t.tipo === 'secundaria' &&
      t.estado === 'pendiente'
    )

    const completadas = accionesSecundarias.filter(s => s.estado === 'completada').length
    const total = accionesSecundarias.length

    // Obtener iconos por área
    const getAreaIcon = (area) => {
      const icons = {
        'empresarial': '💼',
        'humano': '❤️',
        'material': '💎'
      }
      return icons[area] || '📌'
    }

    // Obtener color por área
    const getAreaColor = (area) => {
      const colors = {
        'empresarial': 'blue',
        'humano': 'pink',
        'material': 'yellow'
      }
      return colors[area] || 'gray'
    }

    return `
      <div class="space-y-4">
        <!-- 📋 SECCIÓN 1: Decretos Disponibles (Colapsable) -->
        <div class="gradient-card rounded-xl overflow-hidden">
          <button
            onclick="Agenda.toggleDecretosDisponibles()"
            class="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
          >
            <div class="flex items-center space-x-2">
              <span class="text-lg">📋</span>
              <div class="text-left">
                <h3 class="text-sm font-bold">DECRETOS DISPONIBLES</h3>
                <p class="text-xs text-slate-400">${decretosSecundarios.length} decretos para crear acciones</p>
              </div>
            </div>
            <i id="decretos-disponibles-icon" class="fas fa-chevron-down text-slate-400"></i>
          </button>

          <div id="decretos-disponibles-content" class="p-4 pt-0 space-y-2" style="display: none;">
            ${decretosSecundarios.length === 0 ? `
              <div class="text-center py-4 text-slate-500">
                <p class="text-xs">Los 3 decretos primarios del día ya están asignados</p>
              </div>
            ` : decretosSecundarios.map(decreto => {
              const area = decreto.categoria || decreto.area
              const icon = getAreaIcon(area)
              const color = getAreaColor(area)

              return `
                <div class="bg-slate-800 rounded-lg p-3 hover:bg-slate-700 transition-colors border-l-4 border-${color}-500">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="text-lg">${icon}</span>
                    <div class="flex-1">
                      <div class="text-sm font-semibold text-white">
                        ${decreto.titulo}
                      </div>
                      <div class="text-xs text-slate-400 mt-1 line-clamp-1">
                        ${decreto.descripcion || 'Sin descripción'}
                      </div>
                    </div>
                  </div>
                  <button
                    onclick="Agenda.crearAccionDesdeDecreto('${decreto.id}', '${decreto.titulo}', '${area}')"
                    class="w-full mt-2 px-3 py-1.5 bg-${color}-600 hover:bg-${color}-700 text-white text-xs font-medium rounded transition-all"
                  >
                    ➕ Crear Acción
                  </button>
                </div>
              `
            }).join('')}
          </div>
        </div>

        <!-- ✅ SECCIÓN 2: Acciones Secundarias Creadas -->
        <div class="gradient-card p-5 rounded-xl">
          <div class="mb-4">
            <h3 class="text-lg font-bold flex items-center">
              <span class="mr-2">✅</span>
              ACCIONES SECUNDARIAS
            </h3>
            <p class="text-xs text-slate-400">Acciones que creaste desde decretos</p>
            <div class="text-xs text-accent-green mt-1">
              ${completadas}/${total} completadas
            </div>
          </div>

          <div class="space-y-2 overflow-y-auto" style="max-height: 350px;">
            ${accionesSecundarias.length === 0 ? `
              <div class="text-center py-8 text-slate-500">
                <p class="text-sm">No hay acciones secundarias</p>
                <p class="text-xs mt-2">👆 Crea acciones desde los decretos disponibles</p>
              </div>
            ` : accionesSecundarias.map(accion => `
              <div class="bg-slate-800 rounded-lg p-2 flex items-center space-x-3 hover:bg-slate-700 transition-colors">
                <input
                  type="checkbox"
                  ${accion.estado === 'completada' ? 'checked' : ''}
                  onclick="Agenda.toggleAccion('${accion.id}')"
                  class="w-4 h-4 rounded"
                />
                <div class="flex-1">
                  <div class="text-sm ${accion.estado === 'completada' ? 'line-through text-slate-500' : 'text-white'}">
                    ${accion.titulo}
                  </div>
                  <div class="text-xs text-slate-500">
                    ${accion.duracion_minutos ? `⏰ ${accion.duracion_minutos} min` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
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
  }
}
