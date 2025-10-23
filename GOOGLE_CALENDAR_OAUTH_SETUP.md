# 🔐 Guía Completa: Configuración de Google Calendar OAuth

Esta guía documenta el proceso completo para configurar la integración de Google Calendar con OAuth 2.0 en la aplicación Yo Decreto.

---

## 📋 Resumen del Problema y Solución

### Problema Original
- Error: "The OAuth client was not found"
- Causas:
  1. Variables de entorno `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` no configuradas en Cloudflare Pages
  2. Usuario no agregado como "Test User" en Google Cloud Console
  3. Aplicación OAuth no verificada por Google

### Solución Implementada
1. Configurar secrets en Cloudflare Pages
2. Agregar usuario como Test User en Google Cloud Console
3. Forzar redeploy para cargar las variables de entorno

---

## 🛠️ Paso 1: Obtener Credenciales de Google Cloud

### 1.1 Crear Proyecto en Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Click en el selector de proyectos (arriba)
3. Click en "New Project" / "Nuevo Proyecto"
4. Nombre del proyecto: `yo-decreto` (o el que prefieras)
5. Click en "Create" / "Crear"

### 1.2 Habilitar Google Calendar API

1. En el menú lateral, ve a: **APIs & Services > Library**
2. Busca: `Google Calendar API`
3. Click en el resultado
4. Click en **"Enable"** / **"Habilitar"**

### 1.3 Configurar OAuth Consent Screen

1. Ve a: **APIs & Services > OAuth consent screen**
2. Selecciona **"External"** (para uso público)
3. Click en **"Create"**

**Configuración básica:**
- **App name:** Yo Decreto
- **User support email:** tu-email@gmail.com
- **Developer contact information:** tu-email@gmail.com
- **App domain (opcional):** yo-decreto-app.pages.dev
- **Authorized domains:** pages.dev

4. Click en **"Save and Continue"**

**Scopes (alcances):**
5. Click en **"Add or Remove Scopes"**
6. Busca y selecciona:
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/calendar.readonly`
7. Click en **"Update"**
8. Click en **"Save and Continue"**

**Test Users (crucial):**
9. En la sección **"Test users"**, click en **"+ ADD USERS"**
10. Agrega los emails que podrán usar la integración:
    - `gusguecas@gmail.com` (o el email que usarás)
11. Click en **"Save"**
12. Click en **"Save and Continue"**

### 1.4 Crear Credenciales OAuth 2.0

1. Ve a: **APIs & Services > Credentials**
2. Click en **"+ Create Credentials"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: `Yo Decreto Web Client`

**Authorized JavaScript origins:**
```
https://yo-decreto-app.pages.dev
http://localhost:3000
```

**Authorized redirect URIs:**
```
https://yo-decreto-app.pages.dev/api/google-calendar/callback
http://localhost:3000/api/google-calendar/callback
```

5. Click en **"Create"**
6. **COPIA Y GUARDA:**
   - **Client ID:** `[TU_CLIENT_ID].apps.googleusercontent.com`
   - **Client Secret:** `GOCSPX-[TU_CLIENT_SECRET]`

⚠️ **IMPORTANTE:** Guarda estas credenciales en un lugar seguro.

---

## 🔧 Paso 2: Configurar Variables de Entorno en Cloudflare Pages

### Método 1: Usando Wrangler CLI (Recomendado)

```bash
# Instalar wrangler si no lo tienes
npm install -g wrangler

# Configurar GOOGLE_CLIENT_ID
echo "TU_CLIENT_ID" | npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name=yo-decreto-app

