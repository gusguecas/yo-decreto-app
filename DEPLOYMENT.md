# 🚀 Guía de Despliegue - Yo Decreto App

## 📋 Configuración Inicial (Solo una vez)

### 1. 🔑 Cloudflare API Configuration
- Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
- Crea un **Custom Token** con permisos:
  - **Zone:Read** (para yo-decreto.com)
  - **Cloudflare Pages:Edit**
  - **Account:Read**

### 2. 🌐 GitHub Secrets
Configura estos secrets en tu repositorio GitHub:
- `CLOUDFLARE_API_TOKEN`: Tu token de Cloudflare
- `CLOUDFLARE_ACCOUNT_ID`: ID de tu cuenta Cloudflare

### 3. 📦 Configuración del Proyecto
```bash
# Nombre del proyecto en Cloudflare Pages
Project Name: yo-decreto

# Dominio personalizado
Custom Domain: yo-decreto.com

# Build settings
Framework: None (Static Site)
Build command: npm run build
Build output: /dist
```

## 🔄 Workflow de Desarrollo

### Para Cambios Rápidos:
```bash
# Método súper rápido
npm run update:quick
```

### Para Cambios Detallados:
```bash
# 1. Hacer cambios en el código
# 2. Commit con mensaje descriptivo
git add .
git commit -m "Descripción de los cambios"
git push origin main

# 3. Deploy automático se ejecuta
# 4. Verifica en https://yo-decreto.com
```

### Para Cambios de Base de Datos:
```bash
# 1. Crear nueva migración
# 2. Aplicar en producción
npm run db:migrate:prod

# 3. Deploy normal
npm run update:quick
```

## 🎯 URLs Importantes

### Producción
- **App Principal**: https://yo-decreto.com
- **API**: https://yo-decreto.com/api/*
- **Cloudflare Dashboard**: https://dash.cloudflare.com/

### GitHub
- **Repositorio**: https://github.com/gusguecas/yo-decreto-app
- **Actions**: https://github.com/gusguecas/yo-decreto-app/actions

## 🔧 Comandos Útiles

### Desarrollo Local:
```bash
npm run dev:sandbox          # Servidor local
npm run db:reset            # Reset BD local
npm run test               # Probar conexión
```

### Producción:
```bash
npm run deploy:prod        # Deploy manual
npm run db:migrate:prod    # Migraciones en prod
npm run setup:prod         # Setup completo
```

## 🚨 Troubleshooting

### Si el deploy falla:
1. Verifica que los secrets de GitHub estén configurados
2. Revisa los logs en GitHub Actions
3. Confirma que el build local funciona: `npm run build`

### Si la base de datos da error:
1. Aplica migraciones: `npm run db:migrate:prod`
2. Verifica la configuración en wrangler.jsonc

### Si el dominio no funciona:
1. Verifica DNS en Cloudflare
2. Confirma que el dominio esté agregado al proyecto
3. Espera propagación DNS (hasta 24h)

## 📞 Soporte
- **Email**: info@yo-decreto.com
- **Desarrollador**: Gustavo Adolfo Guerrero Castaños