/**
 * 🎯 AGENDA DRAG & DROP MODULE
 * Gestiona la funcionalidad de arrastrar y soltar eventos en la agenda
 */

export const AgendaDragDrop = {
  /**
   * Variable para almacenar el evento que se está arrastrando
   */
  draggedEvent: null,

  /**
   * Inicia el proceso de arrastre de un evento
   * @param {DragEvent} event - Evento de drag nativo
   * @param {string} eventoId - ID del evento siendo arrastrado
   * @param {string} horaActual - Hora actual del evento (HH:MM)
   */
  onDragStart(event, eventoId, horaActual) {
    console.log('🎯 Iniciando drag:', { eventoId, horaActual })
    this.draggedEvent = { id: eventoId, horaOriginal: horaActual }
    event.dataTransfer.effectAllowed = 'move'
    // Agregar efecto visual
    event.target.style.opacity = '0.4'
  },

  /**
   * Finaliza el proceso de arrastre
   * @param {DragEvent} event - Evento de drag nativo
   */
  onDragEnd(event) {
    console.log('🎯 Finalizando drag')
    event.target.style.opacity = '1'
  },

  /**
   * Maneja el evento cuando el cursor pasa sobre una zona de drop válida
   * @param {DragEvent} event - Evento de drag nativo
   */
  onDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    // Agregar efecto visual a la zona de drop
    const dropZone = event.currentTarget
    dropZone.classList.add('bg-purple-900/20')
  },

  /**
   * Ejecuta la acción de soltar el evento en una nueva hora
   * @param {DragEvent} event - Evento de drag nativo
   * @param {string} horaDestino - Hora de destino (HH:MM)
   * @param {Object} context - Contexto de la aplicación (Agenda object)
   */
  async onDrop(event, horaDestino, context) {
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
      const fechaHora = `${tareaData.fecha_evento || context.data.selectedDate}T${nuevaHora}`

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
        await context.loadAgendaData()
        const mainContent = document.getElementById('main-content')
        mainContent.innerHTML = context.renderAgendaView()
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
