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
      console.log('🔍 Cargando decretos...')
      await this.loadDecretos()
      console.log('✅ Decretos cargados:', this.data.decretos.length)
      mainContent.innerHTML = this.renderDecretosView()

      // Renderizar modales
      this.renderModals()
    } catch (error) {
      console.error('❌ Error al renderizar decretos:', error)
      mainContent.innerHTML = this.renderError(error.message || 'Error desconocido')
    }
  },

  async loadDecretos() {
    const response = await API.decretos.getAll()
    this.data.decretos = response?.data?.decretos || []
    this.data.contadores = response?.data?.contadores || { total: 0, activos: 0, completados: 0 }
    this.data.porcentajes = response?.data?.porcentajes || { empresarial: 0, material: 0, humano: 0 }
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
      <div class="mb-12">
        <!-- Logo a la izquierda, nombre y frase centrados -->
        <div class="flex items-center mb-8">
          <!-- Logo gigante a la izquierda -->
          <div class="flex-shrink-0 mr-8">
            <img src="/static/logo-yo-decreto.png?v=destello2025" alt="Yo Decreto" class="logo-yo-decreto logo-gigante logo-destello-forzado w-auto transition-all duration-300" />
          </div>
          <!-- Nombre y frase centrados en el resto del espacio -->
          <div class="flex-grow text-center">
            <h2 class="text-4xl font-bold mb-6 text-white cursor-pointer hover:text-slate-200 transition-colors duration-300" onclick="Decretos.editNombreUsuario()">
              ${user.nombre_usuario || 'Gustavo Adolfo Guerrero Castaños'}
            </h2>
            <div class="inline-block">
              <p class="text-xl text-slate-300 cursor-pointer hover:text-white transition-colors duration-300" onclick="Decretos.editFraseVida()">
                ${user.frase_vida || '(Agregar frase de vida)'}
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  },

  renderContadores() {
    return `
      <div class="mb-12">
        <!-- Grid de contadores -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      </div>
    `
  },

  renderDecretosByCategory() {
    const categorias = [
      { 
        key: 'empresarial', 
        title: '🏢 Zona Empresarial', 
        icon: '🟢', 
        color: 'accent-green',
        borderColor: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.05)',
        decretos: this.data.decretos.filter(d => d.area === 'empresarial')
      },
      { 
        key: 'material', 
        title: '💰 Zona Material', 
        icon: '🟡', 
        color: 'accent-orange',
        borderColor: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.05)',
        decretos: this.data.decretos.filter(d => d.area === 'material')
      },
      { 
        key: 'humano', 
        title: '❤️ Zona Humana', 
        icon: '🔵', 
        color: 'accent-blue',
        borderColor: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.05)',
        decretos: this.data.decretos.filter(d => d.area === 'humano')
      }
    ]

    return `
      <div class="space-y-8">
        ${categorias.map((categoria, index) => `
          <div class="zona-categoria fade-in" 
               style="background: ${categoria.bgColor}; 
                      border: 2px solid ${categoria.borderColor}; 
                      border-radius: 16px; 
                      padding: 24px; 
                      position: relative; 
                      overflow: hidden;">
            
            <!-- Borde superior decorativo -->
            <div style="position: absolute; 
                        top: 0; 
                        left: 0; 
                        right: 0; 
                        height: 4px; 
                        background: linear-gradient(90deg, ${categoria.borderColor}, ${categoria.borderColor}cc);"></div>
            
            <!-- Header de la zona -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                     style="background: ${categoria.borderColor}; color: white;">
                  ${categoria.icon}
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white">${categoria.title}</h3>
                  <p class="text-slate-300 text-sm">${categoria.decretos.length} decreto${categoria.decretos.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <div class="text-lg font-semibold text-${categoria.color}">
                    ${categoria.decretos.length > 0 ? Math.round(categoria.decretos.reduce((acc, d) => acc + (d.progreso || 0), 0) / categoria.decretos.length) : 0}%
                  </div>
                  <div class="text-xs text-slate-400">Progreso promedio</div>
                </div>
                <button 
                  onclick="Decretos.openCreateModalWithArea('${categoria.key}')"
                  class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:transform hover:scale-110"
                  style="background: ${categoria.borderColor}; color: white;"
                  title="Agregar decreto ${categoria.key}"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
            
            <!-- Contenido de decretos -->
            ${categoria.decretos.length > 0 ? `
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${categoria.decretos.map(decreto => this.renderDecretoCard(decreto, categoria.key)).join('')}
              </div>
            ` : `
              <div class="text-center py-12 text-slate-400" 
                   style="background: rgba(0,0,0,0.2); 
                          border-radius: 12px; 
                          border: 1px dashed ${categoria.borderColor}66;">
                <div class="text-5xl mb-4" style="color: ${categoria.borderColor};">
                  ${categoria.key === 'empresarial' ? '🏢' : categoria.key === 'material' ? '💰' : '❤️'}
                </div>
                <p class="text-lg mb-2">Esta zona está vacía</p>
                <p class="text-sm mb-4">¡Crea tu primer decreto ${categoria.key}!</p>
                <button 
                  onclick="Decretos.openCreateModalWithArea('${categoria.key}')"
                  class="px-6 py-2 rounded-lg transition-all duration-300 hover:transform hover:scale-105"
                  style="background: ${categoria.borderColor}; color: white;"
                >
                  <i class="fas fa-plus mr-2"></i>
                  Crear Decreto
                </button>
              </div>
            `}
          </div>
          
          ${index < categorias.length - 1 ? `
            <!-- Separador entre zonas -->
            <div class="flex items-center justify-center py-4">
              <div class="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
              <div class="mx-4 text-slate-500 text-xs font-medium">•••</div>
              <div class="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            </div>
          ` : ''}
        `).join('')}
      </div>
    `
  },

  renderDecretoCard(decreto, area) {
    const isActive = decreto.estado === 'activo' || !decreto.estado

    return `
      <div class="decreto-card ${area} p-6 hover-lift cursor-pointer ${!isActive ? 'opacity-60' : ''}" onclick="Decretos.openDetalleDecreto('${decreto.id}')">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3 flex-1">
            ${decreto.logo_url ? `
              <img src="${decreto.logo_url}" alt="${decreto.empresa_nombre || 'Logo'}" class="h-12 w-12 object-contain rounded border border-slate-600 flex-shrink-0" />
            ` : ''}
            <div class="flex-1">
              ${decreto.empresa_nombre ? `
                <div class="text-xs text-slate-400 mb-1 uppercase tracking-wider">${decreto.empresa_nombre}</div>
              ` : ''}
              <div class="flex items-center space-x-2">
                <h4 class="text-xl font-bold text-white uppercase">${decreto.titulo}</h4>
                ${!isActive ? '<span class="px-2 py-0.5 text-xs bg-slate-700 text-slate-400 rounded-full">💤 Standby</span>' : '<span class="px-2 py-0.5 text-xs bg-green-900/30 text-green-400 rounded-full border border-green-600/30">🟢 Activo</span>'}
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2 flex-shrink-0">
            <button
              onclick="event.stopPropagation(); Decretos.toggleEstado('${decreto.id}', '${isActive ? 'standby' : 'activo'}')"
              class="text-slate-400 hover:text-${isActive ? 'orange' : 'green'}-400 transition-colors"
              title="${isActive ? 'Pausar (Standby)' : 'Activar'}"
            >
              <i class="fas fa-${isActive ? 'pause' : 'play'}-circle"></i>
            </button>
            <button
              onclick="event.stopPropagation(); Decretos.openEditModal('${decreto.id}')"
              class="text-slate-400 hover:text-blue-400 transition-colors"
              title="Editar decreto"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              onclick="event.stopPropagation(); Decretos.confirmDelete('${decreto.id}')"
              class="text-slate-400 hover:text-red-400 transition-colors"
              title="Eliminar decreto"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <p class="text-slate-300 mb-4 line-clamp-2">${decreto.sueno_meta}</p>
        
        ${decreto.descripcion ? `
          <p class="text-slate-400 text-sm mb-4 line-clamp-3">${decreto.descripcion}</p>
        ` : ''}
        
        <!-- Indicador de acciones retrasadas -->
        ${this.hasOverdueAcciones(decreto) ? `
          <div class="mb-3 p-2 bg-red-900/30 border border-red-600/50 rounded-lg">
            <div class="flex items-center space-x-2 text-red-400">
              <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-xs font-medium">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                Acciones retrasadas
              </span>
            </div>
          </div>
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
      </div>
    `
  },

  // Modal para crear decreto
  renderEditDecretoModal() {
    return UI.renderModal('editDecretoModal', '✏️ Editar Decreto', `
      <form onsubmit="Decretos.handleEditDecreto(event)">
        <input type="hidden" name="decreto_id" id="editDecretoId">

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Área *</label>
            <select name="area" id="editAreaSelect" required class="form-select w-full px-4 py-2" onchange="Decretos.toggleLogoField('edit')">
              <option value="empresarial">🏢 Empresarial</option>
              <option value="material">💰 Material</option>
              <option value="humano">❤️ Humano</option>
            </select>
          </div>

          <div id="editEmpresaField" style="display: none;">
            <label class="block text-sm font-medium mb-2">Empresa/Proyecto Asociado (opcional)</label>
            <input
              type="text"
              name="empresa_nombre"
              id="editEmpresaNombreInput"
              maxlength="100"
              class="form-input w-full px-4 py-2"
              placeholder="Ej: QuantikGeo, KumoLabs, etc."
            />
            <p class="text-xs text-slate-400 mt-1">Nombre de tu empresa o proyecto</p>
          </div>

          <div id="editLogoField" style="display: none;">
            <label class="block text-sm font-medium mb-2">Logo de la Empresa</label>
            <div id="editLogoPreview" class="mb-2"></div>
            <input
              type="file"
              accept="image/*"
              id="editLogoFileInput"
              class="form-input w-full px-4 py-2"
              onchange="Decretos.handleLogoUpload(event, 'edit')"
            />
            <input type="hidden" name="logo_url" id="editLogoUrlInput" />
            <p class="text-xs text-slate-400 mt-1">Sube una imagen (máx. 2MB) - PNG, JPG, o SVG</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Imagen de Visualización (opcional) 🎯</label>
            <div id="editVisualizacionPreview" class="mb-2"></div>
            <input
              type="file"
              accept="image/*"
              id="editVisualizacionFileInput"
              class="form-input w-full px-4 py-2"
              onchange="Decretos.handleVisualizacionUpload(event, 'edit')"
            />
            <input type="hidden" name="imagen_visualizacion" id="editVisualizacionUrlInput" />
            <p class="text-xs text-slate-400 mt-1">Sube una imagen que represente tu meta alcanzada (máx. 2MB)</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Título del Decreto *</label>
            <input
              type="text"
              name="titulo"
              id="editTituloInput"
              required
              maxlength="100"
              class="form-input w-full px-4 py-2"
              placeholder="Ej: Ser el CEO más exitoso de Colombia"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Mi Sueño/Meta *</label>
            <textarea
              name="sueno_meta"
              id="editSuenoMetaTextarea"
              required
              rows="3"
              maxlength="500"
              class="form-textarea w-full px-4 py-2"
              placeholder="Describe tu sueño o meta específica..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Descripción Adicional</label>
            <textarea
              name="descripcion"
              id="editDescripcionTextarea"
              rows="4"
              maxlength="1000"
              class="form-textarea w-full px-4 py-2"
              placeholder="Agrega detalles, contexto o motivación adicional (opcional)..."
            ></textarea>
          </div>
        </div>
        
        <div class="flex space-x-3 mt-8">
          <button 
            type="button" 
            onclick="Modal.close('editDecretoModal')" 
            class="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="flex-2 btn-primary px-6 py-3 rounded-lg"
          >
            💾 Guardar Cambios
          </button>
        </div>
      </form>
    `)
  },

  renderCreateDecretoModal() {
    return UI.renderModal('createDecretoModal', '➕ Nuevo Decreto', `
      <form onsubmit="Decretos.handleCreateDecreto(event)">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Área *</label>
            <select name="area" required class="form-select w-full px-4 py-2" onchange="Decretos.toggleLogoField('create')">
              <option value="">Selecciona un área</option>
              <option value="empresarial">🏢 Empresarial</option>
              <option value="material">💰 Material</option>
              <option value="humano">❤️ Humano</option>
            </select>
          </div>

          <div id="createEmpresaField" style="display: none;">
            <label class="block text-sm font-medium mb-2">Empresa/Proyecto Asociado (opcional)</label>
            <input
              type="text"
              name="empresa_nombre"
              id="createEmpresaNombreInput"
              maxlength="100"
              class="form-input w-full px-4 py-2"
              placeholder="Ej: QuantikGeo, KumoLabs, etc."
            />
            <p class="text-xs text-slate-400 mt-1">Nombre de tu empresa o proyecto</p>
          </div>

          <div id="createLogoField" style="display: none;">
            <label class="block text-sm font-medium mb-2">Logo de la Empresa</label>
            <div id="createLogoPreview" class="mb-2"></div>
            <input
              type="file"
              accept="image/*"
              id="createLogoFileInput"
              class="form-input w-full px-4 py-2"
              onchange="Decretos.handleLogoUpload(event, 'create')"
            />
            <input type="hidden" name="logo_url" id="createLogoUrlInput" />
            <p class="text-xs text-slate-400 mt-1">Sube una imagen (máx. 2MB) - PNG, JPG, o SVG</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Imagen de Visualización (opcional) 🎯</label>
            <div id="createVisualizacionPreview" class="mb-2"></div>
            <input
              type="file"
              accept="image/*"
              id="createVisualizacionFileInput"
              class="form-input w-full px-4 py-2"
              onchange="Decretos.handleVisualizacionUpload(event, 'create')"
            />
            <input type="hidden" name="imagen_visualizacion" id="createVisualizacionUrlInput" />
            <p class="text-xs text-slate-400 mt-1">Sube una imagen que represente tu meta alcanzada (máx. 2MB)</p>
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
      ${this.renderEditDecretoModal()}
      ${this.renderUniversalAccionModal()}
      ${this.renderSeguimientoModal()}
      ${this.renderDetalleAccionModal()}
      ${this.renderEditAccionModal()}
    `
  },

  // ===== MODAL UNIVERSAL PARA ACCIONES (DINÁMICO P/S) =====
  renderUniversalAccionModal() {
    return UI.renderModal('universalAccionModal', '➕ Nueva Acción', `
      <form id="universalAccionForm" onsubmit="Decretos.handleUniversalAccionSubmit(event)">
        <input type="hidden" name="decreto_id" id="universalDecretoId">
        <input type="hidden" name="tipo" id="universalTipoAccion" value="secundaria">

        <div class="space-y-5">
          <!-- Título de la acción -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="titulo"
              required
              class="form-input w-full px-4 py-3 text-base"
              placeholder="Ej: Hacer ejercicio matutino"
            >
          </div>

          <!-- Qué se debe hacer -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-slate-300">
                ¿Qué hacer? *
              </label>
              <button
                type="button"
                id="btnAyudaIA"
                onclick="Decretos.generarQueHacerConIA()"
                class="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs rounded-lg transition-all duration-200 flex items-center space-x-1"
                title="Helene te ayudará a definir qué hacer"
              >
                <i class="fas fa-magic"></i>
                <span>✨ Ayuda IA</span>
              </button>
            </div>

            <!-- Contenedor de auto-sugerencia -->
            <div id="aiSuggestionContainer" class="hidden mb-2 p-3 bg-purple-900/30 border border-purple-500/50 rounded-lg">
              <div class="flex items-start space-x-2">
                <div class="flex-shrink-0 text-purple-400 mt-1">
                  <i class="fas fa-lightbulb"></i>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-purple-300 font-medium mb-1">💡 Sugerencia de Helene:</p>
                  <p id="aiSuggestionText" class="text-sm text-slate-300"></p>
                  <div class="flex space-x-2 mt-2">
                    <button
                      type="button"
                      onclick="Decretos.usarSugerenciaIA()"
                      class="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded transition-colors"
                    >
                      ✓ Usar
                    </button>
                    <button
                      type="button"
                      onclick="Decretos.cerrarSugerenciaIA()"
                      class="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-colors"
                    >
                      ✕ Ignorar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <textarea
              name="que_hacer"
              id="queHacerTextarea"
              required
              rows="3"
              class="form-textarea w-full px-4 py-3 text-base"
              placeholder="Describe específicamente qué hay que hacer... (o usa ✨ Ayuda IA)"
              oninput="Decretos.onQueHacerInput()"
            ></textarea>
          </div>

          <!-- CONTENEDOR DINÁMICO: Campos de Fecha/Hora -->
          <div id="accionFechaContainer">
            <!-- Se renderiza dinámicamente según tipo -->
          </div>
        </div>

        <!-- Botón Sugerir con IA -->
        <div class="pt-4 border-t border-slate-600">
          <button
            type="button"
            onclick="Decretos.openAISuggestModalFromUniversal()"
            class="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            title="Helene te sugerirá acciones basadas en tu decreto"
          >
            <i class="fas fa-magic"></i>
            <span>Sugerir con IA</span>
          </button>
        </div>

        <!-- Botones -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            onclick="Modal.close('universalAccionModal')"
            class="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="btn-primary flex-1 py-3 rounded-lg font-medium"
          >
            <i class="fas fa-save mr-2"></i>
            Guardar Acción
          </button>
        </div>
      </form>
    `)
  },

  renderSeguimientoModal() {
    return UI.renderModal('seguimientoModal', '📝 Seguimiento de Acción', `
      <form onsubmit="Decretos.submitSeguimiento(event)">
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
  toggleLogoField(mode) {
    const empresaField = document.getElementById(mode === 'edit' ? 'editEmpresaField' : 'createEmpresaField')
    const logoField = document.getElementById(mode === 'edit' ? 'editLogoField' : 'createLogoField')
    const areaSelect = document.getElementById(mode === 'edit' ? 'editAreaSelect' : null) ||
                       document.querySelector('#createDecretoModal select[name="area"]')

    if (empresaField && logoField && areaSelect) {
      const area = areaSelect.value
      const isEmpresarial = area === 'empresarial'
      empresaField.style.display = isEmpresarial ? 'block' : 'none'
      logoField.style.display = isEmpresarial ? 'block' : 'none'
    }
  },

  async handleLogoUpload(event, mode) {
    const file = event.target.files[0]
    if (!file) return

    // Validar tamaño
    if (file.size > 2 * 1024 * 1024) {
      Utils.showToast('La imagen no debe superar 2MB', 'error')
      event.target.value = ''
      return
    }

    // Mostrar preview
    const preview = document.getElementById(mode === 'edit' ? 'editLogoPreview' : 'createLogoPreview')
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}" class="h-16 w-16 object-contain rounded border border-slate-600" />`
    }
    reader.readAsDataURL(file)

    // Subir a R2
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        // Guardar URL en campo oculto
        const hiddenInput = document.getElementById(mode === 'edit' ? 'editLogoUrlInput' : 'createLogoUrlInput')
        hiddenInput.value = data.logo_url
        Utils.showToast('Logo subido exitosamente', 'success')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      Utils.showToast('Error al subir logo: ' + error.message, 'error')
      event.target.value = ''
      preview.innerHTML = ''
    }
  },

  async handleVisualizacionUpload(event, mode) {
    const file = event.target.files[0]
    if (!file) return

    // Validar tamaño
    if (file.size > 2 * 1024 * 1024) {
      Utils.showToast('La imagen no debe superar 2MB', 'error')
      event.target.value = ''
      return
    }

    // Mostrar preview
    const preview = document.getElementById(mode === 'edit' ? 'editVisualizacionPreview' : 'createVisualizacionPreview')
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}" class="h-24 w-auto max-w-full object-contain rounded border border-purple-500" />`
    }
    reader.readAsDataURL(file)

    // Subir a R2
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        // Guardar URL en campo oculto
        const hiddenInput = document.getElementById(mode === 'edit' ? 'editVisualizacionUrlInput' : 'createVisualizacionUrlInput')
        hiddenInput.value = data.logo_url
        Utils.showToast('Imagen de visualización subida exitosamente', 'success')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      Utils.showToast('Error al subir imagen: ' + error.message, 'error')
      event.target.value = ''
      preview.innerHTML = ''
    }
  },

  openCreateModal() {
    Modal.open('createDecretoModal')
  },

  openCreateModalWithArea(area) {
    // Abrir modal
    Modal.open('createDecretoModal')
    
    // Preseleccionar el área
    setTimeout(() => {
      const areaSelect = document.querySelector('select[name="area"]')
      if (areaSelect) {
        areaSelect.value = area
        
        // Trigger change event para actualizar estilos si existen
        const event = new Event('change', { bubbles: true })
        areaSelect.dispatchEvent(event)
      }
    }, 100)
  },

  // ===== FUNCIONES PARA MODAL UNIVERSAL =====
  openUniversalAccionModal(decretoId, tipo = 'secundaria') {
    // Si no se proporciona decreto ID, usar el primero disponible por defecto
    if (!decretoId) {
      console.log('⚠️ No se proporcionó decreto ID, usando decreto por defecto')
      const primerDecreto = this.data.decretos?.[0]
      if (primerDecreto) {
        decretoId = primerDecreto.id
      } else {
        Utils.showToast('Error: No hay decretos disponibles. Crea un decreto primero.', 'error')
        return
      }
    }

    console.log('📝 Abriendo modal universal para decreto:', decretoId, 'tipo:', tipo)

    // Cerrar cualquier otro modal que pueda estar abierto
    Modal.close('createAccionModal')
    Modal.close('createAccionDetalleModal')

    // Limpiar flags de procesamiento anteriores
    this._processingForm = null
    this._lastFormHash = null

    // Establecer decreto ID y tipo
    document.getElementById('universalDecretoId').value = decretoId
    document.getElementById('universalTipoAccion').value = tipo

    // Actualizar título del modal según el tipo
    const modalTitle = document.querySelector('#universalAccionModal .text-xl')
    if (modalTitle) {
      modalTitle.innerHTML = tipo === 'primaria'
        ? '🎯 Nueva Acción Primaria (1-3 hrs)'
        : '📅 Nueva Acción Secundaria (5-30 min)'
    }

    // Renderizar campos dinámicamente según tipo
    setTimeout(() => {
      this.renderAccionFechaFields(tipo)
    }, 100)

    Modal.open('universalAccionModal')
  },

  renderAccionFechaFields(tipo) {
    const container = document.getElementById('accionFechaContainer')
    if (!container) return

    const today = new Date().toISOString().split('T')[0]

    if (tipo === 'primaria') {
      // PRIMARIA: Opcional programar con fecha
      container.innerHTML = `
        <div class="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              id="programarPrimariaCheck"
              onchange="Decretos.toggleProgramarPrimaria()"
              class="w-5 h-5 rounded text-green-600 focus:ring-green-500"
            >
            <span class="text-slate-300 font-medium">📅 Programar para fecha específica</span>
          </label>
          <p class="text-xs text-slate-400 mt-2 ml-8">
            Si no programas, aparecerá en el banco de tareas para arrastrar cuando quieras
          </p>
        </div>

        <div id="primariaFechaFields" class="hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              📅 Fecha *
            </label>
            <input
              type="date"
              name="fecha_evento"
              class="form-input w-full px-4 py-3 text-base"
              value="${today}"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              🕐 Hora
            </label>
            <input
              type="time"
              name="hora_evento"
              class="form-input w-full px-4 py-3 text-base"
              value="09:00"
            >
          </div>
        </div>
      `
    } else {
      // SECUNDARIA: Siempre requiere fecha
      container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              📅 ¿Cuándo hacerla? *
            </label>
            <input
              type="date"
              name="fecha_evento"
              required
              class="form-input w-full px-4 py-3 text-base"
              value="${today}"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              🕐 Hora
            </label>
            <input
              type="time"
              name="hora_evento"
              class="form-input w-full px-4 py-3 text-base"
              value="09:00"
            >
          </div>
        </div>
      `
    }
  },

  toggleProgramarPrimaria() {
    const checkbox = document.getElementById('programarPrimariaCheck')
    const fieldsContainer = document.getElementById('primariaFechaFields')

    if (checkbox && fieldsContainer) {
      if (checkbox.checked) {
        fieldsContainer.classList.remove('hidden')
        // Hacer campos requeridos
        const fechaInput = fieldsContainer.querySelector('[name="fecha_evento"]')
        if (fechaInput) fechaInput.required = true
      } else {
        fieldsContainer.classList.add('hidden')
        // Quitar requerido
        const fechaInput = fieldsContainer.querySelector('[name="fecha_evento"]')
        if (fechaInput) {
          fechaInput.required = false
          fechaInput.value = ''
        }
        const horaInput = fieldsContainer.querySelector('[name="hora_evento"]')
        if (horaInput) horaInput.value = ''
      }
    }
  },

  // ===== FUNCIONES DE IA ASISTENTE =====

  _aiSuggestionTimeout: null,
  _currentAISuggestion: '',

  onQueHacerInput() {
    // Limpiar timeout anterior
    if (this._aiSuggestionTimeout) {
      clearTimeout(this._aiSuggestionTimeout)
    }

    // Auto-sugerencia después de 2 segundos de pausa
    this._aiSuggestionTimeout = setTimeout(() => {
      this.generarAutoSugerencia()
    }, 2000)
  },

  async generarQueHacerConIA() {
    const titulo = document.querySelector('#universalAccionForm [name="titulo"]')?.value
    if (!titulo || !titulo.trim()) {
      Utils.showToast('Primero escribe el título de la acción', 'warning')
      return
    }

    const btn = document.getElementById('btnAyudaIA')
    if (btn) {
      btn.disabled = true
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Generando...</span>'
    }

    try {
      await this.generarSugerencia(titulo, true)
    } finally {
      if (btn) {
        btn.disabled = false
        btn.innerHTML = '<i class="fas fa-magic"></i> <span>✨ Ayuda IA</span>'
      }
    }
  },

  async generarAutoSugerencia() {
    const titulo = document.querySelector('#universalAccionForm [name="titulo"]')?.value
    const queHacer = document.getElementById('queHacerTextarea')?.value

    // Solo auto-sugerir si hay título y NO hay contenido en "qué hacer"
    if (!titulo || !titulo.trim() || (queHacer && queHacer.trim())) {
      return
    }

    await this.generarSugerencia(titulo, false)
  },

  async generarSugerencia(titulo, usarDirectamente) {
    try {
      const decretoId = document.getElementById('universalDecretoId')?.value
      if (!decretoId) return

      // Obtener decreto actual
      const decreto = this.data.decretos.find(d => d.id === decretoId)
      if (!decreto) return

      // Llamar a la IA
      const response = await API.request('/chatbot/accion-helper', {
        method: 'POST',
        data: {
          decreto: {
            titulo: decreto.titulo,
            descripcion: decreto.descripcion || decreto.sueno_meta
          },
          tituloAccion: titulo
        }
      })

      if (response.success && response.data.sugerencia) {
        this._currentAISuggestion = response.data.sugerencia

        if (usarDirectamente) {
          // Usar directamente (botón "Ayuda IA")
          const textarea = document.getElementById('queHacerTextarea')
          if (textarea) {
            textarea.value = this._currentAISuggestion
          }
          Utils.showToast('✨ Sugerencia aplicada', 'success')
        } else {
          // Mostrar como auto-sugerencia
          this.mostrarSugerenciaIA(this._currentAISuggestion)
        }
      }
    } catch (error) {
      console.error('Error al generar sugerencia:', error)
      if (usarDirectamente) {
        Utils.showToast('Error al generar sugerencia', 'error')
      }
    }
  },

  mostrarSugerenciaIA(sugerencia) {
    const container = document.getElementById('aiSuggestionContainer')
    const textElement = document.getElementById('aiSuggestionText')

    if (container && textElement) {
      textElement.textContent = sugerencia
      container.classList.remove('hidden')
    }
  },

  usarSugerenciaIA() {
    const textarea = document.getElementById('queHacerTextarea')
    if (textarea && this._currentAISuggestion) {
      textarea.value = this._currentAISuggestion
      this.cerrarSugerenciaIA()
      Utils.showToast('✨ Sugerencia aplicada', 'success')
    }
  },

  cerrarSugerenciaIA() {
    const container = document.getElementById('aiSuggestionContainer')
    if (container) {
      container.classList.add('hidden')
    }
  },

  // Función eliminada - ya no usamos sub-tareas
  toggleUniversalSubtareas(checked) {
    // Eliminada - simplificación version-2
    return
  },

  procesarUniversalSubtareas() {
    const subtareas = []

    for (let i = 1; i <= 3; i++) {
      const titulo = document.querySelector(`[name="subtarea_${i}_titulo"]`)?.value
      const fecha = document.querySelector(`[name="subtarea_${i}_fecha"]`)?.value

      if (titulo && titulo.trim()) {
        subtareas.push({
          titulo: titulo.trim(),
          que_hacer: titulo.trim(),
          fecha_programada: fecha || null
        })
      }
    }

    return subtareas
  },

  async handleUniversalAccionSubmit(event) {
    event.preventDefault()
    event.stopImmediatePropagation()

    const formElement = event.target
    const formId = formElement?.id || 'sin-id'

    console.log('=== INICIO handleUniversalAccionSubmit ===', {
      formId,
      processingFlag: this._processingForm
    })

    // VALIDAR QUE ES EL FORMULARIO CORRECTO
    if (formId !== 'universalAccionForm') {
      console.log('❌ FORMULARIO INCORRECTO - Esperado: universalAccionForm, Recibido:', formId)
      return
    }

    // SISTEMA ANTI-DUPLICACIÓN
    const submitButton = formElement.querySelector('button[type="submit"]')
    const specificProcessingKey = `universalAccion_${formId}`

    if (this._processingForm === specificProcessingKey) {
      console.log('❌ DUPLICADO DETECTADO - Ya procesando formulario:', specificProcessingKey)
      return
    }

    if (submitButton && submitButton.disabled) {
      console.log('❌ DUPLICADO DETECTADO - Botón deshabilitado')
      return
    }

    const formData = new FormData(formElement)
    const data = Object.fromEntries(formData.entries())

    // Validación de decreto_id
    const decretoId = data.decreto_id
    if (!decretoId) {
      Utils.showToast('Error: No se encontró el ID del decreto', 'error')
      return
    }

    const dataHash = `${formId}_${JSON.stringify(data)}`

    if (this._lastFormHash === dataHash && (Date.now() - this._lastFormTime) < 3000) {
      console.log('❌ DUPLICADO DETECTADO - Mismo contenido en menos de 3 segundos')
      return
    }

    this._processingForm = specificProcessingKey
    this._lastFormHash = dataHash
    this._lastFormTime = Date.now()

    if (submitButton) {
      submitButton.disabled = true
      submitButton.innerHTML = '⏳ Guardando...'
    }

    try {
      // Procesar checkbox es_enfoque_dia
      data.es_enfoque_dia = formElement.querySelector('[name="es_enfoque_dia"]').checked

      // Procesar sub-tareas si existen
      const tieneSubtareas = document.getElementById('universalTieneSubtareas')?.checked
      if (tieneSubtareas) {
        data.subtareas = this.procesarUniversalSubtareas()
        console.log('Sub-tareas procesadas:', data.subtareas)
      }

      console.log('Enviando datos al API:', {
        decretoId,
        hasSubtareas: Boolean(data.subtareas?.length),
        subtareaCount: data.subtareas?.length || 0,
        fecha_evento: data.fecha_evento,
        hora_evento: data.hora_evento,
        es_enfoque_dia: data.es_enfoque_dia
      })

      const response = await API.decretos.createAccion(decretoId, data)
      console.log('✅ Respuesta exitosa del API:', response)

      Modal.close('universalAccionModal')

      // Mostrar mensaje personalizado
      if (response.data?.subtareas_creadas > 0) {
        Utils.showToast(`✅ Acción creada con ${response.data.subtareas_creadas} sub-tarea(s)`, 'success')
      } else {
        Utils.showToast('✅ Acción creada exitosamente', 'success')
      }

      // Recargar vista de detalle si estamos en ella
      if (this.data.selectedDecreto) {
        await this.openDetalleDecreto(decretoId)
      }

      console.log('=== PROCESO COMPLETADO EXITOSAMENTE ===')

    } catch (error) {
      console.error('❌ ERROR EN PROCESO:', {
        formId,
        error: error.message,
        stack: error.stack
      })
      Utils.showToast('Error al crear acción', 'error')
    } finally {
      // Limpiar flags y restaurar estado SIEMPRE
      console.log('🧹 Limpiando flags y restaurando estado')
      this._processingForm = null
      this._lastFormHash = null

      if (submitButton) {
        submitButton.disabled = false
        submitButton.innerHTML = '<i class="fas fa-save mr-2"></i>Guardar Acción'
      }

      console.log('=== FIN handleUniversalAccionSubmit ===')
    }
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

  openEditModal(decretoId) {
    const decreto = this.data.decretos.find(d => d.id === decretoId)
    if (!decreto) {
      Utils.showToast('Decreto no encontrado', 'error')
      return
    }

    // Llenar los campos del modal con los datos actuales
    setTimeout(() => {
      document.getElementById('editDecretoId').value = decreto.id
      document.getElementById('editAreaSelect').value = decreto.area
      document.getElementById('editTituloInput').value = decreto.titulo
      document.getElementById('editSuenoMetaTextarea').value = decreto.sueno_meta
      document.getElementById('editDescripcionTextarea').value = decreto.descripcion || ''
      document.getElementById('editEmpresaNombreInput').value = decreto.empresa_nombre || ''
      document.getElementById('editLogoUrlInput').value = decreto.logo_url || ''
      document.getElementById('editVisualizacionUrlInput').value = decreto.imagen_visualizacion || ''

      // Mostrar logo existente si hay
      const logoPreview = document.getElementById('editLogoPreview')
      if (decreto.logo_url) {
        logoPreview.innerHTML = `<img src="${decreto.logo_url}" class="h-16 w-16 object-contain rounded border border-slate-600" />`
      } else {
        logoPreview.innerHTML = ''
      }

      // Mostrar imagen de visualización existente si hay
      const visualizacionPreview = document.getElementById('editVisualizacionPreview')
      if (decreto.imagen_visualizacion) {
        visualizacionPreview.innerHTML = `<img src="${decreto.imagen_visualizacion}" class="h-24 w-auto max-w-full object-contain rounded border border-purple-500" />`
      } else {
        visualizacionPreview.innerHTML = ''
      }

      // Mostrar campos de empresa/logo si es empresarial
      this.toggleLogoField('edit')
    }, 100)

    Modal.open('editDecretoModal')
  },

  async handleEditDecreto(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const decretoId = formData.get('decreto_id')

    const data = {
      area: formData.get('area'),
      titulo: formData.get('titulo'),
      sueno_meta: formData.get('sueno_meta'),
      descripcion: formData.get('descripcion'),
      empresa_nombre: formData.get('empresa_nombre') || null,
      logo_url: formData.get('logo_url') || null,
      imagen_visualizacion: formData.get('imagen_visualizacion') || null
    }
    
    try {
      await API.decretos.update(decretoId, data)
      Modal.close('editDecretoModal')
      Utils.showToast('Decreto actualizado exitosamente', 'success')
      await this.render() // Recargar vista
      
      // Si estamos en vista de detalle, recargar también
      if (AppState.currentSection === 'detalle-decreto' && this.data.selectedDecreto?.id === decretoId) {
        await this.openDetalleDecreto(decretoId)
      }
    } catch (error) {
      Utils.showToast('Error al actualizar decreto', 'error')
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

  async editNombreUsuario() {
    const user = AppState.user || {}
    const nuevoNombre = prompt('Edita tu nombre:', user.nombre_usuario || 'Gustavo Adolfo Guerrero Castaños')
    
    if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
      try {
        await API.config.update({
          nombre_usuario: nuevoNombre.trim(),
          frase_vida: user.frase_vida
        })
        AppState.user.nombre_usuario = nuevoNombre.trim()
        Utils.showToast('Nombre actualizado', 'success')
        await this.render()
      } catch (error) {
        Utils.showToast('Error al actualizar nombre', 'error')
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

  async toggleEstado(decretoId, nuevoEstado) {
    try {
      const estadoTexto = nuevoEstado === 'activo' ? 'Activo' : 'Standby'

      await API.request(`/decretos/${decretoId}/estado`, {
        method: 'PUT',
        data: { estado: nuevoEstado }
      })

      Utils.showToast(`Decreto cambiado a ${estadoTexto}`, 'success')
      await this.render()
    } catch (error) {
      Utils.showToast('Error al cambiar estado del decreto', 'error')
    }
  },

  async openDetalleDecreto(decretoId) {
    try {
      console.log('🔍 Abriendo detalle del decreto:', decretoId)

      // Cambiar la sección a detalle-decreto
      AppState.currentSection = 'detalle-decreto'
      AppState.selectedDecreto = decretoId

      const mainContent = document.getElementById('main-content')
      if (!mainContent) {
        console.error('❌ No se encontró el elemento main-content')
        // Si estamos en un entorno de test, redirigir a la aplicación principal
        if (window.location.pathname.includes('/static/test-')) {
          window.location.href = `/#decreto-${decretoId}`
          return
        }
        return
      }

      mainContent.innerHTML = UI.renderLoading('Cargando detalle del decreto...')

      // Cargar datos del decreto
      console.log('📡 Llamando API.decretos.get(' + decretoId + ')')
      const response = await API.decretos.get(decretoId)
      console.log('📦 Response completa:', response)
      console.log('📦 Response type:', typeof response)
      console.log('📦 Response keys:', Object.keys(response || {}))
      console.log('📦 Response.success:', response?.success)
      console.log('📦 Response.data:', response?.data)
      console.log('📦 Response.data type:', typeof response?.data)
      console.log('📦 Response.data keys:', Object.keys(response?.data || {}))
      console.log('📦 Response.data.decreto:', response?.data?.decreto)

      // Verificar estructura de respuesta
      if (!response || typeof response !== 'object') {
        throw new Error(`Respuesta inválida del servidor: ${typeof response}`)
      }

      if (!response.success) {
        throw new Error(response.error || 'Error desconocido del servidor')
      }

      if (!response.data) {
        throw new Error('La respuesta no contiene datos')
      }

      if (!response.data.decreto) {
        console.error('❌ Estructura de response.data:', JSON.stringify(response.data, null, 2))
        throw new Error('No se encontraron datos del decreto')
      }

      // Asignar el decreto con sus acciones y métricas
      this.data.selectedDecreto = {
        ...response.data.decreto,
        acciones: response.data.acciones || [],
        metricas: response.data.metricas || {}
      }

      console.log('✅ Decreto cargado, renderizando vista...')

      // Renderizar vista de detalle
      mainContent.innerHTML = this.renderDetalleDecreto()

      // Renderizar modales específicos de detalle
      this.renderDetalleModals()

      // Agregar event listeners para botones dinámicos
      this.attachDetalleEventListeners()

      console.log('✅ Detalle del decreto renderizado exitosamente')

    } catch (error) {
      console.error('❌ Error al cargar detalle del decreto:', error)
      console.error('❌ Error stack:', error.stack)

      // Mostrar error específico
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        mainContent.innerHTML = this.renderError(
          `Error al cargar el decreto: ${error.message || 'Error desconocido'}`
        )
      }
      
      if (typeof Utils !== 'undefined' && Utils.showToast) {
        Utils.showToast('Error al cargar el decreto', 'error')
      }
      
      // Regresar a la vista principal después de un momento
      setTimeout(() => {
        Router.navigate('decretos')
      }, 3000)
    }
  },

  renderDetalleDecreto() {
    const decreto = this.data.selectedDecreto
    if (!decreto) {
      console.error('No hay decreto seleccionado en renderDetalleDecreto')
      return this.renderError()
    }

    if (!decreto.titulo) {
      console.error('Decreto sin título:', decreto)
      return this.renderError('Datos del decreto incompletos')
    }

    const areaConfig = {
      empresarial: { color: 'accent-green', icon: '🏢', gradient: 'from-green-600 to-emerald-600' },
      material: { color: 'accent-orange', icon: '💰', gradient: 'from-orange-600 to-amber-600' },
      humano: { color: 'accent-blue', icon: '❤️', gradient: 'from-blue-600 to-purple-600' }
    }
    const config = areaConfig[decreto.area] || areaConfig.empresarial

    return `
      <div class="min-h-screen bg-slate-900">
        <!-- Botón de regreso flotante -->
        <div class="fixed top-6 left-6 z-50">
          <button
            onclick="Decretos.volverALista()"
            class="flex items-center space-x-2 bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 text-white px-4 py-2 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <i class="fas fa-arrow-left"></i>
            <span>Volver</span>
          </button>
        </div>

        <!-- Layout 50/50 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

          <!-- LADO IZQUIERDO: Imagen de Visualización -->
          <div class="relative bg-slate-900 p-4 lg:p-6 flex items-start justify-center overflow-hidden pt-24">

            <div class="relative z-10 w-full flex flex-col items-center">
              ${decreto.imagen_visualizacion ? `
                <!-- Imagen existente - MÁS GRANDE -->
                <div class="w-full flex flex-col items-center">
                  <div class="relative group w-full max-w-3xl mb-4">
                    <img
                      src="${decreto.imagen_visualizacion}"
                      alt="Visualización de ${decreto.titulo}"
                      class="w-full h-auto object-contain rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div class="text-center">
                    <button
                      onclick="Decretos.regenerarImagenVisualizacion('${decreto.id}')"
                      class="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 border border-white/20"
                    >
                      <i class="fas fa-sync-alt mr-2"></i>
                      Regenerar Visualización
                    </button>
                  </div>
                </div>
              ` : `
                <!-- Generar imagen por primera vez -->
                <div class="text-center">
                  <div class="mb-8">
                    <div class="text-8xl mb-4">${config.icon}</div>
                    <h3 class="text-3xl font-bold text-white mb-4">Visualiza tu éxito</h3>
                    <p class="text-white/90 text-lg mb-2">Genera una imagen que represente</p>
                    <p class="text-white/90 text-lg font-semibold">cómo te ves logrando este decreto</p>
                  </div>
                  <button
                    onclick="Decretos.generarImagenVisualizacion('${decreto.id}')"
                    class="bg-white hover:bg-white/90 text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-2xl"
                  >
                    <i class="fas fa-magic mr-2"></i>
                    Generar Mi Visualización
                  </button>
                  <p class="text-white/70 text-sm mt-4">Powered by IA</p>
                </div>
              `}
            </div>
          </div>

          <!-- LADO DERECHO: Información del Decreto -->
          <div class="bg-slate-900 p-8 lg:p-12 overflow-y-auto">

            <!-- Header compacto -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  ${decreto.logo_url ? `
                    <img src="${decreto.logo_url}" alt="${decreto.empresa_nombre || 'Logo'}" class="h-16 w-16 object-contain" />
                  ` : `
                    <span class="text-5xl">${config.icon}</span>
                  `}
                  <div>
                    ${decreto.empresa_nombre ? `
                      <div class="text-xs text-slate-400 uppercase tracking-wider">${decreto.empresa_nombre}</div>
                    ` : ''}
                    <h1 class="text-3xl font-bold text-white">${decreto.titulo}</h1>
                  </div>
                </div>
                <button
                  onclick="Decretos.openEditModal('${decreto.id}')"
                  class="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
              </div>
              <p class="text-xl text-slate-300 mb-3">${decreto.sueno_meta}</p>
              ${decreto.descripcion ? `<p class="text-slate-400">${decreto.descripcion}</p>` : ''}
            </div>

            <!-- Progreso -->
            ${this.renderDetalleProgreso(decreto)}

            <!-- Sistema de Pestañas -->
            <div class="mb-6">
              <div class="flex border-b border-slate-700">
                <button
                  onclick="Decretos.switchDetalleTab('acciones')"
                  id="tab-acciones"
                  class="tab-button active px-6 py-3 font-semibold text-sm transition-all border-b-2 border-accent-green text-accent-green"
                >
                  <i class="fas fa-tasks mr-2"></i>
                  Mis Acciones
                </button>
                <button
                  onclick="Decretos.switchDetalleTab('historial')"
                  id="tab-historial"
                  class="tab-button px-6 py-3 font-semibold text-sm transition-all border-b-2 border-transparent text-slate-400 hover:text-slate-200"
                >
                  <i class="fas fa-history mr-2"></i>
                  Historial CRM
                </button>
              </div>
            </div>

            <!-- Contenido de Pestañas -->
            <div id="tab-content-acciones" class="tab-content space-y-6">
              ${this.renderMisAcciones(decreto)}
              ${this.renderSugerenciasHoy(decreto)}
            </div>

            <div id="tab-content-historial" class="tab-content hidden">
              ${this.renderHistorialCRM(decreto)}
            </div>

          </div>

        </div>
      </div>
    `
  },

  renderDetalleHeader(decreto) {
    const areaConfig = {
      empresarial: { color: 'accent-green', icon: '🏢' },
      material: { color: 'accent-orange', icon: '💰' },
      humano: { color: 'accent-blue', icon: '❤️' }
    }
    const config = areaConfig[decreto.area] || areaConfig.empresarial

    return `
      <div class="mb-8 relative">
        <!-- Botón de editar (esquina superior derecha) -->
        <button
          onclick="Decretos.openEditModal('${decreto.id}')"
          class="absolute top-0 right-0 w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 hover:scale-110"
          title="Editar decreto"
        >
          <i class="fas fa-edit"></i>
        </button>

        <div class="flex items-start space-x-6">
          ${decreto.logo_url ? `
            <div class="flex-shrink-0">
              <img src="${decreto.logo_url}" alt="${decreto.empresa_nombre || 'Logo'}" class="h-44 w-44 object-contain" />
            </div>
          ` : ''}

          <div class="flex-1">
            ${decreto.empresa_nombre ? `
              <div class="text-sm text-slate-400 mb-2 uppercase tracking-widest font-semibold">${decreto.empresa_nombre}</div>
            ` : ''}

            <div class="flex items-center mb-4">
              <span class="text-4xl mr-3">${config.icon}</span>
              <h1 class="text-4xl font-bold text-${config.color}">${decreto.titulo}</h1>
            </div>
            <p class="text-xl text-slate-300">${decreto.sueno_meta}</p>
            ${decreto.descripcion ? `<p class="text-slate-400 mt-4">${decreto.descripcion}</p>` : ''}
          </div>

          ${decreto.imagen_visualizacion ? `
            <div class="flex-shrink-0">
              <div class="text-xs text-purple-400 mb-2 uppercase tracking-wider font-semibold text-center">🎯 Tu Visión</div>
              <img src="${decreto.imagen_visualizacion}" alt="Visualización de ${decreto.titulo}" class="w-64 h-auto object-contain rounded-lg border-2 border-purple-500/50 shadow-lg" />
            </div>
          ` : ''}
        </div>
      </div>
    `
  },

  renderDetalleProgreso(decreto) {
    const metricas = decreto.metricas || {
      total_acciones: 0,
      completadas: 0,
      pendientes: 0,
      sugerencias_disponibles: 5
    }

    return `
      <div class="mb-8">
        <!-- Barra de progreso principal -->
        <div class="gradient-card p-6 rounded-xl mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-semibold">Progreso General</h2>
            <div class="text-3xl font-bold text-accent-green">${decreto.progreso || 0}%</div>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-4">
            <div 
              class="progress-bar h-4 rounded-full bg-gradient-to-r from-accent-green to-accent-blue" 
              style="width: ${decreto.progreso || 0}%"
            ></div>
          </div>
        </div>

        <!-- 4 tarjetas métricas con 3 estados -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="metric-card p-4 text-center">
            <div class="text-2xl font-bold text-white">${metricas.total_acciones}</div>
            <div class="text-slate-300 text-sm">Acciones Registradas</div>
          </div>
          <div class="metric-card p-4 text-center">
            <div class="text-2xl font-bold text-accent-green">${metricas.completadas}</div>
            <div class="text-slate-300 text-sm">Completadas</div>
          </div>
          <div class="metric-card p-4 text-center">
            <div class="text-2xl font-bold text-accent-blue">${metricas.en_progreso || 0}</div>
            <div class="text-slate-300 text-sm">En Progreso</div>
          </div>
          <div class="metric-card p-4 text-center">
            <div class="text-2xl font-bold text-accent-orange">${metricas.pendientes}</div>
            <div class="text-slate-300 text-sm">Pendientes</div>
          </div>
        </div>
      </div>
    `
  },

  renderMisAcciones(decreto) {
    const acciones = decreto.acciones || []
    const primarias = acciones.filter(a => a.tipo === 'primaria')
    const secundarias = acciones.filter(a => a.tipo === 'secundaria')

    return `
      <div class="gradient-card p-6 rounded-xl">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <h3 class="text-xl font-semibold flex items-center">
              <i class="fas fa-tasks mr-2"></i>
              Mis Acciones
            </h3>
            <button
              id="btnAccionesHelp"
              class="w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs flex items-center justify-center transition-all"
              title="¿Qué son las acciones primarias y secundarias?"
              type="button"
            >
              <i class="fas fa-question"></i>
            </button>
          </div>
          <div class="flex gap-2">
            <button
              onclick="Decretos.openUniversalAccionModal('${decreto.id}', 'primaria')"
              class="btn-primary px-4 py-2 rounded-lg text-sm bg-accent-green hover:bg-accent-green/80"
            >
              <i class="fas fa-star mr-1"></i>
              Acción Primaria
            </button>
            <button
              onclick="Decretos.openUniversalAccionModal('${decreto.id}', 'secundaria')"
              class="btn-primary px-4 py-2 rounded-lg text-sm bg-accent-blue hover:bg-accent-blue/80"
            >
              <i class="fas fa-calendar-day mr-1"></i>
              Acción Secundaria
            </button>
          </div>
        </div>

        <!-- Acciones Primarias (Semanales) -->
        ${primarias.length > 0 ? `
          <div class="mb-6">
            <h4 class="text-lg font-medium text-accent-green mb-3 flex items-center">
              <i class="fas fa-star mr-2"></i>
              Acciones Primarias (Semanales)
            </h4>
            <div class="space-y-3">
              ${primarias.map(accion => this.renderAccionCard(accion, 'primaria')).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Acciones Secundarias (Diarias) -->
        ${secundarias.length > 0 ? `
          <div class="mb-4">
            <h4 class="text-lg font-medium text-accent-blue mb-3 flex items-center">
              <i class="fas fa-calendar-day mr-2"></i>
              Acciones Secundarias (Diarias)
            </h4>
            <div class="space-y-3">
              ${secundarias.map(accion => this.renderAccionCard(accion, 'secundaria')).join('')}
            </div>
          </div>
        ` : ''}

        ${acciones.length === 0 ? `
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-3">📋</div>
            <p class="text-lg mb-2">No hay acciones registradas</p>
            <p class="text-sm">¡Crea tu primera acción para este decreto!</p>
          </div>
        ` : ''}
      </div>
    `
  },

  renderAccionCard(accion, tipo) {
    const isCompleted = accion.estado === 'completada'
    const typeColor = tipo === 'primaria' ? 'accent-green' : 'accent-blue'
    const hasAgendaSync = accion.agenda_event_id || tipo === 'secundaria' || tipo === 'primaria' // Secundarias y Primarias siempre tienen acceso a agenda
    
    // Determinar si la acción está retrasada
    const isOverdue = this.isAccionOverdue(accion, isCompleted)

    return `
      <div class="accion-card p-4 rounded-lg ${isCompleted ? 'opacity-75' : ''}" data-accion-id="${accion.id}">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              ${isOverdue ? `
                <div class="w-3 h-3 bg-red-500 rounded-sm border border-red-400" title="Acción retrasada"></div>
              ` : ''}
              <h5 class="font-semibold ${isCompleted ? 'line-through text-slate-400' : isOverdue ? 'text-red-300' : 'text-white'} cursor-pointer hover:text-accent-blue transition-colors" onclick="Decretos.openDetalleAccion('${accion.id}')">${accion.titulo}</h5>
              ${hasAgendaSync ? `
                <div class="flex items-center space-x-1">
                  <span class="inline-block w-2 h-2 bg-accent-blue rounded-full" title="Sincronizada con agenda"></span>
                  <span class="text-xs text-accent-blue">
                    <i class="fas fa-sync-alt"></i>
                  </span>
                </div>
              ` : ''}
              ${tipo === 'secundaria' ? `
                <span class="inline-block px-2 py-0.5 text-xs bg-accent-blue/20 text-accent-blue rounded-full border border-accent-blue/30">
                  Diaria
                </span>
              ` : `
                <span class="inline-block px-2 py-0.5 text-xs bg-accent-green/20 text-accent-green rounded-full border border-accent-green/30">
                  Semanal
                </span>
              `}
            </div>
            ${accion.que_hacer ? `
              <div class="text-sm text-slate-300 mb-1">${accion.que_hacer}</div>
            ` : ''}
            ${accion.proxima_revision ? `
              <div class="text-xs ${isOverdue ? 'text-red-400' : 'text-slate-400'} mt-1">
                <i class="fas fa-calendar mr-1"></i>
                ${tipo === 'secundaria' ? 'Programada para:' : 'Próxima revisión:'} ${Utils.formatDate(accion.proxima_revision)}
                ${isOverdue ? `
                  <span class="text-red-400 font-medium ml-2">
                    <i class="fas fa-exclamation-triangle mr-1"></i>
                    RETRASADA
                  </span>
                ` : ''}
              </div>
            ` : ''}
            ${tipo === 'secundaria' && !accion.proxima_revision ? `
              <div class="text-xs text-accent-blue mt-1">
                <i class="fas fa-calendar-day mr-1"></i>
                Disponible en agenda diaria
              </div>
            ` : ''}
          </div>
          <div class="flex items-center space-x-2">
            ${hasAgendaSync ? `
              <button 
                onclick="Decretos.verEnAgenda('${accion.id}')"
                class="group relative bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-400/50 text-blue-300 hover:text-blue-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                title="Ver en agenda"
              >
                <i class="fas fa-calendar-alt text-sm"></i>
                <div class="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ` : ''}
            <button 
              onclick="Decretos.openSeguimientoModal('${accion.id}')"
              class="group relative bg-gradient-to-r ${tipo === 'primaria' ? 'from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border-green-400/50 text-green-300 hover:text-green-200' : 'from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border-blue-400/50 text-blue-300 hover:text-blue-200'} border px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-${tipo === 'primaria' ? 'green' : 'blue'}-500/20"
              title="Seguimiento"
            >
              <i class="fas fa-lock text-sm"></i>
              <div class="absolute -top-1 -right-1 w-2 h-2 ${tipo === 'primaria' ? 'bg-green-400' : 'bg-blue-400'} rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button 
              onclick="Decretos.cambiarEstadoAccion('${accion.id}')"
              class="group relative bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-400/50 text-purple-300 hover:text-purple-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              title="${accion.estado === 'pendiente' ? 'Iniciar' : accion.estado === 'en_progreso' ? 'Completar' : 'Reiniciar'}"
            >
              <i class="fas fa-${accion.estado === 'pendiente' ? 'play' : accion.estado === 'en_progreso' ? 'check' : 'undo'} text-sm"></i>
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button 
              onclick="Decretos.confirmarBorrarAccion('${accion.id}')"
              class="group relative bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-400/50 text-red-300 hover:text-red-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
              title="Borrar"
            >
              <i class="fas fa-trash text-sm"></i>
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
        
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center space-x-4">
            ${accion.seguimientos && accion.seguimientos.length > 0 ? `
              <div class="text-slate-400">
                <i class="fas fa-history mr-1"></i>
                ${accion.seguimientos.length} seguimiento${accion.seguimientos.length !== 1 ? 's' : ''}
              </div>
            ` : ''}
            ${accion.origen && accion.origen !== 'manual' ? `
              <div class="text-slate-500">
                <i class="fas fa-robot mr-1"></i>
                Auto-generada
              </div>
            ` : ''}
          </div>
          ${tipo === 'secundaria' ? `
            <div class="text-accent-blue">
              <i class="fas fa-arrows-alt-h mr-1"></i>
              Bidireccional
            </div>
          ` : ''}
        </div>
      </div>
    `
  },

  renderSugerenciasHoy(decreto) {
    // Sugerencias hardcodeadas por ahora, luego se pueden generar dinámicamente
    const sugerencias = [
      {
        id: 1,
        titulo: "Revisar métricas semanales",
        descripcion: "Analiza el progreso de la semana y ajusta estrategias",
        categoria: "análisis"
      },
      {
        id: 2,
        titulo: "Networking estratégico",
        descripcion: "Contacta 3 personas clave en tu industria",
        categoria: "relaciones"
      },
      {
        id: 3,
        titulo: "Optimizar procesos",
        descripcion: "Identifica 1 proceso que se pueda automatizar",
        categoria: "eficiencia"
      }
    ]

    return `
      <div class="gradient-card p-6 rounded-xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold flex items-center">
            <i class="fas fa-lightbulb mr-2"></i>
            Sugerencias para Hoy
          </h3>
          <button 
            onclick="Decretos.generarMasSugerencias('${decreto.id}')"
            class="btn-outline-blue px-4 py-2 rounded-lg text-sm"
          >
            <i class="fas fa-refresh mr-1"></i>
            Generar más
          </button>
        </div>

        <div class="space-y-4">
          ${sugerencias.map(sugerencia => `
            <div class="sugerencia-card p-4 rounded-lg border border-slate-600">
              <h5 class="font-semibold text-white mb-2">${sugerencia.titulo}</h5>
              <p class="text-slate-300 text-sm mb-3">${sugerencia.descripcion}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">${sugerencia.categoria}</span>
                <button 
                  onclick="Decretos.agregarSugerenciaAAcciones('${decreto.id}', ${sugerencia.id})"
                  class="btn-primary px-3 py-1 text-xs rounded"
                >
                  <i class="fas fa-plus mr-1"></i>
                  Agregar
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="text-center mt-6">
          <p class="text-slate-400 text-sm">
            <i class="fas fa-info-circle mr-1"></i>
            Las sugerencias se adaptan a tu decreto y progreso actual
          </p>
        </div>
      </div>
    `
  },

  volverALista() {
    AppState.currentSection = 'decretos'
    AppState.selectedDecreto = null
    this.data.selectedDecreto = null
    this.render()
  },

  // Función para cambiar entre pestañas en vista detalle
  switchDetalleTab(tabName) {
    // Remover clases activas de todos los botones
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active', 'border-accent-green', 'text-accent-green')
      btn.classList.add('border-transparent', 'text-slate-400')
    })

    // Ocultar todos los contenidos
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden')
    })

    // Activar el tab seleccionado
    const tabButton = document.getElementById(`tab-${tabName}`)
    const tabContent = document.getElementById(`tab-content-${tabName}`)

    if (tabButton && tabContent) {
      tabButton.classList.add('active', 'border-accent-green', 'text-accent-green')
      tabButton.classList.remove('border-transparent', 'text-slate-400')
      tabContent.classList.remove('hidden')
    }
  },

  // Renderizar la vista de Historial CRM
  renderHistorialCRM(decreto) {
    const acciones = decreto.acciones || []

    // Ordenar por fecha (más recientes primero)
    const accionesOrdenadas = [...acciones].sort((a, b) => {
      const fechaA = a.fecha_completada || a.fecha_hora || a.created_at
      const fechaB = b.fecha_completada || b.fecha_hora || b.created_at
      return new Date(fechaB) - new Date(fechaA)
    })

    // Calcular estadísticas
    const stats = this.calcularEstadisticasHistorial(acciones)

    return `
      <div class="space-y-6">
        <!-- Panel de Estadísticas -->
        ${this.renderEstadisticasHistorial(stats)}

        <!-- Filtros -->
        <div class="gradient-card p-4 rounded-xl">
          <div class="flex flex-wrap gap-3">
            <div class="flex-1 min-w-[200px]">
              <input
                type="text"
                id="historial-search"
                placeholder="🔍 Buscar acción..."
                oninput="Decretos.filtrarHistorial()"
                class="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-accent-green focus:outline-none"
              />
            </div>
            <select
              id="historial-filter-estado"
              onchange="Decretos.filtrarHistorial()"
              class="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-accent-green focus:outline-none"
            >
              <option value="todas">📊 Todos los estados</option>
              <option value="completada">✅ Completadas</option>
              <option value="en_progreso">⏳ En Progreso</option>
              <option value="pendiente">⏸️ Pendientes</option>
              <option value="cancelada">❌ Canceladas</option>
            </select>
            <select
              id="historial-filter-tipo"
              onchange="Decretos.filtrarHistorial()"
              class="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-accent-green focus:outline-none"
            >
              <option value="todas">🎯 Todos los tipos</option>
              <option value="primaria">🌟 Primarias</option>
              <option value="secundaria">📅 Secundarias</option>
            </select>
            <select
              id="historial-filter-fecha"
              onchange="Decretos.filtrarHistorial()"
              class="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-accent-green focus:outline-none"
            >
              <option value="todas">📅 Todo el tiempo</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
              <option value="3meses">Últimos 3 meses</option>
            </select>
          </div>
        </div>

        <!-- Timeline de Acciones -->
        <div class="gradient-card p-6 rounded-xl">
          <h3 class="text-xl font-semibold mb-6 flex items-center">
            <i class="fas fa-timeline mr-2"></i>
            Timeline de Acciones
          </h3>
          <div id="historial-timeline" class="space-y-4">
            ${accionesOrdenadas.length > 0
              ? accionesOrdenadas.map(accion => this.renderTimelineItem(accion)).join('')
              : '<div class="text-center text-slate-400 py-8">No hay acciones registradas aún</div>'
            }
          </div>
        </div>
      </div>
    `
  },

  calcularEstadisticasHistorial(acciones) {
    const total = acciones.length
    const completadas = acciones.filter(a => a.estado === 'completada').length
    const enProgreso = acciones.filter(a => a.estado === 'en_progreso').length
    const pendientes = acciones.filter(a => a.estado === 'pendiente').length
    const canceladas = acciones.filter(a => a.estado === 'cancelada').length

    // Calcular promedio de días para completar
    const completadasConFechas = acciones.filter(a =>
      a.estado === 'completada' && a.created_at && a.fecha_completada
    )

    let promedioDias = 0
    if (completadasConFechas.length > 0) {
      const totalDias = completadasConFechas.reduce((sum, accion) => {
        const inicio = new Date(accion.created_at)
        const fin = new Date(accion.fecha_completada)
        const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24))
        return sum + dias
      }, 0)
      promedioDias = Math.round(totalDias / completadasConFechas.length)
    }

    // Calcular racha más larga
    const rachaActual = this.calcularRachaMasLarga(acciones)

    return {
      total,
      completadas,
      enProgreso,
      pendientes,
      canceladas,
      promedioDias,
      rachaActual,
      tasaCompletado: total > 0 ? Math.round((completadas / total) * 100) : 0
    }
  },

  calcularRachaMasLarga(acciones) {
    const completadas = acciones
      .filter(a => a.estado === 'completada' && a.fecha_completada)
      .sort((a, b) => new Date(a.fecha_completada) - new Date(b.fecha_completada))

    if (completadas.length === 0) return 0

    let rachaActual = 1
    let rachaMaxima = 1

    for (let i = 1; i < completadas.length; i++) {
      const fechaAnterior = new Date(completadas[i - 1].fecha_completada)
      const fechaActual = new Date(completadas[i].fecha_completada)
      const diferenciaDias = Math.ceil((fechaActual - fechaAnterior) / (1000 * 60 * 60 * 24))

      if (diferenciaDias <= 7) {
        rachaActual++
        rachaMaxima = Math.max(rachaMaxima, rachaActual)
      } else {
        rachaActual = 1
      }
    }

    return rachaMaxima
  },

  renderEstadisticasHistorial(stats) {
    return `
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="gradient-card p-4 rounded-xl text-center">
          <div class="text-3xl font-bold text-white mb-1">${stats.total}</div>
          <div class="text-slate-300 text-sm">Acciones Totales</div>
        </div>
        <div class="gradient-card p-4 rounded-xl text-center">
          <div class="text-3xl font-bold text-accent-green mb-1">${stats.tasaCompletado}%</div>
          <div class="text-slate-300 text-sm">Tasa de Éxito</div>
        </div>
        <div class="gradient-card p-4 rounded-xl text-center">
          <div class="text-3xl font-bold text-accent-blue mb-1">${stats.promedioDias}</div>
          <div class="text-slate-300 text-sm">Días Promedio</div>
        </div>
        <div class="gradient-card p-4 rounded-xl text-center">
          <div class="text-3xl font-bold text-accent-orange mb-1">${stats.rachaActual}</div>
          <div class="text-slate-300 text-sm">Racha Máxima</div>
        </div>
      </div>
    `
  },

  renderTimelineItem(accion) {
    const estadoConfig = {
      completada: { icon: 'fa-check-circle', color: 'text-green-400', bgColor: 'bg-green-900/30', borderColor: 'border-green-600/50' },
      en_progreso: { icon: 'fa-spinner', color: 'text-blue-400', bgColor: 'bg-blue-900/30', borderColor: 'border-blue-600/50' },
      pendiente: { icon: 'fa-clock', color: 'text-orange-400', bgColor: 'bg-orange-900/30', borderColor: 'border-orange-600/50' },
      cancelada: { icon: 'fa-times-circle', color: 'text-red-400', bgColor: 'bg-red-900/30', borderColor: 'border-red-600/50' }
    }

    const config = estadoConfig[accion.estado] || estadoConfig.pendiente
    const tipoIcon = accion.tipo === 'primaria' ? '🌟' : '📅'
    const fecha = accion.fecha_completada || accion.fecha_hora || accion.created_at
    const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Sin fecha'

    return `
      <div class="timeline-item ${config.bgColor} ${config.borderColor} border-l-4 pl-6 py-4 rounded-r-lg relative hover:shadow-lg transition-all duration-300" data-accion-id="${accion.id}" data-estado="${accion.estado}" data-tipo="${accion.tipo}" data-fecha="${fecha}">
        <!-- Punto en la línea de tiempo -->
        <div class="absolute -left-3 top-6 w-6 h-6 ${config.color} bg-slate-900 rounded-full flex items-center justify-center border-2 border-current">
          <i class="fas ${config.icon} text-xs"></i>
        </div>

        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">${tipoIcon}</span>
              <span class="text-sm font-semibold ${config.color} uppercase">${accion.tipo}</span>
              <span class="text-xs text-slate-400">${fechaFormateada}</span>
            </div>
            <h4 class="text-lg font-semibold text-white mb-1">${accion.titulo}</h4>
            ${accion.que_hacer ? `<p class="text-slate-300 text-sm mb-2">${accion.que_hacer}</p>` : ''}
            ${accion.notas ? `<div class="text-slate-400 text-xs italic mt-2">📝 ${accion.notas}</div>` : ''}
          </div>
          <div class="text-right ml-4">
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${config.color} ${config.bgColor} border ${config.borderColor}">
              ${this.getEstadoLabel(accion.estado)}
            </span>
          </div>
        </div>
      </div>
    `
  },

  getEstadoLabel(estado) {
    const labels = {
      completada: '✅ Completada',
      en_progreso: '⏳ En Progreso',
      pendiente: '⏸️ Pendiente',
      cancelada: '❌ Cancelada'
    }
    return labels[estado] || estado
  },

  filtrarHistorial() {
    const searchText = document.getElementById('historial-search')?.value.toLowerCase() || ''
    const filterEstado = document.getElementById('historial-filter-estado')?.value || 'todas'
    const filterTipo = document.getElementById('historial-filter-tipo')?.value || 'todas'
    const filterFecha = document.getElementById('historial-filter-fecha')?.value || 'todas'

    const now = new Date()
    const timeline = document.querySelectorAll('#historial-timeline .timeline-item')

    timeline.forEach(item => {
      const texto = item.textContent.toLowerCase()
      const estado = item.dataset.estado
      const tipo = item.dataset.tipo
      const fecha = new Date(item.dataset.fecha)

      let mostrar = true

      // Filtro de búsqueda
      if (searchText && !texto.includes(searchText)) {
        mostrar = false
      }

      // Filtro de estado
      if (filterEstado !== 'todas' && estado !== filterEstado) {
        mostrar = false
      }

      // Filtro de tipo
      if (filterTipo !== 'todas' && tipo !== filterTipo) {
        mostrar = false
      }

      // Filtro de fecha
      if (filterFecha !== 'todas' && fecha) {
        const diffDays = Math.ceil((now - fecha) / (1000 * 60 * 60 * 24))

        if (filterFecha === 'semana' && diffDays > 7) {
          mostrar = false
        } else if (filterFecha === 'mes' && diffDays > 30) {
          mostrar = false
        } else if (filterFecha === '3meses' && diffDays > 90) {
          mostrar = false
        }
      }

      item.style.display = mostrar ? 'block' : 'none'
    })
  },

  async generarImagenVisualizacion(decretoId) {
    try {
      // Mostrar loading
      Utils.showToast('Generando visualización con IA...', 'info')

      const decreto = this.data.decretos.find(d => d.id === decretoId)
      if (!decreto) {
        Utils.showToast('No se encontró el decreto', 'error')
        return
      }

      // Llamar API para generar imagen
      const response = await fetch('/api/ai/generate-visualization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decretoId: decretoId,
          titulo: decreto.titulo,
          sueno_meta: decreto.sueno_meta,
          descripcion: decreto.descripcion,
          area: decreto.area
        })
      })

      const data = await response.json()

      if (data.success && data.imageUrl) {
        // Actualizar el decreto con la nueva imagen
        decreto.imagen_visualizacion = data.imageUrl

        // Refrescar la vista
        await this.openDetalleDecreto(decretoId)
        Utils.showToast('¡Visualización generada con éxito!', 'success')
      } else {
        // Mostrar error detallado en consola
        console.error('Error detallado del servidor:', data)
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error || 'Error al generar la visualización'
        Utils.showToast(errorMsg, 'error')
      }
    } catch (error) {
      console.error('Error generando visualización:', error)
      Utils.showToast('Error al generar la visualización', 'error')
    }
  },

  async regenerarImagenVisualizacion(decretoId) {
    const confirmed = confirm('¿Estás seguro de regenerar la visualización? Se perderá la imagen actual.')
    if (!confirmed) return

    // Usar la misma función de generación
    await this.generarImagenVisualizacion(decretoId)
  },

  renderDetalleModals() {
    // Limpiar modales existentes para evitar duplicados
    const existingSeguimiento = document.getElementById('seguimientoModal')
    if (existingSeguimiento) existingSeguimiento.remove()
    
    const existingCreateAccionDetalle = document.getElementById('createAccionDetalleModal')
    if (existingCreateAccionDetalle) existingCreateAccionDetalle.remove()
    
    // Agregar modales específicos para la vista de detalle
    document.body.insertAdjacentHTML('beforeend', this.renderSeguimientoModal())
    
    console.log('Modales de detalle renderizados') // Debug log
  },

  renderSeguimientoModal() {
    return UI.renderModal('seguimientoModal', '📝 Seguimiento de Acción', `
      <div id="seguimiento-subtitle" class="text-slate-400 text-sm mb-6"></div>
      
      <form id="seguimientoForm" onsubmit="Decretos.submitSeguimiento(event)" class="space-y-6">
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
            class="form-textarea w-full h-32" 
            placeholder="Cada línea se convertirá en una nueva tarea automáticamente.
Usa [P] al inicio para marcar como primaria, [D] para diaria.
Ejemplo:
[P] Revisar propuesta con el equipo
[D] Enviar follow-up a clientes
Preparar presentación para próxima reunión"
          ></textarea>
          <div class="text-xs text-slate-400 mt-1">
            <i class="fas fa-info-circle mr-1"></i>
            Cada línea no vacía creará una nueva tarea. Usa [P] para primarias, [D] para diarias.
          </div>
        </div>

        <!-- Fecha de próxima revisión -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Fecha de próxima revisión
          </label>
          <input 
            type="date" 
            name="proxima_revision" 
            class="form-input w-full"
            placeholder="Selecciona fecha (opcional)"
          >
        </div>

        <!-- Calificación del progreso -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Calificación del progreso (1-10) *
          </label>
          <div class="flex items-center space-x-4">
            <input 
              type="range" 
              name="calificacion" 
              min="1" 
              max="10" 
              value="5" 
              class="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              onInput="document.getElementById('calificacion-display').textContent = this.value"
            >
            <div class="flex items-center space-x-2">
              <span class="text-2xl font-bold text-accent-green" id="calificacion-display">5</span>
              <span class="text-slate-400 text-sm">/10</span>
            </div>
          </div>
          <div class="flex justify-between text-xs text-slate-400 mt-1">
            <span>Muy Malo</span>
            <span>Regular</span>
            <span>Excelente</span>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex space-x-3 pt-4">
          <button 
            type="button" 
            onclick="Modal.close('seguimientoModal')" 
            class="btn-outline-gray flex-1 py-3 rounded-lg"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn-primary flex-2 py-3 rounded-lg"
          >
            <i class="fas fa-save mr-2"></i>
            Guardar Seguimiento
          </button>
        </div>
      </form>
    `)
  },


  // Funciones para manejar eventos de la vista de detalle

  openSeguimientoModal(accionId) {
    console.log('🔍 Abriendo modal de seguimiento para acción:', accionId)
    
    const accion = this.findAccionById(accionId)
    if (!accion) {
      console.error('❌ Acción no encontrada:', accionId)
      Utils.showToast('Acción no encontrada', 'error')
      return
    }
    
    console.log('✅ Acción encontrada:', accion)
    
    // Esperar un poco para que el modal esté renderizado
    setTimeout(() => {
      // Actualizar subtítulo
      const subtitle = document.getElementById('seguimiento-subtitle')
      if (subtitle) {
        const fecha = new Date().toLocaleDateString('es-ES')
        subtitle.textContent = `${fecha} - ${accion.titulo}`
      }
      
      // Configurar el formulario
      const form = document.getElementById('seguimientoForm')
      if (form) {
        form.dataset.accionId = accionId
        form.dataset.decretoId = this.data.selectedDecreto.id
        
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

  async submitSeguimiento(eventOrFormData, accionId) {
    // Si es un evento del formulario, extraer los datos
    if (eventOrFormData && eventOrFormData.preventDefault) {
      eventOrFormData.preventDefault()
      
      const form = eventOrFormData.target
      const formDataObj = new FormData(form)
      accionId = form.dataset.accionId || this.data.selectedAccionId
      
      const formData = {
        que_se_hizo: formDataObj.get('que_se_hizo'),
        como_se_hizo: formDataObj.get('como_se_hizo'),
        resultados: formDataObj.get('resultados_obtenidos'),
        pendientes: formDataObj.get('tareas_pendientes'),
        calificacion: formDataObj.get('calificacion') || 5,
        proxima_revision: formDataObj.get('proxima_revision')
      }
      
      return this.submitSeguimiento(formData, accionId)
    }
    
    // Código original para cuando se llama con formData directamente
    const formData = eventOrFormData
    try {
      // Parsear tareas pendientes
      const pendientes = formData.pendientes || ''
      const nuevasTareas = this.parsearTareasPendientes(pendientes)
      
      // Enviar seguimiento - ajustar nombres de campos al backend
      const seguimientoData = {
        que_se_hizo: formData.que_se_hizo,
        como_se_hizo: formData.como_se_hizo,
        resultados_obtenidos: formData.resultados,
        tareas_pendientes: nuevasTareas,
        proxima_revision: formData.proxima_revision || null,
        calificacion: parseInt(formData.calificacion)
      }
      
      await API.decretos.createSeguimiento(this.data.selectedDecreto.id, accionId, seguimientoData)
      
      // Mostrar notificación mejorada
      if (nuevasTareas.length > 0) {
        const mensajeTareas = `✅ Seguimiento guardado y ${nuevasTareas.length} nueva${nuevasTareas.length !== 1 ? 's' : ''} tarea${nuevasTareas.length !== 1 ? 's' : ''} automáticamente sincronizada${nuevasTareas.length !== 1 ? 's' : ''} con la agenda diaria`
        Utils.showToast(mensajeTareas, 'success')
        
        // Mostrar notificación adicional específica sobre sincronización
        setTimeout(() => {
          Utils.showToast('🔄 Las nuevas tareas ya están disponibles en tu agenda diaria', 'info')
        }, 2000)
      } else {
        Utils.showToast('✅ Seguimiento guardado correctamente', 'success')
      }
      
      // Cerrar modal de seguimiento
      Modal.close('seguimientoModal')
      
      // Actualizar solo los datos del decreto actual sin recargar la página completa
      if (this.data.selectedDecreto && this.data.selectedDecreto.id) {
        await this.openDetalleDecreto(this.data.selectedDecreto.id)
      } else {
        // Si no hay decreto seleccionado, actualizar la vista principal
        await this.loadDecretos()
        this.renderDecretosView()
      }
      
    } catch (error) {
      console.error('Error al guardar seguimiento:', error)
      Utils.showToast('Error al guardar el seguimiento', 'error')
    }
  },

  parsearTareasPendientes(texto) {
    if (!texto.trim()) return []
    
    return texto.split('\n')
      .map(linea => linea.trim())
      .filter(linea => linea.length > 0)
      // El backend espera strings, no objetos
      // Las etiquetas [P], [D], #primaria, #diaria y @YYYY-MM-DD se procesan en el backend
  },

  findAccionById(accionId) {
    if (!this.data.selectedDecreto || !this.data.selectedDecreto.acciones) return null
    return this.data.selectedDecreto.acciones.find(a => a.id === accionId)
  },

  async handleSeguimiento(event) {
    event.preventDefault()
    
    console.log('📝 Iniciando proceso de seguimiento')
    
    const form = event.target
    const accionId = form.dataset.accionId
    const decretoId = form.dataset.decretoId
    
    console.log('🔍 Datos del formulario:', { accionId, decretoId })
    
    if (!accionId || !decretoId) {
      console.error('❌ Datos faltantes:', { accionId, decretoId })
      Utils.showToast('Error: Datos de acción no encontrados', 'error')
      return
    }
    
    const formData = new FormData(form)
    const data = {
      que_se_hizo: formData.get('que_se_hizo'),
      como_se_hizo: formData.get('como_se_hizo'),
      resultados_obtenidos: formData.get('resultados_obtenidos'),
      tareas_pendientes: formData.get('tareas_pendientes'),
      calificacion: formData.get('calificacion') || 5,
      notas_adicionales: formData.get('notas_adicionales')
    }
    
    console.log('📋 Datos del seguimiento:', data)
    
    // Validar que al menos el campo requerido esté lleno
    if (!data.que_se_hizo || data.que_se_hizo.trim() === '') {
      Utils.showToast('Por favor completa el campo "¿Qué se hizo exactamente?"', 'error')
      return
    }
    
    try {
      console.log('💾 Guardando seguimiento localmente...')
      
      // Por ahora guardar el seguimiento localmente en el objeto de la acción
      const accion = this.findAccionById(accionId)
      if (accion) {
        if (!accion.seguimientos) {
          accion.seguimientos = []
        }
        
        const seguimiento = {
          ...data,
          fecha: new Date().toISOString(),
          id: Date.now().toString()
        }
        
        accion.seguimientos.push(seguimiento)
        
        console.log('✅ Seguimiento guardado:', seguimiento)
      }
      
      Modal.close('seguimientoModal')
      Utils.showToast('✅ Seguimiento registrado exitosamente', 'success')
      
      // Opcional: Recargar la vista si es necesario
      // await this.openDetalleDecreto(decretoId)
      
    } catch (error) {
      console.error('❌ Error en seguimiento:', error)
      Utils.showToast(`Error al registrar seguimiento: ${error.message}`, 'error')
    }
  },

  toggleTareaPendiente(accionId, index, checked) {
    console.log('📝 Marcando tarea pendiente:', { accionId, index, checked })
    
    const accion = this.findAccionById(accionId)
    if (accion && accion.tareas_pendientes && accion.tareas_pendientes[index]) {
      // Marcar como completada localmente (esto se puede sincronizar con backend después)
      if (!accion.tareas_completadas) {
        accion.tareas_completadas = {}
      }
      accion.tareas_completadas[index] = checked
      
      const mensaje = checked ? 'Tarea marcada como completada' : 'Tarea desmarcada'
      Utils.showToast(mensaje, 'info')
    }
  },

  async completarAccion(accionId) {
    try {
      await API.decretos.completarAccion(this.data.selectedDecreto.id, accionId)
      Utils.showToast('Acción completada', 'success')
      this.openDetalleDecreto(this.data.selectedDecreto.id) // Recargar
    } catch (error) {
      Utils.showToast('Error al completar la acción', 'error')
    }
  },

  async marcarPendiente(accionId) {
    if (confirm('¿Estás seguro de marcar esta acción como pendiente? Esto revertirá su estado completado.')) {
      try {
        console.log('🔄 Revirtiendo acción a pendiente:', accionId)
        await API.decretos.marcarPendiente(this.data.selectedDecreto.id, accionId)
        Utils.showToast('✅ Acción marcada como pendiente', 'success')
        this.openDetalleDecreto(this.data.selectedDecreto.id) // Recargar
      } catch (error) {
        console.error('❌ Error al marcar como pendiente:', error)
        Utils.showToast('❌ Error al marcar como pendiente', 'error')
      }
    }
  },

  async iniciarAccion(accionId) {
    try {
      console.log('▶️ Iniciando acción:', accionId)
      await API.decretos.iniciarAccion(this.data.selectedDecreto.id, accionId)
      Utils.showToast('✅ Acción iniciada - En Progreso', 'success')
      this.openDetalleDecreto(this.data.selectedDecreto.id) // Recargar
    } catch (error) {
      console.error('❌ Error al iniciar acción:', error)
      Utils.showToast('❌ Error al iniciar acción', 'error')
    }
  },

  // 📅 VER EN AGENDA - Mostrar acción específica en agenda
  verEnAgenda(accionId) {
    try {
      console.log('📅 Navegando a agenda para acción:', accionId)
      
      // Usar Router para navegar a agenda (método simple y seguro)
      if (typeof Router !== 'undefined' && Router.navigate) {
        Router.navigate('agenda')
        
        // Buscar y resaltar después de un breve delay
        setTimeout(() => {
          this.resaltarAccionEnAgenda(accionId)
        }, 1000) // Más tiempo para que cargue la agenda
        
        Utils.showToast('📅 Mostrando en agenda...', 'info')
      } else {
        // Fallback: cambiar sección manualmente
        window.location.hash = '#agenda'
        Utils.showToast('📅 Redirigiendo a agenda...', 'info')
      }
      
    } catch (error) {
      console.error('❌ Error al ver en agenda:', error)
      Utils.showToast('❌ Error al abrir agenda', 'error')
    }
  },

  // 🎯 Resaltar acción específica en decretos (desde agenda)  
  resaltarAccionEnDecretos(accionId) {
    // Buscar elemento de la acción en decretos
    const accionElement = document.querySelector(`[data-accion-id="${accionId}"]`)
    
    if (accionElement) {
      // Scroll hacia el elemento
      accionElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      
      // Añadir efecto de resaltado temporal
      accionElement.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6)'
      accionElement.style.border = '2px solid #22c55e'
      accionElement.style.transition = 'all 0.3s ease'
      
      // Quitar resaltado después de 3 segundos
      setTimeout(() => {
        accionElement.style.boxShadow = ''
        accionElement.style.border = ''
      }, 3000)
      
      Utils.showToast('✨ Acción encontrada y resaltada', 'success')
    } else {
      Utils.showToast('⚠️ Acción no encontrada en decretos', 'warning')
      console.log('🔍 Acción no encontrada en DOM con ID:', accionId)
    }
  },

  // 🎯 Resaltar acción específica en agenda
  resaltarAccionEnAgenda(accionId) {
    console.log('🔍 Buscando acción en agenda con ID:', accionId)
    
    // Buscar en múltiples lugares de la agenda
    let accionElement = null
    
    // 1. Buscar en Panorámica de Pendientes (data-accion-id)
    accionElement = document.querySelector(`[data-accion-id="${accionId}"]`)
    
    // 2. Si no se encuentra, buscar en Timeline (data-evento-id)
    if (!accionElement) {
      accionElement = document.querySelector(`[data-evento-id="${accionId}"]`)
    }
    
    // 3. Si no se encuentra, buscar por clase y onclick que contenga el ID
    if (!accionElement) {
      const allElements = document.querySelectorAll('.accion-maestra-card, .timeline-card')
      for (const element of allElements) {
        if (element.onclick && element.onclick.toString().includes(accionId)) {
          accionElement = element
          break
        }
      }
    }
    
    if (accionElement) {
      console.log('✅ Acción encontrada en agenda:', accionElement)
      
      // Scroll hacia el elemento
      accionElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      
      // Guardar estilos originales
      const originalBoxShadow = accionElement.style.boxShadow
      const originalBorder = accionElement.style.border
      const originalTransition = accionElement.style.transition
      
      // Añadir efecto de resaltado temporal
      accionElement.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
      accionElement.style.border = '2px solid #3b82f6'
      accionElement.style.transition = 'all 0.3s ease'
      accionElement.style.transform = 'scale(1.05)'
      
      // Quitar resaltado después de 3 segundos
      setTimeout(() => {
        accionElement.style.boxShadow = originalBoxShadow
        accionElement.style.border = originalBorder
        accionElement.style.transition = originalTransition
        accionElement.style.transform = 'scale(1)'
      }, 3000)
      
      Utils.showToast('✨ Acción encontrada y resaltada en agenda', 'success')
    } else {
      console.log('❌ Acción no encontrada en agenda. Elementos disponibles:')
      console.log('- Panorámica:', document.querySelectorAll('[data-accion-id]').length)
      console.log('- Timeline:', document.querySelectorAll('[data-evento-id]').length)
      
      Utils.showToast('⚠️ Acción no visible en agenda actual', 'warning')
    }
  },

  // 🎯 BOTÓN INTELIGENTE - Cambia estado según contexto
  async cambiarEstadoAccion(accionId) {
    const accion = this.findAccionById(accionId)
    if (!accion) {
      Utils.showToast('❌ Acción no encontrada', 'error')
      return
    }

    try {
      switch (accion.estado) {
        case 'pendiente':
          console.log('▶️ Iniciando acción:', accionId)
          await API.decretos.iniciarAccion(this.data.selectedDecreto.id, accionId)
          Utils.showToast('▶️ Acción iniciada - En Progreso', 'success')
          break
          
        case 'en_progreso':
          console.log('✅ Completando acción:', accionId)
          await API.decretos.completarAccion(this.data.selectedDecreto.id, accionId)
          Utils.showToast('✅ Acción completada', 'success')
          break
          
        case 'completada':
          if (confirm('¿Estás seguro de reiniciar esta acción? Volverá a estado pendiente.')) {
            console.log('🔄 Reiniciando acción:', accionId)
            await API.decretos.marcarPendiente(this.data.selectedDecreto.id, accionId)
            Utils.showToast('🔄 Acción reiniciada - Pendiente', 'success')
          } else {
            return // No hacer nada si cancela
          }
          break
          
        default:
          Utils.showToast('❌ Estado de acción no reconocido', 'error')
          return
      }
      
      // Recargar vista
      this.openDetalleDecreto(this.data.selectedDecreto.id)
      
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error)
      Utils.showToast('❌ Error al cambiar estado de acción', 'error')
    }
  },

  confirmarBorrarAccion(accionId) {
    const accion = this.findAccionById(accionId)
    if (!accion) return
    
    if (confirm(`¿Estás seguro de que quieres borrar la acción "${accion.titulo}"?`)) {
      this.borrarAccion(accionId)
    }
  },

  async borrarAccion(accionId) {
    try {
      await API.decretos.deleteAccion(this.data.selectedDecreto.id, accionId)
      Utils.showToast('Acción eliminada', 'success')
      this.openDetalleDecreto(this.data.selectedDecreto.id) // Recargar
    } catch (error) {
      Utils.showToast('Error al eliminar la acción', 'error')
    }
  },

  agregarSugerenciaAAcciones(decretoId, sugerenciaId) {
    // Por ahora abre el modal de crear acción
    // En el futuro se puede pre-llenar con la sugerencia
    this.openUniversalAccionModal(decretoId)
  },

  generarMasSugerencias(decretoId) {
    Utils.showToast('Generando nuevas sugerencias...', 'info')
    // TODO: Implementar generación dinámica de sugerencias
  },


  // ===== FUNCIONES PARA TAREAS DERIVADAS =====

  // Toggle para mostrar/ocultar sección de tareas derivadas
  toggleTareasDerivadas(mostrar) {
    const container = document.getElementById('tareasDerivadas_container')
    if (mostrar) {
      container.classList.remove('hidden')
      // Agregar primera tarea derivada por defecto
      if (document.getElementById('tareasDerivadas_list').children.length === 0) {
        this.agregarTareaDerivada(1)
      }
    } else {
      container.classList.add('hidden')
      // Limpiar todas las tareas derivadas
      document.getElementById('tareasDerivadas_list').innerHTML = ''
      this.contadorDerivadas = { nivel1: 0, nivel2: 0 }
    }
  },

  // Contador para IDs únicos de derivadas
  contadorDerivadas: { nivel1: 0, nivel2: 0 },

  // Agregar nueva tarea derivada
  agregarTareaDerivada(nivel, contenedorId = null) {
    const containerId = contenedorId || (nivel === 1 ? 'tareasDerivadas_list' : contenedorId)
    const container = document.getElementById(containerId)
    
    // Incrementar contador
    this.contadorDerivadas[`nivel${nivel}`]++
    const derivadaId = `derivada_${nivel}_${this.contadorDerivadas[`nivel${nivel}`]}`
    
    const derivadaHTML = `
      <div id="${derivadaId}" class="derivada-item bg-slate-700 rounded-lg p-4 border ${nivel === 1 ? 'border-accent-green/30' : 'border-accent-purple/30'}">
        <div class="flex items-center justify-between mb-3">
          <h5 class="font-medium text-white flex items-center">
            ${nivel === 1 ? 
              '<i class="fas fa-arrow-right text-accent-green mr-2"></i>Tarea Derivada' : 
              '<i class="fas fa-arrow-right text-accent-purple mr-2 ml-4"></i>Sub-derivada'
            }
            <span class="text-xs bg-slate-800 px-2 py-1 rounded ml-2">Nivel ${nivel}</span>
          </h5>
          <button 
            type="button"
            onclick="Decretos.eliminarTareaDerivada('${derivadaId}')"
            class="text-red-400 hover:text-red-300 transition-colors"
            title="Eliminar"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <!-- Título -->
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-slate-300 mb-1">Título *</label>
            <input 
              type="text" 
              name="derivadas[${derivadaId}][titulo]" 
              class="form-input w-full px-3 py-2 text-sm" 
              placeholder="Ej: Preparar materiales necesarios"
              required
            >
          </div>

          <!-- Días offset -->
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Programación</label>
            <div class="flex items-center space-x-2">
              <input 
                type="number" 
                name="derivadas[${derivadaId}][dias_offset]" 
                class="form-input w-20 px-2 py-2 text-sm text-center" 
                placeholder="0"
                value="0"
              >
              <span class="text-xs text-slate-400">días</span>
              <select name="derivadas[${derivadaId}][relacion]" class="form-select flex-1 px-2 py-2 text-xs">
                <option value="antes">antes</option>
                <option value="despues">después</option>
                <option value="mismo">mismo día</option>
              </select>
            </div>
          </div>

          <!-- Tipo -->
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Tipo</label>
            <select name="derivadas[${derivadaId}][tipo]" class="form-select w-full px-2 py-2 text-xs">
              <option value="secundaria">Secundaria (diaria)</option>
              <option value="primaria">Primaria (semanal)</option>
            </select>
          </div>
        </div>

        <!-- Descripción expandida -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Qué hacer *</label>
            <textarea 
              name="derivadas[${derivadaId}][que_hacer]" 
              class="form-textarea w-full h-16 px-3 py-2 text-sm" 
              placeholder="Describe específicamente qué hacer..."
              required
            ></textarea>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Cómo hacerlo</label>
            <textarea 
              name="derivadas[${derivadaId}][como_hacerlo]" 
              class="form-textarea w-full h-16 px-3 py-2 text-sm" 
              placeholder="Metodología, pasos..."
            ></textarea>
          </div>
        </div>

        ${nivel === 1 ? `
          <!-- Sub-derivadas (solo para nivel 1) -->
          <div class="border-t border-slate-600 pt-3 mt-3">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-medium text-slate-300 flex items-center">
                <i class="fas fa-level-down-alt mr-2 text-accent-purple"></i>
                ¿Esta derivada genera sub-tareas?
              </label>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  onchange="Decretos.toggleSubderivadas('${derivadaId}', this.checked)"
                  class="sr-only peer"
                >
                <div class="w-8 h-4 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-accent-purple text-xs"></div>
              </label>
            </div>
            
            <div id="${derivadaId}_subderivadas" class="hidden space-y-2">
              <!-- Sub-derivadas se agregan aquí -->
              <button 
                type="button"
                onclick="Decretos.agregarTareaDerivada(2, '${derivadaId}_subderivadas')"
                class="w-full px-3 py-2 bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 text-accent-purple rounded text-xs transition-colors flex items-center justify-center"
              >
                <i class="fas fa-plus mr-2"></i>
                Agregar Sub-derivada
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `
    
    container.insertAdjacentHTML('beforeend', derivadaHTML)
  },

  // Toggle para sub-derivadas
  toggleSubderivadas(derivadaId, mostrar) {
    const container = document.getElementById(`${derivadaId}_subderivadas`)
    if (mostrar) {
      container.classList.remove('hidden')
      // Agregar primera sub-derivada por defecto
      const subList = container.querySelector('.space-y-2')
      if (!subList || subList.children.length <= 1) { // Solo el botón
        this.agregarTareaDerivada(2, `${derivadaId}_subderivadas`)
      }
    } else {
      container.classList.add('hidden')
      // Limpiar sub-derivadas excepto el botón
      const items = container.querySelectorAll('.derivada-item')
      items.forEach(item => item.remove())
    }
  },

  // Eliminar tarea derivada
  eliminarTareaDerivada(derivadaId) {
    const elemento = document.getElementById(derivadaId)
    if (elemento && confirm('¿Eliminar esta tarea derivada?')) {
      elemento.remove()
    }
  },

  // Procesar datos de tareas derivadas del formulario
  procesarTareasDerivadas(formData) {
    const tareasDerivadas = []
    const derivadas = {}
    
    // Agrupar campos por derivada
    for (let [key, value] of formData.entries()) {
      if (key.startsWith('derivadas[')) {
        const match = key.match(/derivadas\[([^\]]+)\]\[([^\]]+)\]/)
        if (match) {
          const derivadaId = match[1]
          const campo = match[2]
          
          if (!derivadas[derivadaId]) {
            derivadas[derivadaId] = {}
          }
          derivadas[derivadaId][campo] = value
        }
      }
    }
    
    // Convertir a array y calcular offsets
    Object.values(derivadas).forEach(derivada => {
      if (derivada.titulo && derivada.que_hacer) {
        let diasOffset = parseInt(derivada.dias_offset) || 0
        
        // Ajustar signo según relación
        if (derivada.relacion === 'antes' && diasOffset > 0) {
          diasOffset = -diasOffset
        } else if (derivada.relacion === 'despues' && diasOffset < 0) {
          diasOffset = Math.abs(diasOffset)
        }
        
        tareasDerivadas.push({
          titulo: derivada.titulo,
          que_hacer: derivada.que_hacer,
          como_hacerlo: derivada.como_hacerlo || '',
          tipo: derivada.tipo || 'secundaria',
          dias_offset: diasOffset,
          // TODO: Procesar sub-derivadas si las hay
          tareas_derivadas: [] // Por ahora vacío, se implementará recursión completa después
        })
      }
    })
    
    return tareasDerivadas
  },

  // Procesar tareas derivadas leyendo directamente del DOM
  procesarTareasDerivadasDOM() {
    const tareasDerivadas = []
    const derivadasElements = document.querySelectorAll('[data-derivada-index]')
    
    derivadasElements.forEach(element => {
      const index = element.dataset.derivadaIndex
      const nivel = element.dataset.derivadaNivel || '1'
      
      // Solo procesar derivadas de nivel 1 por ahora
      if (nivel === '1') {
        const titulo = element.querySelector(`input[name="derivadas[${index}][titulo]"]`)?.value
        const queHacer = element.querySelector(`textarea[name="derivadas[${index}][que_hacer]"]`)?.value
        const comoHacerlo = element.querySelector(`textarea[name="derivadas[${index}][como_hacerlo]"]`)?.value
        const diasOffset = element.querySelector(`input[name="derivadas[${index}][dias_offset]"]`)?.value || 0
        const tipo = element.querySelector(`select[name="derivadas[${index}][tipo]"]`)?.value || 'secundaria'
        
        if (titulo && queHacer) {
          // Procesar sub-derivadas si las hay
          const subderivadas = []
          const subElements = element.querySelectorAll(`[data-subderivada-parent="${index}"]`)
          
          subElements.forEach(subElement => {
            const subIndex = subElement.dataset.subderivadaIndex
            const subTitulo = subElement.querySelector(`input[name="subderivadas[${index}][${subIndex}][titulo]"]`)?.value
            const subQueHacer = subElement.querySelector(`textarea[name="subderivadas[${index}][${subIndex}][que_hacer]"]`)?.value
            const subComoHacerlo = subElement.querySelector(`textarea[name="subderivadas[${index}][${subIndex}][como_hacerlo]"]`)?.value
            const subDiasOffset = subElement.querySelector(`input[name="subderivadas[${index}][${subIndex}][dias_offset]"]`)?.value || 0
            
            if (subTitulo && subQueHacer) {
              subderivadas.push({
                titulo: subTitulo,
                que_hacer: subQueHacer,
                como_hacerlo: subComoHacerlo || '',
                dias_offset: parseInt(subDiasOffset) || 0,
                tipo: 'secundaria'
              })
            }
          })
          
          tareasDerivadas.push({
            titulo: titulo,
            que_hacer: queHacer,
            como_hacerlo: comoHacerlo || '',
            tipo: tipo,
            dias_offset: parseInt(diasOffset) || 0,
            tareas_derivadas: subderivadas
          })
        }
      }
    })
    
    return tareasDerivadas
  },

  renderDetalleAccionModal() {
    return UI.renderModal('detalleAccionModal', '📝 Detalles de la Acción', `
      <div id="detalleAccionContainer">
        ${UI.renderLoading('Cargando detalles de la acción...')}
      </div>
    `)
  },

  renderEditAccionModal() {
    return UI.renderModal('editAccionModal', '✏️ Editar Acción', `
      <form id="editAccionForm" onsubmit="Decretos.handleEditAccion(event)" class="space-y-6">
        <input type="hidden" id="editAccionId">
        <input type="hidden" id="editDecretoId">
        
        <!-- Título de la acción -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Título de la acción *
          </label>
          <input 
            type="text" 
            id="editAccionTitulo"
            name="titulo" 
            class="form-input w-full px-4 py-3 text-base" 
            placeholder="Ej: Hacer ejercicio matutino"
            required
          >
        </div>

        <!-- Qué se debe hacer -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Qué se debe hacer *
          </label>
          <textarea 
            id="editAccionQueHacer"
            name="que_hacer" 
            class="form-textarea w-full h-24 px-4 py-3 text-base" 
            placeholder="Describe específicamente qué hay que hacer..."
            required
          ></textarea>
        </div>

        <!-- Cómo hacerlo -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Cómo hacerlo
          </label>
          <textarea 
            id="editAccionComoHacerlo"
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
            id="editAccionResultados"
            name="resultados" 
            class="form-textarea w-full h-20 px-4 py-3 text-base" 
            placeholder="Qué resultados esperas o has obtenido..."
          ></textarea>
        </div>

        <!-- Tipo y Próxima revisión en la misma fila -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Tipo de acción -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Tipo de acción
            </label>
            <select id="editAccionTipo" name="tipo" class="form-select w-full px-4 py-3 text-base">
              <option value="secundaria">Secundaria (diaria)</option>
              <option value="primaria">Primaria (semanal)</option>
            </select>
          </div>

          <!-- Próxima revisión -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Próxima revisión
            </label>
            <input 
              type="datetime-local" 
              id="editAccionProximaRevision"
              name="proxima_revision" 
              class="form-input w-full px-4 py-3 text-base"
              placeholder="Selecciona fecha y hora (opcional)"
              min="2024-09-01T00:00"
              onchange="console.log('📅 FECHA CAMBIADA:', this.value, 'Fecha objeto:', new Date(this.value))"
            >
            <div class="text-xs text-slate-400 mt-1">
              💡 Puedes usar fechas pasadas para registrar tareas olvidadas
            </div>
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
              id="editAccionCalificacion"
              name="calificacion" 
              min="1" 
              max="10" 
              value="5" 
              class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              oninput="document.getElementById('editAccionCalificacionValue').textContent = this.value"
            >
            <div class="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
            </div>
          </div>
          <div class="text-center mt-2">
            <span id="editAccionCalificacionValue" class="text-2xl font-bold text-white">5</span>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex space-x-3 pt-6">
          <button 
            type="button" 
            onclick="Modal.close('editAccionModal')" 
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

  // Funciones para modal de detalles y edición de acciones
  async openDetalleAccion(accionId, decretoId = null) {
    try {
      Modal.open('detalleAccionModal')
      
      // Usar decreto proporcionado o el seleccionado
      const decretoIdFinal = decretoId || this.data.selectedDecreto?.id
      if (!decretoIdFinal) {
        throw new Error('No se puede obtener el ID del decreto')
      }
      
      // Cargar detalles de la acción
      const response = await API.decretos.getAccion(decretoIdFinal, accionId)
      const accion = response.data
      
      // Renderizar detalles
      const container = document.getElementById('detalleAccionContainer')
      container.innerHTML = this.renderDetalleAccionContent(accion)
      
    } catch (error) {
      Utils.showToast('Error al cargar detalles de la acción', 'error')
      Modal.close('detalleAccionModal')
    }
  },

  renderDetalleAccionContent(accion) {
    const isCompleted = accion.estado === 'completada'
    const isOverdue = this.isAccionOverdue(accion, isCompleted)
    
    return `
      <div class="space-y-6">
        <!-- Información del decreto asociado -->
        <div class="bg-slate-800 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-lg">
              <i class="fas fa-bullseye mr-2 text-${
                accion.area === 'empresarial' ? 'accent-green' : 
                accion.area === 'material' ? 'accent-orange' : 'accent-blue'
              }"></i>
              ${accion.decreto_titulo}
            </h3>
            <span class="text-xs px-2 py-1 rounded-full bg-${
              accion.area === 'empresarial' ? 'accent-green' : 
              accion.area === 'material' ? 'accent-orange' : 'accent-blue'
            }/20 text-${
              accion.area === 'empresarial' ? 'accent-green' : 
              accion.area === 'material' ? 'accent-orange' : 'accent-blue'
            }">
              ${accion.area === 'empresarial' ? '🏢 Empresarial' : 
                accion.area === 'material' ? '💰 Material' : '❤️ Humano'}
            </span>
          </div>
          ${accion.sueno_meta ? `
            <p class="text-slate-300 text-sm">${accion.sueno_meta}</p>
          ` : ''}
        </div>

        <!-- Información principal de la acción -->
        <div class="bg-slate-800 rounded-lg p-4">
          <h3 class="font-semibold text-lg mb-4 flex items-center">
            <i class="fas fa-tasks mr-2 text-accent-blue"></i>
            Información de la Acción
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Título</label>
              <p class="text-white font-medium ${isCompleted ? 'line-through text-slate-400' : isOverdue ? 'text-red-300' : ''}">${accion.titulo}</p>
            </div>
            
            <div>
              <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Estado</label>
              <p class="text-white">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  accion.estado === 'completada'
                    ? 'bg-green-900/30 text-green-400 border border-green-600/50' 
                    : accion.estado === 'en_progreso'
                      ? 'bg-blue-900/30 text-blue-400 border border-blue-600/50'
                      : isOverdue 
                        ? 'bg-red-900/30 text-red-400 border border-red-600/50'
                        : 'bg-orange-900/30 text-orange-400 border border-orange-600/50'
                }">
                  <i class="fas fa-${
                    accion.estado === 'completada' ? 'check-circle' : 
                    accion.estado === 'en_progreso' ? 'play-circle' :
                    isOverdue ? 'exclamation-triangle' : 'clock'
                  } mr-1"></i>
                  ${
                    accion.estado === 'completada' ? 'Completada' : 
                    accion.estado === 'en_progreso' ? 'En Progreso' :
                    isOverdue ? 'Retrasada' : 'Pendiente'
                  }
                </span>
              </p>
            </div>

            ${accion.proxima_revision ? `
              <div>
                <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Próxima Revisión</label>
                <p class="text-white ${isOverdue ? 'text-red-400' : ''}">${Utils.formatDate(accion.proxima_revision)}</p>
              </div>
            ` : ''}

            <div>
              <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Tipo</label>
              <p class="text-white">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-600/50">
                  ${accion.tipo === 'secundaria' ? '📅 Diaria' : '📆 Semanal'}
                </span>
              </p>
            </div>

            ${accion.fecha_creacion ? `
              <div>
                <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Creada</label>
                <p class="text-slate-300">${Utils.formatDate(accion.fecha_creacion)}</p>
              </div>
            ` : ''}

            ${accion.origen ? `
              <div>
                <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Origen</label>
                <p class="text-slate-300 capitalize">
                  ${accion.origen.startsWith('seguimiento') || accion.origen.includes(':') ? 
                    '📝 Seguimiento registrado' : 
                    accion.origen === 'manual' ? '✋ Creada manualmente' :
                    accion.origen === 'subtarea' ? '🔗 Sub-tarea automática' :
                    accion.origen}
                </p>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Detalles de ejecución -->
        <div class="bg-slate-800 rounded-lg p-4">
          <h3 class="font-semibold text-lg mb-4 flex items-center">
            <i class="fas fa-cogs mr-2 text-accent-green"></i>
            Detalles de Ejecución
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Qué se debe hacer</label>
              <p class="text-slate-300 mt-1">${accion.que_hacer || 'No especificado'}</p>
            </div>

            ${accion.como_hacerlo ? `
              <div>
                <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Cómo hacerlo</label>
                <p class="text-slate-300 mt-1">${accion.como_hacerlo}</p>
              </div>
            ` : ''}

            ${accion.resultados ? `
              <div>
                <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Resultados esperados/obtenidos</label>
                <p class="text-slate-300 mt-1">${accion.resultados}</p>
              </div>
            ` : ''}

            ${accion.calificacion ? `
              <div>
                <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">Calificación</label>
                <div class="flex items-center mt-1">
                  <div class="flex space-x-1 mr-3">
                    ${Array.from({length: 10}, (_, i) => {
                      const filled = (i + 1) <= (accion.calificacion || 0)
                      return `<div class="w-3 h-3 rounded-full ${filled ? 'bg-accent-green' : 'bg-slate-600'}"></div>`
                    }).join('')}
                  </div>
                  <span class="text-xl font-bold text-accent-green">${accion.calificacion}/10</span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Tareas pendientes -->
        ${accion.tareas_pendientes && accion.tareas_pendientes.length > 0 ? `
          <div class="bg-slate-800 rounded-lg p-4">
            <h3 class="font-semibold text-lg mb-4 flex items-center">
              <i class="fas fa-list-ul mr-2 text-accent-orange"></i>
              Tareas Pendientes
            </h3>
            <div class="space-y-3">
              ${accion.tareas_pendientes.map((pendiente, index) => `
                <label class="flex items-center cursor-pointer group">
                  <input 
                    type="checkbox" 
                    class="w-5 h-5 text-accent-green bg-slate-700 border-slate-500 rounded focus:ring-accent-green focus:ring-2 mr-3"
                    onchange="Decretos.toggleTareaPendiente('${accion.id}', ${index}, this.checked)"
                  >
                  <span class="text-slate-300 group-hover:text-white transition-colors select-none">
                    ${pendiente}
                  </span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Botones de acción -->
        <div class="flex space-x-3">
          <button 
            onclick="Decretos.openEditAccion('${accion.id}')" 
            class="btn-primary flex-1 py-3 rounded-lg font-medium"
          >
            <i class="fas fa-edit mr-2"></i>
            Editar Acción
          </button>
          
          ${!isCompleted ? `
            <button 
              onclick="Decretos.completarAccion('${accion.id}'); Modal.close('detalleAccionModal')" 
              class="btn-success flex-1 py-3 rounded-lg font-medium"
            >
              <i class="fas fa-check mr-2"></i>
              Completar
            </button>
          ` : `
            <button 
              onclick="Modal.close('detalleAccionModal')" 
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

  async openEditAccion(accionId) {
    try {
      Modal.close('detalleAccionModal')
      Modal.open('editAccionModal')
      
      // Cargar detalles de la acción
      const response = await API.decretos.getAccion(this.data.selectedDecreto.id, accionId)
      const accion = response.data
      
      // Rellenar formulario
      document.getElementById('editAccionId').value = accion.id
      document.getElementById('editDecretoId').value = this.data.selectedDecreto.id
      document.getElementById('editAccionTitulo').value = accion.titulo || ''
      document.getElementById('editAccionQueHacer').value = accion.que_hacer || ''
      document.getElementById('editAccionComoHacerlo').value = accion.como_hacerlo || ''
      document.getElementById('editAccionResultados').value = accion.resultados || ''
      document.getElementById('editAccionTipo').value = accion.tipo || 'secundaria'
      document.getElementById('editAccionCalificacion').value = accion.calificacion || 5
      document.getElementById('editAccionCalificacionValue').textContent = accion.calificacion || 5
      
      // Manejar próxima revisión
      if (accion.proxima_revision) {
        document.getElementById('editAccionProximaRevision').value = accion.proxima_revision
      }
      
    } catch (error) {
      Utils.showToast('Error al cargar acción para edición', 'error')
      Modal.close('editAccionModal')
    }
  },

  async handleEditAccion(event) {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())
    const accionId = document.getElementById('editAccionId').value
    const decretoId = document.getElementById('editDecretoId').value
    
    try {
      await API.decretos.updateAccion(decretoId, accionId, data)
      Modal.close('editAccionModal')
      Utils.showToast('Acción actualizada exitosamente', 'success')
      await this.openDetalleDecreto(decretoId) // Recargar vista de detalle
    } catch (error) {
      Utils.showToast('Error al actualizar acción', 'error')
    }
  },

  // Función para determinar si una acción está retrasada
  isAccionOverdue(accion, isCompleted = false) {
    // Las acciones completadas no se consideran retrasadas
    if (isCompleted || !accion.proxima_revision) {
      return false
    }

    try {
      // Usar dayjs para comparación precisa solo de fechas (sin horas)
      const fechaRevision = dayjs(accion.proxima_revision).format('YYYY-MM-DD')
      const hoy = dayjs().format('YYYY-MM-DD')

      // Verificar si la fecha es válida
      if (!dayjs(fechaRevision).isValid()) {
        return false // Si la fecha no es válida, no se considera retrasada
      }

      // La acción está retrasada solo si la fecha de revisión es ANTERIOR a hoy
      // NO si es hoy mismo o futura
      return dayjs(fechaRevision).isBefore(hoy)
    } catch (error) {
      console.error('Error al verificar fecha de acción:', error)
      return false // En caso de error, no marcar como retrasada
    }
  },

  // Función para determinar si un decreto tiene acciones retrasadas
  hasOverdueAcciones(decreto) {
    if (!decreto.acciones || decreto.acciones.length === 0) {
      return false
    }

    return decreto.acciones.some(accion => {
      const isCompleted = accion.estado === 'completada'
      return this.isAccionOverdue(accion, isCompleted)
    })
  },

  renderError(message = 'No se pudieron cargar los decretos. Verifica tu conexión.') {
    return `
      <div class="container mx-auto px-4 py-8 text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold mb-4">Error al cargar</h2>
        <p class="text-slate-400 mb-6">${message}</p>
        <div class="space-x-3">
          <button onclick="Decretos.render()" class="btn-primary px-6 py-2 rounded-lg">
            Volver a Decretos
          </button>
          <button onclick="window.location.reload()" class="btn-secondary px-6 py-2 rounded-lg">
            Recargar Página
          </button>
        </div>
      </div>
    `
  },

  // Función simple para manejar sub-tareas
  // 🎯 NUEVA FUNCIÓN: Manejar selección de tipo de decreto
  updateDecretoSelect(tipoSeleccionado) {
    console.log('🔄 Tipo de decreto seleccionado:', tipoSeleccionado)
    
    const select = document.getElementById('decretoTipoSelect')
    if (!select) return
    
    // Cambiar estilos según la selección
    if (tipoSeleccionado && tipoSeleccionado !== '') {
      // Decreto seleccionado - cambiar a verde
      select.classList.remove('border-accent-red/50', 'focus:border-accent-red')
      select.classList.add('border-accent-green/50', 'focus:border-accent-green', 'bg-green-900/10')
      
      // Ocultar mensaje de error
      const errorMsg = select.parentElement.querySelector('.text-accent-red')
      if (errorMsg) {
        errorMsg.style.display = 'none'
      }
      
      Utils.showToast(`✅ Decreto ${tipoSeleccionado} seleccionado`, 'success')
    } else {
      // Sin selección - mantener rojo
      select.classList.add('border-accent-red/50', 'focus:border-accent-red')
      select.classList.remove('border-accent-green/50', 'focus:border-accent-green', 'bg-green-900/10')

      // Mostrar mensaje de error
      const errorMsg = select.parentElement.querySelector('.text-accent-red')
      if (errorMsg) {
        errorMsg.style.display = 'block'
      }
    }
  },

  // 🔗 Agregar event listeners para botones dinámicos del detalle
  attachDetalleEventListeners() {
    // Botón de ayuda (?)
    const btnHelp = document.getElementById('btnAccionesHelp')
    if (btnHelp) {
      btnHelp.addEventListener('click', () => {
        console.log('🔘 Click en botón de ayuda')
        this.showAccionesHelp()
      })
    }

  },

  // 📖 Mostrar modal de ayuda sobre acciones primarias y secundarias
  showAccionesHelp() {
    const helpContent = `
      <div class="space-y-6">
        <div class="text-center mb-4">
          <div class="text-5xl mb-2">👑</div>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Metodología SPEC de Helene Hadsell
          </h3>
          <p class="text-slate-400 text-sm mt-1">La Reina de los Concursos te explica</p>
        </div>

        <!-- Acciones Primarias -->
        <div class="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-lg p-5">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 bg-accent-green rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-star text-white text-xl"></i>
            </div>
            <div>
              <h4 class="text-lg font-bold text-accent-green">Acciones Primarias (Semanales)</h4>
              <p class="text-xs text-slate-400">PROJECT - Proyecta en el mundo físico</p>
            </div>
          </div>
          <p class="text-sm text-slate-300 mb-3">
            Son las <strong>acciones estratégicas</strong> que realmente te acercan a tu decreto.
          </p>

          <div class="space-y-2 text-sm">
            <div class="flex items-start">
              <i class="fas fa-check text-accent-green mr-2 mt-1"></i>
              <span class="text-slate-300">Requieren <strong>tiempo dedicado</strong> (1-3 horas o más)</span>
            </div>
            <div class="flex items-start">
              <i class="fas fa-check text-accent-green mr-2 mt-1"></i>
              <span class="text-slate-300">Son las que <strong>realmente mueven la aguja</strong></span>
            </div>
            <div class="flex items-start">
              <i class="fas fa-check text-accent-green mr-2 mt-1"></i>
              <span class="text-slate-300">No urgentes, pero <strong>IMPORTANTES</strong></span>
            </div>
            <div class="flex items-start">
              <i class="fas fa-check text-accent-green mr-2 mt-1"></i>
              <span class="text-slate-300">Frecuencia: <strong>1-2 veces por semana</strong></span>
            </div>
          </div>

          <div class="mt-4 bg-slate-900/50 rounded p-3">
            <p class="text-xs text-slate-400 mb-2">📝 Ejemplo:</p>
            <p class="text-sm text-slate-200">
              <strong>Decreto:</strong> "Generar $10,000 USD mensuales"<br>
              <strong>✅ Primaria:</strong> Crear campaña de marketing (Lunes)<br>
              <strong>✅ Primaria:</strong> Hacer networking con 3 clientes (Jueves)
            </p>
          </div>
        </div>

        <!-- Acciones Secundarias -->
        <div class="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-lg p-5">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 bg-accent-blue rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-calendar-day text-white text-xl"></i>
            </div>
            <div>
              <h4 class="text-lg font-bold text-accent-blue">Acciones Secundarias (Diarias)</h4>
              <p class="text-xs text-slate-400">EXPECT - Mantén la expectativa viva</p>
            </div>
          </div>
          <p class="text-sm text-slate-300 mb-3">
            Son los <strong>hábitos y recordatorios diarios</strong> que mantienen tu energía enfocada.
          </p>

          <div class="space-y-2 text-sm">
            <div class="flex items-start">
              <i class="fas fa-check text-accent-blue mr-2 mt-1"></i>
              <span class="text-slate-300"><strong>Rápidas</strong> (5-30 minutos)</span>
            </div>
            <div class="flex items-start">
              <i class="fas fa-check text-accent-blue mr-2 mt-1"></i>
              <span class="text-slate-300">Refuerzan la <strong>fe en tu decreto</strong></span>
            </div>
            <div class="flex items-start">
              <i class="fas fa-check text-accent-blue mr-2 mt-1"></i>
              <span class="text-slate-300">Mantienen el <strong>momentum</strong></span>
            </div>
            <div class="flex items-start">
              <i class="fas fa-check text-accent-blue mr-2 mt-1"></i>
              <span class="text-slate-300">Frecuencia: <strong>Diarias o casi diarias</strong></span>
            </div>
          </div>

          <div class="mt-4 bg-slate-900/50 rounded p-3">
            <p class="text-xs text-slate-400 mb-2">📝 Ejemplo:</p>
            <p class="text-sm text-slate-200">
              <strong>Decreto:</strong> "Generar $10,000 USD mensuales"<br>
              <strong>✅ Secundaria:</strong> Visualizar cuenta bancaria con $10k (5 min/día)<br>
              <strong>✅ Secundaria:</strong> Agradecer por clientes que llegan (5 min/día)
            </p>
          </div>
        </div>

        <!-- Regla de Oro -->
        <div class="bg-gradient-to-r from-yellow-900/30 to-pink-900/30 border border-yellow-500/30 rounded-lg p-4">
          <div class="flex items-center mb-2">
            <i class="fas fa-lightbulb text-yellow-400 text-xl mr-2"></i>
            <h4 class="font-bold text-yellow-400">La Regla de Oro</h4>
          </div>
          <div class="space-y-2 text-sm text-slate-300">
            <p><strong class="text-accent-green">PRIMARIAS =</strong> ACCIÓN FÍSICA hacia tu meta (PROJECT)</p>
            <p><strong class="text-accent-blue">SECUNDARIAS =</strong> ACCIÓN MENTAL/ESPIRITUAL hacia tu meta (EXPECT)</p>
          </div>
        </div>

        <!-- Preguntas para identificar -->
        <div class="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <h4 class="font-semibold mb-3 flex items-center text-slate-200">
            <i class="fas fa-question-circle mr-2 text-purple-400"></i>
            ¿Cómo saber cuál es cuál?
          </h4>

          <div class="space-y-3">
            <div>
              <p class="text-xs font-semibold text-accent-green mb-1">¿Es PRIMARIA?</p>
              <ul class="text-xs text-slate-400 space-y-1 ml-4">
                <li>• ¿Me acerca DIRECTAMENTE a mi decreto?</li>
                <li>• ¿Requiere esfuerzo y tiempo significativo?</li>
                <li>• ¿Puedo medir resultados tangibles?</li>
              </ul>
            </div>

            <div>
              <p class="text-xs font-semibold text-accent-blue mb-1">¿Es SECUNDARIA?</p>
              <ul class="text-xs text-slate-400 space-y-1 ml-4">
                <li>• ¿Mantiene mi energía/fe/expectativa alta?</li>
                <li>• ¿Es rápido y fácil de hacer?</li>
                <li>• ¿Es más mental/espiritual que física?</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="text-center pt-2">
          <p class="text-sm text-slate-400 italic">
            "Me pregunto cuándo va a aparecer..." - Helene Hadsell 💫
          </p>
        </div>
      </div>
    `

    // Crear modal personalizado
    const modalId = 'accionesHelpModal'
    const existingModal = document.getElementById(modalId)
    if (existingModal) {
      existingModal.remove()
    }

    const modalHTML = `
      <div id="${modalId}" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" style="display: flex;">
        <div class="modal-container max-w-3xl">
          <div class="modal-header">
            <h2 class="text-2xl font-bold">
              <i class="fas fa-book-open mr-2"></i>
              Guía de Acciones SPEC
            </h2>
            <button onclick="document.getElementById('${modalId}').remove()" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body max-h-[70vh] overflow-y-auto">
            ${helpContent}
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML('beforeend', modalHTML)
  },

  // 🤖 Abrir modal de sugerencias IA desde el modal universal
  openAISuggestModalFromUniversal() {
    // Obtener el decreto_id del modal actual
    const decretoId = document.getElementById('universalDecretoId')?.value

    if (!decretoId) {
      Utils.showToast('Error: No se encontró el ID del decreto', 'error')
      return
    }

    console.log('🔘 Abriendo sugerencias IA desde modal universal para decreto:', decretoId)

    // Llamar a la función de sugerencias con IA
    this.suggestAccionesWithAI(decretoId)
  },

  // 🤖 Sugerir acciones con IA (Helene)
  async suggestAccionesWithAI(decretoId) {
    try {
      // Buscar el decreto - primero intentar con selectedDecreto, luego en el array
      let decreto = this.data.selectedDecreto

      // Si selectedDecreto no tiene el ID correcto, buscar en el array
      if (!decreto || decreto.id !== decretoId) {
        decreto = this.data.decretos.find(d => d.id === decretoId)
      }

      if (!decreto) {
        console.error('❌ Decreto no encontrado. ID:', decretoId)
        console.error('❌ selectedDecreto:', this.data.selectedDecreto)
        console.error('❌ decretos array:', this.data.decretos)
        Utils.showToast('Decreto no encontrado', 'error')
        return
      }

      console.log('✅ Decreto encontrado para IA:', decreto)

      // Mostrar loading
      Utils.showToast('🤖 Helene está analizando tu decreto...', 'info')

      // Llamar al nuevo endpoint especializado para sugerencias
      const response = await API.request('/chatbot/suggest', { method: 'POST', data: { decreto } })

      console.log('📨 Response de chatbot:', response)

      if (!response.success) {
        throw new Error(response.error || 'Error al obtener sugerencias')
      }

      // Intentar parsear el JSON de la respuesta
      const message = response.data?.message || response.message
      console.log('💬 Mensaje de Helene:', message)

      let suggestions

      try {
        // Buscar JSON en la respuesta
        const jsonMatch = message.match(/\{[\s\S]*"primarias"[\s\S]*"secundarias"[\s\S]*\}/)
        console.log('🔍 JSON encontrado:', jsonMatch ? jsonMatch[0].substring(0, 100) + '...' : 'NO ENCONTRADO')

        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0])
          console.log('✅ Suggestions parseadas:', suggestions)
        } else {
          throw new Error('No se encontró JSON en la respuesta')
        }
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError)
        console.log('📄 Mostrando respuesta como texto...')
        // Si no hay JSON, mostrar la respuesta de Helene directamente
        Utils.showToast('Helene respondió, pero no en el formato esperado', 'warning')

        // Mostrar la respuesta en un modal
        this.showAISuggestionsText(message)
        return
      }

      console.log('🎯 Abriendo modal de sugerencias...')
      // Mostrar modal con sugerencias
      this.showAISuggestionsModal(decretoId, suggestions)

    } catch (error) {
      console.error('Error al sugerir acciones con IA:', error)
      Utils.showToast('Error al obtener sugerencias de Helene', 'error')
    }
  },

  // Mostrar respuesta de texto de Helene
  showAISuggestionsText(message) {
    const modalId = 'aiSuggestionsTextModal'
    const existingModal = document.getElementById(modalId)
    if (existingModal) {
      existingModal.remove()
    }

    const modalHTML = `
      <div id="${modalId}" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" style="display: flex;">
        <div class="modal-container max-w-3xl">
          <div class="modal-header bg-gradient-to-r from-purple-600 to-pink-600">
            <h2 class="text-2xl font-bold flex items-center">
              <span class="text-3xl mr-2">👑</span>
              Helene te responde
            </h2>
            <button onclick="document.getElementById('${modalId}').remove()" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body max-h-[60vh] overflow-y-auto">
            <div class="prose prose-invert max-w-none">
              <div class="whitespace-pre-wrap text-slate-200">${message.replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-300">$1</strong>')}</div>
            </div>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML('beforeend', modalHTML)
  },

  // Mostrar modal con sugerencias parseadas
  showAISuggestionsModal(decretoId, suggestions) {
    const { primarias = [], secundarias = [] } = suggestions

    const modalId = 'aiSuggestionsModal'
    const existingModal = document.getElementById(modalId)
    if (existingModal) {
      existingModal.remove()
    }

    const modalHTML = `
      <div id="${modalId}" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" style="display: flex;">
        <div class="modal-container max-w-4xl">
          <div class="modal-header bg-gradient-to-r from-purple-600 to-pink-600">
            <h2 class="text-2xl font-bold flex items-center">
              <span class="text-3xl mr-2">👑</span>
              Sugerencias de Helene
            </h2>
            <button onclick="document.getElementById('${modalId}').remove()" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body max-h-[70vh] overflow-y-auto">
            <p class="text-slate-300 mb-6 italic">
              "Dear, basándome en tu decreto, aquí están las acciones que te recomiendo según mi método SPEC..." 💫
            </p>

            <!-- Acciones Primarias -->
            <div class="mb-6">
              <h3 class="text-xl font-bold text-accent-green mb-4 flex items-center">
                <i class="fas fa-star mr-2"></i>
                Acciones Primarias (Semanales)
              </h3>
              <div class="space-y-3">
                ${primarias.map((accion, index) => `
                  <div class="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-lg p-4">
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex-1">
                        <h4 class="font-semibold text-white mb-1">${accion.titulo}</h4>
                        <p class="text-sm text-slate-300">${accion.descripcion}</p>
                        ${accion.dia_sugerido ? `
                          <div class="mt-2 flex items-center text-xs text-slate-400">
                            <i class="fas fa-calendar mr-1"></i>
                            Sugerido para: ${accion.dia_sugerido}
                          </div>
                        ` : ''}
                      </div>
                      <label class="flex items-center ml-4">
                        <input
                          type="checkbox"
                          class="ai-suggestion-checkbox"
                          data-tipo="primaria"
                          data-index="${index}"
                          checked
                        />
                        <span class="ml-2 text-sm text-slate-400">Agregar</span>
                      </label>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Acciones Secundarias -->
            <div class="mb-6">
              <h3 class="text-xl font-bold text-accent-blue mb-4 flex items-center">
                <i class="fas fa-calendar-day mr-2"></i>
                Acciones Secundarias (Diarias)
              </h3>
              <div class="space-y-3">
                ${secundarias.map((accion, index) => `
                  <div class="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-lg p-4">
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex-1">
                        <h4 class="font-semibold text-white mb-1">${accion.titulo}</h4>
                        <p class="text-sm text-slate-300">${accion.descripcion}</p>
                        ${accion.momento ? `
                          <div class="mt-2 flex items-center text-xs text-slate-400">
                            <i class="fas fa-clock mr-1"></i>
                            Momento: ${accion.momento}
                          </div>
                        ` : ''}
                      </div>
                      <label class="flex items-center ml-4">
                        <input
                          type="checkbox"
                          class="ai-suggestion-checkbox"
                          data-tipo="secundaria"
                          data-index="${index}"
                          checked
                        />
                        <span class="ml-2 text-sm text-slate-400">Agregar</span>
                      </label>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="space-y-3 pt-4 border-t border-slate-700">
              <!-- Botón principal: Agregar seleccionadas -->
              <button
                onclick="Decretos.createSuggestedAcciones('${decretoId}', ${JSON.stringify(suggestions).replace(/"/g, '&quot;')})"
                class="btn-primary w-full"
              >
                <i class="fas fa-check mr-2"></i>
                Agregar Seleccionadas
              </button>

              <!-- Botones secundarios: Repensar y Agregar más -->
              <div class="flex gap-2">
                <button
                  onclick="document.getElementById('${modalId}').remove(); Decretos.suggestMoreAcciones('${decretoId}')"
                  class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                >
                  <i class="fas fa-plus-circle mr-1"></i>
                  Agregar Más
                </button>
                <button
                  onclick="document.getElementById('${modalId}').remove(); Decretos.rethinkAcciones('${decretoId}')"
                  class="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
                >
                  <i class="fas fa-sync mr-1"></i>
                  Repensar
                </button>
                <button
                  onclick="document.getElementById('${modalId}').remove()"
                  class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML('beforeend', modalHTML)
  },

  // Crear las acciones sugeridas seleccionadas
  async createSuggestedAcciones(decretoId, suggestions) {
    try {
      const checkboxes = document.querySelectorAll('.ai-suggestion-checkbox:checked')

      if (checkboxes.length === 0) {
        Utils.showToast('Selecciona al menos una acción', 'warning')
        return
      }

      const { primarias = [], secundarias = [] } = suggestions
      const accionesToCreate = []

      checkboxes.forEach(checkbox => {
        const tipo = checkbox.dataset.tipo
        const index = parseInt(checkbox.dataset.index)

        const accion = tipo === 'primaria' ? primarias[index] : secundarias[index]

        if (accion) {
          accionesToCreate.push({
            decreto_id: decretoId,
            tipo: tipo,
            titulo: accion.titulo,
            que_hacer: accion.descripcion,
            fecha_evento: new Date().toISOString().split('T')[0], // Hoy
            hora_evento: '09:00'
          })
        }
      })

      Utils.showToast(`Creando ${accionesToCreate.length} acciones...`, 'info')

      // Crear cada acción
      let created = 0
      for (const accionData of accionesToCreate) {
        const response = await API.decretos.createAccion(accionData)
        if (response.success) {
          created++
        }
      }

      Modal.close('aiSuggestionsModal')
      Utils.showToast(`✅ ${created} acciones creadas exitosamente`, 'success')

      // Recargar datos
      await this.loadDecretos()

      // Reabrir el detalle del decreto
      this.openDetalleModal(decretoId)

    } catch (error) {
      console.error('Error al crear acciones sugeridas:', error)
      Utils.showToast('Error al crear las acciones', 'error')
    }
  },

  // Sugerir MÁS acciones adicionales (se agregan a las existentes)
  async suggestMoreAcciones(decretoId) {
    try {
      console.log('🔮 Pidiendo MÁS sugerencias para decreto:', decretoId)

      let decreto = this.data.selectedDecreto
      if (!decreto || decreto.id !== decretoId) {
        decreto = this.data.decretos.find(d => d.id === decretoId)
      }

      if (!decreto) {
        Utils.showToast('Decreto no encontrado', 'error')
        return
      }

      Utils.showToast('Helene está pensando en más acciones...', 'info')

      const prompt = `Analiza este decreto y dame MÁS sugerencias ADICIONALES de acciones según el método SPEC.

DECRETO: "${decreto.titulo}"
DESCRIPCIÓN: "${decreto.descripcion}"

IMPORTANTE: Dame acciones DIFERENTES y COMPLEMENTARIAS a las que ya sugeriste antes. Piensa en otros ángulos, otras estrategias.

FORMATO DE RESPUESTA (JSON):
{
  "primarias": [
    {"titulo": "...", "descripcion": "...", "dia_sugerido": "lunes|miércoles|viernes"},
    {"titulo": "...", "descripcion": "...", "dia_sugerido": "lunes|miércoles|viernes"}
  ],
  "secundarias": [
    {"titulo": "...", "descripcion": "...", "momento": "mañana|tarde|noche"},
    {"titulo": "...", "descripcion": "...", "momento": "mañana|tarde|noche"},
    {"titulo": "...", "descripcion": "...", "momento": "mañana|tarde|noche"}
  ]
}`

      const response = await API.chatbot.sendMessage(prompt, [])
      console.log('📨 Response de chatbot (Agregar Más):', response)

      if (response.success && response.message) {
        const message = response.message
        console.log('💬 Mensaje de Helene (Agregar Más):', message)
        console.log('📏 Longitud del mensaje:', message.length)

        // Intentar encontrar JSON con diferentes patrones
        let jsonMatch = message.match(/\{[\s\S]*?"primarias"[\s\S]*?"secundarias"[\s\S]*?\}/m)

        if (!jsonMatch) {
          // Intentar con ```json
          jsonMatch = message.match(/```json\s*(\{[\s\S]*?\})\s*```/)
          if (jsonMatch) {
            jsonMatch[0] = jsonMatch[1]
          }
        }

        if (jsonMatch) {
          console.log('🔍 JSON encontrado (Agregar Más):', jsonMatch[0])
          try {
            const suggestions = JSON.parse(jsonMatch[0])
            console.log('✅ Suggestions parseadas (Agregar Más):', suggestions)
            this.showAISuggestionsModal(decretoId, suggestions)
          } catch (parseError) {
            console.error('❌ Error parseando JSON:', parseError)
            console.log('⚠️ Mostrando respuesta de texto en su lugar')
            this.showAISuggestionsText(message)
          }
        } else {
          console.log('⚠️ No se encontró JSON en respuesta de Agregar Más, mostrando texto')
          console.log('🔎 Buscando en el mensaje:', message.substring(0, 500))
          this.showAISuggestionsText(message)
        }
      } else {
        console.error('❌ Respuesta inválida del chatbot:', response)
      }

    } catch (error) {
      console.error('Error al sugerir más acciones con IA:', error)
      Utils.showToast('Error al obtener más sugerencias de Helene', 'error')
    }
  },

  // Repensar las sugerencias con un enfoque diferente
  async rethinkAcciones(decretoId) {
    try {
      console.log('🔄 Repensando sugerencias para decreto:', decretoId)

      let decreto = this.data.selectedDecreto
      if (!decreto || decreto.id !== decretoId) {
        decreto = this.data.decretos.find(d => d.id === decretoId)
      }

      if (!decreto) {
        Utils.showToast('Decreto no encontrado', 'error')
        return
      }

      Utils.showToast('Helene está repensando las acciones...', 'info')

      const prompt = `Analiza este decreto y dame sugerencias de acciones con un ENFOQUE COMPLETAMENTE DIFERENTE según el método SPEC.

DECRETO: "${decreto.titulo}"
DESCRIPCIÓN: "${decreto.descripcion}"

IMPORTANTE:
- Piensa FUERA DE LA CAJA
- Usa un enfoque más creativo o innovador
- Considera ángulos poco convencionales
- Sé más específica y práctica

FORMATO DE RESPUESTA (JSON):
{
  "primarias": [
    {"titulo": "...", "descripcion": "...", "dia_sugerido": "lunes|miércoles|viernes"},
    {"titulo": "...", "descripcion": "...", "dia_sugerido": "lunes|miércoles|viernes"},
    {"titulo": "...", "descripcion": "...", "dia_sugerido": "lunes|miércoles|viernes"}
  ],
  "secundarias": [
    {"titulo": "...", "descripcion": "...", "momento": "mañana|tarde|noche"},
    {"titulo": "...", "descripcion": "...", "momento": "mañana|tarde|noche"},
    {"titulo": "...", "descripcion": "...", "momento": "mañana|tarde|noche"},
    {"titulo": "...", "descripcion": "...", "momento": "mañana|tarde|noche"},
    {"titulo": "...", "descripcion": "...", "momento": "mañana|tarde|noche"}
  ]
}`

      const response = await API.chatbot.sendMessage(prompt, [])
      console.log('📨 Response de chatbot (Repensar):', response)

      if (response.success && response.message) {
        const message = response.message
        console.log('💬 Mensaje de Helene (Repensar):', message)
        console.log('📏 Longitud del mensaje:', message.length)

        // Intentar encontrar JSON con diferentes patrones
        let jsonMatch = message.match(/\{[\s\S]*?"primarias"[\s\S]*?"secundarias"[\s\S]*?\}/m)

        if (!jsonMatch) {
          // Intentar con ```json
          jsonMatch = message.match(/```json\s*(\{[\s\S]*?\})\s*```/)
          if (jsonMatch) {
            jsonMatch[0] = jsonMatch[1]
          }
        }

        if (jsonMatch) {
          console.log('🔍 JSON encontrado (Repensar):', jsonMatch[0])
          try {
            const suggestions = JSON.parse(jsonMatch[0])
            console.log('✅ Suggestions parseadas (Repensar):', suggestions)
            this.showAISuggestionsModal(decretoId, suggestions)
          } catch (parseError) {
            console.error('❌ Error parseando JSON:', parseError)
            console.log('⚠️ Mostrando respuesta de texto en su lugar')
            this.showAISuggestionsText(message)
          }
        } else {
          console.log('⚠️ No se encontró JSON en respuesta de Repensar, mostrando texto')
          console.log('🔎 Buscando en el mensaje:', message.substring(0, 500))
          this.showAISuggestionsText(message)
        }
      } else {
        console.error('❌ Respuesta inválida del chatbot:', response)
      }

    } catch (error) {
      console.error('Error al repensar acciones con IA:', error)
      Utils.showToast('Error al repensar sugerencias de Helene', 'error')
    }
  }
}