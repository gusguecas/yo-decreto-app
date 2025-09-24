// Sistema de Autenticación "Yo Decreto"
// Con logo grande y espectacular

const Auth = {
  // Estado de autenticación
  isAuthenticated: false,
  currentUser: null,
  
  // Configuración
  config: {
    sessionKey: 'yo-decreto-session',
    apiBase: '/api/auth'
  },

  // Inicializar sistema de autenticación
  async init() {
    console.log('🔐 Iniciando sistema de autenticación...')
    
    // Verificar sesión existente
    const session = localStorage.getItem(this.config.sessionKey)
    if (session) {
      try {
        const userData = JSON.parse(session)
        const isValid = await this.validateSession(userData.token)
        if (isValid) {
          this.isAuthenticated = true
          this.currentUser = userData
          return true
        }
      } catch (error) {
        console.log('Sesión inválida, mostrando login')
        localStorage.removeItem(this.config.sessionKey)
      }
    }
    
    // Mostrar pantalla de login
    this.showLoginScreen()
    return false
  },

  // Mostrar pantalla de login con LOGO GIGANTE
  showLoginScreen() {
    document.body.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <!-- Efectos de fondo -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute -top-40 -right-40 w-80 h-80 bg-accent-blue/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-green/10 rounded-full blur-3xl"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        </div>

        <!-- Contenedor principal -->
        <div class="relative z-10 w-full max-w-md">
          <!-- LOGO GIGANTE CON EFECTOS ESPECTACULARES -->
          <div class="text-center mb-8">
            <div class="relative inline-block">
              <!-- Efectos de resplandor detrás del logo -->
              <div class="absolute inset-0 transform scale-110">
                <img src="/static/logo-yo-decreto.png" alt="Yo Decreto" 
                     class="w-32 h-32 mx-auto opacity-30 blur-sm animate-pulse" />
              </div>
              <div class="absolute inset-0 transform scale-105">
                <img src="/static/logo-yo-decreto.png" alt="Yo Decreto" 
                     class="w-32 h-32 mx-auto opacity-50 blur-xs" />
              </div>
              
              <!-- LOGO PRINCIPAL GIGANTE -->
              <img src="/static/logo-yo-decreto.png" alt="Yo Decreto" 
                   class="relative w-32 h-32 mx-auto mb-6 logo-login-giant" />
            </div>
            
            <!-- Título con efectos -->
            <h1 class="text-5xl font-bold bg-gradient-to-r from-accent-blue via-white to-accent-green bg-clip-text text-transparent mb-3 animate-fade-in">
              YO DECRETO
            </h1>
            <p class="text-xl text-slate-300 font-light animate-fade-in-delay">
              Tu manifestación, tu poder
            </p>
            
            <!-- Línea decorativa -->
            <div class="flex items-center justify-center mt-6 mb-8">
              <div class="w-16 h-px bg-gradient-to-r from-transparent via-accent-blue to-transparent"></div>
              <div class="mx-4 w-2 h-2 bg-accent-blue rounded-full animate-pulse"></div>
              <div class="w-16 h-px bg-gradient-to-r from-transparent via-accent-green to-transparent"></div>
            </div>
          </div>

          <!-- Formulario de login -->
          <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-semibold text-white mb-2">Bienvenido</h2>
              <p class="text-slate-400">Ingresa para acceder a tu espacio de manifestación</p>
            </div>

            <form id="loginForm" class="space-y-6">
              <!-- Email -->
              <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-slate-300">
                  <i class="fas fa-envelope mr-2 text-accent-blue"></i>
                  Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                  autocomplete="email"
                />
              </div>

              <!-- Password -->
              <div class="space-y-2">
                <label for="password" class="block text-sm font-medium text-slate-300">
                  <i class="fas fa-lock mr-2 text-accent-green"></i>
                  Contraseña
                </label>
                <div class="relative">
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required
                    class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all pr-12"
                    placeholder="Tu contraseña segura"
                    autocomplete="current-password"
                  />
                  <button 
                    type="button" 
                    onclick="Auth.togglePassword()"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    <i id="passwordToggleIcon" class="fas fa-eye"></i>
                  </button>
                </div>
              </div>

              <!-- Remember me -->
              <div class="flex items-center justify-between">
                <label class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    name="remember"
                    class="w-4 h-4 text-accent-blue bg-slate-700 border-slate-600 rounded focus:ring-accent-blue focus:ring-2"
                  />
                  <span class="ml-2 text-sm text-slate-300">Recordarme</span>
                </label>
                <button type="button" onclick="Auth.showForgotPassword()" class="text-sm text-accent-blue hover:text-accent-blue/80 transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <!-- Login button -->
              <button 
                type="submit" 
                class="w-full bg-gradient-to-r from-accent-blue to-accent-green hover:from-accent-blue/80 hover:to-accent-green/80 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <i class="fas fa-sign-in-alt mr-2"></i>
                Ingresar a Mi Decreto
              </button>
            </form>

            <!-- Separator -->
            <div class="flex items-center my-6">
              <div class="flex-1 border-t border-slate-600"></div>
              <span class="px-4 text-sm text-slate-400">o</span>
              <div class="flex-1 border-t border-slate-600"></div>
            </div>

            <!-- Register link -->
            <div class="text-center">
              <p class="text-slate-400 text-sm mb-4">¿Primera vez aquí?</p>
              <button 
                type="button" 
                onclick="Auth.showRegisterScreen()"
                class="w-full bg-slate-700/50 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg border border-slate-600 transition-all duration-300 hover:border-slate-500"
              >
                <i class="fas fa-user-plus mr-2"></i>
                Crear Mi Cuenta
              </button>
            </div>
          </div>

          <!-- Footer info -->
          <div class="text-center mt-8 text-xs text-slate-500">
            <p>© ${new Date().getFullYear()} <strong>www.yo-decreto.com</strong></p>
            <p class="mt-1">Tu manifestación, protegida y segura</p>
          </div>
        </div>

        <!-- Loading overlay -->
        <div id="authLoading" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" style="display: none;">
          <div class="bg-slate-800 rounded-lg p-6 text-center">
            <div class="loader mx-auto mb-4"></div>
            <p class="text-white">Verificando credenciales...</p>
          </div>
        </div>
      </div>
    `

    // Configurar event listeners
    this.setupLoginEventListeners()
  },

  // Configurar eventos del login
  setupLoginEventListeners() {
    const loginForm = document.getElementById('loginForm')
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        await this.handleLogin(e.target)
      })
    }
  },

  // Configurar eventos del registro
  setupRegisterEventListeners() {
    const registerForm = document.getElementById('registerForm')
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        await this.handleRegister(e.target)
      })
    }
  },

  // Toggle password visibility
  togglePassword() {
    const passwordInput = document.getElementById('password')
    const toggleIcon = document.getElementById('passwordToggleIcon')
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text'
      toggleIcon.className = 'fas fa-eye-slash'
    } else {
      passwordInput.type = 'password'
      toggleIcon.className = 'fas fa-eye'
    }
  },

  // Manejar login
  async handleLogin(form) {
    const email = form.email.value
    const password = form.password.value
    const remember = form.remember.checked

    this.showLoading(true)

    try {
      const response = await fetch(`${this.config.apiBase}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, remember })
      })

      const data = await response.json()

      if (response.ok) {
        // Guardar sesión
        this.currentUser = data.user
        this.isAuthenticated = true
        
        if (remember) {
          localStorage.setItem(this.config.sessionKey, JSON.stringify({
            token: data.token,
            user: data.user
          }))
        }

        // Mostrar mensaje de éxito y cargar app
        this.showSuccessAndLoadApp()
      } else {
        this.showError(data.error || 'Credenciales incorrectas')
      }
    } catch (error) {
      console.error('Error en login:', error)
      this.showError('Error de conexión. Inténtalo nuevamente.')
    } finally {
      this.showLoading(false)
    }
  },

  // Manejar registro
  async handleRegister(form) {
    const fullName = form.fullName.value.trim()
    const email = form.email.value.trim()
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value
    const acceptTerms = form.acceptTerms.checked

    // Validaciones
    if (!fullName || !email || !password || !confirmPassword) {
      this.showError('Todos los campos son obligatorios')
      return
    }

    if (!acceptTerms) {
      this.showError('Debes aceptar los términos y condiciones')
      return
    }

    if (password !== confirmPassword) {
      this.showError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      this.showError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    this.showLoading(true)

    try {
      const response = await fetch(`${this.config.apiBase}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: fullName, 
          email, 
          password 
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Mostrar éxito y redirigir al login
        this.showSuccess('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.')
        
        setTimeout(() => {
          this.showLoginScreen()
        }, 2000)
      } else {
        this.showError(data.error || 'Error al crear la cuenta')
      }
    } catch (error) {
      console.error('Error en registro:', error)
      this.showError('Error de conexión. Inténtalo nuevamente.')
    } finally {
      this.showLoading(false)
    }
  },

  // Mostrar pantalla de registro
  showRegisterScreen() {
    document.body.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <!-- Efectos de fondo -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute -top-40 -right-40 w-80 h-80 bg-accent-blue/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-green/10 rounded-full blur-3xl"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        </div>

        <!-- Contenedor principal -->
        <div class="relative z-10 w-full max-w-md">
          <!-- LOGO GIGANTE -->
          <div class="text-center mb-6">
            <div class="relative inline-block">
              <img src="/static/logo-yo-decreto.png" alt="Yo Decreto" 
                   class="relative w-24 h-24 mx-auto mb-4 logo-login-giant" />
            </div>
            
            <h1 class="text-4xl font-bold bg-gradient-to-r from-accent-blue via-white to-accent-green bg-clip-text text-transparent mb-2">
              CREAR CUENTA
            </h1>
            <p class="text-lg text-slate-300 font-light">
              Únete a la manifestación
            </p>
          </div>

          <!-- Formulario de registro -->
          <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
            <form id="registerForm" class="space-y-4">
              <!-- Name -->
              <div class="space-y-2">
                <label for="fullName" class="block text-sm font-medium text-slate-300">
                  <i class="fas fa-user mr-2 text-accent-green"></i>
                  Nombre Completo
                </label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  required
                  class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all"
                  placeholder="Tu nombre completo"
                  autocomplete="name"
                />
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <label for="registerEmail" class="block text-sm font-medium text-slate-300">
                  <i class="fas fa-envelope mr-2 text-accent-blue"></i>
                  Email
                </label>
                <input 
                  type="email" 
                  id="registerEmail" 
                  name="email" 
                  required
                  class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                  autocomplete="email"
                />
              </div>

              <!-- Password -->
              <div class="space-y-2">
                <label for="registerPassword" class="block text-sm font-medium text-slate-300">
                  <i class="fas fa-lock mr-2 text-accent-purple"></i>
                  Contraseña
                </label>
                <div class="relative">
                  <input 
                    type="password" 
                    id="registerPassword" 
                    name="password" 
                    required
                    minlength="6"
                    class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all pr-12"
                    placeholder="Mínimo 6 caracteres"
                    autocomplete="new-password"
                  />
                </div>
                <p class="text-xs text-slate-400">Mínimo 6 caracteres</p>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-2">
                <label for="confirmPassword" class="block text-sm font-medium text-slate-300">
                  <i class="fas fa-lock mr-2 text-accent-purple"></i>
                  Confirmar Contraseña
                </label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  required
                  minlength="6"
                  class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
                  placeholder="Repite tu contraseña"
                  autocomplete="new-password"
                />
              </div>

              <!-- Terms -->
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="acceptTerms" 
                  name="acceptTerms"
                  required
                  class="w-4 h-4 text-accent-blue bg-slate-700 border-slate-600 rounded focus:ring-accent-blue focus:ring-2"
                />
                <label for="acceptTerms" class="ml-2 text-sm text-slate-300">
                  Acepto los términos y condiciones de <strong>www.yo-decreto.com</strong>
                </label>
              </div>

              <!-- Register button -->
              <button 
                type="submit" 
                class="w-full bg-gradient-to-r from-accent-green to-accent-blue hover:from-accent-green/80 hover:to-accent-blue/80 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mt-4"
              >
                <i class="fas fa-user-plus mr-2"></i>
                Crear Mi Cuenta
              </button>
            </form>

            <!-- Back to login -->
            <div class="flex items-center my-4">
              <div class="flex-1 border-t border-slate-600"></div>
              <span class="px-4 text-sm text-slate-400">o</span>
              <div class="flex-1 border-t border-slate-600"></div>
            </div>

            <div class="text-center">
              <button 
                type="button" 
                onclick="Auth.showLoginScreen()"
                class="w-full bg-slate-700/50 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg border border-slate-600 transition-all duration-300 hover:border-slate-500"
              >
                <i class="fas fa-arrow-left mr-2"></i>
                Ya tengo cuenta
              </button>
            </div>
          </div>
        </div>

        <!-- Loading overlay -->
        <div id="authLoading" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" style="display: none;">
          <div class="bg-slate-800 rounded-lg p-6 text-center">
            <div class="loader mx-auto mb-4"></div>
            <p class="text-white">Creando tu cuenta...</p>
          </div>
        </div>
      </div>
    `

    // Configurar event listeners
    this.setupRegisterEventListeners()
  },

  // Mostrar forgot password
  showForgotPassword() {
    console.log('Mostrar recuperación...')
    // TODO: Implementar recuperación
    this.showError('Recuperación no implementada aún. Contacta soporte.')
  },

  // Mostrar/ocultar loading
  showLoading(show) {
    const loading = document.getElementById('authLoading')
    if (loading) {
      loading.style.display = show ? 'flex' : 'none'
    }
  },

  // Mostrar error
  showError(message) {
    // Crear toast de error
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in'
    toast.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-red-200 hover:text-white">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `
    document.body.appendChild(toast)

    // Auto-remove después de 5 segundos
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, 5000)
  },

  // Mostrar éxito
  showSuccess(message) {
    // Crear toast de éxito
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in'
    toast.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-check-circle mr-2"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-green-200 hover:text-white">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `
    document.body.appendChild(toast)

    // Auto-remove después de 5 segundos
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, 5000)
  },

  // Mostrar éxito y cargar app
  showSuccessAndLoadApp() {
    // Mostrar mensaje de éxito con logo
    document.body.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div class="text-center">
          <!-- Logo con animación de éxito -->
          <div class="relative mb-8">
            <img src="/static/logo-yo-decreto.png" alt="Yo Decreto" 
                 class="w-24 h-24 mx-auto animate-bounce" />
            <div class="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-ping">
              <i class="fas fa-check text-white text-sm"></i>
            </div>
          </div>
          
          <h1 class="text-3xl font-bold text-white mb-4">
            ¡Bienvenido, ${this.currentUser?.name || 'Usuario'}!
          </h1>
          <p class="text-slate-300 mb-6">Cargando tu espacio de manifestación...</p>
          
          <div class="loader mx-auto"></div>
        </div>
      </div>
    `

    // Cargar aplicación después de 2 segundos
    setTimeout(() => {
      this.loadMainApp()
    }, 2000)
  },

  // Cargar aplicación principal
  loadMainApp() {
    // Recargar la página para inicializar la app principal
    window.location.href = '/'
  },

  // Validar sesión existente
  async validateSession(token) {
    try {
      const response = await fetch(`${this.config.apiBase}/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return response.ok
    } catch (error) {
      return false
    }
  },

  // Logout
  logout() {
    localStorage.removeItem(this.config.sessionKey)
    this.isAuthenticated = false
    this.currentUser = null
    this.showLoginScreen()
  }
}

// CSS adicional para animaciones de login
const loginStyles = `
<style>
  .logo-login-giant {
    filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.3)) drop-shadow(0 0 60px rgba(34, 197, 94, 0.2));
    animation: logoGlow 4s ease-in-out infinite alternate;
  }
  
  @keyframes logoGlow {
    0% {
      filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.3)) drop-shadow(0 0 60px rgba(34, 197, 94, 0.2));
      transform: scale(1);
    }
    100% {
      filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 80px rgba(34, 197, 94, 0.4));
      transform: scale(1.05);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 1s ease-out;
  }
  
  .animate-fade-in-delay {
    animation: fadeIn 1.5s ease-out;
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
  
  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateX(100%);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
`

// Inyetar estilos cuando se carga el módulo
if (document.head) {
  document.head.insertAdjacentHTML('beforeend', loginStyles)
}