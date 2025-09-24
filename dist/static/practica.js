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
      
      // Verificar si es un nuevo día y hacer reset si es necesario
      await this.verificarResetDiario()
      
      await this.loadPracticaData()
      console.log('✅ Datos cargados:', this.data)
      mainContent.innerHTML = this.renderPracticaView()
      this.renderModals()
      
      // Inicializar verificación de medianoche
      this.inicializarVerificacionMedianoche()
      
      console.log('✅ Práctica renderizada exitosamente')
    } catch (error) {
      console.error('❌ Error en práctica:', error)
      mainContent.innerHTML = this.renderError(error.message)
    }
  },

  async loadPracticaData() {
    try {
      console.log('🔄 Cargando rutinas...')
      
      // Verificar si hay fecha simulada
      const fechaSimulada = localStorage.getItem('yo-decreto-fecha-simulada')
      const rutinas = fechaSimulada 
        ? await API.practica.getRutinasConFecha(fechaSimulada)
        : await API.practica.getRutinas()
      
      if (fechaSimulada) {
        console.log(`🗺️ Usando fecha simulada: ${fechaSimulada}`)
      }
      
      console.log('✅ Rutinas cargadas:', rutinas.data.length, 'elementos')
      
      console.log('🔄 Cargando afirmaciones...')
      const afirmaciones = await API.practica.getAfirmaciones()
      console.log('✅ Afirmaciones cargadas:', afirmaciones.data.length, 'elementos')
      
      console.log('🔄 Cargando progreso...')
      const progresoRutinas = await API.practica.getProgresoDia()
      console.log('✅ Progreso cargado:', progresoRutinas.data.porcentaje_progreso + '%')

      this.data.rutinas = rutinas.data || []
      this.data.afirmaciones = afirmaciones.data || []
      this.data.progresoRutinas = progresoRutinas.data || {}
      
      console.log('🎯 Datos finales:', {
        rutinas: this.data.rutinas.length,
        afirmaciones: this.data.afirmaciones.length,
        progreso: this.data.progresoRutinas.porcentaje_progreso
      })
    } catch (error) {
      console.error('💥 Error en loadPracticaData:', error)
      throw new Error('Error al cargar datos: ' + error.message)
    }
  },

  renderPracticaView() {
    return `
      <div class="container mx-auto px-4 py-8">
        <!-- Header elegante -->
        <div class="text-center mb-10">
          <div class="inline-block relative mb-4">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            <div class="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full">
              <span class="text-3xl">🌟</span>
            </div>
          </div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Mi Práctica Diaria
          </h1>
          <p class="text-slate-400 mt-2 text-lg">Rutinas que transforman tu realidad</p>
        </div>

        <!-- Rutina Matutina -->
        ${this.renderRutinaMatutina()}

        <!-- Analytics Dashboard -->
        ${this.renderAnalyticsDashboard()}

        <!-- Banco de Afirmaciones -->
        ${this.renderBancoAfirmaciones()}
      </div>
    `
  },

  renderRutinaMatutina() {
    const progreso = this.data.progresoRutinas || {}
    console.log('🏃 Renderizando rutinas:', this.data.rutinas.length, 'progreso:', progreso)
    
    return `
      <div class="relative mb-12">
        <!-- Header Espectacular -->
        <div class="text-center mb-8">
          <div class="inline-block relative">
            <div class="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-yellow-500/30 to-orange-500/30 rounded-full blur-xl"></div>
            <div class="relative bg-gradient-to-r from-orange-500 to-yellow-500 p-4 rounded-full shadow-2xl">
              <span class="text-4xl">🌅</span>
            </div>
          </div>
          <h2 class="text-3xl font-bold mt-4 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Rutina Matutina
          </h2>
          <p class="text-slate-400 mt-2">Transforma tu día con estas 8 prácticas poderosas</p>
          
          <!-- Progreso Central -->
          <div class="mt-6 max-w-md mx-auto">
            <div class="flex items-center justify-center space-x-4 mb-3">
              <div class="text-center">
                <div class="text-3xl font-bold text-green-400">${progreso.porcentaje_progreso || 0}%</div>
                <div class="text-xs text-slate-500">Completado</div>
              </div>
              <div class="w-px h-12 bg-slate-600"></div>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-400">${progreso.completadas_hoy || 0}</div>
                <div class="text-xs text-slate-500">de ${progreso.total_rutinas || 0} rutinas</div>
              </div>
            </div>
            <div class="relative h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div class="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full"></div>
              <div 
                class="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full transition-all duration-1000 shadow-lg relative"
                style="width: ${progreso.porcentaje_progreso || 0}%"
              >
                <div class="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid Rutinas Simétricas -->
        <div class="max-w-5xl mx-auto">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            ${(this.data.rutinas || []).map((rutina, index) => `
              <div class="group cursor-pointer" onclick="Practica.toggleRutina('${rutina.id}', ${!rutina.completada_hoy})">
                <div class="relative transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                  
                  <!-- Glow Effect -->
                  <div class="absolute inset-0 ${this.getGlowColor(rutina.icono)} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  
                  <!-- Card Principal -->
                  <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 group-hover:border-slate-500 transition-all duration-300 shadow-xl">
                    
                    <!-- Status Ring -->
                    <div class="absolute -top-2 -right-2 w-8 h-8 rounded-full ${rutina.completada_hoy ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-slate-500 to-slate-600'} flex items-center justify-center shadow-lg border-2 border-slate-900">
                      <i class="fas ${rutina.completada_hoy ? 'fa-check' : 'fa-plus'} text-white text-sm"></i>
                    </div>
                    
                    <!-- Icono Central -->
                    <div class="text-center mb-4">
                      <div class="relative inline-block">
                        <div class="w-20 h-20 ${this.getIconBg(rutina.icono)} rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                          <i class="${rutina.icono} text-3xl ${this.getIconColor(rutina.icono)}"></i>
                        </div>
                        <div class="absolute inset-0 ${this.getIconBg(rutina.icono)} rounded-full animate-ping opacity-20"></div>
                      </div>
                    </div>
                    
                    <!-- Contenido -->
                    <div class="text-center">
                      <h3 class="font-bold text-white text-sm mb-2 leading-tight">${rutina.nombre}</h3>
                      
                      <!-- Tiempo con estilo -->
                      <div class="inline-flex items-center space-x-1 bg-slate-700/50 px-3 py-1 rounded-full">
                        <i class="fas fa-clock text-blue-400 text-xs"></i>
                        <span class="text-slate-300 text-xs font-medium">${rutina.tiempo_estimado} min</span>
                      </div>
                      
                      <!-- Estado visual -->
                      <div class="mt-3">
                        ${rutina.completada_hoy ? 
                          '<div class="text-green-400 text-xs font-medium flex items-center justify-center space-x-1"><i class="fas fa-sparkles"></i><span>¡Completada!</span></div>' :
                          '<div class="text-slate-400 text-xs">Toca para completar</div>'
                        }
                      </div>
                    </div>
                    
                    <!-- Efecto de completado -->
                    ${rutina.completada_hoy ? `
                      <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20"></div>
                      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <i class="fas fa-check text-6xl text-green-500/20"></i>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
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
              onclick="Practica.sugerirNuevaAfirmacion()"
              class="group relative bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-400/50 text-purple-300 hover:text-purple-200 px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <i class="fas fa-magic"></i>
              <span>Sugerir Afirmación</span>
            </button>
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
    const favoritas = (this.data.afirmaciones || []).filter(a => a.es_favorita).slice(0, 3)
    
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
                      <span class="text-xs px-2 py-1 rounded-full ${this.getCategoryColors(afirmacion.categoria)}">${this.getCategoryIcon(afirmacion.categoria)} ${afirmacion.categoria}</span>
                      ${afirmacion.veces_usada > 0 ? `<span class="text-xs text-slate-400">Usada ${afirmacion.veces_usada} veces</span>` : ''}
                    </div>
                  </div>
                  <button 
                    onclick="Practica.usarAfirmacion('${afirmacion.id}')"
                    class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white p-3 rounded-full ml-3 transition-all hover:scale-110 shadow-lg"
                    title="✨ Recitar Afirmación"
                  >
                    <i class="fas fa-magic"></i>
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
    return (this.data.afirmaciones || []).map(afirmacion => `
      <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <blockquote class="font-medium mb-2">"${afirmacion.texto}"</blockquote>
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-xs px-2 py-1 rounded-full ${this.getCategoryColors(afirmacion.categoria)}">${this.getCategoryIcon(afirmacion.categoria)} ${afirmacion.categoria}</span>
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

  renderAnalyticsDashboard() {
    return `
      <div class="gradient-card p-8 rounded-xl">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold flex items-center">
            <span class="text-3xl mr-3">📊</span>
            Analytics de Rutinas
          </h2>
          <div class="flex space-x-3">
            <button onclick="Practica.toggleAnalytics()" 
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <i class="fas fa-chart-bar mr-2"></i>Ver Análisis
            </button>
            <button onclick="Practica.demostrarResetDiario()" 
                    class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
              <i class="fas fa-info mr-1"></i>Info Reset
            </button>
            <button onclick="Practica.simularCambioDia()" 
                    class="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
              <i class="fas fa-calendar-plus mr-1"></i>Simular Mañana
            </button>
            <button onclick="Practica.resetearRutinasAhora()" 
                    class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
              <i class="fas fa-sync-alt mr-1"></i>Reset AHORA
            </button>
          </div>
        </div>
        
        <!-- Mini stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-slate-800/50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-400" id="racha-actual">0</div>
            <div class="text-xs text-slate-400">Días de racha</div>
          </div>
          <div class="bg-slate-800/50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-400" id="rutinas-semana">0</div>
            <div class="text-xs text-slate-400">Esta semana</div>
          </div>
          <div class="bg-slate-800/50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-purple-400" id="tiempo-promedio">0</div>
            <div class="text-xs text-slate-400">Min/día promedio</div>
          </div>
          <div class="bg-slate-800/50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-orange-400" id="rutina-favorita">-</div>
            <div class="text-xs text-slate-400">Rutina favorita</div>
          </div>
        </div>
        
        <!-- Botón para analytics detallados -->
        <div class="text-center">
          <p class="text-slate-400 text-sm mb-4">Datos de los últimos 30 días</p>
          <div id="analytics-content" class="hidden"></div>
        </div>
      </div>
    `
  },

  async toggleAnalytics() {
    const analyticsContent = document.getElementById('analytics-content')
    const isVisible = !analyticsContent.classList.contains('hidden')
    
    if (isVisible) {
      analyticsContent.classList.add('hidden')
    } else {
      // Cargar y mostrar analytics detallados
      await this.loadAnalyticsDetallados()
      analyticsContent.classList.remove('hidden')
    }
  },

  async loadAnalyticsDetallados() {
    try {
      const analytics = await API.practica.getAnalytics(30)
      const analyticsContent = document.getElementById('analytics-content')
      
      analyticsContent.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <!-- Tendencias por rutina -->
          <div class="bg-slate-800/30 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fas fa-trophy text-yellow-400 mr-2"></i>
              Rutinas Más Completadas
            </h3>
            <div class="space-y-3">
              ${analytics.data.tendencias_por_rutina.slice(0, 5).map(rutina => `
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <i class="${rutina.icono} text-blue-400"></i>
                    <span class="text-sm">${rutina.nombre}</span>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-green-400">${rutina.veces_completada || 0}</div>
                    <div class="text-xs text-slate-400">${Math.round(rutina.tiempo_promedio || 0)} min/día</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Progreso semanal -->
          <div class="bg-slate-800/30 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fas fa-calendar-week text-blue-400 mr-2"></i>
              Progreso Últimos 7 Días
            </h3>
            <div class="space-y-2">
              ${analytics.data.progreso_diario.slice(0, 7).map(dia => `
                <div class="flex items-center justify-between">
                  <span class="text-sm">${new Date(dia.fecha).toLocaleDateString('es-ES', {weekday: 'short', day: 'numeric'})}</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" 
                           style="width: ${dia.porcentaje_completado}%"></div>
                    </div>
                    <span class="text-xs text-slate-400 w-8 text-right">${Math.round(dia.porcentaje_completado)}%</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="mt-6 text-center">
          <div class="inline-flex items-center space-x-4 text-sm text-slate-400">
            <span>🔥 Racha actual: ${analytics.data.racha_actual} días</span>
            <span>📅 Período: ${analytics.data.resumen.dias_analizados} días</span>
          </div>
        </div>
      `
      
      // Actualizar mini stats
      document.getElementById('racha-actual').textContent = analytics.data.racha_actual || 0
      
      const totalRutinas = analytics.data.progreso_diario.slice(0, 7)
        .reduce((sum, dia) => sum + dia.rutinas_completadas, 0)
      document.getElementById('rutinas-semana').textContent = totalRutinas || 0
      
      const tiempoPromedio = analytics.data.progreso_diario.slice(0, 7)
        .reduce((sum, dia) => sum + dia.tiempo_total_minutos, 0) / 7
      document.getElementById('tiempo-promedio').textContent = Math.round(tiempoPromedio) || 0
      
      const rutinaFavorita = analytics.data.tendencias_por_rutina[0]
      document.getElementById('rutina-favorita').textContent = 
        rutinaFavorita ? rutinaFavorita.nombre.split(' ')[0] : '-'
      
    } catch (error) {
      console.error('Error al cargar analytics:', error)
      document.getElementById('analytics-content').innerHTML = `
        <div class="text-red-400 text-center p-4">
          <i class="fas fa-exclamation-triangle mb-2"></i>
          <p>Error al cargar estadísticas</p>
        </div>
      `
    }
  },

  // Reset automático diario
  async verificarResetDiario() {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      const ultimaFecha = localStorage.getItem('yo-decreto-ultima-fecha')
      
      console.log(`📅 Verificación diaria: hoy=${hoy}, última=${ultimaFecha}`)
      
      // SIEMPRE mostrar el estado actual para debug
      console.log(`🔍 Estado actual del reset:`)
      console.log(`   - Fecha del sistema: ${hoy}`)
      console.log(`   - Última fecha guardada: ${ultimaFecha || 'nunca establecida'}`)
      console.log(`   - ¿Es nuevo día?: ${ultimaFecha !== hoy ? 'SÍ' : 'NO'}`)
      
      if (ultimaFecha !== hoy) {
        console.log('🔄 ✨ NUEVO DÍA DETECTADO - Aplicando reset automático...')
        console.log(`🔄 Cambiando de ${ultimaFecha || 'primera vez'} → ${hoy}`)
        
        // Guardar estadísticas del día anterior si existe
        if (ultimaFecha) {
          await this.guardarEstadisticasDia(ultimaFecha)
          console.log(`📊 Estadísticas guardadas para ${ultimaFecha}`)
        }
        
        // FORZAR la actualización de fecha
        localStorage.setItem('yo-decreto-ultima-fecha', hoy)
        localStorage.removeItem('yo-decreto-fecha-simulada') // Limpiar cualquier simulación
        
        // IMPORTANTE: Esto es lo que hace que las rutinas aparezcan como "no completadas"
        console.log('✨ El backend automáticamente mostrará rutinas como no completadas para la nueva fecha')
        
        Utils.showToast(`🌅 ¡Nuevo día ${hoy}! Las rutinas se han reiniciado automáticamente`, 'success')
        console.log('✅ Reset diario completado - Todas las rutinas están listas para el nuevo día')
        
        // Marcar que hubo un reset para el siguiente render
        this.resetAplicado = true
        
      } else {
        console.log(`✅ Mismo día (${hoy}) - No se requiere reset`)
        this.resetAplicado = false
      }
    } catch (error) {
      console.error('Error en verificación de reset diario:', error)
    }
  },

  async guardarEstadisticasDia(fecha) {
    try {
      // Las estadísticas se guardan automáticamente en el backend
      // cuando se completa una rutina, pero podemos verificar aquí
      console.log(`📊 Estadísticas del ${fecha} ya guardadas en BD`)
    } catch (error) {
      console.error('Error al guardar estadísticas del día:', error)
    }
  },

  inicializarVerificacionMedianoche() {
    // Calcular tiempo hasta medianoche
    const ahora = new Date()
    const medianoche = new Date()
    medianoche.setHours(24, 0, 0, 0) // Próxima medianoche (12:00 AM del día siguiente)
    
    const tiempoHastaMedianoche = medianoche.getTime() - ahora.getTime()
    const horasHastaMedianoche = Math.floor(tiempoHastaMedianoche / 1000 / 60 / 60)
    const minutosHastaMedianoche = Math.floor((tiempoHastaMedianoche / 1000 / 60) % 60)
    
    // Programar reset a medianoche
    setTimeout(() => {
      this.ejecutarResetMedianoche()
      
      // Programar reset diario cada 24 horas después de la primera medianoche
      setInterval(() => {
        this.ejecutarResetMedianoche()
      }, 24 * 60 * 60 * 1000) // 24 horas exactas
      
    }, tiempoHastaMedianoche)
    
    console.log(`⏰ ✨ RESET AUTOMÁTICO PROGRAMADO PARA LAS 12:00 AM`)
    console.log(`🕐 Tiempo restante: ${horasHastaMedianoche}h ${minutosHastaMedianoche}m`)
    console.log(`📅 Próxima medianoche: ${medianoche.toLocaleString('es-ES')}`)
    console.log(`🔄 Las rutinas se reiniciarán automáticamente cada día a las 12:00 AM`)
  },

  async ejecutarResetMedianoche() {
    try {
      const ahora = new Date()
      const fechaActual = ahora.toISOString().split('T')[0]
      const horaActual = ahora.toLocaleTimeString('es-ES')
      
      console.log(`🕐 ✨ ¡RESET DE MEDIANOCHE EJECUTÁNDOSE! ✨`)
      console.log(`📅 Fecha: ${fechaActual} - Hora: ${horaActual}`)
      console.log(`🔄 Reiniciando todas las rutinas para el nuevo día...`)
      
      // Guardar estadísticas del día que termina
      const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      await this.guardarEstadisticasDia(ayer)
      console.log(`📊 Estadísticas del ${ayer} archivadas correctamente`)
      
      // Actualizar fecha en localStorage
      localStorage.setItem('yo-decreto-ultima-fecha', fechaActual)
      console.log(`📅 Fecha actualizada en sistema: ${fechaActual}`)
      
      // Si la sección de práctica está activa, recargar
      if (AppState.currentSection === 'practica') {
        await this.loadPracticaData()
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.innerHTML = this.renderPracticaView()
          this.renderModals()
        }
        console.log(`🔄 Vista de práctica recargada automáticamente`)
      }
      
      // Mostrar notificación si el usuario está activo
      if (document.visibilityState === 'visible') {
        Utils.showToast(`🌅 ¡NUEVO DÍA ${fechaActual}! Todas las rutinas se han reiniciado automáticamente`, 'success')
      }
      
      console.log(`✅ ✨ RESET COMPLETADO EXITOSAMENTE ✨`)
      console.log(`🎆 ¡Listo para un nuevo día de prácticas transformadoras!`)
      
    } catch (error) {
      console.error('❌ Error en reset de medianoche:', error)
    }
  },

  // Función de demostración del reset diario
  async demostrarResetDiario() {
    try {
      // Mostrar información actual del sistema
      const fechaActual = new Date().toISOString().split('T')[0]
      const ultimaFecha = localStorage.getItem('yo-decreto-ultima-fecha')
      const ahora = new Date()
      
      // Calcular tiempo hasta medianoche
      const medianoche = new Date()
      medianoche.setHours(24, 0, 0, 0)
      const tiempoHastaMedianoche = medianoche.getTime() - ahora.getTime()
      const horasHasta = Math.floor(tiempoHastaMedianoche / 1000 / 60 / 60)
      const minutosHasta = Math.floor((tiempoHastaMedianoche / 1000 / 60) % 60)
      
      const info = `
📅 ESTADO ACTUAL DEL SISTEMA DE RESET DIARIO:

✅ Fecha actual: ${fechaActual}
✅ Última sesión: ${ultimaFecha || 'Primera vez'}
⏰ Próxima medianoche: ${medianoche.toLocaleString('es-ES')}
⏱️ Tiempo restante: ${horasHasta}h ${minutosHasta}m

🔄 ¿CÓMO FUNCIONA EL RESET AUTOMÁTICO?

1. 🕐 A las 12:00 AM cada día
2. 📊 Se guardan las estadísticas del día anterior
3. 🔄 Todas las rutinas se marcan como "no completadas"
4. 🎆 ¡Listo para un nuevo día!

✨ DATOS QUE SE CONSERVAN:
• Historial completo de rutinas completadas
• Respuestas a preguntas específicas
• Tiempos invertidos
• Estados de ánimo y calidad
• Estadísticas y analytics
• Rachas de consistencia

🌅 Cada día es una nueva oportunidad para:
• Completar tus 8 rutinas matutinas
• Responder preguntas de reflexión
• Hacer seguimiento detallado
• Mantener tu racha de consistencia
      `
      
      alert(info)
      
      console.log('📈 DEMOSTRACIÓN DEL SISTEMA DE RESET DIARIO:')
      console.log(info)
      
    } catch (error) {
      console.error('Error en demostración:', error)
      alert('Error al mostrar información del reset diario')
    }
  },

  // Simular cambio de día para pruebas
  async simularCambioDia() {
    try {
      const fechaActual = new Date().toISOString().split('T')[0]
      const fechaSimuladaActual = localStorage.getItem('yo-decreto-fecha-simulada')
      
      if (fechaSimuladaActual) {
        // Ya estamos en simulación, preguntar si quiere volver al día actual o avanzar
        const opcion = confirm(`
🗺️ ESTÁS EN MODO SIMULACIÓN

Fecha real: ${fechaActual}
Fecha simulada: ${fechaSimuladaActual}

❓ ¿Qué quieres hacer?

• ACEPTAR: Volver al día actual (salir de simulación)
• CANCELAR: Avanzar un día más en la simulación`)
        
        if (opcion) {
          // Volver al día actual
          localStorage.removeItem('yo-decreto-fecha-simulada')
          localStorage.setItem('yo-decreto-ultima-fecha', fechaActual)
          await this.recargarRutinas()
          alert(`✅ Has vuelto al día actual: ${fechaActual}`)
        } else {
          // Avanzar un día más
          const fechaSimulada = new Date(fechaSimuladaActual)
          fechaSimulada.setDate(fechaSimulada.getDate() + 1)
          const nuevaFecha = fechaSimulada.toISOString().split('T')[0]
          
          localStorage.setItem('yo-decreto-fecha-simulada', nuevaFecha)
          localStorage.setItem('yo-decreto-ultima-fecha', nuevaFecha)
          await this.recargarRutinas()
          alert(`⏭️ Simulación avanzada a: ${nuevaFecha}`)
        }
        return
      }
      
      // Primera simulación
      const manana = new Date()
      manana.setDate(manana.getDate() + 1)
      const fechaManana = manana.toISOString().split('T')[0]
      
      const confirmacion = confirm(`
📅 SIMULACIÓN DE CAMBIO DE DÍA

Esto simulará que hemos pasado al día siguiente:

📅 Hoy: ${fechaActual}
🌅 Mañana: ${fechaManana}

✨ Esto hará que:
• Todas las rutinas aparezcan como "no completadas"
• Se conserven los datos históricos de hoy
• Puedas empezar un nuevo día de rutinas

📝 Para volver al día actual, haz clic de nuevo en "Simular Mañana"

¿Continuar con la simulación?`)
      
      if (!confirmacion) return
      
      // Activar simulación
      localStorage.setItem('yo-decreto-fecha-simulada', fechaManana)
      localStorage.setItem('yo-decreto-ultima-fecha', fechaManana)
      
      console.log(`🗺️ SIMULACIÓN INICIADA: ${fechaActual} → ${fechaManana}`)
      
      // Recargar con fecha simulada
      await this.recargarRutinas()
      
      alert(`✨ ¡SIMULACIÓN ACTIVADA!

🌅 Ahora simulas estar en: ${fechaManana}
🔄 Todas las rutinas aparecen como "no completadas"
⚡ Puedes completar rutinas como si fuera el nuevo día

🔍 Observa que NO hay rutinas marcadas como completadas

📝 Para salir de la simulación, haz clic otra vez en "Simular Mañana"`)
      
    } catch (error) {
      console.error('Error en simulación:', error)
      alert('Error al simular cambio de día')
    }
  },

  // Restaurar fecha actual (salir de simulación)
  async restaurarFechaActual() {
    try {
      const fechaReal = new Date().toISOString().split('T')[0]
      localStorage.setItem('yo-decreto-ultima-fecha', fechaReal)
      
      await this.verificarResetDiario()
      await this.recargarRutinas()
      
      Utils.showToast('📅 Fecha restaurada al día actual', 'info')
    } catch (error) {
      console.error('Error al restaurar fecha:', error)
    }
  },

  // Reset manual forzado de rutinas
  async resetearRutinasAhora() {
    try {
      const fechaActual = new Date().toISOString().split('T')[0]
      const horaActual = new Date().toLocaleTimeString('es-ES')
      
      const confirmacion = confirm(`
🔄 RESET MANUAL DE RUTINAS

📅 Fecha: ${fechaActual}
⏰ Hora: ${horaActual}

⚠️ Esto hará:
• Marcará todas las rutinas como "NO completadas"
• Simulará un nuevo día fresco
• Conservará todos los datos históricos

🔥 ¡Perfecto para probar el reset diario!

¿Continuar con el reset forzado?`)
      
      if (!confirmacion) return
      
      console.log(`🔄 ✨ EJECUTANDO RESET MANUAL FORZADO ✨`)
      
      // Forzar cambio de fecha para activar reset
      const fechaForzada = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      // Limpiar localStorage y forzar nuevo día
      localStorage.removeItem('yo-decreto-ultima-fecha')
      localStorage.removeItem('yo-decreto-fecha-simulada')
      localStorage.setItem('yo-decreto-ultima-fecha', fechaForzada)
      
      console.log(`🔄 Fecha forzada a: ${fechaForzada}`)
      
      // Ejecutar verificación que detectará el "nuevo día"
      await this.verificarResetDiario()
      
      // Recargar rutinas (ahora deberían aparecer todas como no completadas)
      await this.recargarRutinas()
      
      // Restaurar fecha real después del reset
      setTimeout(() => {
        localStorage.setItem('yo-decreto-ultima-fecha', fechaActual)
      }, 1000)
      
      alert(`✨ ¡RESET COMPLETADO!

🔄 Todas las rutinas han sido resetadas
🎆 Ahora aparecerán como "no completadas"
📊 Los datos históricos se conservaron

🔍 ¡Observa cómo cambió la interfaz!`)
      
    } catch (error) {
      console.error('Error en reset manual:', error)
      alert('Error al ejecutar reset manual')
    }
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

  // Helper functions para iconos coloridos
  getIconColor(icono) {
    const colors = {
      'fa-sun': 'text-yellow-400',
      'fa-heart': 'text-red-400', 
      'fa-scroll': 'text-purple-400',
      'fa-microphone': 'text-blue-400',
      'fa-eye': 'text-green-400',
      'fa-tint': 'text-cyan-400',
      'fa-running': 'text-orange-400',
      'fa-tasks': 'text-indigo-400'
    }
    return colors[icono] || 'text-slate-400'
  },

  getIconBg(icono) {
    const backgrounds = {
      'fa-sun': 'bg-yellow-400/20',
      'fa-heart': 'bg-red-400/20',
      'fa-scroll': 'bg-purple-400/20', 
      'fa-microphone': 'bg-blue-400/20',
      'fa-eye': 'bg-green-400/20',
      'fa-tint': 'bg-cyan-400/20',
      'fa-running': 'bg-orange-400/20',
      'fa-tasks': 'bg-indigo-400/20'
    }
    return backgrounds[icono] || 'bg-slate-700'
  },

  getIconText(icono) {
    const texts = {
      'fa-sun': 'Despertar',
      'fa-heart': 'Gratitud',
      'fa-scroll': 'Decretos',
      'fa-microphone': 'Afirmaciones', 
      'fa-eye': 'Visualización',
      'fa-tint': 'Hidratación',
      'fa-running': 'Movimiento',
      'fa-tasks': 'Planificación'
    }
    return texts[icono] || 'Rutina'
  },

  getCategoryColors(categoria) {
    const colors = {
      'empresarial': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      'material': 'bg-green-500/20 text-green-300 border border-green-500/30',
      'humano': 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
      'general': 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    }
    return colors[categoria] || 'bg-slate-600/20 text-slate-300 border border-slate-500/30'
  },

  getCategoryIcon(categoria) {
    const icons = {
      'empresarial': '🏢',
      'material': '💰', 
      'humano': '❤️',
      'general': '🌟'
    }
    return icons[categoria] || '📝'
  },

  getGlowColor(icono) {
    const glows = {
      'fa-sun': 'bg-yellow-500/40',
      'fa-heart': 'bg-red-500/40',
      'fa-scroll': 'bg-purple-500/40',
      'fa-microphone': 'bg-blue-500/40',
      'fa-eye': 'bg-green-500/40',
      'fa-tint': 'bg-cyan-500/40',
      'fa-running': 'bg-orange-500/40',
      'fa-tasks': 'bg-indigo-500/40'
    }
    return glows[icono] || 'bg-slate-500/40'
  },

  // Event handlers
  async toggleRutina(rutinaId, completada) {
    try {
      if (completada) {
        // Abrir modal con preguntas específicas
        await this.abrirModalRutinaDetallada(rutinaId)
      } else {
        await API.practica.desmarcarRutina(rutinaId)
        Utils.showToast('Rutina desmarcada', 'info')
        await this.recargarRutinas()
      }
    } catch (error) {
      Utils.showToast('Error al actualizar rutina', 'error')
    }
  },

  async abrirModalRutinaDetallada(rutinaId) {
    try {
      // Obtener información de la rutina
      const rutina = this.data.rutinas.find(r => r.id === rutinaId)
      if (!rutina) return

      // Obtener preguntas específicas para esta rutina
      const preguntas = await API.practica.getPreguntasRutina(rutinaId)
      
      // Crear y mostrar modal
      const modal = this.crearModalRutinaDetallada(rutina, preguntas.data)
      document.body.appendChild(modal)
      
      // Mostrar modal
      setTimeout(() => {
        modal.classList.remove('opacity-0')
        modal.classList.add('opacity-100')
      }, 10)
      
    } catch (error) {
      console.error('Error al abrir modal detallado:', error)
      Utils.showToast('Error al cargar preguntas de rutina', 'error')
    }
  },

  crearModalRutinaDetallada(rutina, preguntas) {
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 opacity-0 transition-opacity duration-300'
    modal.id = 'modal-rutina-detallada'
    
    modal.innerHTML = `
      <div class="bg-slate-900 rounded-xl p-6 max-w-lg w-full mx-4 max-h-96 overflow-y-auto transform scale-95 transition-transform duration-300" id="modal-content">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <i class="${rutina.icono} text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-white">${rutina.nombre}</h3>
              <p class="text-slate-400 text-sm">Completa los detalles de tu práctica</p>
            </div>
          </div>
          <button onclick="Practica.cerrarModalRutina()" class="text-slate-400 hover:text-white transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Cronómetro/Tiempo -->
        <div class="mb-6 bg-slate-800 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <span class="text-white font-medium">⏱️ Tiempo de práctica</span>
            <button id="btn-cronometro" onclick="Practica.toggleCronometro()" 
                    class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
              <i class="fas fa-play" id="icon-cronometro"></i> Iniciar
            </button>
          </div>
          <div class="text-center">
            <div class="text-2xl font-mono text-blue-400" id="display-cronometro">00:00</div>
            <input type="number" id="tiempo-manual" placeholder="O ingresa minutos manualmente" 
                   class="mt-2 w-full px-3 py-2 bg-slate-700 text-white rounded-lg text-sm" min="1" max="120">
          </div>
        </div>

        <!-- Estado de ánimo antes -->
        <div class="mb-4">
          <label class="block text-white font-medium mb-2">😊 ¿Cómo te sientes antes de empezar?</label>
          <div class="flex space-x-2">
            ${[1,2,3,4,5].map(n => `
              <button onclick="Practica.setEstadoAnimo('antes', ${n})" 
                      class="estado-animo-antes w-10 h-10 rounded-full border-2 border-slate-600 hover:border-blue-500 transition-colors flex items-center justify-center text-lg"
                      data-valor="${n}">${['😔','😐','🙂','😊','😄'][n-1]}</button>
            `).join('')}
          </div>
        </div>

        <!-- Preguntas específicas -->
        <div class="space-y-4 mb-6">
          ${preguntas.map((pregunta, index) => `
            <div>
              <label class="block text-white font-medium mb-2">${pregunta.pregunta}</label>
              ${this.renderCampoRespuesta(pregunta, index)}
            </div>
          `).join('')}
        </div>

        <!-- Estado de ánimo después -->
        <div class="mb-6">
          <label class="block text-white font-medium mb-2">✨ ¿Cómo te sientes después de la práctica?</label>
          <div class="flex space-x-2">
            ${[1,2,3,4,5].map(n => `
              <button onclick="Practica.setEstadoAnimo('despues', ${n})" 
                      class="estado-animo-despues w-10 h-10 rounded-full border-2 border-slate-600 hover:border-green-500 transition-colors flex items-center justify-center text-lg"
                      data-valor="${n}">${['😔','😐','🙂','😊','😄'][n-1]}</button>
            `).join('')}
          </div>
        </div>

        <!-- Calidad percibida -->
        <div class="mb-6">
          <label class="block text-white font-medium mb-2">⭐ Calidad de tu práctica</label>
          <div class="flex space-x-1">
            ${[1,2,3,4,5].map(n => `
              <button onclick="Practica.setCalidad(${n})" 
                      class="calidad-estrella text-2xl text-slate-600 hover:text-yellow-400 transition-colors"
                      data-valor="${n}">⭐</button>
            `).join('')}
          </div>
        </div>

        <!-- Ubicación -->
        <div class="mb-6">
          <label class="block text-white font-medium mb-2">📍 ¿Dónde realizaste la práctica?</label>
          <input type="text" id="ubicacion" placeholder="Ej: Casa, Parque, Oficina..." 
                 class="w-full px-3 py-2 bg-slate-700 text-white rounded-lg">
        </div>

        <!-- Notas adicionales -->
        <div class="mb-6">
          <label class="block text-white font-medium mb-2">📝 Notas adicionales (opcional)</label>
          <textarea id="notas-adicionales" placeholder="¿Alguna reflexión o detalle importante?" 
                    class="w-full px-3 py-2 bg-slate-700 text-white rounded-lg h-20 resize-none"></textarea>
        </div>

        <!-- Botones -->
        <div class="flex space-x-3">
          <button onclick="Practica.cerrarModalRutina()" 
                  class="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            Cancelar
          </button>
          <button onclick="Practica.completarRutinaDetallada('${rutina.id}')" 
                  class="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-colors font-semibold">
            ✅ Completar Rutina
          </button>
        </div>
      </div>
    `
    
    // Animar entrada del modal
    setTimeout(() => {
      const content = modal.querySelector('#modal-content')
      content.classList.remove('scale-95')
      content.classList.add('scale-100')
    }, 50)
    
    return modal
  },

  renderCampoRespuesta(pregunta, index) {
    const inputId = `respuesta-${index}`
    
    switch (pregunta.tipo_respuesta) {
      case 'escala':
        return `
          <div class="flex space-x-2">
            ${[1,2,3,4,5].map(n => `
              <button onclick="Practica.setRespuestaEscala('${inputId}', ${n})" 
                      class="respuesta-escala-${index} w-8 h-8 rounded border-2 border-slate-600 hover:border-blue-500 transition-colors text-sm"
                      data-valor="${n}">${n}</button>
            `).join('')}
          </div>
        `
      case 'numero':
        return `<input type="number" id="${inputId}" class="w-full px-3 py-2 bg-slate-700 text-white rounded-lg" min="0" max="999">`
      case 'booleano':
        return `
          <div class="flex space-x-3">
            <button onclick="Practica.setRespuestaBoolean('${inputId}', true)" 
                    class="respuesta-bool-${index} px-4 py-2 border-2 border-slate-600 hover:border-green-500 text-white rounded-lg transition-colors"
                    data-valor="true">✅ Sí</button>
            <button onclick="Practica.setRespuestaBoolean('${inputId}', false)" 
                    class="respuesta-bool-${index} px-4 py-2 border-2 border-slate-600 hover:border-red-500 text-white rounded-lg transition-colors"
                    data-valor="false">❌ No</button>
          </div>
        `
      case 'texto':
      default:
        return `<input type="text" id="${inputId}" class="w-full px-3 py-2 bg-slate-700 text-white rounded-lg" placeholder="Tu respuesta...">`
    }
  },

  // Variables para el modal detallado
  cronometroActivo: false,
  cronometroInicio: null,
  cronometroInterval: null,
  datosRutina: {
    estadoAnimoAntes: null,
    estadoAnimoDespues: null,
    calidad: null,
    respuestas: {}
  },

  // Funciones del cronómetro
  toggleCronometro() {
    if (this.cronometroActivo) {
      this.pararCronometro()
    } else {
      this.iniciarCronometro()
    }
  },

  iniciarCronometro() {
    this.cronometroActivo = true
    this.cronometroInicio = Date.now()
    
    const btnCronometro = document.getElementById('btn-cronometro')
    const iconCronometro = document.getElementById('icon-cronometro')
    
    btnCronometro.innerHTML = '<i class="fas fa-pause" id="icon-cronometro"></i> Pausar'
    btnCronometro.className = 'px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors'
    
    this.cronometroInterval = setInterval(() => {
      this.actualizarDisplayCronometro()
    }, 1000)
  },

  pararCronometro() {
    this.cronometroActivo = false
    clearInterval(this.cronometroInterval)
    
    const btnCronometro = document.getElementById('btn-cronometro')
    btnCronometro.innerHTML = '<i class="fas fa-play" id="icon-cronometro"></i> Iniciar'
    btnCronometro.className = 'px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors'
    
    // Poner tiempo en el campo manual
    if (this.cronometroInicio) {
      const tiempoMinutos = Math.ceil((Date.now() - this.cronometroInicio) / 60000)
      document.getElementById('tiempo-manual').value = tiempoMinutos
    }
  },

  actualizarDisplayCronometro() {
    if (!this.cronometroInicio) return
    
    const tiempoTranscurrido = Date.now() - this.cronometroInicio
    const minutos = Math.floor(tiempoTranscurrido / 60000)
    const segundos = Math.floor((tiempoTranscurrido % 60000) / 1000)
    
    const display = document.getElementById('display-cronometro')
    display.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
  },

  // Funciones de interacción
  setEstadoAnimo(momento, valor) {
    if (momento === 'antes') {
      this.datosRutina.estadoAnimoAntes = valor
    } else {
      this.datosRutina.estadoAnimoDespues = valor
    }
    
    // Actualizar UI
    const botones = document.querySelectorAll(`.estado-animo-${momento}`)
    botones.forEach(btn => {
      btn.classList.remove('border-blue-500', 'border-green-500', 'bg-blue-500', 'bg-green-500')
      btn.classList.add('border-slate-600')
    })
    
    const botonSeleccionado = document.querySelector(`.estado-animo-${momento}[data-valor="${valor}"]`)
    const colorClass = momento === 'antes' ? 'blue' : 'green'
    botonSeleccionado.classList.remove('border-slate-600')
    botonSeleccionado.classList.add(`border-${colorClass}-500`, `bg-${colorClass}-500`)
  },

  setCalidad(valor) {
    this.datosRutina.calidad = valor
    
    // Actualizar estrellas
    const estrellas = document.querySelectorAll('.calidad-estrella')
    estrellas.forEach((estrella, index) => {
      if (index < valor) {
        estrella.classList.remove('text-slate-600')
        estrella.classList.add('text-yellow-400')
      } else {
        estrella.classList.remove('text-yellow-400')
        estrella.classList.add('text-slate-600')
      }
    })
  },

  setRespuestaEscala(inputId, valor) {
    this.datosRutina.respuestas[inputId] = valor
    
    // Actualizar UI
    const index = inputId.split('-')[1]
    const botones = document.querySelectorAll(`.respuesta-escala-${index}`)
    botones.forEach(btn => {
      btn.classList.remove('border-blue-500', 'bg-blue-500')
      btn.classList.add('border-slate-600')
    })
    
    const botonSeleccionado = document.querySelector(`.respuesta-escala-${index}[data-valor="${valor}"]`)
    botonSeleccionado.classList.remove('border-slate-600')
    botonSeleccionado.classList.add('border-blue-500', 'bg-blue-500')
  },

  setRespuestaBoolean(inputId, valor) {
    this.datosRutina.respuestas[inputId] = valor
    
    // Actualizar UI
    const index = inputId.split('-')[1]
    const botones = document.querySelectorAll(`.respuesta-bool-${index}`)
    botones.forEach(btn => {
      btn.classList.remove('border-green-500', 'bg-green-500', 'border-red-500', 'bg-red-500')
      btn.classList.add('border-slate-600')
    })
    
    const botonSeleccionado = document.querySelector(`.respuesta-bool-${index}[data-valor="${valor}"]`)
    const colorClass = valor === true ? 'green' : 'red'
    botonSeleccionado.classList.remove('border-slate-600')
    botonSeleccionado.classList.add(`border-${colorClass}-500`, `bg-${colorClass}-500`)
  },

  async completarRutinaDetallada(rutinaId) {
    try {
      // Recopilar todos los datos
      const tiempoManual = document.getElementById('tiempo-manual').value
      const tiempoFinal = tiempoManual || (this.cronometroInicio ? Math.ceil((Date.now() - this.cronometroInicio) / 60000) : null)
      
      // Recopilar respuestas de campos de texto y número
      const camposTexto = document.querySelectorAll('#modal-rutina-detallada input[type="text"], #modal-rutina-detallada input[type="number"]')
      camposTexto.forEach(campo => {
        if (campo.id.startsWith('respuesta-')) {
          this.datosRutina.respuestas[campo.id] = campo.value
        }
      })
      
      const ubicacion = document.getElementById('ubicacion').value
      const notas = document.getElementById('notas-adicionales').value
      
      // Enviar datos al servidor
      await API.practica.completarRutinaDetallada(rutinaId, {
        tiempo_invertido: tiempoFinal,
        notas: notas,
        respuestas: this.datosRutina.respuestas,
        estado_animo_antes: this.datosRutina.estadoAnimoAntes,
        estado_animo_despues: this.datosRutina.estadoAnimoDespues,
        calidad_percibida: this.datosRutina.calidad,
        ubicacion: ubicacion
      })
      
      Utils.showToast('¡Rutina completada con éxito!', 'success')
      this.cerrarModalRutina()
      await this.recargarRutinas()
      
    } catch (error) {
      console.error('Error al completar rutina detallada:', error)
      Utils.showToast('Error al completar rutina', 'error')
    }
  },

  cerrarModalRutina() {
    const modal = document.getElementById('modal-rutina-detallada')
    if (modal) {
      // Limpiar cronómetro
      if (this.cronometroActivo) {
        this.pararCronometro()
      }
      
      // Limpiar datos
      this.datosRutina = {
        estadoAnimoAntes: null,
        estadoAnimoDespues: null,
        calidad: null,
        respuestas: {}
      }
      
      modal.classList.add('opacity-0')
      setTimeout(() => {
        modal.remove()
      }, 300)
    }
  },

  async recargarRutinas() {
    try {
      console.log('🔄 Recargando rutinas...')
      
      // Limpiar datos actuales
      this.data = {
        rutinas: [],
        afirmaciones: [],
        progresoRutinas: {},
        estadisticas: {}
      }
      
      // Cargar datos frescos
      await this.loadPracticaData()
      
      // Re-renderizar completamente la vista
      const mainContent = document.getElementById('main-content')
      if (mainContent && AppState.currentSection === 'practica') {
        mainContent.innerHTML = this.renderPracticaView()
        this.renderModals()
      }
      
      console.log('✅ Rutinas recargadas completamente')
      console.log(`📈 Estado actual:`, this.data.rutinas?.map(r => ({
        nombre: r.nombre, 
        completada: r.completada_hoy
      })))
      
    } catch (error) {
      console.error('Error al recargar rutinas:', error)
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
  },

  async sugerirNuevaAfirmacion() {
    try {
      // Mostrar estado de carga
      Utils.showToast('🪄 Generando nueva afirmación...', 'info')
      
      // Obtener categoría actual del filtro
      const categoriaSeleccionada = document.getElementById('filtroCategoria')?.value || 'todas'
      const categoria = categoriaSeleccionada === 'todas' ? 'general' : categoriaSeleccionada
      
      console.log('🎯 Generando afirmación para categoría:', categoria)
      
      // Llamar a la API para generar afirmación
      const response = await API.practica.generarAfirmacion({ categoria })
      
      if (response.success) {
        const nuevaAfirmacion = response.data
        
        // Mostrar toast de éxito con preview de la afirmación
        const previewTexto = nuevaAfirmacion.texto.length > 50 
          ? nuevaAfirmacion.texto.substring(0, 50) + '...' 
          : nuevaAfirmacion.texto
        
        Utils.showToast(`✨ Nueva afirmación creada: "${previewTexto}"`, 'success')
        
        // Recargar afirmaciones respetando el filtro actual
        if (categoriaSeleccionada === 'todas') {
          // Si no hay filtro, cargar todas las afirmaciones
          await this.loadPracticaData()
          this.updateAfirmacionesView()
        } else {
          // Si hay filtro activo, aplicar el filtro para mostrar la nueva afirmación
          document.getElementById('filtroCategoria').value = categoria
          await this.filtrarAfirmaciones()
        }
        
      } else {
        Utils.showToast('Error al generar afirmación', 'error')
      }
      
    } catch (error) {
      console.error('❌ Error al sugerir afirmación:', error)
      Utils.showToast('Error al generar afirmación', 'error')
    }
  }
}