// Módulo de Configuración de Google Calendar

const GoogleCalendarSettings = {
  data: {
    status: null,
    isConnected: false,
    loading: false
  },

  async init() {
    await this.loadStatus()
  },

  async loadStatus() {
    try {
      this.data.loading = true
      const response = await API.googleCalendar.getStatus()
      this.data.status = response.data
      this.data.isConnected = response.data.is_connected === 1
    } catch (error) {
      console.error('Error loading Google Calendar status:', error)
      this.data.isConnected = false
    } finally {
      this.data.loading = false
    }
  },

  renderSettingsPanel() {
    if (this.data.loading) {
      return `
        <div class="gradient-card rounded-xl p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <i class="fas fa-calendar mr-3 text-blue-400"></i>
            Google Calendar
          </h3>
          ${UI.renderLoading('Cargando estado de conexión...')}
        </div>
      `
    }

    if (!this.data.isConnected) {
      return this.renderDisconnectedState()
    }

    return this.renderConnectedState()
  },

  renderDisconnectedState() {
    return `
      <div class="gradient-card rounded-xl p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <i class="fas fa-calendar text-4xl text-blue-400 mr-4"></i>
            <div>
              <h3 class="text-xl font-bold">Google Calendar</h3>
              <p class="text-slate-400 text-sm">Sincroniza tus eventos automáticamente</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
            <i class="fas fa-circle text-gray-500 mr-2"></i>
            Desconectado
          </span>
        </div>

        <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h4 class="font-bold mb-2 text-blue-300">
            <i class="fas fa-sync-alt mr-2"></i>
            Beneficios de la Sincronización
          </h4>
          <ul class="space-y-2 text-sm text-blue-200">
            <li class="flex items-start">
              <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>Ve todos tus eventos de Google en tu Agenda Yo Decreto</span>
            </li>
            <li class="flex items-start">
              <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>Tus tareas de Yo Decreto aparecen en Google Calendar</span>
            </li>
            <li class="flex items-start">
              <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>Evita conflictos de horario automáticamente</span>
            </li>
            <li class="flex items-start">
              <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>Sincronización bidireccional en tiempo real</span>
            </li>
          </ul>
        </div>

        <div class="bg-slate-800/50 rounded-lg p-4 mb-6">
          <h4 class="font-semibold mb-3 flex items-center">
            <i class="fas fa-lock text-yellow-400 mr-2"></i>
            Seguridad y Privacidad
          </h4>
          <ul class="space-y-1 text-sm text-slate-300">
            <li>✓ Tokens encriptados en tu base de datos</li>
            <li>✓ Solo tú tienes acceso a tus eventos</li>
            <li>✓ Datos nunca compartidos con terceros</li>
            <li>✓ Puedes desconectar en cualquier momento</li>
          </ul>
        </div>

        <button
          onclick="GoogleCalendarSettings.connectGoogleCalendar()"
          class="w-full btn-primary px-6 py-3 rounded-lg text-lg font-semibold">
          <i class="fab fa-google mr-2"></i>
          Conectar con Google Calendar
        </button>
      </div>
    `
  },

  renderConnectedState() {
    const { auto_import, auto_export, export_rutinas, export_decretos_primarios, export_agenda_eventos, last_import, timezone } = this.data.status

    return `
      <div class="gradient-card rounded-xl p-6">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center">
            <i class="fas fa-calendar text-4xl text-green-400 mr-4"></i>
            <div>
              <h3 class="text-xl font-bold">Google Calendar</h3>
              <p class="text-slate-400 text-sm">Sincronización activa</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm border border-green-500/30">
            <i class="fas fa-circle text-green-400 mr-2 animate-pulse"></i>
            Conectado
          </span>
        </div>

        ${last_import ? `
          <div class="bg-slate-800/50 rounded-lg p-3 mb-6 text-sm text-slate-300">
            <i class="fas fa-clock text-blue-400 mr-2"></i>
            Última sincronización: ${Utils.formatDate(last_import, 'DD/MM/YYYY HH:mm')}
          </div>
        ` : ''}

        <div class="space-y-4 mb-6">
          <h4 class="font-semibold text-lg mb-3">Opciones de Sincronización</h4>

          <!-- Auto Import -->
          <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div class="flex-1">
              <div class="font-semibold">Importar eventos de Google</div>
              <div class="text-xs text-slate-400">Ver tus eventos de Google Calendar en Yo Decreto</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox"
                     ${auto_import ? 'checked' : ''}
                     onchange="GoogleCalendarSettings.updateSetting('auto_import', this.checked)"
                     class="sr-only peer">
              <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <!-- Auto Export -->
          <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div class="flex-1">
              <div class="font-semibold">Exportar mis tareas a Google</div>
              <div class="text-xs text-slate-400">Crear eventos en Google Calendar desde Yo Decreto</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox"
                     ${auto_export ? 'checked' : ''}
                     onchange="GoogleCalendarSettings.updateSetting('auto_export', this.checked)"
                     class="sr-only peer">
              <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          ${auto_export ? `
            <div class="ml-4 space-y-3 p-4 bg-slate-900/50 rounded-lg border-l-2 border-blue-500">
              <div class="text-sm font-semibold text-blue-300 mb-2">
                <i class="fas fa-cog mr-2"></i>
                ¿Qué sincronizar?
              </div>

              <!-- Export Rutinas -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="text-sm">Rutinas Matutina/Vespertina</div>
                  <div class="text-xs text-slate-500">Crear bloques diarios en Google Calendar</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox"
                         ${export_rutinas ? 'checked' : ''}
                         onchange="GoogleCalendarSettings.updateSetting('export_rutinas', this.checked)"
                         class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <!-- Export Decretos Primarios -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="text-sm">Decretos Primarios del día</div>
                  <div class="text-xs text-slate-500">Bloques de trabajo (40 min cada uno)</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox"
                         ${export_decretos_primarios ? 'checked' : ''}
                         onchange="GoogleCalendarSettings.updateSetting('export_decretos_primarios', this.checked)"
                         class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <!-- Export Agenda Eventos -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="text-sm">Eventos de mi Agenda</div>
                  <div class="text-xs text-slate-500">Tareas y eventos programados</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox"
                         ${export_agenda_eventos ? 'checked' : ''}
                         onchange="GoogleCalendarSettings.updateSetting('export_agenda_eventos', this.checked)"
                         class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onclick="GoogleCalendarSettings.importNow()"
            class="btn-primary px-4 py-2 rounded-lg">
            <i class="fas fa-download mr-2"></i>
            Importar de Google
          </button>
          <button
            onclick="GoogleCalendarSettings.exportAll()"
            class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white">
            <i class="fas fa-upload mr-2"></i>
            Exportar a Google
          </button>
          <button
            onclick="GoogleCalendarSettings.fullSync()"
            class="btn-secondary px-4 py-2 rounded-lg md:col-span-2">
            <i class="fas fa-sync-alt mr-2"></i>
            Sincronización Completa
          </button>
          <button
            onclick="GoogleCalendarSettings.disconnect()"
            class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white md:col-span-2">
            <i class="fas fa-unlink mr-2"></i>
            Desconectar Google Calendar
          </button>
        </div>
      </div>
    `
  },

  async connectGoogleCalendar() {
    try {
      // Obtener URL de autorización
      const response = await API.googleCalendar.getAuthUrl()

      if (!response.success) {
        Utils.showToast(response.error || 'Error al generar URL de autenticación', 'error')
        return
      }

      // Redirigir a Google OAuth
      window.location.href = response.data.authUrl
    } catch (error) {
      console.error('Error connecting Google Calendar:', error)
      Utils.showToast('Error al conectar con Google Calendar', 'error')
    }
  },

  async disconnect() {
    if (!confirm('¿Estás seguro de que quieres desconectar Google Calendar?\n\nTus eventos ya sincronizados permanecerán en ambos sistemas, pero no se sincronizarán nuevos cambios.')) {
      return
    }

    try {
      await API.googleCalendar.disconnect()
      Utils.showToast('Google Calendar desconectado exitosamente', 'success')

      // Recargar estado
      await this.loadStatus()

      // Re-renderizar panel (esto depende de dónde esté montado)
      this.refreshPanel()
    } catch (error) {
      console.error('Error disconnecting:', error)
      Utils.showToast('Error al desconectar Google Calendar', 'error')
    }
  },

  async updateSetting(setting, value) {
    try {
      const data = {}
      data[setting] = value

      await API.googleCalendar.updateSettings(data)
      Utils.showToast('Configuración actualizada', 'success')

      // Actualizar estado local
      this.data.status[setting] = value
    } catch (error) {
      console.error('Error updating setting:', error)
      Utils.showToast('Error al actualizar configuración', 'error')
    }
  },

  async importNow() {
    try {
      const today = new Date()
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0).toISOString()

      Utils.showToast('📥 Importando eventos de Google Calendar...', 'info')

      const response = await API.googleCalendar.importEvents({
        startDate,
        endDate
      })

      if (response.success) {
        Utils.showToast(
          `✅ Importación completa: ${response.data.eventsProcessed} eventos (${response.data.eventsCreated} nuevos, ${response.data.eventsUpdated} actualizados)`,
          'success'
        )

        // Recargar estado
        await this.loadStatus()
        this.refreshPanel()
      }
    } catch (error) {
      console.error('Error importing:', error)
      Utils.showToast('Error al importar eventos', 'error')
    }
  },

  async exportAll() {
    try {
      Utils.showToast('📤 Exportando tus tareas a Google Calendar...', 'info')

      const response = await API.googleCalendar.syncAll()

      if (response.success) {
        const { rutinas, decretosPrimarios, agendaEventos, errors } = response.data
        const total = rutinas + decretosPrimarios + agendaEventos

        if (total > 0) {
          Utils.showToast(
            `✅ Exportación completa: ${total} eventos creados en Google Calendar (${rutinas} rutinas, ${decretosPrimarios} decretos, ${agendaEventos} tareas)`,
            'success'
          )
        }

        if (errors && errors.length > 0) {
          console.error('Errors during export:', errors)
          Utils.showToast(`⚠️ Algunos eventos no se pudieron exportar. Revisa la consola.`, 'warning')
        }
      }
    } catch (error) {
      console.error('Error exporting:', error)
      Utils.showToast('Error al exportar eventos', 'error')
    }
  },

  async fullSync() {
    try {
      Utils.showToast('🔄 Sincronización bidireccional en proceso...', 'info')

      // Primero importar
      await this.importNow()

      // Esperar un momento
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Luego exportar
      await this.exportAll()

      Utils.showToast('✅ Sincronización bidireccional completada!', 'success')
    } catch (error) {
      console.error('Error in full sync:', error)
      Utils.showToast('Error en sincronización completa', 'error')
    }
  },

  refreshPanel() {
    // Re-renderizar el panel
    const container = document.getElementById('google-calendar-settings-container')
    if (container) {
      container.innerHTML = this.renderSettingsPanel()
    }

    // También disparar evento por si alguien más lo necesita
    window.dispatchEvent(new CustomEvent('google-calendar-settings-updated'))
  }
}

// Event listener para actualizar el panel cuando sea necesario
window.addEventListener('google-calendar-settings-updated', () => {
  const container = document.getElementById('google-calendar-settings-container')
  if (container) {
    container.innerHTML = GoogleCalendarSettings.renderSettingsPanel()
  }
})

// Manejar callback de OAuth al volver de Google
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search)

  if (urlParams.get('google_auth_success')) {
    Utils.showToast('✅ Google Calendar conectado exitosamente!', 'success')

    // Limpiar URL
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash)

    // Recargar estado
    GoogleCalendarSettings.init()
  }

  if (urlParams.get('google_auth_error')) {
    const error = urlParams.get('google_auth_error')
    Utils.showToast(`❌ Error al conectar Google Calendar: ${error}`, 'error')

    // Limpiar URL
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash)
  }
})
