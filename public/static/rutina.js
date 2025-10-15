// Módulo de Rutina Diaria Tripartito

const Rutina = {
  data: {
    todayData: null,
    stats: null,
    currentCheckInTime: null
  },

  async render() {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = UI.renderLoading('Cargando rutina del día...')

    try {
      // Cargar datos del día
      const response = await API.rutina.getToday()
      this.data.todayData = response.data

      // Determinar check-in actual basado en la hora
      this.data.currentCheckInTime = this.getCurrentCheckInTime()

      // Renderizar vista
      mainContent.innerHTML = this.renderRutinaView()

      // Configurar event listeners
      this.setupEventListeners()

    } catch (error) {
      console.error('Error al cargar rutina:', error)
      mainContent.innerHTML = `
        <div class="container mx-auto px-4 py-8">
          <div class="text-center">
            <div class="text-6xl mb-4">⚠️</div>
            <h2 class="text-2xl font-bold mb-2">Error al cargar la rutina</h2>
            <p class="text-slate-400 mb-4">Asegúrate de tener decretos activos en las 3 categorías</p>
            <button onclick="Router.navigate('decretos')" class="btn-primary px-6 py-3 rounded-lg">
              Ir a Mis Decretos
            </button>
          </div>
        </div>
      `
    }
  },

  getCurrentCheckInTime() {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 10) return null // Antes de primer check-in
    if (hour >= 10 && hour < 15) return '10am'
    if (hour >= 15 && hour < 20) return '3pm'
    return '8pm'
  },

  renderRutinaView() {
    const { date, dailyFocus, primary, secondary, routines, faithCheckins, meritCommitment, completedTasks } = this.data.todayData

    // Verificar si rutinas están completadas
    const morningRoutineCompleted = routines?.some(r => r.routine_type === 'morning' && r.completed)
    const eveningRoutineCompleted = routines?.some(r => r.routine_type === 'evening' && r.completed)

    // Verificar tareas completadas
    const tasksMap = {}
    completedTasks?.forEach(task => {
      const key = `${task.decreto_id}_${task.task_type}`
      tasksMap[key] = task
    })

    return `
      <div class="container mx-auto px-4 py-8 max-w-7xl">
        <!-- Header del Día -->
        ${this.renderDayHeader(date, dailyFocus)}

        <!-- Rutina Matutina -->
        <div class="mb-8">
          ${this.renderMorningRoutine(morningRoutineCompleted)}
        </div>

        <!-- Decretos Primarios del Día (3) -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-4 flex items-center">
            <span class="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              🎯 Tus 3 Decretos Primarios del Día
            </span>
          </h2>
          <p class="text-slate-400 mb-6">
            Dedica 30-40 minutos a cada uno (total: 1.5-2 horas)
          </p>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            ${this.renderPrimaryDecreto(primary.material, 'material', '🏆', 'Material', tasksMap, faithCheckins)}
            ${this.renderPrimaryDecreto(primary.humano, 'humano', '❤️', 'Humano', tasksMap, faithCheckins)}
            ${this.renderPrimaryDecreto(primary.empresarial, 'empresarial', '💼', 'Empresarial', tasksMap, faithCheckins)}
          </div>
        </div>

        <!-- Check-ins de Fe (3 al día) -->
        <div class="mb-8">
          ${this.renderFaithCheckIns(faithCheckins, primary)}
        </div>

        <!-- Decretos Secundarios (Rápidos) -->
        ${secondary && secondary.length > 0 ? `
          <div class="mb-8">
            <div class="gradient-card rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-2xl font-bold flex items-center">
                    ⚡ Decretos Secundarios (${secondary.length})
                  </h2>
                  <p class="text-slate-400 text-sm mt-1">
                    5-10 min cada uno para mantener momentum
                  </p>
                </div>
                <button onclick="document.getElementById('secondaryDecretos').classList.toggle('hidden')"
                        class="btn-secondary px-4 py-2 rounded-lg">
                  <i class="fas fa-chevron-down"></i>
                  <span class="ml-2">Expandir</span>
                </button>
              </div>
              <div id="secondaryDecretos" class="hidden mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${secondary.map(decreto => this.renderSecondaryDecreto(decreto, tasksMap)).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Compromiso de Merecimiento -->
        <div class="mb-8">
          ${this.renderMeritCommitment(meritCommitment)}
        </div>

        <!-- Rutina Vespertina -->
        <div class="mb-8">
          ${this.renderEveningRoutine(eveningRoutineCompleted)}
        </div>

        <!-- Resumen del Día -->
        ${this.renderDailySummary(primary, secondary, tasksMap, routines)}
      </div>
    `
  },

  renderDayHeader(date, dailyFocus) {
    const focusInfo = {
      'SELECT': { emoji: '🎯', color: 'blue', description: 'Define con claridad total' },
      'PROJECT': { emoji: '🎬', color: 'purple', description: 'Visualiza multisensorialmente' },
      'EXPECT': { emoji: '⚡', color: 'yellow', description: 'Mantén certeza sin ansiedad' },
      'MERECIMIENTO': { emoji: '👑', color: 'pink', description: 'Aumenta tu sentido de merecimiento' },
      'ACCION': { emoji: '🚀', color: 'green', description: 'Actúa desde la certeza' },
      'GRATITUD': { emoji: '🙏', color: 'orange', description: 'Agradece lo manifestado y por manifestar' },
      'RECARGA': { emoji: '🔋', color: 'indigo', description: 'Descansa y renueva tu energía' }
    }

    const focus = focusInfo[dailyFocus] || focusInfo['SELECT']

    return `
      <div class="gradient-card rounded-xl p-8 mb-8 text-center">
        <div class="text-6xl mb-4">${focus.emoji}</div>
        <h1 class="text-4xl font-bold mb-2">
          <span class="bg-gradient-to-r from-${focus.color}-400 to-${focus.color}-600 bg-clip-text text-transparent">
            ${dailyFocus}
          </span>
        </h1>
        <p class="text-xl text-slate-300 mb-4">${focus.description}</p>
        <p class="text-slate-400">${Utils.formatDate(date, 'dddd, D [de] MMMM [de] YYYY')}</p>
        <div class="mt-6 flex justify-center space-x-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-yellow-400">2.5h</div>
            <div class="text-xs text-slate-400">Compromiso diario</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-pink-400">3</div>
            <div class="text-xs text-slate-400">Primarios</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-400">3</div>
            <div class="text-xs text-slate-400">Check-ins</div>
          </div>
        </div>
      </div>
    `
  },

  renderMorningRoutine(completed) {
    return `
      <div class="gradient-card rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="text-4xl">🌅</div>
            <div>
              <h3 class="text-xl font-bold">Rutina Matutina</h3>
              <p class="text-sm text-slate-400">10 minutos para empezar el día</p>
            </div>
          </div>
          ${completed ? `
            <div class="text-green-400 flex items-center space-x-2">
              <i class="fas fa-check-circle text-2xl"></i>
              <span class="font-semibold">Completada</span>
            </div>
          ` : `
            <button onclick="Rutina.completeRoutine('morning')" class="btn-primary px-4 py-2 rounded-lg">
              Marcar Completada
            </button>
          `}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div class="bg-slate-800/50 p-4 rounded-lg">
            <div class="text-2xl mb-2">🙏</div>
            <h4 class="font-semibold mb-1">Gratitud</h4>
            <p class="text-sm text-slate-400">3 cosas por las que estás agradecido</p>
          </div>
          <div class="bg-slate-800/50 p-4 rounded-lg">
            <div class="text-2xl mb-2">🎯</div>
            <h4 class="font-semibold mb-1">Intención del Día</h4>
            <p class="text-sm text-slate-400">Define tu enfoque SPEC</p>
          </div>
          <div class="bg-slate-800/50 p-4 rounded-lg">
            <div class="text-2xl mb-2">⚡</div>
            <h4 class="font-semibold mb-1">Visualización</h4>
            <p class="text-sm text-slate-400">5 min de visualización multisensorial</p>
          </div>
        </div>
      </div>
    `
  },

  renderPrimaryDecreto(decreto, categoria, emoji, label, tasksMap, faithCheckins) {
    const taskKey = `${decreto.id}_primary`
    const isCompleted = tasksMap[taskKey]?.completed
    const minutesSpent = tasksMap[taskKey]?.minutes_spent || 0

    // Obtener último check-in de fe para este decreto
    const lastFaithCheckin = faithCheckins?.filter(fc => fc.decreto_id === decreto.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]

    const categoryColors = {
      material: 'yellow',
      humano: 'pink',
      empresarial: 'blue'
    }
    const color = categoryColors[categoria]

    return `
      <div class="gradient-card rounded-xl p-6 border-2 ${isCompleted ? 'border-green-500' : `border-${color}-500`}">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="text-4xl">${emoji}</div>
            <div>
              <div class="text-xs text-slate-400 uppercase tracking-wide">${label}</div>
              <h3 class="text-lg font-bold">${decreto.titulo}</h3>
            </div>
          </div>
          ${isCompleted ? `
            <i class="fas fa-check-circle text-green-400 text-2xl"></i>
          ` : ''}
        </div>

        ${decreto.description ? `
          <p class="text-sm text-slate-300 mb-4">${decreto.description}</p>
        ` : ''}

        <!-- Barra de progreso de tiempo -->
        <div class="mb-4">
          <div class="flex justify-between text-xs text-slate-400 mb-1">
            <span>Tiempo dedicado</span>
            <span>${minutesSpent}/40 min</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-2">
            <div class="bg-gradient-to-r from-${color}-400 to-${color}-600 h-2 rounded-full transition-all duration-500"
                 style="width: ${Math.min((minutesSpent / 40) * 100, 100)}%"></div>
          </div>
        </div>

        <!-- Nivel de Fe -->
        ${lastFaithCheckin ? `
          <div class="mb-4 p-3 bg-slate-800/50 rounded-lg">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-400">Nivel de Fe Actual</span>
              <div class="flex items-center space-x-2">
                ${this.renderFaithStars(lastFaithCheckin.faith_level)}
                <span class="font-bold text-${color}-400">${lastFaithCheckin.faith_level}/10</span>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Acciones -->
        <div class="flex space-x-2">
          ${!isCompleted ? `
            <button onclick="Rutina.openTaskModal(${decreto.id}, 'primary', '${decreto.titulo}')"
                    class="flex-1 btn-primary px-4 py-2 rounded-lg text-sm">
              <i class="fas fa-play mr-2"></i>
              Trabajar (40 min)
            </button>
          ` : `
            <button onclick="Rutina.viewTaskDetails(${decreto.id}, 'primary')"
                    class="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm">
              <i class="fas fa-eye mr-2"></i>
              Ver Detalles
            </button>
          `}
          <button onclick="Rutina.recordSignal(${decreto.id}, '${decreto.titulo}')"
                  class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
                  title="Registrar señal o sincronicidad">
            <i class="fas fa-magic"></i>
          </button>
        </div>
      </div>
    `
  },

  renderSecondaryDecreto(decreto, tasksMap) {
    const taskKey = `${decreto.id}_secondary`
    const isCompleted = tasksMap[taskKey]?.completed
    const minutesSpent = tasksMap[taskKey]?.minutes_spent || 0

    const categoryEmojis = {
      material: '🏆',
      humano: '❤️',
      empresarial: '💼'
    }
    const emoji = categoryEmojis[decreto.categoria] || '📌'

    return `
      <div class="gradient-card rounded-lg p-4 ${isCompleted ? 'border-l-4 border-green-500' : ''}">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">${emoji}</span>
            <h4 class="font-semibold">${decreto.titulo}</h4>
          </div>
          ${isCompleted ? `
            <i class="fas fa-check-circle text-green-400"></i>
          ` : ''}
        </div>

        <div class="text-xs text-slate-400 mb-3">
          ${minutesSpent > 0 ? `⏱️ ${minutesSpent} min dedicados` : '⏱️ 5-10 min sugeridos'}
        </div>

        ${!isCompleted ? `
          <button onclick="Rutina.openTaskModal(${decreto.id}, 'secondary', '${decreto.titulo}')"
                  class="w-full btn-secondary px-3 py-2 rounded-lg text-sm">
            <i class="fas fa-check mr-2"></i>
            Completar Rápido
          </button>
        ` : `
          <button onclick="Rutina.viewTaskDetails(${decreto.id}, 'secondary')"
                  class="w-full bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm">
            <i class="fas fa-eye mr-2"></i>
            Ver Detalles
          </button>
        `}
      </div>
    `
  },

  renderFaithCheckIns(faithCheckins, primary) {
    const checkInTimes = ['10am', '3pm', '8pm']
    const currentTime = this.data.currentCheckInTime

    return `
      <div class="gradient-card rounded-xl p-6">
        <div class="mb-4">
          <h2 class="text-2xl font-bold mb-2 flex items-center">
            📊 Check-ins de Fe (3 al día)
          </h2>
          <p class="text-slate-400">
            Registra tu nivel de fe en 10am, 3pm y 8pm para cada decreto primario
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${checkInTimes.map(time => {
            const isCurrentOrPast = this.isCheckInTimeAvailable(time)
            const hasCheckins = faithCheckins?.some(fc => fc.check_in_time === time)

            return `
              <div class="bg-slate-800/50 p-4 rounded-lg ${isCurrentOrPast ? 'border-2 border-blue-500' : 'opacity-50'}">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-bold text-lg">${time}</h3>
                  ${hasCheckins ? `
                    <i class="fas fa-check-circle text-green-400"></i>
                  ` : isCurrentOrPast ? `
                    <i class="fas fa-clock text-blue-400"></i>
                  ` : `
                    <i class="fas fa-lock text-slate-600"></i>
                  `}
                </div>

                ${isCurrentOrPast ? `
                  ${hasCheckins ? `
                    <div class="space-y-2">
                      ${Object.entries(primary).map(([categoria, decreto]) => {
                        const checkin = faithCheckins?.find(fc => fc.decreto_id === decreto.id && fc.check_in_time === time)
                        return checkin ? `
                          <div class="text-sm">
                            <div class="flex justify-between items-center">
                              <span class="text-slate-300">${this.getCategoryEmoji(categoria)}</span>
                              <span class="font-bold text-yellow-400">${checkin.faith_level}/10</span>
                            </div>
                          </div>
                        ` : ''
                      }).join('')}
                    </div>
                  ` : `
                    <button onclick="Rutina.openFaithCheckInModal('${time}')"
                            class="w-full btn-primary px-3 py-2 rounded-lg text-sm">
                      Registrar Check-in
                    </button>
                  `}
                ` : `
                  <p class="text-xs text-slate-500">Disponible a partir de ${time}</p>
                `}
              </div>
            `
          }).join('')}
        </div>
      </div>
    `
  },

  renderMeritCommitment(commitment) {
    return `
      <div class="gradient-card rounded-xl p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="text-4xl">👑</div>
            <div>
              <h3 class="text-xl font-bold">Compromiso de Merecimiento</h3>
              <p class="text-sm text-slate-400">Obligatorio diario - ¿Qué harás hoy para aumentar tu sentido de merecimiento?</p>
            </div>
          </div>
          ${commitment?.completed ? `
            <div class="text-green-400 flex items-center space-x-2">
              <i class="fas fa-check-circle text-2xl"></i>
            </div>
          ` : ''}
        </div>

        ${commitment && commitment.commitment ? `
          <div class="bg-slate-800/50 p-4 rounded-lg mb-4">
            <p class="text-slate-300">${commitment.commitment}</p>
            ${commitment.reflection ? `
              <div class="mt-3 pt-3 border-t border-slate-700">
                <p class="text-sm text-slate-400"><strong>Reflexión:</strong> ${commitment.reflection}</p>
              </div>
            ` : ''}
          </div>

          ${!commitment.completed ? `
            <button onclick="Rutina.completeMeritCommitment()"
                    class="btn-primary px-4 py-2 rounded-lg">
              <i class="fas fa-check mr-2"></i>
              Marcar como Completado
            </button>
          ` : ''}
        ` : `
          <button onclick="Rutina.openMeritCommitmentModal()"
                  class="btn-primary px-4 py-2 rounded-lg">
            <i class="fas fa-pen mr-2"></i>
            Definir Compromiso del Día
          </button>
        `}
      </div>
    `
  },

  renderEveningRoutine(completed) {
    return `
      <div class="gradient-card rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="text-4xl">🌙</div>
            <div>
              <h3 class="text-xl font-bold">Rutina Vespertina</h3>
              <p class="text-sm text-slate-400">10 minutos para cerrar el día</p>
            </div>
          </div>
          ${completed ? `
            <div class="text-green-400 flex items-center space-x-2">
              <i class="fas fa-check-circle text-2xl"></i>
              <span class="font-semibold">Completada</span>
            </div>
          ` : `
            <button onclick="Rutina.completeRoutine('evening')" class="btn-primary px-4 py-2 rounded-lg">
              Marcar Completada
            </button>
          `}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div class="bg-slate-800/50 p-4 rounded-lg">
            <div class="text-2xl mb-2">📝</div>
            <h4 class="font-semibold mb-1">Revisión del Día</h4>
            <p class="text-sm text-slate-400">¿Qué logré? ¿Qué aprendí?</p>
          </div>
          <div class="bg-slate-800/50 p-4 rounded-lg">
            <div class="text-2xl mb-2">✨</div>
            <h4 class="font-semibold mb-1">Señales</h4>
            <p class="text-sm text-slate-400">Registra señales o sincronicidades</p>
          </div>
          <div class="bg-slate-800/50 p-4 rounded-lg">
            <div class="text-2xl mb-2">🙏</div>
            <h4 class="font-semibold mb-1">Gratitud Final</h4>
            <p class="text-sm text-slate-400">Agradece lo manifestado hoy</p>
          </div>
        </div>
      </div>
    `
  },

  renderDailySummary(primary, secondary, tasksMap, routines) {
    // Contar tareas completadas
    let primaryCompleted = 0
    let secondaryCompleted = 0
    let totalMinutes = 0

    Object.entries(primary).forEach(([_, decreto]) => {
      const task = tasksMap[`${decreto.id}_primary`]
      if (task?.completed) {
        primaryCompleted++
        totalMinutes += task.minutes_spent || 0
      }
    })

    secondary?.forEach(decreto => {
      const task = tasksMap[`${decreto.id}_secondary`]
      if (task?.completed) {
        secondaryCompleted++
        totalMinutes += task.minutes_spent || 0
      }
    })

    const morningDone = routines?.some(r => r.routine_type === 'morning' && r.completed)
    const eveningDone = routines?.some(r => r.routine_type === 'evening' && r.completed)

    const totalTasks = 3 + (secondary?.length || 0) + 2 // 3 primarios + secundarios + 2 rutinas
    const completedTasks = primaryCompleted + secondaryCompleted + (morningDone ? 1 : 0) + (eveningDone ? 1 : 0)
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100)

    return `
      <div class="gradient-card rounded-xl p-6">
        <h2 class="text-2xl font-bold mb-4">📊 Resumen del Día</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-4 bg-slate-800/50 rounded-lg">
            <div class="text-3xl font-bold text-yellow-400">${primaryCompleted}/3</div>
            <div class="text-xs text-slate-400">Primarios</div>
          </div>
          <div class="text-center p-4 bg-slate-800/50 rounded-lg">
            <div class="text-3xl font-bold text-blue-400">${secondaryCompleted}/${secondary?.length || 0}</div>
            <div class="text-xs text-slate-400">Secundarios</div>
          </div>
          <div class="text-center p-4 bg-slate-800/50 rounded-lg">
            <div class="text-3xl font-bold text-pink-400">${totalMinutes}</div>
            <div class="text-xs text-slate-400">Minutos</div>
          </div>
          <div class="text-center p-4 bg-slate-800/50 rounded-lg">
            <div class="text-3xl font-bold text-green-400">${completionPercentage}%</div>
            <div class="text-xs text-slate-400">Completado</div>
          </div>
        </div>

        <!-- Barra de progreso general -->
        <div class="mb-4">
          <div class="flex justify-between text-sm text-slate-400 mb-2">
            <span>Progreso General del Día</span>
            <span>${completedTasks}/${totalTasks} tareas</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-4">
            <div class="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                 style="width: ${completionPercentage}%">
              ${completionPercentage >= 20 ? `<span class="text-xs font-bold text-white">${completionPercentage}%</span>` : ''}
            </div>
          </div>
        </div>

        ${completionPercentage === 100 ? `
          <div class="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/50 rounded-lg p-4 text-center">
            <div class="text-4xl mb-2">🎉</div>
            <p class="text-lg font-bold text-green-400">¡Felicitaciones! Completaste tu rutina diaria al 100%</p>
            <p class="text-sm text-slate-300 mt-2">Estás un paso más cerca de manifestar tus decretos</p>
          </div>
        ` : ''}
      </div>
    `
  },

  renderFaithStars(level) {
    const fullStars = Math.floor(level / 2)
    const halfStar = level % 2 === 1
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    let stars = ''
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star text-yellow-400"></i>'
    if (halfStar) stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>'
    for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star text-slate-600"></i>'

    return stars
  },

  getCategoryEmoji(categoria) {
    const emojis = {
      material: '🏆',
      humano: '❤️',
      empresarial: '💼'
    }
    return emojis[categoria] || '📌'
  },

  isCheckInTimeAvailable(time) {
    const hour = new Date().getHours()
    if (time === '10am') return hour >= 10
    if (time === '3pm') return hour >= 15
    if (time === '8pm') return hour >= 20
    return false
  },

  setupEventListeners() {
    // Los event listeners se configuran inline en los botones onclick
    // para mantener el código más simple y directo
  },

  // === ACCIONES ===

  async completeRoutine(type) {
    try {
      const notes = prompt(type === 'morning'
        ? '¿Qué intención tienes para hoy? (opcional)'
        : '¿Qué lograste hoy? (opcional)')

      await API.rutina.completeRoutine({
        routineType: type,
        notes: notes || ''
      })

      Utils.showToast(`Rutina ${type === 'morning' ? 'matutina' : 'vespertina'} completada`, 'success')
      this.render()

    } catch (error) {
      console.error('Error al completar rutina:', error)
      Utils.showToast('Error al completar rutina', 'error')
    }
  },

  async openTaskModal(decretoId, taskType, titulo) {
    const isPrimary = taskType === 'primary'
    const suggestedMinutes = isPrimary ? 40 : 10

    const html = `
      <div class="space-y-4">
        <div class="bg-slate-800/50 p-4 rounded-lg">
          <h4 class="font-bold mb-2">${titulo}</h4>
          <p class="text-sm text-slate-400">
            ${isPrimary
              ? 'Trabaja en este decreto por 30-40 minutos. Concéntrate en acciones específicas que te acerquen a su manifestación.'
              : 'Dedica 5-10 minutos para mantener el momentum de este decreto.'}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">
            ⏱️ Tiempo dedicado (minutos)
          </label>
          <input type="number" id="taskMinutes" value="${suggestedMinutes}" min="1" max="120"
                 class="form-input w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600">
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">
            📝 ¿Qué hiciste? (opcional)
          </label>
          <textarea id="taskNotes" rows="3" placeholder="Describe brevemente las acciones que realizaste..."
                    class="form-input w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"></textarea>
        </div>

        <div class="flex space-x-3">
          <button onclick="Modal.close('taskModal')" class="flex-1 btn-secondary px-4 py-2 rounded-lg">
            Cancelar
          </button>
          <button onclick="Rutina.submitTask(${decretoId}, '${taskType}')" class="flex-1 btn-primary px-4 py-2 rounded-lg">
            <i class="fas fa-check mr-2"></i>
            Completar Tarea
          </button>
        </div>
      </div>
    `

    // Agregar modal al DOM
    const modalsContainer = document.getElementById('modals') || document.body
    const modalHtml = UI.renderModal('taskModal', `Completar Decreto ${isPrimary ? 'Primario' : 'Secundario'}`, html, 'md')
    modalsContainer.innerHTML = modalHtml
    Modal.open('taskModal')
  },

  async submitTask(decretoId, taskType) {
    try {
      const minutes = parseInt(document.getElementById('taskMinutes').value)
      const notes = document.getElementById('taskNotes').value.trim()

      if (!minutes || minutes < 1) {
        Utils.showToast('Debes indicar cuántos minutos dedicaste', 'error')
        return
      }

      await API.rutina.completeTask({
        decretoId,
        taskType,
        minutesSpent: minutes,
        notes
      })

      Modal.close('taskModal')
      Utils.showToast('Tarea completada exitosamente', 'success')
      this.render()

    } catch (error) {
      console.error('Error al completar tarea:', error)
      Utils.showToast('Error al completar tarea', 'error')
    }
  },

  async openFaithCheckInModal(checkInTime) {
    const { primary } = this.data.todayData

    const html = `
      <div class="space-y-6">
        <div class="bg-blue-900/30 border border-blue-500/50 p-4 rounded-lg">
          <p class="text-sm text-blue-200">
            Registra tu nivel de fe para cada uno de tus 3 decretos primarios del día.
            <strong>1 = Sin fe</strong>, <strong>10 = Fe absoluta</strong>
          </p>
        </div>

        ${Object.entries(primary).map(([categoria, decreto]) => `
          <div class="gradient-card p-4 rounded-lg" data-decreto-id="${decreto.id}">
            <div class="flex items-center space-x-3 mb-3">
              <span class="text-3xl">${this.getCategoryEmoji(categoria)}</span>
              <div>
                <div class="text-xs text-slate-400 uppercase">${categoria}</div>
                <div class="font-bold">${decreto.titulo}</div>
              </div>
            </div>

            <div class="mb-3">
              <label class="block text-sm font-medium mb-2">Nivel de Fe (1-10)</label>
              <input type="range" min="1" max="10" value="5"
                     class="faith-slider w-full"
                     data-decreto-id="${decreto.id}"
                     oninput="document.getElementById('faith-value-${decreto.id}').textContent = this.value">
              <div class="text-center mt-2">
                <span class="text-2xl font-bold text-yellow-400" id="faith-value-${decreto.id}">5</span>
                <span class="text-slate-400">/10</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Notas (opcional)</label>
              <textarea class="faith-notes form-input w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600"
                        data-decreto-id="${decreto.id}"
                        rows="2"
                        placeholder="¿Por qué sientes este nivel de fe hoy?"></textarea>
            </div>
          </div>
        `).join('')}

        <div class="flex space-x-3">
          <button onclick="Modal.close('faithCheckInModal')" class="flex-1 btn-secondary px-4 py-2 rounded-lg">
            Cancelar
          </button>
          <button onclick="Rutina.submitFaithCheckIns('${checkInTime}')" class="flex-1 btn-primary px-4 py-2 rounded-lg">
            <i class="fas fa-save mr-2"></i>
            Guardar Check-in
          </button>
        </div>
      </div>
    `

    const modalsContainer = document.getElementById('modals') || document.body
    const modalHtml = UI.renderModal('faithCheckInModal', `Check-in de Fe - ${checkInTime}`, html, 'lg')
    modalsContainer.innerHTML = modalHtml
    Modal.open('faithCheckInModal')
  },

  async submitFaithCheckIns(checkInTime) {
    try {
      const sliders = document.querySelectorAll('.faith-slider')
      const promises = []

      sliders.forEach(slider => {
        const decretoId = parseInt(slider.dataset.decretoId)
        const faithLevel = parseInt(slider.value)
        const notesTextarea = document.querySelector(`.faith-notes[data-decreto-id="${decretoId}"]`)
        const notes = notesTextarea?.value.trim() || ''

        promises.push(
          API.rutina.faithCheckin({
            decretoId,
            checkInTime,
            faithLevel,
            notes
          })
        )
      })

      await Promise.all(promises)

      Modal.close('faithCheckInModal')
      Utils.showToast(`Check-in de ${checkInTime} registrado exitosamente`, 'success')
      this.render()

    } catch (error) {
      console.error('Error al registrar check-ins:', error)
      Utils.showToast('Error al registrar check-ins de fe', 'error')
    }
  },

  async openMeritCommitmentModal() {
    const html = `
      <div class="space-y-4">
        <div class="bg-yellow-900/30 border border-yellow-500/50 p-4 rounded-lg">
          <p class="text-sm text-yellow-200">
            <strong>El compromiso de merecimiento es obligatorio.</strong><br>
            Define una acción concreta que aumentará tu sentido de merecimiento hoy.
            Puede ser cuidarte, celebrarte, tratarte con respeto, o hacer algo que te haga sentir valioso.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">
            👑 ¿Qué harás hoy para sentirte más merecedor?
          </label>
          <textarea id="meritCommitmentText" rows="3"
                    placeholder="Ejemplo: Tomaré 30 minutos para mí, haré ejercicio, me compraré algo que deseo, etc."
                    class="form-input w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"></textarea>
        </div>

        <div class="flex space-x-3">
          <button onclick="Modal.close('meritModal')" class="flex-1 btn-secondary px-4 py-2 rounded-lg">
            Cancelar
          </button>
          <button onclick="Rutina.submitMeritCommitment()" class="flex-1 btn-primary px-4 py-2 rounded-lg">
            <i class="fas fa-save mr-2"></i>
            Guardar Compromiso
          </button>
        </div>
      </div>
    `

    const modalsContainer = document.getElementById('modals') || document.body
    const modalHtml = UI.renderModal('meritModal', 'Compromiso de Merecimiento Diario', html, 'md')
    modalsContainer.innerHTML = modalHtml
    Modal.open('meritModal')
  },

  async submitMeritCommitment() {
    try {
      const commitment = document.getElementById('meritCommitmentText').value.trim()

      if (!commitment) {
        Utils.showToast('Debes escribir tu compromiso de merecimiento', 'error')
        return
      }

      await API.rutina.saveMeritCommitment({
        commitment,
        completed: false
      })

      Modal.close('meritModal')
      Utils.showToast('Compromiso de merecimiento guardado', 'success')
      this.render()

    } catch (error) {
      console.error('Error al guardar compromiso:', error)
      Utils.showToast('Error al guardar compromiso', 'error')
    }
  },

  async completeMeritCommitment() {
    try {
      const reflection = prompt('¿Cómo te sentiste al cumplir este compromiso? (opcional)')

      await API.rutina.saveMeritCommitment({
        commitment: this.data.todayData.meritCommitment.commitment,
        completed: true,
        reflection: reflection || ''
      })

      Utils.showToast('¡Compromiso de merecimiento completado!', 'success')
      this.render()

    } catch (error) {
      console.error('Error al completar compromiso:', error)
      Utils.showToast('Error al completar compromiso', 'error')
    }
  },

  async recordSignal(decretoId, decretoTitulo) {
    const html = `
      <div class="space-y-4">
        <div class="bg-purple-900/30 border border-purple-500/50 p-4 rounded-lg">
          <h4 class="font-bold mb-2">${decretoTitulo}</h4>
          <p class="text-sm text-purple-200">
            Registra señales, sincronicidades u oportunidades relacionadas con este decreto
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Tipo de Evento</label>
          <select id="signalType" class="form-input w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600">
            <option value="señal">✨ Señal</option>
            <option value="sincronicidad">🔮 Sincronicidad</option>
            <option value="oportunidad">🚀 Oportunidad</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Descripción</label>
          <textarea id="signalDescription" rows="4"
                    placeholder="Describe lo que sucedió..."
                    class="form-input w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Impacto Emocional (1-10)</label>
          <input type="range" id="emotionalImpact" min="1" max="10" value="5" class="w-full"
                 oninput="document.getElementById('impact-value').textContent = this.value">
          <div class="text-center mt-2">
            <span class="text-2xl font-bold text-purple-400" id="impact-value">5</span>
            <span class="text-slate-400">/10</span>
          </div>
        </div>

        <div class="flex space-x-3">
          <button onclick="Modal.close('signalModal')" class="flex-1 btn-secondary px-4 py-2 rounded-lg">
            Cancelar
          </button>
          <button onclick="Rutina.submitSignal(${decretoId})" class="flex-1 btn-primary px-4 py-2 rounded-lg">
            <i class="fas fa-save mr-2"></i>
            Registrar Señal
          </button>
        </div>
      </div>
    `

    const modalsContainer = document.getElementById('modals') || document.body
    const modalHtml = UI.renderModal('signalModal', 'Registrar Señal / Sincronicidad', html, 'md')
    modalsContainer.innerHTML = modalHtml
    Modal.open('signalModal')
  },

  async submitSignal(decretoId) {
    try {
      const description = document.getElementById('signalDescription').value.trim()
      const signalType = document.getElementById('signalType').value
      const emotionalImpact = parseInt(document.getElementById('emotionalImpact').value)

      if (!description) {
        Utils.showToast('Debes describir la señal o sincronicidad', 'error')
        return
      }

      await API.rutina.recordSignal({
        decretoId,
        description,
        signalType,
        emotionalImpact
      })

      Modal.close('signalModal')
      Utils.showToast('Señal registrada exitosamente', 'success')

    } catch (error) {
      console.error('Error al registrar señal:', error)
      Utils.showToast('Error al registrar señal', 'error')
    }
  },

  viewTaskDetails(decretoId, taskType) {
    const task = Object.values(this.data.todayData.completedTasks || {})
      .find(t => t.decreto_id === decretoId && t.task_type === taskType)

    if (!task) {
      Utils.showToast('No se encontraron detalles de esta tarea', 'error')
      return
    }

    const html = `
      <div class="space-y-4">
        <div class="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p class="text-green-200">
            <i class="fas fa-check-circle mr-2"></i>
            Tarea completada exitosamente
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-slate-800/50 p-4 rounded-lg">
            <div class="text-slate-400 text-sm mb-1">Tiempo Dedicado</div>
            <div class="text-2xl font-bold text-blue-400">${task.minutes_spent || 0} min</div>
          </div>
          <div class="bg-slate-800/50 p-4 rounded-lg">
            <div class="text-slate-400 text-sm mb-1">Completado</div>
            <div class="text-sm font-bold text-green-400">
              ${Utils.formatDate(task.completed_at, 'HH:mm')}
            </div>
          </div>
        </div>

        ${task.notes ? `
          <div class="bg-slate-800/50 p-4 rounded-lg">
            <div class="text-slate-400 text-sm mb-2">Notas:</div>
            <p class="text-slate-200">${task.notes}</p>
          </div>
        ` : ''}

        <button onclick="Modal.close('taskDetailsModal')" class="w-full btn-primary px-4 py-2 rounded-lg">
          Cerrar
        </button>
      </div>
    `

    const modalsContainer = document.getElementById('modals') || document.body
    const modalHtml = UI.renderModal('taskDetailsModal', 'Detalles de Tarea Completada', html, 'md')
    modalsContainer.innerHTML = modalHtml
    Modal.open('taskDetailsModal')
  }
}
