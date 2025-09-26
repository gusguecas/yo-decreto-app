// Módulo de Práctica - Versión Debug Simplificada

const PracticaDebug = {
  data: {
    rutinas: [],
    afirmaciones: [],
    progresoRutinas: {}
  },

  async render() {
    console.log('🌟 INICIO - PracticaDebug.render()')
    const mainContent = document.getElementById('main-content')
    
    if (!mainContent) {
      console.error('❌ No se encontró #main-content')
      return
    }
    
    mainContent.innerHTML = `
      <div class="container mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold mb-2">🌟 Mi Práctica (Debug)</h1>
          <p class="text-slate-300">Versión de depuración</p>
        </div>
        <div id="debug-status" class="bg-slate-800 p-4 rounded mb-6">
          <div class="text-green-400">✅ Renderizado inicial exitoso</div>
          <div class="text-yellow-400">🔄 Cargando datos...</div>
        </div>
        <div id="debug-content">
          <!-- El contenido se cargará aquí -->
        </div>
      </div>
    `
    
    try {
      console.log('🔄 Iniciando loadPracticaData...')
      await this.loadPracticaData()
      
      console.log('🔄 Renderizando contenido...')
      const debugContent = document.getElementById('debug-content')
      debugContent.innerHTML = this.renderContent()
      
      const debugStatus = document.getElementById('debug-status')
      debugStatus.innerHTML = `
        <div class="text-green-400">✅ Datos cargados exitosamente</div>
        <div class="text-blue-400">📊 Rutinas: ${this.data.rutinas.length}</div>
        <div class="text-blue-400">💎 Afirmaciones: ${this.data.afirmaciones.length}</div>
        <div class="text-blue-400">📈 Progreso: ${this.data.progresoRutinas.porcentaje_progreso || 0}%</div>
      `
      
      console.log('✅ ÉXITO - Práctica renderizada completamente')
      
    } catch (error) {
      console.error('💥 ERROR en render:', error)
      const debugStatus = document.getElementById('debug-status')
      debugStatus.innerHTML = `
        <div class="text-red-400">❌ Error: ${error.message}</div>
        <div class="text-yellow-400">📋 Stack: ${error.stack}</div>
      `
    }
  },

  async loadPracticaData() {
    console.log('📡 Iniciando llamadas API...')
    
    try {
      // Probar cada API individualmente
      console.log('🔄 1/3 Cargando rutinas...')
      const rutinasResp = await axios.get('/api/practica/rutinas')
      console.log('✅ 1/3 Rutinas response:', rutinasResp.status, rutinasResp.data.success)
      
      console.log('🔄 2/3 Cargando afirmaciones...')
      const afirmacionesResp = await axios.get('/api/practica/afirmaciones')
      console.log('✅ 2/3 Afirmaciones response:', afirmacionesResp.status, afirmacionesResp.data.success)
      
      console.log('🔄 3/3 Cargando progreso...')
      const progresoResp = await axios.get('/api/practica/rutinas/progreso-dia')
      console.log('✅ 3/3 Progreso response:', progresoResp.status, progresoResp.data.success)
      
      // Asignar datos
      this.data.rutinas = rutinasResp.data.data || []
      this.data.afirmaciones = afirmacionesResp.data.data || []
      this.data.progresoRutinas = progresoResp.data.data || {}
      
      console.log('📊 Datos procesados:', {
        rutinas: this.data.rutinas.length,
        afirmaciones: this.data.afirmaciones.length,
        progreso: this.data.progresoRutinas.porcentaje_progreso
      })
      
    } catch (error) {
      console.error('💥 Error en API call:', error)
      if (error.response) {
        console.error('📡 Response status:', error.response.status)
        console.error('📡 Response data:', error.response.data)
      }
      throw new Error(`API Error: ${error.message}`)
    }
  },

  renderContent() {
    console.log('🎨 Renderizando contenido HTML...')
    
    return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Rutinas -->
        <div class="bg-slate-800 p-6 rounded-xl">
          <h3 class="text-xl font-semibold mb-4">🌅 Rutinas Matutinas</h3>
          <div class="space-y-3">
            ${this.data.rutinas.map(rutina => `
              <div class="bg-slate-700 p-3 rounded flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <span class="text-2xl">${rutina.icono}</span>
                  <div>
                    <div class="font-medium">${rutina.nombre}</div>
                    <div class="text-xs text-slate-400">${rutina.tiempo_estimado} min</div>
                  </div>
                </div>
                <div class="text-sm ${rutina.completada_hoy ? 'text-green-400' : 'text-slate-400'}">
                  ${rutina.completada_hoy ? '✅' : '⭕'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Afirmaciones -->
        <div class="bg-slate-800 p-6 rounded-xl">
          <h3 class="text-xl font-semibold mb-4">💎 Afirmaciones</h3>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            ${this.data.afirmaciones.slice(0, 5).map(afirmacion => `
              <div class="bg-slate-700 p-3 rounded">
                <div class="font-medium text-sm mb-1">"${afirmacion.texto}"</div>
                <div class="flex items-center justify-between">
                  <span class="text-xs bg-blue-600 px-2 py-1 rounded">${afirmacion.categoria}</span>
                  <span class="text-xs text-slate-400">${afirmacion.es_favorita ? '⭐' : ''}${afirmacion.veces_usada} usos</span>
                </div>
              </div>
            `).join('')}
            <div class="text-center text-slate-400 text-sm">
              ${this.data.afirmaciones.length > 5 ? `... y ${this.data.afirmaciones.length - 5} más` : ''}
            </div>
          </div>
        </div>
      </div>
    `
  }
}

// Sobrescribir el módulo original temporalmente
console.log('🔧 Cargando PracticaDebug como reemplazo...')
window.Practica = PracticaDebug