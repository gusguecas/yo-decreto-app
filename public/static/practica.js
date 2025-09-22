// Módulo de Práctica

const Practica = {
  data: {
    rutinas: [],
    afirmaciones: [],
    progresoRutinas: {},
    estadisticas: {}
  },

  async render() {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = UI.renderLoading('Cargando práctica...')
    
    try {
      console.log('🌟 Iniciando carga de práctica...')
      await this.loadPracticaData()
      console.log('✅ Datos cargados:', this.data)
      mainContent.innerHTML = this.renderPracticaView()
      this.renderModals()
      console.log('✅ Práctica renderizada exitosamente')
    } catch (error) {
      console.error('❌ Error en práctica:', error)
      mainContent.innerHTML = this.renderError(error.message)
    }
  },

  async loadPracticaData() {
    const [rutinas, afirmaciones, progresoRutinas] = await Promise.all([
      API.practica.getRutinas(),
      API.practica.getAfirmaciones(),
      API.practica.getProgresoDia()
    ])

    this.data.rutinas = rutinas.data
    this.data.afirmaciones = afirmaciones.data
    this.data.progresoRutinas = progresoRutinas.data
  },

  renderPracticaView() {
    return `
      <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold mb-2 flex items-center justify-center">
            <span class="text-3xl mr-3">🌟</span>
            <span class="text-gradient-green">Mi Práctica</span>
          </h1>
          <p class="text-slate-300">Convierte tus decretos en acción diaria. Aquí aplicas los ejercicios del libro Name it and Claim it para transformar tu vida paso a paso.</p>
        </div>

        <!-- Rutina Matutina -->
        ${this.renderRutinaMatutina()}

        <!-- Banco de Afirmaciones -->
        ${this.renderBancoAfirmaciones()}
      </div>
    `
  },

  renderRutinaMatutina() {
    const progreso = this.data.progresoRutinas
    
    return `
      <div class="gradient-card p-8 rounded-xl mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold flex items-center">
            <span class="text-3xl mr-3">🌅</span>
            Rutina Matutina
          </h2>
          <div class="text-right">
            <div class="text-sm text-slate-400">Progreso del día</div>
            <div class="text-2xl font-bold text-accent-green">
              ${progreso.porcentaje_progreso || 0}%
            </div>
            <div class="text-xs text-slate-400">
              ${progreso.completadas_hoy || 0} de ${progreso.total_rutinas || 0}
            </div>
          </div>
        </div>

        <!-- Barra de progreso general -->
        <div class="mb-8">
          <div class="w-full bg-slate-700 rounded-full h-3">
            <div 
              class="h-3 rounded-full progress-bar" 
              style="width: ${progreso.porcentaje_progreso || 0}%"
            ></div>
          </div>
        </div>

        <!-- Lista de rutinas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${this.data.rutinas.map(rutina => `
            <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <span class="text-2xl">${rutina.icono}</span>
                  <div>
                    <h4 class="font-medium">${rutina.nombre}</h4>
                    <p class="text-xs text-slate-400">${rutina.tiempo_estimado} min</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    class="sr-only peer"
                    ${rutina.completada_hoy ? 'checked' : ''}
                    onchange="Practica.toggleRutina('${rutina.id}', this.checked)"
                  >
                  <div class="toggle-checkbox peer"></div>
                </label>
              </div>
              
              <p class="text-sm text-slate-300 mb-3">${rutina.descripcion}</p>
              
              ${rutina.completada_hoy && rutina.detalle_hoy ? `
                <div class="text-xs text-accent-green border-l-2 border-accent-green pl-2">
                  ✅ Completada
                  ${rutina.detalle_hoy.tiempo_invertido ? ` - ${rutina.detalle_hoy.tiempo_invertido} min` : ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  renderBancoAfirmaciones() {
    return `
      <div class="gradient-card p-8 rounded-xl">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold flex items-center">
            <span class="text-3xl mr-3">💎</span>
            Banco de Afirmaciones
          </h2>
          <div class="flex space-x-3">
            <select 
              id="filtroCategoria" 
              class="form-select px-3 py-2 text-sm"
              onchange="Practica.filtrarAfirmaciones()"
            >
              <option value="todas">Todas las categorías</option>
              <option value="empresarial">🏢 Empresarial</option>
              <option value="material">💰 Material</option>
              <option value="humano">❤️ Humano</option>
              <option value="general">🌟 General</option>
            </select>
            <button 
              onclick="Practica.openCreateAfirmacionModal()"
              class="btn-primary px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
            >
              <i class="fas fa-plus"></i>
              <span>Nueva Afirmación</span>
            </button>
          </div>
        </div>

        <!-- Afirmaciones del día -->
        ${this.renderAfirmacionesDelDia()}

        <!-- Todas las afirmaciones -->
        <div class="mt-8">
          <h3 class="text-lg font-medium mb-4">Todas las Afirmaciones</h3>
          <div id="afirmacionesContainer" class="space-y-3 max-h-96 overflow-y-auto">
            ${this.renderAfirmacionesList()}
          </div>
        </div>
      </div>
    `
  },

  renderAfirmacionesDelDia() {
    // Seleccionar algunas afirmaciones favoritas
    const favoritas = this.data.afirmaciones.filter(a => a.es_favorita).slice(0, 3)
    
    return `
      <div class="bg-slate-800 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium mb-4 flex items-center">
          <span class="text-xl mr-2">⭐</span>
          Afirmaciones Sugeridas del Día
        </h3>
        
        ${favoritas.length > 0 ? `
          <div class="space-y-3">
            ${favoritas.map(afirmacion => `
              <div class="bg-slate-900 rounded p-4 border-l-4 border-accent-green">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <blockquote class="text-lg font-medium italic mb-2">
                      "${afirmacion.texto}"
                    </blockquote>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs badge-${afirmacion.categoria}">${afirmacion.categoria}</span>
                      ${afirmacion.veces_usada > 0 ? `<span class="text-xs text-slate-400">Usada ${afirmacion.veces_usada} veces</span>` : ''}
                    </div>
                  </div>
                  <button 
                    onclick="Practica.usarAfirmacion('${afirmacion.id}')"
                    class="btn-primary p-2 rounded-full ml-3"
                    title="Recitar/Usar"
                  >
                    <i class="fas fa-redo"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-2">💎</div>
            <p>No tienes afirmaciones favoritas aún</p>
            <p class="text-sm">Marca algunas como favoritas para verlas aquí</p>
          </div>
        `}
      </div>
    `
  },

  renderAfirmacionesList() {
    return this.data.afirmaciones.map(afirmacion => `
      <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <blockquote class="font-medium mb-2">"${afirmacion.texto}"</blockquote>
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-xs badge-${afirmacion.categoria}">${afirmacion.categoria}</span>
              ${afirmacion.veces_usada > 0 ? `<span class="text-xs text-slate-400">Usada ${afirmacion.veces_usada} veces</span>` : ''}
            </div>
          </div>
          <div class="flex items-center space-x-2 ml-4">
            <button 
              onclick="Practica.toggleFavorita('${afirmacion.id}', ${!afirmacion.es_favorita})"
              class="p-2 rounded transition-colors ${afirmacion.es_favorita ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-400 hover:text-yellow-400'}"
              title="${afirmacion.es_favorita ? 'Quitar de favoritas' : 'Marcar como favorita'}"
            >
              <i class="fas fa-star"></i>
            </button>
            <button 
              onclick="Practica.usarAfirmacion('${afirmacion.id}')"
              class="btn-secondary p-2 rounded"
              title="Recitar/Usar"
            >
              <i class="fas fa-redo"></i>
            </button>
            <button 
              onclick="Practica.eliminarAfirmacion('${afirmacion.id}')"
              class="text-slate-400 hover:text-red-400 p-2 rounded transition-colors"
              title="Eliminar"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('')
  },

  renderModals() {
    const modalsContainer = document.getElementById('modals') || (() => {
      const container = document.createElement('div')
      container.id = 'modals'
      document.body.appendChild(container)
      return container
    })()

    modalsContainer.innerHTML += `
      ${this.renderCreateAfirmacionModal()}
    `
  },

  renderCreateAfirmacionModal() {
    return UI.renderModal('createAfirmacionModal', '💎 Nueva Afirmación', `
      <form onsubmit="Practica.handleCreateAfirmacion(event)">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Texto de la afirmación *</label>
            <textarea 
              name="texto" 
              required 
              rows="3"
              class="form-textarea w-full px-4 py-2"
              placeholder="Ej: Yo soy el arquitecto de mi destino empresarial"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Categoría *</label>
            <select name="categoria" required class="form-select w-full px-4 py-2">
              <option value="">Selecciona una categoría</option>
              <option value="empresarial">🏢 Empresarial</option>
              <option value="material">💰 Material</option>
              <option value="humano">❤️ Humano</option>
              <option value="general">🌟 General</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4 mt-8">
          <button 
            type="button" 
            onclick="Modal.close('createAfirmacionModal')"
            class="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="btn-primary px-6 py-2 rounded-lg"
          >
            💾 Guardar Afirmación
          </button>
        </div>
      </form>
    `)
  },

  // Event handlers
  async toggleRutina(rutinaId, completada) {
    try {
      if (completada) {
        // Preguntar tiempo invertido (opcional)
        const tiempo = prompt('¿Cuántos minutos invertiste? (opcional)')
        const notas = prompt('¿Alguna nota sobre esta práctica? (opcional)')
        
        await API.practica.completarRutina(rutinaId, {
          tiempo_invertido: tiempo ? parseInt(tiempo) : null,
          notas: notas || ''
        })
        
        Utils.showToast('Rutina completada', 'success')
      } else {
        await API.practica.desmarcarRutina(rutinaId)
        Utils.showToast('Rutina desmarcada', 'info')
      }
      
      // Recargar solo la sección de rutinas
      await this.loadPracticaData()
      const rutinaContainer = document.querySelector('.gradient-card:first-of-type')
      if (rutinaContainer) {
        rutinaContainer.outerHTML = this.renderRutinaMatutina()
      }
    } catch (error) {
      Utils.showToast('Error al actualizar rutina', 'error')
    }
  },

  async toggleFavorita(afirmacionId, esFavorita) {
    try {
      await API.practica.toggleFavorita(afirmacionId, esFavorita)
      Utils.showToast(esFavorita ? 'Agregada a favoritas' : 'Quitada de favoritas', 'success')
      
      // Actualizar datos y re-renderizar afirmaciones
      await this.loadPracticaData()
      this.updateAfirmacionesView()
    } catch (error) {
      Utils.showToast('Error al actualizar favorita', 'error')
    }
  },

  async usarAfirmacion(afirmacionId) {
    try {
      await API.practica.usarAfirmacion(afirmacionId)
      Utils.showToast('¡Afirmación recitada! 🌟', 'success')
      
      // Actualizar contador de uso
      await this.loadPracticaData()
      this.updateAfirmacionesView()
    } catch (error) {
      Utils.showToast('Error al marcar como usada', 'error')
    }
  },

  async eliminarAfirmacion(afirmacionId) {
    if (confirm('¿Estás seguro de eliminar esta afirmación?')) {
      try {
        await API.practica.deleteAfirmacion(afirmacionId)
        Utils.showToast('Afirmación eliminada', 'success')
        
        await this.loadPracticaData()
        this.updateAfirmacionesView()
      } catch (error) {
        Utils.showToast('Error al eliminar afirmación', 'error')
      }
    }
  },

  async filtrarAfirmaciones() {
    const categoria = document.getElementById('filtroCategoria').value
    
    try {
      const params = categoria === 'todas' ? {} : { categoria }
      const response = await API.practica.getAfirmaciones(params)
      this.data.afirmaciones = response.data
      
      this.updateAfirmacionesView()
    } catch (error) {
      Utils.showToast('Error al filtrar afirmaciones', 'error')
    }
  },

  updateAfirmacionesView() {
    const container = document.getElementById('afirmacionesContainer')
    if (container) {
      container.innerHTML = this.renderAfirmacionesList()
    }
  },

  openCreateAfirmacionModal() {
    Modal.open('createAfirmacionModal')
  },

  async handleCreateAfirmacion(event) {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())
    
    try {
      await API.practica.createAfirmacion(data)
      Modal.close('createAfirmacionModal')
      Utils.showToast('Afirmación creada exitosamente', 'success')
      
      await this.loadPracticaData()
      this.updateAfirmacionesView()
    } catch (error) {
      Utils.showToast('Error al crear afirmación', 'error')
    }
  },

  renderError(errorMsg = 'Error desconocido') {
    return `
      <div class="container mx-auto px-4 py-8 text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold mb-4">Error al cargar práctica</h2>
        <p class="text-slate-400 mb-2">No se pudo cargar la información de práctica.</p>
        <p class="text-red-400 text-sm mb-6">${errorMsg}</p>
        <button onclick="Practica.render()" class="btn-primary px-6 py-2 rounded-lg">
          Reintentar
        </button>
      </div>
    `
  }
}