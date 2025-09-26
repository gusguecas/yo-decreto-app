# 🎯 Yo Decreto App - Aplicación de Manifestación Personal

## 📋 Descripción del Proyecto

**Yo Decreto** es una aplicación web completa para el manejo de decretos personales, agenda diaria, seguimiento de progreso y práctica de manifestación. Incluye sistema de autenticación completo con login espectacular y logo gigante.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Pantalla de login espectacular** con logo gigante y efectos visuales
- **Registro de nuevos usuarios** con validación completa
- **Sesiones persistentes** con tokens seguros
- **Sistema de "Recordarme"** para sesiones de 30 días

### 🎯 Funcionalidades Core
- **Mis Decretos**: Creación y gestión de decretos personales
- **Agenda Diaria**: Layout horizontal rediseñado con calendario compacto
- **Click Consistente**: Al hacer clic en acciones de Agenda, Decretos o Panorámica se abre el mismo modal de detalles
- **Mi Progreso**: Seguimiento visual de avance y estadísticas
- **Mi Práctica**: Rutinas matutinas y afirmaciones personalizadas
- **Nombre de usuario editable** para personalización

### 🎨 Diseño Visual
- **Logo gigante con efectos glow** y animaciones espectaculares
- **Layout horizontal** con distribución en 3 columnas iguales
- **Interfaz responsiva** con Tailwind CSS
- **Efectos visuales** y transiciones suaves

### ⚖️ Cumplimiento Legal
- **Disclaimers completos** para uso de referencias de libros
- **Términos y condiciones** integrados
- **Protección de propiedad intelectual**

## 🌐 URLs de Producción

### 🔗 Aplicación en Vivo
- **Desarrollo**: `https://3000-irquswxy1gmfji7zemejt-6532622b.e2b.dev`
- **GitHub**: `https://github.com/gusguecas/yo-decreto-app`
- **Producción**: *Pendiente de despliegue a Cloudflare Pages*

### 🔑 Credenciales de Prueba
- **Admin**: `admin@yo-decreto.com` / `admin123`
- **Registro**: Crear nueva cuenta desde la interfaz

## 🏗️ Arquitectura Técnica

### 💻 Stack Tecnológico
- **Backend**: Hono Framework + TypeScript
- **Frontend**: JavaScript Vanilla + Tailwind CSS
- **Base de Datos**: Cloudflare D1 SQLite
- **Autenticación**: Sistema JWT personalizado
- **Despliegue**: Cloudflare Pages + Workers

### 📊 Modelos de Datos
- **auth_users**: Sistema de usuarios y autenticación
- **auth_sessions**: Gestión de sesiones activas
- **decretos**: Decretos personales del usuario
- **acciones**: Acciones asociadas a decretos
- **agenda**: Tareas y eventos de agenda
- **rutinas_matutinas**: Rutinas de práctica diaria
- **afirmaciones**: Afirmaciones personalizadas

### 🗂️ Estructura del Proyecto
```
webapp/
├── src/                    # Backend Hono
│   ├── index.tsx          # Aplicación principal
│   ├── renderer.tsx       # Plantilla HTML
│   └── routes/            # Rutas API
│       ├── auth.ts        # 🔐 Autenticación
│       ├── decretos.ts    # Gestión de decretos
│       ├── agenda.ts      # Agenda diaria
│       ├── progreso.ts    # Seguimiento
│       └── practica.ts    # Rutinas y afirmaciones
├── public/static/         # Frontend
│   ├── auth.js           # 🔐 Sistema de login/registro
│   ├── app.js            # Aplicación principal
│   ├── decretos.js       # Módulo de decretos
│   ├── agenda.js         # Módulo de agenda
│   ├── progreso.js       # Módulo de progreso
│   ├── practica.js       # Módulo de práctica
│   ├── acerca.js         # Información legal
│   └── styles.css        # Estilos personalizados
├── migrations/           # Migraciones de BD
└── *.sql                # Datos de prueba
```

## 🚀 Guía de Uso

### 👤 Para Usuarios
1. **Accede a la aplicación** desde el navegador
2. **Crea tu cuenta** o inicia sesión
3. **Agrega tus decretos** personales
4. **Gestiona tu agenda** diaria
5. **Sigue tu progreso** y estadísticas
6. **Practica con rutinas** matutinas

### 💻 Para Desarrolladores
```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run build
npm run dev:sandbox

# Migraciones
npm run db:migrate:local
npm run db:seed

# Despliegue
npm run deploy
```

## 📈 Estado del Desarrollo

### ✅ Completado
- [x] Sistema de autenticación completo (login/registro)
- [x] Interfaz de login con logo gigante espectacular
- [x] Layout horizontal rediseñado
- [x] Gestión completa de decretos y acciones
- [x] Agenda diaria con calendario
- [x] **Click handlers consistentes**: Agenda, Decretos y Panorámica abren el mismo modal de detalles
- [x] **🔧 ARREGLO CRÍTICO DE FECHAS**: Las fechas seleccionadas por el usuario en seguimientos ahora se respetan correctamente (NO TOCAR ESTE CÓDIGO)
- [x] **🎯 LÓGICA CORRECTA DE TIMELINE**: Timeline muestra acciones por FECHA COMPROMISO (proxima_revision) únicamente - CÓDIGO PROTEGIDO
- [x] Sistema de progreso y estadísticas
- [x] Rutinas matutinas y afirmaciones
- [x] Nombre de usuario editable
- [x] Cumplimiento legal completo
- [x] Base de datos D1 configurada
- [x] Frontend responsivo
- [x] Cache busting implementado

### 🔄 En Progreso
- [ ] Despliegue a Cloudflare Pages
- [ ] Configuración de dominio personalizado
- [ ] Optimizaciones de rendimiento

### 🎯 Próximos Pasos
- [ ] Sistema de backup automático
- [ ] Notificaciones push
- [ ] Integración con calendarios externos
- [ ] App móvil nativa
- [ ] Funciones sociales (opcional)

## 🛡️ Seguridad y Privacidad

### 🔒 Medidas de Seguridad
- **Autenticación JWT** con tokens seguros
- **Validación del lado servidor** en todas las rutas
- **Sanitización de datos** de entrada
- **Sesiones con expiración** configurable
- **HTTPS** obligatorio en producción

### 📱 Compatibilidad
- **Desktop**: Todas las resoluciones
- **Mobile**: Responsive design completo
- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas versiones)

## 📞 Soporte y Contacto

### 📧 Información de Contacto
- **Website**: www.yo-decreto.com
- **Email**: info@yo-decreto.com
- **Desarrollador**: Gustavo Adolfo Guerrero Castaños

### 📄 Legal
- **Copyright**: © 2024 www.yo-decreto.com
- **Términos**: Aplicación desarrollada independientemente
- **Disclaimer**: Implementación independiente para uso personal

---

## 🎉 ¡Gracias por usar Yo Decreto!

*Tu manifestación, tu poder. Decretar es crear tu realidad.*

**Versión**: 1.0.0 - Production Ready  
**Última actualización**: Septiembre 2024  
**Estado**: ✅ Funcional y listo para producción