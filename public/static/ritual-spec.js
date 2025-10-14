// Ritual SPEC - Timer guiado de 7 minutos (Name It and Claim It)

const RitualSPEC = {
  // Estado del ritual
  state: {
    sessionId: null,
    decretoId: null,
    momento: null, // 'manana' o 'noche'
    isRunning: false,
    isPaused: false,
    currentStage: 0,
    timeRemaining: 0,
    timerInterval: null,
    startTime: null,
    totalElapsed: 0,

    // Datos del ritual
    data: {
      respiracion_completada: 0,
      escena_1: '',
      escena_2: '',
      frase_certeza: '',
      accion_cosecha: '',
      obstaculo: '',
      plan_if_then: ''
    }
  },

  // Etapas del ritual (7 minutos)
  stages: [
    {
      name: 'Respiración',
      duration: 60, // 1 minuto
      icon: '🫁',
      color: 'blue',
      description: 'Respira 4-4-6-2 para centrar tu sistema nervioso',
      instruction: 'Inhala por 4 segundos, sostén 4, exhala 6, pausa 2. Repite.',
      field: 'respiracion_completada'
    },
    {
      name: 'PROJECT (Proyecta)',
      duration: 120, // 2 minutos
      icon: '🎬',
      color: 'purple',
      description: 'Visualiza 2 micro-escenas multisensoriales',
      instruction: 'Crea dos escenas vívidas con todos tus sentidos. Siente las emociones.',
      fields: ['escena_1', 'escena_2']
    },
    {
      name: 'EXPECT (Espera)',
      duration: 60, // 1 minuto
      icon: '⚡',
      color: 'yellow',
      description: 'Mantén expectativa firme',
      instruction: 'Repite tu frase de certeza. No "deseo", sino "SÉ que viene".',
      fields: ['frase_certeza']
    },
    {
      name: 'COLLECT (Cosecha)',
      duration: 120, // 2 minutos
      icon: '🎁',
      color: 'green',
      description: 'Define 1 acción de cosecha para HOY',
      instruction: 'Escribe una acción concreta que harás hoy para manifestar tu decreto.',
      fields: ['accion_cosecha']
    },
    {
      name: 'If-Then Plan',
      duration: 60, // 1 minuto
      icon: '🛡️',
      color: 'orange',
      description: 'Planifica tu respuesta al obstáculo del día',
      instruction: 'Si encuentro [obstáculo], entonces haré [acción].',
      fields: ['obstaculo', 'plan_if_then']
    }
  ],

  // Renderizar vista principal
  render() {
    const hoy = new Date().toISOString().split('T')[0]

    return `
      <div class="ritual-spec-container p-6">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold mb-2 flex items-center">
            <span class="text-4xl mr-3">🧘</span>
            Ritual SPEC (7 minutos)
          </h2>
          <p class="text-slate-400">
            Práctica diaria basada en "Name It and Claim It" de Helene Hadsell
          </p>
        </div>

        <!-- Estadísticas -->
        <div id="ritual-stats" class="mb-8">
          ${this.renderStats()}
        </div>

        <!-- Timer / Configuración -->
        <div id="ritual-timer-area">
          ${this.renderSetup()}
        </div>

        <!-- Sesiones del día -->
        <div id="ritual-sesiones" class="mt-8">
          ${this.renderSesionesHoy()}
        </div>
      </div>
    `
  },

  // Renderizar estadísticas
  renderStats() {
    return `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card p-4">
          <div class="text-2xl mb-2">🔥</div>
          <div class="text-sm text-slate-400 mb-1">Racha actual</div>
          <div class="text-2xl font-bold" id="stat-racha">-</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl mb-2">✅</div>
          <div class="text-sm text-slate-400 mb-1">Sesiones completadas</div>
          <div class="text-2xl font-bold" id="stat-completadas">-</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl mb-2">☀️</div>
          <div class="text-sm text-slate-400 mb-1">Mañanas</div>
          <div class="text-2xl font-bold" id="stat-manana">-</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl mb-2">🌙</div>
          <div class="text-sm text-slate-400 mb-1">Noches</div>
          <div class="text-2xl font-bold" id="stat-noche">-</div>
        </div>
      </div>
    `
  },

  // Renderizar configuración inicial
  renderSetup() {
    return `
      <div class="card p-6">
        <h3 class="text-xl font-bold mb-4">Iniciar Ritual SPEC</h3>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">¿Cuándo vas a hacer el ritual?</label>
          <div class="grid grid-cols-2 gap-4">
            <button onclick="RitualSPEC.selectMomento('manana')" class="momento-btn card p-4 hover-lift cursor-pointer text-center" data-momento="manana">
              <div class="text-3xl mb-2">☀️</div>
              <div class="font-bold">Mañana</div>
              <div class="text-xs text-slate-400 mt-1">Al despertar</div>
            </button>
            <button onclick="RitualSPEC.selectMomento('noche')" class="momento-btn card p-4 hover-lift cursor-pointer text-center" data-momento="noche">
              <div class="text-3xl mb-2">🌙</div>
              <div class="font-bold">Noche</div>
              <div class="text-xs text-slate-400 mt-1">Antes de dormir</div>
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Decreto relacionado (opcional)</label>
          <select id="ritual-decreto-select" class="input-field w-full">
            <option value="">Sin decreto específico</option>
          </select>
        </div>

        <button onclick="RitualSPEC.startRitual()" class="btn-primary w-full py-3" disabled id="start-ritual-btn">
          <i class="fas fa-play mr-2"></i>
          Comenzar Ritual (7 min)
        </button>
      </div>
    `
  },

  // Renderizar timer activo
  renderTimer() {
    const stage = this.stages[this.state.currentStage]
    const totalSeconds = this.stages.reduce((sum, s) => sum + s.duration, 0)
    const elapsedSeconds = this.stages.slice(0, this.state.currentStage).reduce((sum, s) => sum + s.duration, 0) +
                          (stage.duration - this.state.timeRemaining)
    const progressPercent = (elapsedSeconds / totalSeconds) * 100

    return `
      <div class="card p-6">
        <!-- Progreso general -->
        <div class="mb-6">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-slate-400">Progreso total</span>
            <span class="font-bold">${Math.floor(progressPercent)}%</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-2">
            <div class="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- Etapa actual -->
        <div class="text-center mb-6">
          <div class="text-6xl mb-3">${stage.icon}</div>
          <h3 class="text-2xl font-bold mb-2">${stage.name}</h3>
          <p class="text-slate-400 mb-4">${stage.description}</p>
          <div class="bg-slate-800 rounded-lg p-4 mb-4">
            <p class="text-sm italic">"${stage.instruction}"</p>
          </div>
        </div>

        <!-- Timer -->
        <div class="text-center mb-6">
          <div class="text-6xl font-bold mb-2" id="timer-display">
            ${this.formatTime(this.state.timeRemaining)}
          </div>
          <div class="text-slate-400 text-sm">
            Etapa ${this.state.currentStage + 1} de ${this.stages.length}
          </div>
        </div>

        <!-- Indicador de etapas -->
        <div class="flex justify-center space-x-2 mb-6">
          ${this.stages.map((s, i) => `
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl ${
              i < this.state.currentStage ? 'bg-green-600' :
              i === this.state.currentStage ? 'bg-purple-600 animate-pulse' :
              'bg-slate-700'
            }">
              ${s.icon}
            </div>
          `).join('')}
        </div>

        <!-- Controles -->
        <div class="flex justify-center space-x-4">
          <button onclick="RitualSPEC.togglePause()" class="btn-secondary px-6 py-2">
            <i class="fas fa-${this.state.isPaused ? 'play' : 'pause'} mr-2"></i>
            ${this.state.isPaused ? 'Continuar' : 'Pausar'}
          </button>
          <button onclick="RitualSPEC.nextStage()" class="btn-primary px-6 py-2">
            <i class="fas fa-forward mr-2"></i>
            Siguiente etapa
          </button>
          <button onclick="RitualSPEC.stopRitual()" class="btn-danger px-6 py-2">
            <i class="fas fa-stop mr-2"></i>
            Terminar
          </button>
        </div>
      </div>
    `
  },

  // Renderizar formulario de completado
  renderCompletionForm() {
    const stage = this.stages[this.state.currentStage]

    return `
      <div class="card p-6">
        <h3 class="text-2xl font-bold mb-4 text-center">
          <span class="text-3xl mr-2">${stage.icon}</span>
          ${stage.name}
        </h3>
        <p class="text-slate-400 text-center mb-6">${stage.instruction}</p>

        <div id="stage-form-fields">
          ${this.renderStageFields(this.state.currentStage)}
        </div>

        <div class="flex justify-center space-x-4 mt-6">
          ${this.state.currentStage < this.stages.length - 1 ? `
            <button onclick="RitualSPEC.saveStageAndContinue()" class="btn-primary px-8 py-3">
              <i class="fas fa-arrow-right mr-2"></i>
              Siguiente etapa
            </button>
          ` : `
            <button onclick="RitualSPEC.saveStageAndComplete()" class="btn-success px-8 py-3">
              <i class="fas fa-check mr-2"></i>
              Completar Ritual
            </button>
          `}
        </div>
      </div>
    `
  },

  // Renderizar campos según la etapa
  renderStageFields(stageIndex) {
    const stage = this.stages[stageIndex]

    switch (stageIndex) {
      case 0: // Respiración
        return `
          <div class="text-center">
            <p class="text-lg mb-4">¿Completaste los ciclos de respiración?</p>
            <div class="flex justify-center space-x-4">
              <button onclick="RitualSPEC.setData('respiracion_completada', 1)" class="btn-primary px-8 py-3">
                <i class="fas fa-check mr-2"></i>
                Sí, completado
              </button>
            </div>
          </div>
        `

      case 1: // PROJECT
        return `
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Escena 1: Describe tu primera visualización</label>
              <textarea
                id="escena_1"
                class="input-field w-full"
                rows="3"
                placeholder="Ej: Me veo firmando el contrato. Escucho las felicitaciones. Siento la emoción del logro..."
              >${this.state.data.escena_1}</textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Escena 2: Describe tu segunda visualización</label>
              <textarea
                id="escena_2"
                class="input-field w-full"
                rows="3"
                placeholder="Ej: Veo el dashboard con los resultados. Siento el orgullo. Escucho mi voz interior celebrando..."
              >${this.state.data.escena_2}</textarea>
            </div>
          </div>
        `

      case 2: // EXPECT
        return `
          <div>
            <label class="block text-sm font-medium mb-2">Tu frase de certeza</label>
            <textarea
              id="frase_certeza"
              class="input-field w-full"
              rows="2"
              placeholder='Ej: SÉ que este contrato viene. Es inevitable. Ya es mío.'
            >${this.state.data.frase_certeza}</textarea>
            <p class="text-xs text-slate-500 mt-2">Recuerda: No "deseo" o "espero", sino "SÉ que viene"</p>
          </div>
        `

      case 3: // COLLECT
        return `
          <div>
            <label class="block text-sm font-medium mb-2">Tu acción de cosecha para HOY</label>
            <textarea
              id="accion_cosecha"
              class="input-field w-full"
              rows="2"
              placeholder="Ej: Enviaré 3 propuestas antes de las 5pm. Llamaré al contacto clave."
            >${this.state.data.accion_cosecha}</textarea>
            <p class="text-xs text-slate-500 mt-2">Debe ser una acción concreta y realizable hoy</p>
          </div>
        `

      case 4: // If-Then
        return `
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Obstáculo que podrías enfrentar hoy</label>
              <input
                type="text"
                id="obstaculo"
                class="input-field w-full"
                placeholder="Ej: Duda, falta de tiempo, miedo al rechazo..."
                value="${this.state.data.obstaculo}"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Plan If-Then: Si encuentro ese obstáculo, entonces...</label>
              <textarea
                id="plan_if_then"
                class="input-field w-full"
                rows="2"
                placeholder="Ej: Si siento duda, entonces recordaré mis 3 logros pasados y continuaré"
              >${this.state.data.plan_if_then}</textarea>
            </div>
          </div>
        `

      default:
        return ''
    }
  },

  // Renderizar sesiones de hoy
  renderSesionesHoy() {
    return `
      <div>
        <h3 class="text-xl font-bold mb-4">Sesiones de hoy</h3>
        <div id="sesiones-list" class="space-y-4">
          ${UI.renderLoading('Cargando sesiones...')}
        </div>
      </div>
    `
  },

  // Inicializar
  async init() {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = this.render()

    // Cargar decretos para el selector
    await this.loadDecretos()

    // Cargar estadísticas
    await this.loadStats()

    // Cargar sesiones de hoy
    await this.loadSesionesHoy()
  },

  // Cargar decretos
  async loadDecretos() {
    try {
      const response = await API.decretos.getAll()
      const decretos = response.data

      const select = document.getElementById('ritual-decreto-select')
      if (select) {
        decretos.forEach(d => {
          const option = document.createElement('option')
          option.value = d.id
          option.textContent = `${d.titulo} (${d.area})`
          select.appendChild(option)
        })
      }
    } catch (error) {
      console.error('Error loading decretos:', error)
    }
  },

  // Cargar estadísticas
  async loadStats() {
    try {
      const response = await API.ritual.getEstadisticas()
      const stats = response.data

      document.getElementById('stat-racha').textContent = `${stats.racha_dias || 0} días`
      document.getElementById('stat-completadas').textContent = stats.sesiones_completadas || 0
      document.getElementById('stat-manana').textContent = stats.sesiones_manana || 0
      document.getElementById('stat-noche').textContent = stats.sesiones_noche || 0
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  },

  // Cargar sesiones de hoy
  async loadSesionesHoy() {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      const response = await API.ritual.getSesiones(hoy)
      const sesiones = response.data

      const list = document.getElementById('sesiones-list')
      if (!list) return

      if (sesiones.length === 0) {
        list.innerHTML = '<p class="text-slate-400 text-center py-4">No hay sesiones registradas para hoy</p>'
        return
      }

      list.innerHTML = sesiones.map(s => `
        <div class="card p-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-3xl">${s.momento === 'manana' ? '☀️' : '🌙'}</div>
            <div>
              <div class="font-bold">${s.momento === 'manana' ? 'Mañana' : 'Noche'}</div>
              <div class="text-sm text-slate-400">
                ${s.decreto_titulo || 'Sin decreto específico'}
              </div>
              ${s.completado ? `
                <div class="text-xs text-green-400 mt-1">
                  <i class="fas fa-check-circle mr-1"></i>
                  Completado (${Math.floor(s.duracion_segundos / 60)} min)
                </div>
              ` : `
                <div class="text-xs text-yellow-400 mt-1">
                  <i class="fas fa-clock mr-1"></i>
                  En progreso
                </div>
              `}
            </div>
          </div>
          <button onclick="RitualSPEC.deleteSesion('${s.id}')" class="btn-danger btn-sm">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `).join('')
    } catch (error) {
      console.error('Error loading sesiones:', error)
    }
  },

  // Seleccionar momento
  selectMomento(momento) {
    this.state.momento = momento

    // Actualizar UI
    document.querySelectorAll('.momento-btn').forEach(btn => {
      btn.classList.remove('border-purple-500', 'bg-purple-900/20')
      btn.classList.add('border-slate-700')
    })

    const selected = document.querySelector(`[data-momento="${momento}"]`)
    selected.classList.remove('border-slate-700')
    selected.classList.add('border-purple-500', 'bg-purple-900/20')

    // Habilitar botón de inicio
    document.getElementById('start-ritual-btn').disabled = false
  },

  // Iniciar ritual
  async startRitual() {
    if (!this.state.momento) {
      Utils.showToast('Selecciona si harás el ritual en la mañana o noche', 'error')
      return
    }

    const decretoSelect = document.getElementById('ritual-decreto-select')
    this.state.decretoId = decretoSelect.value || null

    try {
      // Crear sesión en backend
      const response = await API.ritual.createSesion({
        decreto_id: this.state.decretoId,
        momento: this.state.momento
      })

      this.state.sessionId = response.session_id
      this.state.isRunning = true
      this.state.currentStage = 0
      this.state.timeRemaining = this.stages[0].duration
      this.state.startTime = Date.now()
      this.state.totalElapsed = 0

      // Renderizar timer
      const timerArea = document.getElementById('ritual-timer-area')
      timerArea.innerHTML = this.renderTimer()

      // Iniciar countdown
      this.startTimer()

      Utils.showToast('¡Ritual SPEC iniciado! 🧘', 'success')
    } catch (error) {
      console.error('Error starting ritual:', error)
      Utils.showToast('Error al iniciar ritual', 'error')
    }
  },

  // Timer countdown
  startTimer() {
    this.state.timerInterval = setInterval(() => {
      if (!this.state.isPaused) {
        this.state.timeRemaining--
        this.state.totalElapsed++

        // Actualizar display
        const display = document.getElementById('timer-display')
        if (display) {
          display.textContent = this.formatTime(this.state.timeRemaining)
        }

        // Sonido al final de etapa (opcional)
        if (this.state.timeRemaining === 3) {
          this.playBeep()
        }

        // Cambiar de etapa
        if (this.state.timeRemaining <= 0) {
          clearInterval(this.state.timerInterval)
          this.showStageForm()
        }
      }
    }, 1000)
  },

  // Mostrar formulario de etapa
  showStageForm() {
    const timerArea = document.getElementById('ritual-timer-area')
    timerArea.innerHTML = this.renderCompletionForm()
  },

  // Siguiente etapa
  async nextStage() {
    if (this.state.currentStage < this.stages.length - 1) {
      this.state.currentStage++
      this.state.timeRemaining = this.stages[this.state.currentStage].duration

      const timerArea = document.getElementById('ritual-timer-area')
      timerArea.innerHTML = this.renderTimer()

      this.startTimer()
    } else {
      await this.completeRitual()
    }
  },

  // Pausar/Continuar
  togglePause() {
    this.state.isPaused = !this.state.isPaused

    const timerArea = document.getElementById('ritual-timer-area')
    timerArea.innerHTML = this.renderTimer()
  },

  // Detener ritual
  async stopRitual() {
    if (!confirm('¿Estás seguro de que quieres detener el ritual?')) {
      return
    }

    clearInterval(this.state.timerInterval)

    // Guardar progreso parcial
    await this.saveProgress()

    // Resetear estado
    this.resetState()

    // Volver a setup
    const timerArea = document.getElementById('ritual-timer-area')
    timerArea.innerHTML = this.renderSetup()
    await this.loadDecretos()

    Utils.showToast('Ritual detenido. Progreso guardado.', 'info')
  },

  // Guardar progreso y continuar
  async saveStageAndContinue() {
    this.collectStageData()
    await this.saveProgress()
    await this.nextStage()
  },

  // Guardar progreso y completar
  async saveStageAndComplete() {
    this.collectStageData()
    await this.completeRitual()
  },

  // Recolectar datos de etapa actual
  collectStageData() {
    const stage = this.stages[this.state.currentStage]

    if (stage.field) {
      // Respiración
      this.state.data[stage.field] = 1
    } else if (stage.fields) {
      // Otras etapas con múltiples campos
      stage.fields.forEach(field => {
        const input = document.getElementById(field)
        if (input) {
          this.state.data[field] = input.value
        }
      })
    }
  },

  // Guardar progreso en backend
  async saveProgress() {
    try {
      await API.ritual.updateSesion(this.state.sessionId, {
        ...this.state.data,
        duracion_segundos: this.state.totalElapsed,
        completado: 0
      })
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  },

  // Completar ritual
  async completeRitual() {
    try {
      await API.ritual.updateSesion(this.state.sessionId, {
        ...this.state.data,
        duracion_segundos: this.state.totalElapsed,
        completado: 1
      })

      // Mostrar mensaje de éxito
      const timerArea = document.getElementById('ritual-timer-area')
      timerArea.innerHTML = `
        <div class="card p-8 text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold mb-4">¡Ritual SPEC Completado!</h3>
          <p class="text-slate-400 mb-6">
            Has completado tu práctica de ${this.state.momento === 'manana' ? 'mañana' : 'noche'}.
            <br>Recuerda ejecutar tu acción de cosecha hoy.
          </p>
          ${this.state.data.accion_cosecha ? `
            <div class="bg-green-900/20 border border-green-600 rounded-lg p-4 mb-6">
              <div class="font-bold mb-2">Tu acción de cosecha:</div>
              <div class="text-green-300">${this.state.data.accion_cosecha}</div>
            </div>
          ` : ''}
          <button onclick="RitualSPEC.init()" class="btn-primary px-8 py-3">
            <i class="fas fa-check mr-2"></i>
            Finalizar
          </button>
        </div>
      `

      // Resetear estado
      this.resetState()

      // Recargar stats y sesiones
      await this.loadStats()
      await this.loadSesionesHoy()

      Utils.showToast('¡Ritual completado exitosamente! 🎉', 'success')
    } catch (error) {
      console.error('Error completing ritual:', error)
      Utils.showToast('Error al completar ritual', 'error')
    }
  },

  // Eliminar sesión
  async deleteSesion(id) {
    if (!confirm('¿Eliminar esta sesión?')) return

    try {
      await API.ritual.deleteSesion(id)
      Utils.showToast('Sesión eliminada', 'success')
      await this.loadSesionesHoy()
      await this.loadStats()
    } catch (error) {
      console.error('Error deleting sesion:', error)
      Utils.showToast('Error al eliminar sesión', 'error')
    }
  },

  // Utilidades
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  },

  playBeep() {
    // Sonido simple usando Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (e) {
      // Silently fail if audio not supported
    }
  },

  setData(key, value) {
    this.state.data[key] = value
    this.saveStageAndContinue()
  },

  resetState() {
    this.state.sessionId = null
    this.state.decretoId = null
    this.state.momento = null
    this.state.isRunning = false
    this.state.isPaused = false
    this.state.currentStage = 0
    this.state.timeRemaining = 0
    this.state.timerInterval = null
    this.state.startTime = null
    this.state.totalElapsed = 0
    this.state.data = {
      respiracion_completada: 0,
      escena_1: '',
      escena_2: '',
      frase_certeza: '',
      accion_cosecha: '',
      obstaculo: '',
      plan_if_then: ''
    }
  }
}
