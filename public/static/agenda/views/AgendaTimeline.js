/**
 * ⏰ AGENDA TIMELINE MODULE
 * Gestiona el renderizado del timeline y eventos por hora
 */

export const AgendaTimeline = {

  /**
   * Renderiza el timeline básico del día
   */
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

  /**
   * Actualiza solo el timeline sin re-renderizar toda la página
   */
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

  /**
   * Renderiza filtros horizontales compactos
   */
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

  /**
   * Renderiza vista Kanban de tareas (Pendientes/Completadas)
   */
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

  /**
   * Renderiza una tarea individual con estilo mejorado
   */
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

  /**
   * Renderiza métricas visuales con gráfico circular
   */
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

  /**
   * Renderiza filtros compactos con selectores
   */
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

  /**
   * Renderiza timeline expandido en dos columnas
   */
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

  /**
   * Renderiza una tarea en formato compacto
   */
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

  /**
   * Renderiza timeline cinematográfico con diseño premium
   */
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

  /**
   * Renderiza una tarea individual en estilo cinematográfico
   */
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
        <div class="timeline-card" data-evento-id="${tarea.id}"
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
                <h4 class="font-medium text-white text-base truncate">${tarea.titulo}</h4>
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
              onclick="Agenda.openSeguimientoModal('${tarea.id}')"
              class="group relative bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-400/50 text-green-300 hover:text-green-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
              title="Seguimiento"
            >
              <i class="fas fa-lock text-sm"></i>
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button
              onclick="Agenda.cambiarEstadoTarea('${tarea.id}')"
              class="group relative bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-400/50 text-purple-300 hover:text-purple-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              title="${tarea.estado === 'completada' ? 'Marcar pendiente' : 'Completar tarea'}"
            >
              <i class="fas fa-${tarea.estado === 'completada' ? 'undo' : 'check'} text-sm"></i>
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button
              onclick="Agenda.confirmarBorrarTarea('${tarea.id}')"
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

  /**
   * Renderiza timeline propuesto (vista especial)
   */
  renderTimelinePropuesto() {
    const timeline = this.data.timeline || []

    return `
      <div class="gradient-card p-6 rounded-xl">
        <h3 class="text-xl font-semibold mb-6">📋 Timeline Propuesto</h3>

        <div class="space-y-4">
          ${timeline.length > 0 ? timeline.map((tarea, index) => `
            <div class="p-4 bg-slate-800/50 rounded-lg border-l-4 ${
              tarea.es_enfoque_dia ? 'border-accent-purple' : 'border-accent-blue'
            }">
              <div class="flex items-center justify-between mb-2">
                <span class="text-accent-green font-semibold">${tarea.hora_evento || '09:00'}</span>
                ${tarea.es_enfoque_dia ? `<span class="px-2 py-1 bg-accent-purple/20 text-accent-purple text-xs rounded">🎯 Enfoque</span>` : ''}
              </div>
              <h4 class="text-white font-medium">${tarea.titulo}</h4>
              ${tarea.decreto_titulo ? `
                <p class="text-sm text-slate-400 mt-1">${tarea.decreto_titulo}</p>
              ` : ''}
            </div>
          `).join('') : `
            <p class="text-center text-slate-400">No hay tareas programadas</p>
          `}
        </div>
      </div>
    `
  }

}
