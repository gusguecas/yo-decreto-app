# 📅 Configuración de Google Calendar API

## Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombre sugerido: **"Yo Decreto - Calendar Integration"**

## Paso 2: Habilitar Google Calendar API

1. En el menú lateral, ve a **"APIs y servicios" > "Biblioteca"**
2. Busca **"Google Calendar API"**
3. Haz clic en **"HABILITAR"**

## Paso 3: Configurar Pantalla de Consentimiento OAuth

1. Ve a **"APIs y servicios" > "Pantalla de consentimiento de OAuth"**
2. Selecciona **"Externo"** (o "Interno" si tienes Google Workspace)
3. Haz clic en **"CREAR"**

4. **Información de la aplicación**:
   - Nombre de la aplicación: `Yo Decreto`
   - Correo electrónico de asistencia: tu correo
   - Logotipo de la aplicación: (opcional)

5. **Información de contacto del desarrollador**:
   - Correo: tu correo

6. **Ámbitos (Scopes)**:
   - Haz clic en "AGREGAR O QUITAR ÁMBITOS"
   - Busca y selecciona:
     - `https://www.googleapis.com/auth/calendar.events`
     - `https://www.googleapis.com/auth/calendar.readonly`
   - Guarda

7. **Usuarios de prueba** (si es "Externo"):
   - Agrega tu correo de Gmail para pruebas
   - Guarda y continúa

8. Haz clic en **"VOLVER AL PANEL"**

## Paso 4: Crear Credenciales OAuth 2.0

1. Ve a **"APIs y servicios" > "Credenciales"**
2. Haz clic en **"+ CREAR CREDENCIALES"**
3. Selecciona **"ID de cliente de OAuth 2.0"**

4. **Configuración**:
   - Tipo de aplicación: **Aplicación web**
   - Nombre: `Yo Decreto Web Client`

5. **URIs de redireccionamiento autorizados**:
   Agrega las siguientes URLs (ajusta según tu dominio):

   ```
   http://localhost:8787/api/google-calendar/callback
   https://yo-decreto.pages.dev/api/google-calendar/callback
   https://tu-dominio-personalizado.com/api/google-calendar/callback
   ```

6. Haz clic en **"CREAR"**

7. **Guarda las credenciales**:
   - `Client ID`: Algo como `123456789-abc123.apps.googleusercontent.com`
   - `Client Secret`: Algo como `GOCSPX-abc123xyz789`

## Paso 5: Configurar Variables de Entorno en Cloudflare

### Opción A: Usando Wrangler CLI (Recomendado)

```bash
# Navega a la carpeta del proyecto
cd "/Users/gustavo/Desktop/250924 8 39 pm backup/webapp"

# Agregar secrets
npx wrangler pages secret put GOOGLE_CLIENT_ID
# Pega tu Client ID y presiona Enter

npx wrangler pages secret put GOOGLE_CLIENT_SECRET
# Pega tu Client Secret y presiona Enter

npx wrangler pages secret put GOOGLE_REDIRECT_URI
# Pega tu redirect URI (ejemplo: https://yo-decreto.pages.dev/api/google-calendar/callback)
```

### Opción B: Usando Dashboard de Cloudflare

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona tu cuenta
3. Ve a **Workers & Pages**
4. Selecciona tu proyecto **"yo-decreto-app"**
5. Ve a **Settings > Environment variables**
6. Agrega las siguientes variables:

   ```
   GOOGLE_CLIENT_ID = tu-client-id-aqui
   GOOGLE_CLIENT_SECRET = tu-client-secret-aqui
   GOOGLE_REDIRECT_URI = https://yo-decreto.pages.dev/api/google-calendar/callback
   ```

## Paso 6: Ejecutar Migración de Base de Datos

```bash
cd "/Users/gustavo/Desktop/250924 8 39 pm backup/webapp"

# Ejecutar migración en producción
npx wrangler d1 execute yo-decreto-production --file=./migrations/011_google_calendar_integration.sql
```

## Paso 7: Desplegar Aplicación

```bash
npm run build
npx wrangler pages deploy --commit-dirty=true
```

## Paso 8: Probar la Integración

1. Ve a tu aplicación en producción
2. Navega a la sección **"Configuración"** (agregaremos este panel)
3. Haz clic en **"Conectar Google Calendar"**
4. Autoriza la aplicación
5. ¡Listo! Ya tienes sincronización con Google Calendar

---

## 🔒 Seguridad y Privacidad

- **Los tokens de acceso se almacenan encriptados** en tu base de datos D1
- **Solo tú** tienes acceso a tus eventos de Google Calendar
- **Los datos nunca** se comparten con terceros
- **Puedes desconectar** en cualquier momento desde Configuración

---

## 🆘 Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verifica que la URL de callback en Google Cloud coincida exactamente con la configurada en Cloudflare
- Incluye el protocolo (https://) y la ruta completa (/api/google-calendar/callback)

### Error: "access_denied"
- Asegúrate de haber agregado tu correo a "Usuarios de prueba" si la app está en modo "Externo"
- Verifica que hayas habilitado los scopes correctos

### Error: "invalid_client"
- Verifica que GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET estén correctamente configurados
- Revisa que no haya espacios extra al copiar/pegar

---

## 📝 Notas Importantes

1. **Modo de Prueba**: Si tu app está en modo "Externo" y no verificada, solo funcionará para usuarios de prueba (máximo 100 usuarios)

2. **Publicar en Producción**: Para más de 100 usuarios, necesitas enviar tu app a verificación de Google (proceso que puede tomar 1-2 semanas)

3. **Cuotas**: Google Calendar API tiene límites:
   - 1,000,000 requests por día
   - 10 requests por segundo
   - Suficiente para uso personal

---

## ✅ Checklist Final

- [ ] Proyecto creado en Google Cloud Console
- [ ] Google Calendar API habilitada
- [ ] Pantalla de consentimiento OAuth configurada
- [ ] Credenciales OAuth 2.0 creadas
- [ ] Variables de entorno configuradas en Cloudflare
- [ ] Migración ejecutada en base de datos
- [ ] Aplicación desplegada
- [ ] Prueba de conexión exitosa

---

**¡Listo para sincronizar con Google Calendar!** 🎉
