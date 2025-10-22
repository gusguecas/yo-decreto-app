/**
 * 🛠️ AGENDA HELPERS MODULE
 * Utilidades y funciones helper para la agenda
 */

export const AgendaHelpers = {
  /**
   * Parsea el texto de tareas pendientes y lo convierte en un array de objetos
   * @param {string} textoPendientes - Texto con tareas separadas por líneas
   * @returns {Array} Array de objetos con estructura {titulo, que_hacer, como_hacerlo}
   */
  parsearTareasPendientes(textoPendientes) {
    if (!textoPendientes || textoPendientes.trim() === '') {
      return []
    }

    return textoPendientes
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 3) // Máximo 3 como en decretos
      .map(titulo => ({
        titulo: titulo,
        que_hacer: '',
        como_hacerlo: ''
      }))
  },

  /**
   * Calcula el porcentaje de productividad del día basado en tareas completadas
   * @param {Object} data - Objeto con datos de la agenda que contiene metricas
   * @returns {number} Porcentaje de productividad (0-100)
   */
  calcularProductividadHoy(data) {
    const completadas = data?.metricas?.completadas || 0
    const total = data?.metricas?.total || 1
    return Math.round((completadas / total) * 100)
  },

  /**
   * Calcula el tiempo total de reuniones del día
   * @returns {string} Tiempo en formato "X.Xh"
   */
  calcularTiempoReuniones() {
    // Simulación - en producción sería calculado real
    return "3.5h"
  },

  /**
   * Obtiene la hora actual en Nueva York
   * @returns {string} Hora en formato 12h con AM/PM
   */
  obtenerHoraNY() {
    const now = new Date()
    const nyTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}))
    return nyTime.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})
  },

  /**
   * Cuenta el número de recordatorios pendientes (no completados)
   * @returns {number} Cantidad de recordatorios pendientes
   */
  contarPendientes() {
    const recordatorios = this.obtenerRecordatorios()
    return recordatorios.filter(r => !r.completado).length
  },

  /**
   * Obtiene todos los recordatorios desde localStorage
   * @returns {Array} Array de recordatorios
   */
  obtenerRecordatorios() {
    // Simulación inicial
    return JSON.parse(localStorage.getItem('recordatorios') || '[]')
  },

  /**
   * Obtiene el icono correspondiente a un área
   * @param {string} area - Nombre del área ('Empresarial', 'Humano', 'Material')
   * @returns {string} Emoji del icono
   */
  getAreaIcon(area) {
    const icons = {
      'Empresarial': '🏢',
      'Humano': '👨‍👩‍👧‍👦',
      'Material': '💰'
    }
    return icons[area] || '📋'
  }
}
