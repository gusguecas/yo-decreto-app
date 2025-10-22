# 🚀 Configuración de GitHub Actions para Deploy Automático

## ✅ Ya configurado:
- ✅ Workflow de GitHub Actions creado en `.github/workflows/deploy.yml`
- ✅ Account ID identificado: `6b31c8b77f0093f232b04b37709843a2`

## 📋 Pasos para completar la configuración:

### 1️⃣ Crear API Token en Cloudflare

Ya abrí la página: https://dash.cloudflare.com/profile/api-tokens

1. Click en **"Create Token"**
2. Usa el template **"Edit Cloudflare Workers"** (o crea uno custom)
3. Configura los permisos:
   - **Account** > **Cloudflare Pages** > **Edit**
4. En **Account Resources**:
   - Include > Specific account > **Gusguecas@gmail.com's Account**
5. Click en **"Continue to summary"**
6. Click en **"Create Token"**
7. **COPIA EL TOKEN** (solo lo verás una vez)

### 2️⃣ Agregar Secrets a GitHub

Ya abrí la página: https://github.com/gusguecas/yo-decreto-app/settings/secrets/actions

1. Click en **"New repository secret"**

**Secret 1:**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: `6b31c8b77f0093f232b04b37709843a2`

2. Click en **"New repository secret"** de nuevo

**Secret 2:**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: [El token que copiaste en el paso 1]

### 3️⃣ Desactivar build automático de Cloudflare Pages (opcional)

Para evitar builds duplicados:

1. Ve a: https://dash.cloudflare.com/
2. Workers & Pages > yo-decreto-app > Settings
3. En "Build configuration" > Deshabilita "Automatic deployments"

### 4️⃣ Probar el workflow

Una vez configurados los secrets:

```bash
git add .github/workflows/deploy.yml
git commit -m "🚀 Add GitHub Actions workflow for automatic deployment"
git push origin main
```

Luego ve a: https://github.com/gusguecas/yo-decreto-app/actions

Verás el workflow ejecutándose. Si todo está bien:
- ✅ Build exitoso
- ✅ Deploy automático a Cloudflare Pages
- ✅ URL actualizada en producción

## 🎯 ¿Qué hace el workflow?

Cada vez que haces `git push` a la rama `main`:

1. 🏗️ Clona el repositorio
2. 📦 Instala Node.js 20
3. 🔨 Ejecuta `npm ci` (instala dependencias)
4. ⚡ Ejecuta `npm run build` (construye el proyecto)
5. 🚀 Usa Wrangler para desplegar `dist/` a Cloudflare Pages

## ⚠️ Importante

- Los archivos modulares (`public/static/agenda/`) NO se suben en producción
- Solo se sube el archivo consolidado `dist/static/agenda.js` generado por el build
- Esto reduce el tamaño del deploy y evita errores de módulos

---

**Estado actual:** ⏳ Esperando configuración de secrets

Una vez completados los pasos 1 y 2, el deploy automático estará funcionando.
