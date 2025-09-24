// Módulo Acerca de

const Acerca = {
  async render() {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = this.renderAcercaView()
  },

  renderAcercaView() {
    const user = AppState.user || {}
    return `
      <div class="container mx-auto px-4 py-8">
        
        <!-- Header con logo gigante -->
        <div class="mb-12">
          <div class="flex items-center justify-center mb-8">
            <!-- Logo gigante centrado -->
            <div class="text-center">
              <img src="/static/logo-yo-decreto.png" alt="Yo Decreto" class="logo-yo-decreto logo-gigante w-auto mx-auto mb-6 transition-all duration-300" />
              <h1 class="text-5xl font-bold mb-4 text-gradient-green">Acerca de Yo Decreto</h1>
              <p class="text-xl text-slate-300">Transforma tu vida a través del poder de tus decretos</p>
            </div>
          </div>
        </div>

        <!-- Contenido principal -->
        <div class="max-w-4xl mx-auto space-y-12">
          
          <!-- Sección: ¿Qué es Yo Decreto? -->
          <div class="gradient-card p-8 rounded-xl">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
              <span class="text-3xl mr-3">🎯</span>
              <span class="text-gradient-green">¿Qué es Yo Decreto?</span>
            </h2>
            <div class="text-lg text-slate-300 space-y-4 leading-relaxed">
              <p>
                "Yo Decreto" es una aplicación revolucionaria diseñada para ayudarte a manifestar tus sueños y objetivos 
                más ambiciosos a través del poder transformador de los decretos conscientes.
              </p>
              <p>
                Basada en principios de desarrollo personal y manifestación, esta herramienta te permite organizar, 
                seguir y materializar tus metas en las tres áreas fundamentales de la vida: 
                <span class="text-accent-green font-semibold">Empresarial</span>, 
                <span class="text-accent-orange font-semibold">Material</span> y 
                <span class="text-accent-blue font-semibold">Humana</span>.
              </p>
              <p>
                Cada decreto es una declaración poderosa de intención que, cuando se combina con acciones específicas 
                y seguimiento constante, se convierte en tu realidad tangible.
              </p>
            </div>
          </div>

          <!-- Sección: La Agenda Ejecutiva -->
          <div class="gradient-card p-8 rounded-xl">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
              <span class="text-3xl mr-3">📅</span>
              <span class="text-gradient-green">Tu Agenda Ejecutiva</span>
            </h2>
            <div class="text-lg text-slate-300 space-y-4 leading-relaxed">
              <p>
                La <span class="text-accent-green font-semibold">Agenda Ejecutiva</span> es el corazón operativo de tu transformación. 
                No es solo un calendario, es tu centro de comando personal donde cada tarea está alineada con tus decretos más importantes.
              </p>
              
              <div class="grid md:grid-cols-2 gap-6 mt-6">
                <div class="bg-slate-800/50 p-6 rounded-lg">
                  <h4 class="text-xl font-semibold text-accent-green mb-3">🎯 Enfoque Diario</h4>
                  <p class="text-sm">Define tu prioridad principal cada día y mantén tu energía enfocada en lo que realmente importa.</p>
                </div>
                
                <div class="bg-slate-800/50 p-6 rounded-lg">
                  <h4 class="text-xl font-semibold text-accent-orange mb-3">📊 Seguimiento Inteligente</h4>
                  <p class="text-sm">Cada tarea conectada a un decreto incluye seguimiento detallado de progreso y resultados.</p>
                </div>
                
                <div class="bg-slate-800/50 p-6 rounded-lg">
                  <h4 class="text-xl font-semibold text-accent-blue mb-3">⚡ Sincronización Total</h4>
                  <p class="text-sm">Tus tareas de agenda se sincronizan automáticamente con las acciones de tus decretos.</p>
                </div>
                
                <div class="bg-slate-800/50 p-6 rounded-lg">
                  <h4 class="text-xl font-semibold text-accent-purple mb-3">📈 Métricas de Éxito</h4>
                  <p class="text-sm">Visualiza tu progreso diario, semanal y mensual hacia tus objetivos más importantes.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección: Inspiración y Metodología -->
          <div class="gradient-card p-8 rounded-xl">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
              <span class="text-3xl mr-3">📚</span>
              <span class="text-gradient-green">Inspiración y Metodología</span>
            </h2>
            <div class="text-lg text-slate-300 space-y-4 leading-relaxed">
              <p>
                Esta aplicación está inspirada en principios de desarrollo personal establecidos en la literatura de manifestación consciente, 
                incluyendo conceptos del libro <span class="text-accent-green font-semibold">"Name It and Claim It"</span>.
              </p>
              <div class="bg-slate-800/50 p-4 rounded-lg text-sm text-slate-400 border-l-4 border-accent-blue">
                <p><strong>Disclaimer:</strong> Esta aplicación es una implementación independiente de conceptos generales de desarrollo personal. 
                No está oficialmente afiliada con ningún autor o editorial específica. Todos los derechos de las obras originales pertenecen a sus respectivos autores.</p>
              </div>
              
              <div class="bg-gradient-to-r from-accent-green/10 to-accent-blue/10 p-6 rounded-lg border-l-4 border-accent-green">
                <h4 class="text-xl font-semibold text-accent-green mb-4">Principios de Manifestación Aplicados:</h4>
                <ul class="space-y-3 text-base">
                  <li class="flex items-start">
                    <span class="text-accent-green mr-2">•</span>
                    <span><strong>Nombra tu Deseo:</strong> Define con claridad absoluta lo que quieres manifestar en tu vida.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-accent-green mr-2">•</span>
                    <span><strong>Reclámalo con Poder:</strong> Declara tu derecho a recibir aquello que deseas con convicción total.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-accent-green mr-2">•</span>
                    <span><strong>Actúa en Alineación:</strong> Toma acciones específicas y consistentes que respalden tu decreto.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-accent-green mr-2">•</span>
                    <span><strong>Mantén la Fe Activa:</strong> Sostén una expectativa positiva mientras trabajas hacia tu objetivo.</span>
                  </li>
                </ul>
              </div>

              <p>
                La metodología aplicada enseña que cuando combinas una <span class="text-accent-orange font-semibold">declaración clara</span> 
                con una <span class="text-accent-blue font-semibold">acción consistente</span> y una 
                <span class="text-accent-green font-semibold">fe inquebrantable</span>, activas principios universales 
                que contribuyen a materializar tus objetivos en la realidad física.
              </p>

              <p>
                "Yo Decreto" digitaliza estos principios eternos, proporcionándote las herramientas modernas 
                para aplicar esta sabiduría ancestral de manera sistemática y medible en tu vida diaria.
              </p>
            </div>
          </div>

          <!-- Sección: Cómo Funciona -->
          <div class="gradient-card p-8 rounded-xl">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
              <span class="text-3xl mr-3">⚙️</span>
              <span class="text-gradient-green">Cómo Funciona</span>
            </h2>
            <div class="text-lg text-slate-300 space-y-6">
              <div class="grid md:grid-cols-3 gap-6">
                <div class="text-center p-6 bg-slate-800/30 rounded-lg">
                  <div class="text-4xl mb-4">1️⃣</div>
                  <h4 class="text-xl font-semibold text-accent-green mb-2">Declara</h4>
                  <p class="text-sm">Crea decretos poderosos en las áreas Empresarial, Material y Humana de tu vida.</p>
                </div>
                
                <div class="text-center p-6 bg-slate-800/30 rounded-lg">
                  <div class="text-4xl mb-4">2️⃣</div>
                  <h4 class="text-xl font-semibold text-accent-orange mb-2">Planifica</h4>
                  <p class="text-sm">Define acciones específicas y organiza tu agenda diaria alineada con tus decretos.</p>
                </div>
                
                <div class="text-center p-6 bg-slate-800/30 rounded-lg">
                  <div class="text-4xl mb-4">3️⃣</div>
                  <h4 class="text-xl font-semibold text-accent-blue mb-2">Manifesta</h4>
                  <p class="text-sm">Ejecuta consistentemente mientras monitoreas tu progreso hacia la manifestación total.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer inspiracional -->
          <div class="text-center py-8">
            <div class="text-2xl font-bold text-gradient-green mb-4">
              "Tus decretos son las semillas de tu destino"
            </div>
            <p class="text-lg text-slate-400">
              Cada palabra que declaras con convicción se convierte en la arquitectura de tu futuro.
            </p>
            <div class="mt-6">
              <button 
                onclick="Router.navigate('decretos')"
                class="btn-primary px-8 py-3 rounded-lg font-semibold hover-lift"
              >
                Comenzar a Decretar
              </button>
            </div>
          </div>

        </div>

        <!-- Footer Legal -->
        <div class="mt-16 pt-8 border-t border-slate-700">
          <div class="text-center space-y-4">
            <div class="text-sm text-slate-400">
              <p><strong>© ${new Date().getFullYear()} www.yo-decreto.com</strong> - Todos los derechos reservados</p>
              <p>Esta aplicación y su contenido están protegidos por derechos de autor</p>
            </div>
            
            <div class="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
              <span>📧 Contacto: info@yo-decreto.com</span>
              <span>🌐 Aplicación desarrollada independientemente</span>
              <span>⚖️ Uso sujeto a términos y condiciones</span>
            </div>
            
            <div class="text-xs text-slate-500 max-w-2xl mx-auto">
              <p><strong>Aviso Legal:</strong> Esta aplicación es una herramienta de desarrollo personal creada de manera independiente. 
              Las metodologías implementadas se basan en principios generales de manifestación y desarrollo personal disponibles 
              en el dominio público. No nos hacemos responsables por resultados individuales obtenidos mediante el uso de esta aplicación.</p>
            </div>
          </div>
        </div>
      </div>
    `
  }
}