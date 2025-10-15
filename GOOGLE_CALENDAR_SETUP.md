# Configuración de Google Calendar

## Pasos para configurar la integración con Google Calendar

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombre sugerido: "Yo Decreto Calendar Integration"

### 2. Habilitar Google Calendar API

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google Calendar API"
3. Haz clic en **Enable**

### 3. Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Si es la primera vez, configura la **OAuth consent screen**:
   - User Type: **External**
   - App name: **Yo Decreto**
   - User support email: tu email
   - Developer contact: tu email
   - Scopes: No agregues ninguno ahora (lo haremos después)
   - Test users: Agrega tu email
   - Guarda

4. Vuelve a **Credentials** > **+ CREATE CREDENTIALS** > **OAuth client ID**
5. Application type: **Web application**
6. Name: **Yo Decreto Web Client**
7. Authorized redirect URIs:
   ```
   https://yo-decreto-app.pages.dev/api/google-calendar/callback
   ```
8. Haz clic en **Create**
9. **IMPORTANTE**: Guarda el **Client ID** y **Client Secret** que se muestran

### 4. Configurar Variables de Entorno en Cloudflare

Necesitas agregar las credenciales como **secretos** en Cloudflare Pages:

#### Opción A: Desde la línea de comandos (wrangler)

```bash
# Configurar GOOGLE_CLIENT_ID
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name=yo-decreto-app

# Configurar GOOGLE_CLIENT_SECRET
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=yo-decreto-app
```

Cuando te pregunte, pega el valor correspondiente de Google Cloud Console.

#### Opción B: Desde el Dashboard de Cloudflare

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona tu cuenta
3. Ve a **Workers & Pages**
4. Selecciona **yo-decreto-app**
5. Ve a **Settings** > **Environment variables**
6. En la sección **Production**, agrega:
   - Variable name: `GOOGLE_CLIENT_ID`
   - Value: (pega el Client ID de Google)
   - Click **Encrypt** para hacerlo secreto
   - Click **Add variable**
7. Repite para `GOOGLE_CLIENT_SECRET`

### 5. Variables que ya están configuradas

Las siguientes variables ya están en `wrangler.jsonc` y no necesitan cambios:

- `GOOGLE_REDIRECT_URI`: `https://yo-decreto-app.pages.dev/api/google-calendar/callback`

### 6. Verificar Configuración

Después de configurar las variables:

1. Espera 1-2 minutos para que se propaguen
2. Ve a https://yo-decreto-app.pages.dev
3. Navega a **Agenda**
4. Haz clic en **Conectar Google Calendar**
5. Si todo está bien, te redirigirá a Google para autorizar la app

### 7. Scopes de Google Calendar

La aplicación solicita los siguientes permisos:

- `https://www.googleapis.com/auth/calendar.events` - Crear/editar eventos
- `https://www.googleapis.com/auth/calendar.readonly` - Leer eventos

### Troubleshooting

**Error: "Google Calendar no está configurado"**
- Verifica que agregaste `GOOGLE_CLIENT_ID` como secreto en Cloudflare Pages
- Espera 1-2 minutos después de agregar las variables
- Redeploy la aplicación si es necesario

**Error: "redirect_uri_mismatch"**
- Verifica que la URI de redirección en Google Cloud Console es exactamente:
  ```
  https://yo-decreto-app.pages.dev/api/google-calendar/callback
  ```
- Nota: No debe tener `/` al final

**Error: "Access blocked: This app's request is invalid"**
- Asegúrate de haber configurado la OAuth consent screen
- Agrega tu email como "test user" en Google Cloud Console

### Comandos Útiles

```bash
# Ver variables de entorno actuales
npx wrangler pages deployment list --project-name=yo-decreto-app

# Eliminar una variable (si te equivocaste)
npx wrangler pages secret delete GOOGLE_CLIENT_ID --project-name=yo-decreto-app

# Ver logs en tiempo real
npx wrangler pages deployment tail --project-name=yo-decreto-app --environment=production
```

### Próximos Pasos

Una vez configurado:

1. La integración estará disponible en la sección **Agenda**
2. Podrás importar eventos desde Google Calendar
3. Podrás exportar:
   - Rutinas matutinas/vespertinas
   - Decretos primarios del día
   - Eventos de la agenda
4. Sincronización bidireccional automática (si está habilitada)