# Configurar GOOGLE_CLIENT_SECRET
echo "TU_CLIENT_SECRET" | npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=yo-decreto-app
```

### Método 2: Desde el Dashboard de Cloudflare

1. Ve a: https://dash.cloudflare.com/
2. **Workers & Pages** → **yo-decreto-app** → **Settings**
3. En el menú lateral: **Environment variables**
4. En la sección **"Production"**, click en **"Add variable"**

**Variable 1:**
- Name: `GOOGLE_CLIENT_ID`
- Value: `[TU_CLIENT_ID]`
- **NO** marcar como "Encrypted" (Cloudflare encripta automáticamente)

**Variable 2:**
- Name: `GOOGLE_CLIENT_SECRET`
- Value: `[TU_CLIENT_SECRET]`
- **NO** marcar como "Encrypted"

5. Click en **"Save"**

---

## 🚀 Paso 3: Forzar Redeploy

**¿Por qué?** Los secrets solo se inyectan durante el deployment, no están disponibles inmediatamente.

### Opción A: Git Push Vacío

```bash
git commit --allow-empty -m "🔧 Trigger deployment to load Google OAuth secrets"
git push origin main
```

### Opción B: Redeploy Manual

1. Ve a: **Cloudflare Dashboard** → **Workers & Pages** → **yo-decreto-app**
2. En la pestaña **"Deployments"**
3. Click en los 3 puntos del último deployment
4. Click en **"Redeploy"**

---

## ✅ Paso 4: Verificar la Configuración

### 4.1 Probar el Endpoint de Auth URL

```bash
curl https://yo-decreto-app.pages.dev/api/google-calendar/auth-url
```

**Respuesta esperada:**
```json
{
  "success": true,
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
}
```

### 4.2 Probar la Autorización en el Navegador

1. Abre: https://yo-decreto-app.pages.dev/#/acerca
2. Busca la sección **"Google Calendar"**
3. Click en **"Conectar con Google Calendar"**
4. Deberías ver la pantalla de autorización de Google
5. Selecciona tu cuenta (debe estar en Test Users)
6. Autoriza los permisos solicitados

### 4.3 Verificar Conexión

Después de autorizar:
- Serás redirigido a la aplicación
- Verás un mensaje de éxito
- El estado cambiará a **"Conectado"** con círculo verde
- Aparecerán botones de sincronización

---

## 🔍 Troubleshooting (Resolución de Problemas)

### Error: "The OAuth client was not found"

**Causa:** Variables de entorno no configuradas correctamente

**Solución:**
1. Verifica que los secrets estén configurados:
   ```bash
   npx wrangler pages secret list --project-name=yo-decreto-app
   ```
2. Si no aparecen, configúralos nuevamente
3. Fuerza un redeploy

### Error: "Acceso bloqueado: yo-decreto-app.pages.dev no completó el proceso de verificación"

**Causa:** Usuario no está agregado como Test User

**Solución:**
1. Ve a: https://console.cloud.google.com/apis/credentials/consent?project=TU_PROJECT_ID
2. Click en **"Edit App"** o navega a la sección **"Test users"**
3. Click en **"+ ADD USERS"**
4. Agrega tu email: `tu-email@gmail.com`
5. Click en **"Save"**
6. Espera 1-2 minutos
7. Intenta autorizar de nuevo

### Error: "Invalid redirect_uri"

**Causa:** La URL de redirección no está autorizada

**Solución:**
1. Ve a: https://console.cloud.google.com/apis/credentials?project=TU_PROJECT_ID
2. Click en tu OAuth 2.0 Client ID
3. En **"Authorized redirect URIs"**, asegúrate de tener:
   ```
   https://yo-decreto-app.pages.dev/api/google-calendar/callback
   ```
4. Click en **"Save"**

### Error: "Unauthorized" (401) al importar eventos

**Causa:** Token de acceso no válido o no existe

**Solución:**
1. Desconecta Google Calendar desde la app
2. Vuelve a conectar
3. Esto regenerará los tokens

---

## 📝 Notas Importantes

### Límites de Test Users
- Máximo 100 usuarios de prueba
- Solo usuarios agregados pueden usar la app hasta que sea verificada por Google
- El proceso de verificación de Google toma 4-6 semanas

### Tokens de Acceso
- **Access Token:** Expira cada 1 hora
- **Refresh Token:** Se usa para obtener nuevos access tokens
- La aplicación refresca automáticamente los tokens expirados

### Scopes (Permisos)
- `calendar.events`: Crear, leer, actualizar y eliminar eventos
- `calendar.readonly`: Solo lectura de eventos (backup)

### Seguridad
- Los tokens se almacenan encriptados en Cloudflare D1 (SQLite)
- Los secrets de Cloudflare están encriptados en reposo
- Nunca expongas `GOOGLE_CLIENT_SECRET` en el frontend

---

## 🔄 Mantenimiento Futuro

### Agregar Más Test Users

```bash
# Opción 1: Dashboard (recomendado para usuarios sin experiencia técnica)
# Ve a Google Cloud Console → OAuth consent screen → Test users → + ADD USERS

# Opción 2: CLI (si tienes permisos)
gcloud auth login
gcloud config set project TU_PROJECT_ID
# Nota: No hay comando directo de gcloud para test users, usar dashboard
```

### Renovar Client Secret (si es comprometido)

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Click en tu OAuth 2.0 Client ID
3. Click en **"Reset Secret"**
4. Copia el nuevo secret
5. Actualiza en Cloudflare Pages:
   ```bash
   echo "NUEVO_SECRET" | npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=yo-decreto-app
   ```
6. Fuerza redeploy

### Verificar la Aplicación para Producción

Cuando estés listo para usuarios reales (sin límite de 100):

1. Ve a: https://console.cloud.google.com/apis/credentials/consent
2. Click en **"Publish App"** / **"Publicar aplicación"**
3. Google revisará tu aplicación (4-6 semanas)
4. Proporciona:
   - Política de privacidad
   - Términos de servicio
   - Video demostrando el uso de los scopes
   - Justificación de por qué necesitas los permisos

---

## 📚 Referencias

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Calendar API Reference](https://developers.google.com/calendar/api/v3/reference)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

---

## 🎯 Checklist Final

- [ ] Proyecto creado en Google Cloud Console
- [ ] Google Calendar API habilitada
- [ ] OAuth Consent Screen configurado
- [ ] Test users agregados
- [ ] Credenciales OAuth 2.0 creadas
- [ ] `GOOGLE_CLIENT_ID` configurado en Cloudflare Pages
- [ ] `GOOGLE_CLIENT_SECRET` configurado en Cloudflare Pages
- [ ] Redeploy forzado completado
- [ ] Autorización probada exitosamente
- [ ] Importación de eventos funcionando

---

**Última actualización:** 2025-10-23
**Versión:** 1.0
**Autor:** Claude Code
