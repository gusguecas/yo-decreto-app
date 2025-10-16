// Módulo del Chatbot con Helene Hadsell

const Chatbot = {
  data: {
    conversationHistory: [],
    isTyping: false,
    isRecording: false,
    recognition: null
  },

  async render() {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = this.renderChatbotView()

    // Event listeners
    this.setupEventListeners()

    // Inicializar reconocimiento de voz
    this.initVoiceRecognition()

    // Mensaje de bienvenida
    this.addMessage('assistant', '¡Hola dear! 👑 Soy Helene Hadsell, conocida como "La Reina de los Concursos". Durante más de 30 años gané más de 5,000 concursos usando mi método SPEC. ¿Qué quieres manifestar en tu vida hoy?')
  },

  renderChatbotView() {
    return `
      <div class="container mx-auto px-4 py-8 max-w-4xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-block relative mb-4">
            <div class="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-yellow-500/20 rounded-full blur-xl"></div>
            <div class="relative bg-gradient-to-r from-yellow-600 to-pink-600 p-3 rounded-full">
              <span class="text-4xl">👑</span>
            </div>
          </div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            Chat con Helene Hadsell
          </h1>
          <p class="text-slate-400 mt-2 text-lg">La Reina de los Concursos te guía en tu manifestación</p>
        </div>

        <!-- Chat Container -->
        <div class="gradient-card rounded-xl shadow-2xl overflow-hidden">
          <!-- Chat Messages -->
          <div id="chatMessages" class="h-[500px] overflow-y-auto p-6 space-y-4 bg-slate-900/50">
            <!-- Los mensajes se agregan dinámicamente aquí -->
          </div>

          <!-- Input Area -->
          <div class="bg-slate-800/50 border-t border-slate-700 p-4">
            <form id="chatForm" class="flex space-x-3">
              <input
                type="text"
                id="chatInput"
                placeholder="Escribe o habla tu pregunta..."
                class="flex-1 form-input px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                autocomplete="off"
              />
              <button
                type="button"
                id="micButton"
                onclick="Chatbot.toggleVoiceRecording()"
                class="px-4 py-3 rounded-lg flex items-center space-x-2 shadow-lg transition-all transform hover:scale-105"
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                title="Hablar con Helene"
              >
                <i class="fas fa-microphone" id="micIcon"></i>
              </button>
              <button
                type="submit"
                id="sendButton"
                class="btn-primary px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg hover:shadow-pink-500/50 transition-all transform hover:scale-105"
              >
                <i class="fas fa-paper-plane"></i>
                <span>Enviar</span>
              </button>
            </form>

            <!-- Quick Actions -->
            <div class="flex flex-wrap gap-2 mt-3">
              <button onclick="Chatbot.quickMessage('¿Cómo funciona el método SPEC?')"
                      class="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full transition-colors">
                🎯 ¿Cómo funciona SPEC?
              </button>
              <button onclick="Chatbot.quickMessage('Quiero manifestar un auto nuevo')"
                      class="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full transition-colors">
                🚗 Quiero un auto
              </button>
              <button onclick="Chatbot.quickMessage('No veo resultados, ¿qué hago?')"
                      class="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full transition-colors">
                ❓ No veo resultados
              </button>
              <button onclick="Chatbot.quickMessage('Cuéntame sobre la casa Formica')"
                      class="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full transition-colors">
                🏠 Historia de la casa
              </button>
              <button onclick="Chatbot.clearChat()"
                      class="text-xs px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-full transition-colors">
                🗑️ Limpiar chat
              </button>
            </div>
          </div>
        </div>

        <!-- Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div class="gradient-card p-4 rounded-lg text-center">
            <div class="text-3xl mb-2">🎯</div>
            <h3 class="font-semibold mb-1">SELECT</h3>
            <p class="text-xs text-slate-400">Define con claridad total</p>
          </div>
          <div class="gradient-card p-4 rounded-lg text-center">
            <div class="text-3xl mb-2">🎬</div>
            <h3 class="font-semibold mb-1">PROJECT</h3>
            <p class="text-xs text-slate-400">Visualiza multisensorial</p>
          </div>
          <div class="gradient-card p-4 rounded-lg text-center">
            <div class="text-3xl mb-2">⚡</div>
            <h3 class="font-semibold mb-1">EXPECT</h3>
            <p class="text-xs text-slate-400">Certeza sin ansiedad</p>
          </div>
        </div>
      </div>
    `
  },

  setupEventListeners() {
    const form = document.getElementById('chatForm')
    const input = document.getElementById('chatInput')

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const message = input.value.trim()

      if (!message) return

      input.value = ''
      await this.sendMessage(message)
    })

    // Auto-scroll en nuevos mensajes
    const chatMessages = document.getElementById('chatMessages')
    const observer = new MutationObserver(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight
    })
    observer.observe(chatMessages, { childList: true })
  },

  async sendMessage(message) {
    try {
      // Agregar mensaje del usuario
      this.addMessage('user', message)

      // Agregar al historial
      this.data.conversationHistory.push({
        role: 'user',
        content: message
      })

      // Mostrar indicador de escritura
      this.showTypingIndicator()

      // Llamar a la API
      const response = await API.chatbot.sendMessage(message, this.data.conversationHistory)

      // Quitar indicador de escritura
      this.hideTypingIndicator()

      if (response.success) {
        // Agregar respuesta de Helene
        this.addMessage('assistant', response.data.message)

        // Actualizar historial
        this.data.conversationHistory = response.data.conversationHistory || [
          ...this.data.conversationHistory,
          {
            role: 'assistant',
            content: response.data.message
          }
        ]
      } else {
        this.addMessage('error', 'Lo siento dear, tuve un problema técnico. ¿Podrías intentar de nuevo?')
      }

    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      this.hideTypingIndicator()
      this.addMessage('error', 'Hubo un error al comunicarme, honey. Por favor intenta de nuevo.')
    }
  },

  addMessage(role, content) {
    const chatMessages = document.getElementById('chatMessages')
    const messageDiv = document.createElement('div')

    if (role === 'user') {
      messageDiv.className = 'flex justify-end'
      messageDiv.innerHTML = `
        <div class="max-w-[70%] bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-4 py-3 shadow-lg">
          <p class="text-sm whitespace-pre-wrap">${this.escapeHtml(content)}</p>
        </div>
      `
    } else if (role === 'assistant') {
      messageDiv.className = 'flex justify-start'
      messageDiv.innerHTML = `
        <div class="flex space-x-3 max-w-[85%]">
          <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <span class="text-xl">👑</span>
          </div>
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg px-4 py-3 shadow-lg border border-slate-700">
            <p class="text-sm whitespace-pre-wrap helene-message">${this.formatHeleneMessage(content)}</p>
          </div>
        </div>
      `
    } else if (role === 'error') {
      messageDiv.className = 'flex justify-center'
      messageDiv.innerHTML = `
        <div class="bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg px-4 py-3 max-w-[70%]">
          <p class="text-sm">${this.escapeHtml(content)}</p>
        </div>
      `
    }

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  },

  showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages')
    const typingDiv = document.createElement('div')
    typingDiv.id = 'typingIndicator'
    typingDiv.className = 'flex justify-start'
    typingDiv.innerHTML = `
      <div class="flex space-x-3">
        <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
          <span class="text-xl">👑</span>
        </div>
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg px-4 py-3 shadow-lg border border-slate-700">
          <div class="flex space-x-2">
            <div class="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>
      </div>
    `
    chatMessages.appendChild(typingDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  },

  hideTypingIndicator() {
    const typingDiv = document.getElementById('typingIndicator')
    if (typingDiv) {
      typingDiv.remove()
    }
  },

  formatHeleneMessage(content) {
    // Escapar HTML primero
    let formatted = this.escapeHtml(content)

    // Formatear negritas
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-300">$1</strong>')

    // Formatear cursivas
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="text-pink-300">$1</em>')

    // Formatear listas
    formatted = formatted.replace(/^- (.*?)$/gm, '<li class="ml-4">• $1</li>')

    // Formatear emojis destacados
    formatted = formatted.replace(/(🎯|🎬|⚡|🎁|✨|💫|🏆|❤️|💼|👑)/g, '<span class="text-xl">$1</span>')

    return formatted
  },

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  },

  quickMessage(message) {
    const input = document.getElementById('chatInput')
    input.value = message
    document.getElementById('chatForm').dispatchEvent(new Event('submit'))
  },

  clearChat() {
    if (confirm('¿Estás seguro de que quieres limpiar toda la conversación?')) {
      this.data.conversationHistory = []
      const chatMessages = document.getElementById('chatMessages')
      chatMessages.innerHTML = ''

      // Mensaje de bienvenida
      this.addMessage('assistant', '¡Hola dear! 👑 Soy Helene Hadsell. ¿En qué puedo ayudarte hoy?')

      Utils.showToast('Conversación limpiada', 'success')
    }
  },

  // === RECONOCIMIENTO DE VOZ ===

  initVoiceRecognition() {
    // Verificar si el navegador soporta Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn('El navegador no soporta reconocimiento de voz')
      const micButton = document.getElementById('micButton')
      if (micButton) {
        micButton.disabled = true
        micButton.title = 'Tu navegador no soporta reconocimiento de voz'
        micButton.style.opacity = '0.5'
      }
      return
    }

    // Crear instancia de reconocimiento
    this.data.recognition = new SpeechRecognition()
    this.data.recognition.lang = 'es-ES' // Español
    this.data.recognition.continuous = false // Detener después de una frase
    this.data.recognition.interimResults = false // Solo resultados finales

    // Evento cuando se recibe un resultado
    this.data.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      console.log('🎤 Texto reconocido:', transcript)

      // Insertar el texto en el input
      const input = document.getElementById('chatInput')
      if (input) {
        input.value = transcript
      }

      // Enviar automáticamente
      this.sendMessage(transcript)

      // Resetear estado
      this.stopRecording()
    }

    // Evento cuando hay un error
    this.data.recognition.onerror = (event) => {
      console.error('Error de reconocimiento de voz:', event.error)
      this.stopRecording()

      let errorMessage = 'Error al reconocer voz'
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No se detectó ninguna voz'
          break
        case 'audio-capture':
          errorMessage = 'No se pudo acceder al micrófono'
          break
        case 'not-allowed':
          errorMessage = 'Permiso de micrófono denegado'
          break
      }

      Utils.showToast(errorMessage, 'error')
    }

    // Evento cuando termina
    this.data.recognition.onend = () => {
      console.log('🎤 Reconocimiento de voz finalizado')
      this.stopRecording()
    }
  },

  toggleVoiceRecording() {
    if (!this.data.recognition) {
      Utils.showToast('Reconocimiento de voz no disponible', 'error')
      return
    }

    if (this.data.isRecording) {
      // Detener grabación
      this.data.recognition.stop()
      this.stopRecording()
    } else {
      // Iniciar grabación
      try {
        this.data.recognition.start()
        this.startRecording()
        Utils.showToast('🎤 Escuchando... Habla ahora', 'info')
      } catch (error) {
        console.error('Error al iniciar reconocimiento:', error)
        Utils.showToast('Error al iniciar micrófono', 'error')
      }
    }
  },

  startRecording() {
    this.data.isRecording = true
    const micButton = document.getElementById('micButton')
    const micIcon = document.getElementById('micIcon')

    if (micButton && micIcon) {
      // Cambiar estilo a "grabando"
      micButton.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      micButton.classList.add('animate-pulse')
      micIcon.classList.remove('fa-microphone')
      micIcon.classList.add('fa-stop')
    }
  },

  stopRecording() {
    this.data.isRecording = false
    const micButton = document.getElementById('micButton')
    const micIcon = document.getElementById('micIcon')

    if (micButton && micIcon) {
      // Restaurar estilo normal
      micButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      micButton.classList.remove('animate-pulse')
      micIcon.classList.remove('fa-stop')
      micIcon.classList.add('fa-microphone')
    }
  }
}
