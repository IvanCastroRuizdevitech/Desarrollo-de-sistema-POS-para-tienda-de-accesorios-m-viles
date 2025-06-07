#!/bin/bash

# Script para construir el frontend para producción en ambos entornos (web y Electron)

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directorio base
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$BASE_DIR/frontend/pos-frontend"

# Función para mostrar mensajes
log() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Verificar que el directorio del frontend existe
if [ ! -d "$FRONTEND_DIR" ]; then
  error "El directorio del frontend no existe: $FRONTEND_DIR"
fi

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
  error "Node.js no está instalado. Por favor, instálelo antes de continuar."
fi

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
  error "npm no está instalado. Por favor, instálelo antes de continuar."
fi

# Entrar al directorio del frontend
cd "$FRONTEND_DIR" || error "No se pudo acceder al directorio del frontend"

# Instalar dependencias
log "Instalando dependencias..."
npm install || error "Error al instalar dependencias"

# Construir versión web
log "Construyendo versión web..."
npm run build || error "Error al construir versión web"

# Verificar que la carpeta build se creó correctamente
if [ ! -d "$FRONTEND_DIR/build" ]; then
  error "La carpeta build no se creó correctamente"
fi

log "Versión web construida exitosamente en: $FRONTEND_DIR/build"

# Construir versión Electron
log "Construyendo versión Electron..."
if [ -f "$FRONTEND_DIR/package.json" ] && grep -q "electron:build" "$FRONTEND_DIR/package.json"; then
  npm run electron:build || warn "Error al construir versión Electron"
  
  # Verificar que la carpeta dist se creó correctamente
  if [ -d "$FRONTEND_DIR/dist" ]; then
    log "Versión Electron construida exitosamente en: $FRONTEND_DIR/dist"
  else
    warn "La carpeta dist no se creó correctamente"
  fi
else
  warn "No se encontró el script electron:build en package.json"
  
  # Intentar con electron-builder directamente
  if command -v electron-builder &> /dev/null; then
    log "Intentando construir con electron-builder..."
    npx electron-builder --dir || warn "Error al construir con electron-builder"
  else
    warn "electron-builder no está instalado. Instalando..."
    npm install --save-dev electron-builder || warn "Error al instalar electron-builder"
    
    log "Intentando construir con electron-builder..."
    npx electron-builder --dir || warn "Error al construir con electron-builder"
  fi
fi

# Crear archivo de configuración para despliegue web
log "Creando archivo de configuración para despliegue web..."
cat > "$FRONTEND_DIR/build/web-config.json" << EOF
{
  "name": "POS System Web",
  "version": "1.0.0",
  "description": "Versión web del sistema POS",
  "apiUrl": "/api",
  "environment": "production",
  "clientType": "web"
}
EOF

log "Proceso de construcción completado."
log "Archivos para despliegue web: $FRONTEND_DIR/build"
log "Archivos para aplicación Electron: $FRONTEND_DIR/dist (si está disponible)"

# Mostrar instrucciones para despliegue
echo ""
echo "=== INSTRUCCIONES PARA DESPLIEGUE ==="
echo "1. Para desplegar la versión web:"
echo "   - Copie el contenido de $FRONTEND_DIR/build a su servidor web"
echo "   - Configure su servidor web para servir la aplicación"
echo ""
echo "2. Para distribuir la aplicación Electron:"
echo "   - Los archivos de distribución están en $FRONTEND_DIR/dist (si está disponible)"
echo "   - Puede crear instaladores ejecutando: npm run electron:build-installer"
echo ""

exit 0

