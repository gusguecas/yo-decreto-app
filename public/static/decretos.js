// Módulo de Decretos

const Decretos = {
  data: {
    decretos: [],
    contadores: {},
    porcentajes: {},
    selectedDecreto: null
  },

  async render() {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = UI.renderLoading('Cargando decretos...')
    
    try {
      await this.loadDecretos()
      mainContent.innerHTML = this.renderDecretosView()
      
      // Renderizar modales
      this.renderModals()
    } catch (error) {
      mainContent.innerHTML = this.renderError()
    }
  },

  async loadDecretos() {
    const response = await API.decretos.getAll()
    this.data.decretos = response.data.decretos
    this.data.contadores = response.data.contadores
    this.data.porcentajes = response.data.porcentajes
  },

  renderDecretosView() {
    return `
      <div class="container mx-auto px-4 py-8">
        <!-- Encabezado principal -->
        ${this.renderHeaderSection()}
        
        <!-- Panel de contadores -->
        ${this.renderContadores()}
        
        <!-- Botón agregar decreto -->
        <div class="text-center mb-8">
          <button 
            onclick="Decretos.openCreateModal()"
            class="btn-primary px-8 py-3 rounded-lg font-semibold flex items-center mx-auto space-x-2 hover-lift"
          >
            <i class="fas fa-plus"></i>
            <span>Agregar Decreto</span>
          </button>
        </div>
        
        <!-- Zonas por categoría -->
        ${this.renderDecretosByCategory()}
      </div>
    `
  },

  renderHeaderSection() {
    const user = AppState.user || {}
    return `
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4 text-gradient-green">Yo Decreto</h1>
        <h2 class="text-2xl font-semibold mb-4">${user.nombre_usuario || 'Gustavo Adolfo Guerrero Castaños'}</h2>
        <div class="inline-block">
          <p class="text-lg text-slate-300 cursor-pointer hover:text-white" onclick="Decretos.editFraseVida()">
            ${user.frase_vida || '(Agregar frase de vida)'}
          </p>
        </div>
      </div>
    `
  },

  renderContadores() {
    return `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div class="metric-card p-6 text-center">
          <div class="text-3xl font-bold text-white">${this.data.contadores.total || 0}</div>
          <div class="text-slate-300 text-sm">Total Decretos</div>
        </div>
        <div class="metric-card p-6 text-center">
          <div class="text-3xl font-bold text-accent-green">${this.data.contadores.empresarial || 0}</div>
          <div class="text-slate-300 text-sm">Empresariales</div>
          <div class="text-xs text-slate-400">${this.data.porcentajes.empresarial || 0}%</div>
        </div>
        <div class="metric-card p-6 text-center">
          <div class="text-3xl font-bold text-accent-orange">${this.data.contadores.material || 0}</div>
          <div class="text-slate-300 text-sm">Materiales</div>
          <div class="text-xs text-slate-400">${this.data.porcentajes.material || 0}%</div>
        </div>
        <div class="metric-card p-6 text-center">
          <div class="text-3xl font-bold text-accent-blue">${this.data.contadores.humano || 0}</div>
          <div class="text-slate-300 text-sm">Humanos</div>
          <div class="text-xs text-slate-400">${this.data.porcentajes.humano || 0}%</div>
        </div>
      </div>
    `
  },

  renderDecretosByCategory() {
    const categorias = [
      { 
        key: 'empresarial', 
        title: 'Decretos Empresariales', 
        icon: '🏢', 
        color: 'accent-green',
        decretos: this.data.decretos.filter(d => d.area === 'empresarial')
      },
      { 
        key: 'material', 
        title: 'Decretos Materiales', 
        icon: '💰', 
        color: 'accent-orange',
        decretos: this.data.decretos.filter(d => d.area === 'material')
      },
      { 
        key: 'humano', 
        title: 'Decretos Humanos', 
        icon: '❤️', 
        color: 'accent-blue',
        decretos: this.data.decretos.filter(d => d.area === 'humano')
      }
    ]

    return `
      <div class="space-y-12">
        ${categorias.map(categoria => `
          <div class="fade-in">
            <h3 class="text-2xl font-semibold mb-6 flex items-center">
              <span class="text-3xl mr-3">${categoria.icon}</span>
              <span class="text-${categoria.color}">${categoria.title}</span>
              <span class="ml-3 text-sm text-slate-400">(${categoria.decretos.length})</span>
            </h3>
            
            ${categoria.decretos.length > 0 ? `
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${categoria.decretos.map(decreto => this.renderDecretoCard(decreto, categoria.key)).join('')}
              </div>
            ` : `
              <div class="text-center py-12 text-slate-400">
                <div class="text-6xl mb-4">📝</div>
                <p class="text-lg">No hay decretos en esta categoría</p>
                <p class="text-sm">¡Crea tu primer decreto ${categoria.key}!</p>
              </div>
            `}
          </div>
        `).join('')}
      </div>
    `
  },

  renderDecretoCard(decreto, area) {
    return `
      <div class="decreto-card ${area} p-6 hover-lift cursor-pointer" onclick="Decretos.openDetalleDecreto('${decreto.id}')">
        <div class="flex items-start justify-between mb-4">
          <h4 class="text-xl font-bold text-white uppercase">${decreto.titulo}</h4>
          <button 
            onclick="event.stopPropagation(); Decretos.confirmDelete('${decreto.id}')"
            class="text-slate-400 hover:text-red-400 transition-colors"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
        
        <p class="text-slate-300 mb-4 line-clamp-2">${decreto.sueno_meta}</p>
        
        ${decreto.descripcion ? `
          <p class="text-slate-400 text-sm mb-4 line-clamp-3">${decreto.descripcion}</p>
        ` : ''}
        
        <!-- Barra de progreso -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-slate-300">Progreso</span>
            <span class="text-sm font-semibold text-${area === 'empresarial' ? 'accent-green' : area === 'material' ? 'accent-orange' : 'accent-blue'}">${decreto.progreso || 0}%</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-2">
            <div 
              class="progress-bar h-2 rounded-full" 
              style="width: ${decreto.progreso || 0}%; background: ${area === 'empresarial' ? 'var(--color-accent-green)' : area === 'material' ? 'var(--color-accent-orange)' : 'var(--color-accent-blue)'};"
            ></div>
          </div>
        </div>
        
        <!-- Botón acción diaria -->
        <button 
          onclick="event.stopPropagation(); Decretos.openCreateAccionModal('${decreto.id}')"
          class="w-full btn-${area === 'empresarial' ? 'primary' : area === 'material' ? 'warning' : 'info'} py-2 rounded-lg text-sm font-medium"
        >
          <i class="fas fa-plus mr-2"></i>
          Acción Diaria
        </button>
      </div>
    `
  },

  // Modal para crear decreto
  renderCreateDecretoModal() {
    return UI.renderModal('createDecretoModal', '➕ Nuevo Decreto', `
      <form onsubmit="Decretos.handleCreateDecreto(event)">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Área *</label>
            <select name="area" required class="form-select w-full px-4 py-2">
              <option value="">Selecciona un área</option>
              <option value="empresarial">🏢 Empresarial</option>
              <option value="material">💰 Material</option>
              <option value="humano">❤️ Humano</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Título del decreto *</label>
            <input 
              type="text" 
              name="titulo" 
              required 
              class="form-input w-full px-4 py-2"
              placeholder="Ej: Salud Física Perfecta"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Sueño/Meta *</label>
            <textarea 
              name="sueno_meta" 
              required 
              rows="3"
              class="form-textarea w-full px-4 py-2"
              placeholder="Qué quiero lograr con este decreto..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Descripción / Información general</label>
            <textarea 
              name="descripcion"
              rows="4"
              class="form-textarea w-full px-4 py-2"
              placeholder="Información adicional sobre este decreto (opcional)"
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4 mt-8">
          <button 
            type="button" 
            onclick="Modal.close('createDecretoModal')"
            class="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="btn-primary px-6 py-2 rounded-lg"
          >
            💾 Guardar Decreto
          </button>
        </div>
      </form>
    `)
  },

  renderModals() {
    // Agregar modales al DOM si no existen
    const modalsContainer = document.getElementById('modals') || (() => {
      const container = document.createElement('div')
      container.id = 'modals'
      document.body.appendChild(container)
      return container
    })()

    modalsContainer.innerHTML = `
      ${this.renderCreateDecretoModal()}
      ${this.renderCreateAccionModal()}
      ${this.renderSeguimientoModal()}
    `
  },

  renderCreateAccionModal() {
    return UI.renderModal('createAccionModal', '➕ Nueva Acción', `
      <form onsubmit="Decretos.handleCreateAccion(event)">
        <input type="hidden" name="decreto_id" id="accionDecretoId">
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Título de la acción *</label>
            <input 
              type="text" 
              name="titulo" 
              required 
              class="form-input w-full px-4 py-2"
              placeholder="Ej: Hacer ejercicio matutino"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Qué se debe hacer *</label>
            <textarea 
              name="que_hacer" 
              required 
              rows="3"
              class="form-textarea w-full px-4 py-2"
              placeholder="Describe específicamente qué hay que hacer..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Cómo hacerlo</label>
            <textarea 
              name="como_hacerlo"
              rows="3"
              class="form-textarea w-full px-4 py-2"
              placeholder="Metodología, pasos, recursos necesarios..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Resultados esperados</label>
            <textarea 
              name="resultados"
              rows="2"
              class="form-textarea w-full px-4 py-2"
              placeholder="Qué resultados esperas obtener..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Tipo de acción</label>
              <select name="tipo" class="form-select w-full px-4 py-2">
                <option value="secundaria">Secundaria (diaria)</option>
                <option value="primaria">Primaria (semanal)</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Próxima revisión</label>
              <input 
                type="datetime-local" 
                name="proxima_revision"
                class="form-input w-full px-4 py-2"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Calificación del progreso (1-10)</label>
            <input 
              type="range" 
              name="calificacion" 
              min="1" 
              max="10" 
              value="5"
              class="w-full"
              oninput="this.nextElementSibling.textContent = this.value"
            >
            <div class="text-center mt-2 font-semibold">5</div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4 mt-8">
          <button 
            type="button" 
            onclick="Modal.close('createAccionModal')"
            class="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="btn-primary px-6 py-2 rounded-lg"
          >
            💾 Guardar Acción
          </button>
        </div>
      </form>
    `)
  },

  renderSeguimientoModal() {
    return UI.renderModal('seguimientoModal', '📝 Seguimiento de Acción', `
      <form onsubmit="Decretos.handleSeguimiento(event)">
        <input type="hidden" name="decreto_id" id="seguimientoDecretoId">
        <input type="hidden" name="accion_id" id="seguimientoAccionId">
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">🍒 ¿Qué se hizo exactamente? *</label>
            <textarea 
              name="que_se_hizo" 
              required 
              rows="3"
              class="form-textarea w-full px-4 py-2"
              placeholder="Describe específicamente qué se realizó..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">🛠️ ¿Cómo se hizo? (Metodología) *</label>
            <textarea 
              name="como_se_hizo" 
              required 
              rows="3"
              class="form-textarea w-full px-4 py-2"
              placeholder="Explica el proceso, métodos utilizados..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">📊 Resultados obtenidos *</label>
            <textarea 
              name="resultados_obtenidos" 
              required 
              rows="3"
              class="form-textarea w-full px-4 py-2"
              placeholder="¿Qué resultados concretos obtuviste?"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">📝 Tareas pendientes / Próximos pasos</label>
            <textarea 
              name="tareas_pendientes"
              rows="4"
              class="form-textarea w-full px-4 py-2"
              placeholder="Una tarea por línea. Usa [P] o #primaria para tareas primarias, #diaria para secundarias, @YYYY-MM-DD para fecha específica"
            ></textarea>
            <div class="text-xs text-slate-400 mt-1">
              Ejemplo: [P] Revisar métricas trimestrales @2024-01-15<br>
              #diaria Llamar a proveedor principal
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">📅 Fecha de próxima revisión</label>
              <input 
                type="datetime-local" 
                name="proxima_revision"
                class="form-input w-full px-4 py-2"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">⭐ Calificación del progreso (1-10)</label>
              <input 
                type="range" 
                name="calificacion" 
                min="1" 
                max="10" 
                value="5"
                class="w-full"
                oninput="this.nextElementSibling.textContent = this.value"
              >
              <div class="text-center mt-2 font-semibold">5</div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4 mt-8">
          <button 
            type="button" 
            onclick="Modal.close('seguimientoModal')"
            class="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="btn-secondary px-6 py-2 rounded-lg"
          >
            💾 Guardar Seguimiento
          </button>
        </div>
      </form>
    `)
  },

  // Event handlers
  openCreateModal() {
    Modal.open('createDecretoModal')
  },

  openCreateAccionModal(decretoId) {
    document.getElementById('accionDecretoId').value = decretoId
    Modal.open('createAccionModal')
  },

  async handleCreateDecreto(event) {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())
    
    try {
      await API.decretos.create(data)
      Modal.close('createDecretoModal')
      Utils.showToast('Decreto creado exitosamente', 'success')
      await this.render() // Recargar vista
    } catch (error) {
      Utils.showToast('Error al crear decreto', 'error')
    }
  },

  async handleCreateAccion(event) {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())
    const decretoId = data.decreto_id
    
    try {
      await API.decretos.createAccion(decretoId, data)
      Modal.close('createAccionModal')
      Utils.showToast('Acción creada exitosamente', 'success')
      // No recargar toda la vista, solo actualizar si estamos en detalle
    } catch (error) {
      Utils.showToast('Error al crear acción', 'error')
    }
  },

  async confirmDelete(decretoId) {
    if (confirm('¿Estás seguro de que quieres eliminar este decreto y todo lo asociado?')) {
      try {
        await API.decretos.delete(decretoId)
        Utils.showToast('Decreto eliminado exitosamente', 'success')
        await this.render()
      } catch (error) {
        Utils.showToast('Error al eliminar decreto', 'error')
      }
    }
  },

  async editFraseVida() {
    const user = AppState.user || {}
    const nuevaFrase = prompt('Edita tu frase de vida:', user.frase_vida || '')
    
    if (nuevaFrase !== null) {
      try {
        await API.config.update({
          nombre_usuario: user.nombre_usuario,
          frase_vida: nuevaFrase
        })
        AppState.user.frase_vida = nuevaFrase
        Utils.showToast('Frase de vida actualizada', 'success')
        await this.render()
      } catch (error) {
        Utils.showToast('Error al actualizar frase', 'error')
      }
    }
  },

  async openDetalleDecreto(decretoId) {
    // TODO: Implementar vista de detalle del decreto
    Utils.showToast('Vista de detalle próximamente', 'info')
  },

  renderError() {
    return `
      <div class="container mx-auto px-4 py-8 text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold mb-4">Error al cargar decretos</h2>
        <p class="text-slate-400 mb-6">No se pudieron cargar los decretos. Verifica tu conexión.</p>
        <button onclick="Decretos.render()" class="btn-primary px-6 py-2 rounded-lg">
          Reintentar
        </button>
      </div>
    `
  }
}