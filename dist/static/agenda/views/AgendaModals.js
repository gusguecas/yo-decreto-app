/**
 * 📋 AGENDA MODALS MODULE
 * Gestiona todos los modales y diálogos de la agenda
 */

export const AgendaModals = {
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
  }
}
