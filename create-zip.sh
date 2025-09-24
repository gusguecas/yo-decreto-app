#!/bin/bash
echo "🚀 Creando código limpio de Yo Decreto App..."

# Crear directorio temporal
mkdir -p /tmp/yo-decreto-clean

# Copiar archivos esenciales (sin archivos pesados)
cd /home/user/webapp

# Copiar estructura principal
cp -r src /tmp/yo-decreto-clean/
cp -r public /tmp/yo-decreto-clean/
cp -r migrations /tmp/yo-decreto-clean/
cp -r .github /tmp/yo-decreto-clean/

# Copiar archivos de configuración
cp package.json /tmp/yo-decreto-clean/
cp wrangler.jsonc /tmp/yo-decreto-clean/
cp tsconfig.json /tmp/yo-decreto-clean/
cp vite.config.ts /tmp/yo-decreto-clean/
cp ecosystem.config.cjs /tmp/yo-decreto-clean/
cp README.md /tmp/yo-decreto-clean/
cp DEPLOYMENT.md /tmp/yo-decreto-clean/
cp .gitignore /tmp/yo-decreto-clean/

# Copiar archivos SQL
cp *.sql /tmp/yo-decreto-clean/ 2>/dev/null || true

# Crear archivo ZIP más pequeño
cd /tmp
zip -r yo-decreto-clean.zip yo-decreto-clean/

# Mover a public
cp yo-decreto-clean.zip /home/user/webapp/public/

echo "✅ Archivo creado: yo-decreto-clean.zip"
ls -lh /home/user/webapp/public/yo-decreto-clean.zip