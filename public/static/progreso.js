// Módulo de Progreso

const Progreso = {
  data: {
    metricas: {},
    porDecreto: {},
    timeline: [],
    charts: {}
  },

  async render() {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = UI.renderLoading('Cargando progreso...')
    
    try {
      await this.loadProgresoData()
      mainContent.innerHTML = this.renderProgresoView()
      
      // Inicializar gráficos después del render
      setTimeout(() => {
        this.initCharts()
      }, 100)
      
    } catch (error) {
      mainContent.innerHTML = this.renderError()
    }
  },

  async loadProgresoData() {
    const [metricas, porDecreto, timeline, decretos] = await Promise.all([
      API.progreso.getMetricas(),
      API.progreso.getPorDecreto(),
      API.progreso.getTimeline('mes'), // Última mes por defecto
      API.decretos.getAll() // Para obtener contadores de decretos
    ])

    this.data.metricas = metricas?.data || {}
    this.data.porDecreto = porDecreto?.data || { totales_por_area: {} }
    this.data.timeline = timeline?.data || []
    this.data.decretosContadores = decretos?.data?.contadores || {} // Agregar contadores de decretos
  },

  renderProgresoView() {
    return `
      <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold mb-2 flex items-center justify-center">
            <span class="text-3xl mr-3">📊</span>
            <span class="text-gradient-green">Mi Progreso</span>
          </h1>
          <p class="text-slate-300">Aquí puedes medir cómo avanzas en tus decretos y tareas. Cada acción cuenta.</p>
        </div>

        <!-- Métricas Generales -->
        ${this.renderMetricasGenerales()}

        <!-- Progreso por Decreto -->
        ${this.renderProgresoPorDecreto()}

        <!-- Timeline de Avances -->
        ${this.renderTimelineAvances()}

        <!-- Visualizaciones -->
        ${this.renderVisualizaciones()}

        <!-- Botón Exportar -->
        <div class="text-center mt-12">
          <button 
            onclick="Progreso.exportarReporte()"
            class="btn-primary px-8 py-3 rounded-lg font-semibold flex items-center mx-auto space-x-2 hover-lift"
          >
            <i class="fas fa-file-pdf"></i>
            <span>📑 Generar Reporte PDF</span>
          </button>
        </div>
      </div>
    `
  },

  renderMetricasGenerales() {
    const metricas = this.data.metricas
    return `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div class="metric-card p-6 text-center">
          <div class="text-4xl font-bold text-slate-300 mb-2">${metricas.total_tareas || 0}</div>
          <div class="text-slate-400">Total de Tareas</div>
        </div>
        <div class="metric-card p-6 text-center">
          <div class="text-4xl font-bold text-accent-green mb-2">${metricas.completadas || 0}</div>
          <div class="text-slate-400">Completadas</div>
        </div>
        <div class="metric-card p-6 text-center">
          <div class="text-4xl font-bold text-accent-orange mb-2">${metricas.pendientes || 0}</div>
          <div class="text-slate-400">Pendientes</div>
        </div>
        <div class="metric-card p-6 text-center">
          <div class="text-4xl font-bold text-accent-blue mb-2">${metricas.progreso_global || 0}%</div>
          <div class="text-slate-400">Progreso Global</div>
        </div>
      </div>
    `
  },

  renderProgresoPorDecreto() {
    const totales = this.data.porDecreto.totales_por_area || {}
    const contadores = this.data.decretosContadores || {}
    
    return `
      <div class="gradient-card p-8 rounded-xl mb-12">
        <h2 class="text-2xl font-semibold mb-6">Progreso por Área de Decretos</h2>
        
        <div class="space-y-6">
          <!-- Empresarial -->
          <div class="bg-slate-800/50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xl font-medium flex items-center">
                <span class="text-3xl mr-3">🏢</span>
                Empresarial
              </span>
              <div class="text-right">
                <div class="text-sm text-slate-400">📋 ${contadores.empresarial || 0} decretos</div>
                <div class="text-sm text-slate-400">⚡ ${totales.empresarial?.completadas || 0}/${totales.empresarial?.total_acciones || 0} tareas</div>
              </div>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-4 mb-2">
              <div 
                class="h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500" 
                style="width: ${totales.empresarial?.progreso || 0}%"
              ></div>
            </div>
            <div class="text-right text-lg font-bold text-green-400">
              ${totales.empresarial?.progreso || 0}%
            </div>
          </div>

          <!-- Material -->
          <div class="bg-slate-800/50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xl font-medium flex items-center">
                <span class="text-3xl mr-3">💰</span>
                Material
              </span>
              <div class="text-right">
                <div class="text-sm text-slate-400">📋 ${contadores.material || 0} decretos</div>
                <div class="text-sm text-slate-400">⚡ ${totales.material?.completadas || 0}/${totales.material?.total_acciones || 0} tareas</div>
              </div>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-4 mb-2">
              <div 
                class="h-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500" 
                style="width: ${totales.material?.progreso || 0}%"
              ></div>
            </div>
            <div class="text-right text-lg font-bold text-orange-400">
              ${totales.material?.progreso || 0}%
            </div>
          </div>

          <!-- Humano -->
          <div class="bg-slate-800/50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xl font-medium flex items-center">
                <span class="text-3xl mr-3">❤️</span>
                Humano
              </span>
              <div class="text-right">
                <div class="text-sm text-slate-400">📋 ${contadores.humano || 0} decretos</div>
                <div class="text-sm text-slate-400">⚡ ${totales.humano?.completadas || 0}/${totales.humano?.total_acciones || 0} tareas</div>
              </div>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-4 mb-2">
              <div 
                class="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" 
                style="width: ${totales.humano?.progreso || 0}%"
              ></div>
            </div>
            <div class="text-right text-lg font-bold text-blue-400">
              ${totales.humano?.progreso || 0}%
            </div>
          </div>
        </div>
      </div>
    `
  },

  renderTimelineAvances() {
    return `
      <div class="gradient-card p-8 rounded-xl mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold">Línea de Tiempo de Avances</h2>
          <div class="flex space-x-2">
            <button onclick="Progreso.loadTimeline('dia')" class="btn-secondary px-3 py-1 text-sm rounded">Día</button>
            <button onclick="Progreso.loadTimeline('semana')" class="btn-secondary px-3 py-1 text-sm rounded">Semana</button>
            <button onclick="Progreso.loadTimeline('mes')" class="btn-primary px-3 py-1 text-sm rounded">Mes</button>
            <button onclick="Progreso.loadTimeline('acumulado')" class="btn-secondary px-3 py-1 text-sm rounded">Todo</button>
          </div>
        </div>
        
        <div class="space-y-4 max-h-96 overflow-y-auto">
          ${this.data.timeline.length > 0 ? this.data.timeline.map(hito => `
            <div class="timeline-item pl-6 pb-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="text-accent-green font-medium text-sm">
                      ${Utils.formatDate(hito.fecha_cierre)}
                    </span>
                    <span class="text-xs badge-${hito.area}">${hito.decreto_titulo}</span>
                    ${hito.tipo === 'primaria' ? '<span class="text-xs bg-purple-600 px-2 py-1 rounded">Primaria</span>' : ''}
                  </div>
                  <h4 class="font-medium mb-1">${hito.titulo} - ✅ Completada</h4>
                  ${hito.resultados_obtenidos ? `<p class="text-slate-400 text-sm">${hito.resultados_obtenidos}</p>` : ''}
                  ${hito.calificacion ? `<div class="text-xs text-accent-green mt-1">Calificación: ${hito.calificacion}/10</div>` : ''}
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="text-center py-12 text-slate-400">
              <div class="text-6xl mb-4">📈</div>
              <p class="text-lg">No hay avances registrados</p>
              <p class="text-sm">¡Completa algunas tareas para ver tu progreso!</p>
            </div>
          `}
        </div>
      </div>
    `
  },

  renderVisualizaciones() {
    return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Gráfico Circular -->
        <div class="gradient-card p-6 rounded-xl">
          <h3 class="text-xl font-semibold mb-4">Distribución Global</h3>
          <div class="relative h-64">
            <canvas id="chartDistribucion"></canvas>
          </div>
        </div>

        <!-- Gráfico de Evolución -->
        <div class="gradient-card p-6 rounded-xl">
          <h3 class="text-xl font-semibold mb-4">Evolución de Tareas</h3>
          <div class="relative h-64">
            <canvas id="chartEvolucion"></canvas>
          </div>
        </div>
      </div>
    `
  },

  async initCharts() {
    try {
      // Gráfico de distribución (circular)
      await this.initDistribucionChart()
      
      // Gráfico de evolución (línea)
      await this.initEvolucionChart()
    } catch (error) {
      console.error('Error al inicializar gráficos:', error)
    }
  },

  async initDistribucionChart() {
    const distribucionData = await API.progreso.getDistribucion()
    const ctx = document.getElementById('chartDistribucion')
    
    if (!ctx) return

    const data = distribucionData.data
    const labels = data.map(d => d.area.charAt(0).toUpperCase() + d.area.slice(1))
    const values = data.map(d => d.completadas)
    const colors = ['#10b981', '#f59e0b', '#3b82f6'] // Verde, Orange, Azul

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: '#1e293b',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#f1f5f9',
              padding: 20
            }
          }
        }
      }
    })
  },

  async initEvolucionChart() {
    const evolucionData = await API.progreso.getEvolucion(30)
    const ctx = document.getElementById('chartEvolucion')
    
    if (!ctx) return

    const data = evolucionData.data
    const labels = data.map(d => Utils.formatDate(d.fecha_cierre, 'DD/MM'))
    const values = data.map(d => d.acumuladas)

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Tareas Completadas',
          data: values,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: '#475569'
            },
            ticks: {
              color: '#94a3b8'
            }
          },
          y: {
            grid: {
              color: '#475569'
            },
            ticks: {
              color: '#94a3b8'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#f1f5f9'
            }
          }
        }
      }
    })
  },

  // Event handlers
  async loadTimeline(periodo) {
    try {
      const response = await API.progreso.getTimeline(periodo)
      this.data.timeline = response.data
      
      // Re-renderizar solo la sección del timeline
      const timelineContainer = document.querySelector('.gradient-card:nth-of-type(3)')
      if (timelineContainer) {
        timelineContainer.outerHTML = this.renderTimelineAvances()
      }
    } catch (error) {
      Utils.showToast('Error al cargar timeline', 'error')
    }
  },

  async exportarReporte() {
    try {
      const reporteData = await API.progreso.getReporte()
      
      // Por ahora, mostrar los datos en consola
      console.log('Datos del reporte:', reporteData.data)
      
      Utils.showToast('Función de exportar PDF próximamente', 'info')
    } catch (error) {
      Utils.showToast('Error al generar reporte', 'error')
    }
  },

  renderError() {
    return `
      <div class="container mx-auto px-4 py-8 text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold mb-4">Error al cargar progreso</h2>
        <p class="text-slate-400 mb-6">No se pudo cargar la información de progreso.</p>
        <button onclick="Progreso.render()" class="btn-primary px-6 py-2 rounded-lg">
          Reintentar
        </button>
      </div>
    `
  }
}