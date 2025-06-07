#!/bin/bash

# Script para construir el backend para producción

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directorio base
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$BASE_DIR/backend/pos-backend"

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

# Verificar que el directorio del backend existe
if [ ! -d "$BACKEND_DIR" ]; then
  error "El directorio del backend no existe: $BACKEND_DIR"
fi

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
  error "Node.js no está instalado. Por favor, instálelo antes de continuar."
fi

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
  error "npm no está instalado. Por favor, instálelo antes de continuar."
fi

# Entrar al directorio del backend
cd "$BACKEND_DIR" || error "No se pudo acceder al directorio del backend"

# Instalar dependencias
log "Instalando dependencias..."
npm install || error "Error al instalar dependencias"

# Crear archivo .env para producción si no existe
if [ ! -f "$BACKEND_DIR/.env.production" ]; then
  log "Creando archivo .env.production..."
  cat > "$BACKEND_DIR/.env.production" << EOF
# Configuración de producción
NODE_ENV=production
PORT=3001

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=pos_system

# JWT
JWT_SECRET=pos-system-secret-key-production
JWT_EXPIRATION=1d

# Sesión
SESSION_SECRET=pos-system-session-secret-production

# Configuración de Redis (opcional)
REDIS_HOST=localhost
REDIS_PORT=6379
EOF
  log "Archivo .env.production creado. Por favor, edite los valores según su entorno de producción."
else
  log "El archivo .env.production ya existe."
fi

# Construir para producción
log "Construyendo backend para producción..."
npm run build || error "Error al construir backend para producción"

# Verificar que la carpeta dist se creó correctamente
if [ ! -d "$BACKEND_DIR/dist" ]; then
  error "La carpeta dist no se creó correctamente"
fi

# Crear archivo para PM2 (gestor de procesos para Node.js)
log "Creando archivo de configuración para PM2..."
cat > "$BACKEND_DIR/ecosystem.config.js" << EOF
module.exports = {
  apps: [{
    name: 'pos-backend',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

# Crear script de inicio para producción
log "Creando script de inicio para producción..."
cat > "$BACKEND_DIR/start-production.sh" << EOF
#!/bin/bash

# Cargar variables de entorno
if [ -f .env.production ]; then
  export \$(grep -v '^#' .env.production | xargs)
fi

# Iniciar aplicación
node dist/main.js
EOF

# Hacer ejecutable el script de inicio
chmod +x "$BACKEND_DIR/start-production.sh"

log "Backend construido exitosamente para producción."
log "Archivos para despliegue: $BACKEND_DIR/dist"

# Mostrar instrucciones para despliegue
echo ""
echo "=== INSTRUCCIONES PARA DESPLIEGUE DEL BACKEND ==="
echo "1. Copie los siguientes archivos a su servidor:"
echo "   - $BACKEND_DIR/dist/ (directorio completo)"
echo "   - $BACKEND_DIR/package.json"
echo "   - $BACKEND_DIR/.env.production (renombrar a .env en producción)"
echo "   - $BACKEND_DIR/ecosystem.config.js (si usa PM2)"
echo ""
echo "2. En el servidor, ejecute:"
echo "   - npm install --production"
echo "   - node dist/main.js"
echo ""
echo "3. Para usar PM2 (recomendado):"
echo "   - npm install -g pm2"
echo "   - pm2 start ecosystem.config.js"
echo ""

exit 0

