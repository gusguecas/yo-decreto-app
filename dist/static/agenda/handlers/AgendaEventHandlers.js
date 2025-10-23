/**
 * 🎮 AGENDA EVENT HANDLERS MODULE
 * Gestiona todos los manejadores de eventos y acciones del usuario
 */

export const AgendaEventHandlers = {
  // ============================================
  // 🎯 NAVEGACIÓN Y VISTAS
  // ============================================

  async cambiarVista(vista) {
    this.data.vistaActiva = vista
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = this.renderAgendaView()

    // Ya no hacemos auto-agenda automáticamente
    // El usuario debe hacer click en el botón "Auto-agendar los 3 decretos"
  },

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

    // Actualizar solo las secciones necesarias
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

  // ============================================
  // 🎯 ENFOQUE DEL DÍA
  // ============================================

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

  // ============================================
  // 📝 GESTIÓN DE TAREAS
  // ============================================

  openCreateTareaModal() {
    // TODO: Cargar decretos para el selector
    Modal.open('createTareaModal')
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
      console.log('🎯 Completando tarea:', id)

      const response = await fetch(`/api/agenda/tareas/${id}/completar`, {
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

  async marcarPendiente(id) {
    try {
      console.log('🔄 Marcando tarea como pendiente:', id)

      const response = await fetch(`/api/agenda/tareas/${id}/pendiente`, {
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
    try {
      console.log('🗑️ Eliminando tarea:', id)

      const response = await fetch(`/api/agenda/tareas/${id}`, {
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

  // ============================================
  // 📋 DETALLES Y EDICIÓN DE TAREAS
  // ============================================

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

  // ============================================
  // 🔍 FILTROS
  // ============================================

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

  // ============================================
  // 📝 SEGUIMIENTO
  // ============================================

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

  // ============================================
  // 🎯 GESTIÓN DE ESTADO
  // ============================================

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

  // ============================================
  // 📊 PANORÁMICA DE PENDIENTES
  // ============================================

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

  // ============================================
  // 🤖 AUTO-SCHEDULING
  // ============================================

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

  // ============================================
  // 🎯 DECRETOS DEL DÍA
  // ============================================

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
      const manana = ahora.add(1, 'day').format('YYYY-MM-DD')
      const fecha = manana // 🌅 Siempre agendar para mañana
      const horaInicio = '08:00'
      const fechaFormateada = dayjs(fecha).format('DD/MM/YYYY')

      let mensajeConfirm = '🤖 Auto-agendar mis 3 decretos del día\n\n'
      mensajeConfirm += `🌅 Se agendará para MAÑANA (${fechaFormateada}) desde las 8:00 AM\n\n`
      console.log(`🌅 Agendando para mañana: ${fecha} desde ${horaInicio}`)

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

  // ============================================
  // 🎯 DRAG & DROP
  // ============================================

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
  },

  // ============================================
  // 📊 ACCIONES EN PANORÁMICA
  // ============================================

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
        await this.loadPanoramicaPendientes()
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

  /**
   * 🎯 NUEVO: Crear acción desde un decreto secundario
   * Abre el modal universal de creación de acciones preseleccionando el decreto
   */
  crearAccionDesdeDecreto(decretoId, decretoTitulo, area) {
    console.log('➕ Creando acción desde decreto secundario:', { decretoId, decretoTitulo, area })

    // Llamar al modal universal de Decretos con el decreto preseleccionado
    if (window.Decretos && typeof window.Decretos.openUniversalAccionModal === 'function') {
      window.Decretos.openUniversalAccionModal(decretoId)
    } else {
      console.error('❌ No se encontró Decretos.openUniversalAccionModal')
      Utils.showToast('❌ Error: Modal de acciones no disponible', 'error')
    }
  },

  /**
   * 🎯 Toggle para expandir/colapsar sección de Decretos Disponibles
   */
  toggleDecretosDisponibles() {
    const content = document.getElementById('decretos-disponibles-content')
    const icon = document.getElementById('decretos-disponibles-icon')

    if (content && icon) {
      const isHidden = content.style.display === 'none'

      if (isHidden) {
        // Expandir
        content.style.display = 'block'
        icon.classList.remove('fa-chevron-down')
        icon.classList.add('fa-chevron-up')
      } else {
        // Colapsar
        content.style.display = 'none'
        icon.classList.remove('fa-chevron-up')
        icon.classList.add('fa-chevron-down')
      }
    }
  }
}
