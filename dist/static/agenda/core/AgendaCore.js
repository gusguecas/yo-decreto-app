/**
 * 🎯 AGENDA CORE MODULE
 * Gestiona el estado central y la lógica de carga de datos de la agenda
 */

export const AgendaCore = {
  /**
   * Estado central de la aplicación de agenda
   */
  data: {
    selectedDate: (() => {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const formatted = `${year}-${month}-${day}`
      console.log('📅 Fecha inicial calculada:', formatted, '| Hora local:', today.toLocaleString())
      return formatted
    })(),
    currentMonth: dayjs().format('YYYY-MM'),
    eventos: {},
    timeline: [],
    originalTimeline: [], // Timeline sin filtrar
    metricas: {},
    enfoque: null,
    // 🎯 Vista activa: 'actual' o 'propuesta'
    vistaActiva: 'propuesta', // ✨ Por defecto mostrar Vista Propuesta con los 3 decretos del día
    // 🎯 NUEVO: 3 Decretos primarios del día desde Rutina Diaria
    decretosDelDia: null, // { empresarial: {...}, humano: {...}, material: {...} }
    // 🎯 NUEVO: Datos para panorámica de pendientes
    panoramicaPendientes: {
      acciones: [],
      estadisticas: {},
      filtroArea: 'todos' // todos, empresarial, materiales, humanos
    },
    filtros: {
      tareasHoy: true,
      tareasFuturas: true, // Cambiar a true para mostrar futuras por defecto
      completadas: true,
      pendientes: true,
      decreto: 'todos'
    }
  },

  /**
   * Carga todos los datos necesarios para la agenda
   * @returns {Promise<void>}
   */
  async loadAgendaData() {
    const [year, month] = this.data.currentMonth.split('-')

    console.log('🔄 Cargando datos de agenda para fecha:', this.data.selectedDate)
    console.log('🆕🆕🆕 VERSION DEBUG 1.0.3 - FORCE CACHE BUST - Cargando Rutina Diaria...')

    // Cargar datos en paralelo (AGREGANDO Google Calendar Y Rutina Diaria)
    const [calendario, timeline, metricas, enfoque, panoramica, googleEvents, rutinaData] = await Promise.all([
      API.agenda.getCalendario(year, month),
      API.agenda.getTimeline(this.data.selectedDate),
      API.agenda.getMetricasDia(this.data.selectedDate),
      API.agenda.getEnfoque(this.data.selectedDate),
      // 🎯 NUEVO: Cargar panorámica de pendientes
      API.agenda.getPanoramicaPendientes(this.data.panoramicaPendientes.filtroArea),
      // 📅 NUEVO: Cargar eventos de Google Calendar
      API.googleCalendar.getEvents({
        startDate: this.data.selectedDate,
        endDate: dayjs(this.data.selectedDate).add(1, 'day').format('YYYY-MM-DD')
      }).catch(() => ({ success: false, data: [] })),
      // 🎯 NUEVO: Cargar 3 decretos primarios del día desde Rutina Diaria
      API.rutina.getToday().catch(() => ({ success: false, data: null }))
    ])

    console.log('📊 Respuesta timeline:', timeline)
    console.log('📅 Eventos timeline:', timeline.data)

    console.log('✅ Promise.all completado. Procesando rutinaData...')

    this.data.eventos = calendario.data.estados

    // 📅 Formatear eventos de Google Calendar
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

    // Combinar tareas locales + eventos de Google Calendar
    this.data.originalTimeline = [...timeline.data, ...googleEventsFormatted]
    this.data.timeline = [...this.data.originalTimeline] // Copia para filtrar
    this.data.metricas = metricas.data
    this.data.enfoque = enfoque.data

    // 🎯 NUEVO: Almacenar datos de panorámica
    if (panoramica.success) {
      this.data.panoramicaPendientes.acciones = panoramica.data.acciones || []
      this.data.panoramicaPendientes.estadisticas = panoramica.data.estadisticas || {}
      console.log('📊 Panorámica cargada:', {
        acciones: this.data.panoramicaPendientes.acciones.length,
        estadisticas: this.data.panoramicaPendientes.estadisticas
      })
    } else {
      console.error('❌ Error al cargar panorámica:', panoramica)
    }

    // 🎯 NUEVO: Almacenar datos de Rutina Diaria (3 decretos primarios del día)
    console.log('🔍 DEBUG: rutinaData recibido:', rutinaData)

    if (rutinaData && rutinaData.success && rutinaData.data) {
      this.data.decretosDelDia = rutinaData.data.primary || {}
      console.log('🎯 Decretos del día cargados:', {
        empresarial: this.data.decretosDelDia.empresarial?.titulo,
        humano: this.data.decretosDelDia.humano?.titulo,
        material: this.data.decretosDelDia.material?.titulo
      })
    } else {
      this.data.decretosDelDia = null
      console.warn('⚠️ No se pudieron cargar los decretos del día desde Rutina')
      console.warn('🔍 Razón:', {
        rutinaDataExists: !!rutinaData,
        success: rutinaData?.success,
        hasData: !!rutinaData?.data
      })
    }

    // Aplicar filtros después de cargar los datos (se llamará desde el módulo de handlers)
    return this.data
  }
}
