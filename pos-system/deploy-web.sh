#!/bin/bash

# Script para desplegar la versión web del sistema POS

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directorio base
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$BASE_DIR/frontend/pos-frontend"
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

# Verificar que los directorios existen
if [ ! -d "$FRONTEND_DIR" ]; then
  error "El directorio del frontend no existe: $FRONTEND_DIR"
fi

if [ ! -d "$BACKEND_DIR" ]; then
  error "El directorio del backend no existe: $BACKEND_DIR"
fi

# Verificar que los scripts de construcción existen
if [ ! -f "$BASE_DIR/build-frontend.sh" ]; then
  error "El script de construcción del frontend no existe: $BASE_DIR/build-frontend.sh"
fi

if [ ! -f "$BASE_DIR/build-backend.sh" ]; then
  error "El script de construcción del backend no existe: $BASE_DIR/build-backend.sh"
fi

# Hacer ejecutables los scripts de construcción
chmod +x "$BASE_DIR/build-frontend.sh"
chmod +x "$BASE_DIR/build-backend.sh"

# Construir frontend y backend
log "Construyendo frontend..."
"$BASE_DIR/build-frontend.sh" || error "Error al construir frontend"

log "Construyendo backend..."
"$BASE_DIR/build-backend.sh" || error "Error al construir backend"

# Crear directorio para despliegue
DEPLOY_DIR="$BASE_DIR/deploy"
mkdir -p "$DEPLOY_DIR" || error "Error al crear directorio de despliegue"

# Copiar archivos del frontend
log "Copiando archivos del frontend..."
mkdir -p "$DEPLOY_DIR/public"
cp -r "$FRONTEND_DIR/build/"* "$DEPLOY_DIR/public/" || warn "Error al copiar archivos del frontend"

# Copiar archivos del backend
log "Copiando archivos del backend..."
mkdir -p "$DEPLOY_DIR/api"
cp -r "$BACKEND_DIR/dist" "$DEPLOY_DIR/api/" || warn "Error al copiar archivos del backend"
cp "$BACKEND_DIR/package.json" "$DEPLOY_DIR/api/" || warn "Error al copiar package.json del backend"
cp "$BACKEND_DIR/.env.production" "$DEPLOY_DIR/api/.env" || warn "Error al copiar .env.production del backend"

# Crear archivo de configuración para Nginx
log "Creando configuración de Nginx..."
mkdir -p "$DEPLOY_DIR/config"
cat > "$DEPLOY_DIR/config/nginx.conf" << EOF
server {
    listen 80;
    server_name pos-system.example.com; # Cambiar por el dominio real

    # Archivos estáticos del frontend
    location / {
        root /var/www/pos-system/public;
        try_files \$uri \$uri/ /index.html;
        index index.html;
    }

    # API backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Configuración de seguridad
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' localhost:* ws://localhost:*;" always;
}
EOF

# Crear script de despliegue para el servidor
log "Creando script de despliegue para el servidor..."
cat > "$DEPLOY_DIR/deploy-to-server.sh" << EOF
#!/bin/bash

# Script para desplegar la aplicación en el servidor

# Configuración
SERVER_USER="ubuntu"
SERVER_HOST="your-server-ip"
SERVER_PATH="/var/www/pos-system"
BACKEND_SERVICE="pos-backend"

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log() {
  echo -e "\${GREEN}[INFO]\${NC} \$1"
}

warn() {
  echo -e "\${YELLOW}[WARN]\${NC} \$1"
}

error() {
  echo -e "\${RED}[ERROR]\${NC} \$1"
  exit 1
}

# Verificar que rsync está instalado
if ! command -v rsync &> /dev/null; then
  error "rsync no está instalado. Por favor, instálelo antes de continuar."
fi

# Verificar que ssh está instalado
if ! command -v ssh &> /dev/null; then
  error "ssh no está instalado. Por favor, instálelo antes de continuar."
fi

# Crear directorios en el servidor
log "Creando directorios en el servidor..."
ssh \$SERVER_USER@\$SERVER_HOST "mkdir -p \$SERVER_PATH/public \$SERVER_PATH/api" || error "Error al crear directorios en el servidor"

# Copiar archivos del frontend
log "Copiando archivos del frontend al servidor..."
rsync -avz --delete public/ \$SERVER_USER@\$SERVER_HOST:\$SERVER_PATH/public/ || error "Error al copiar archivos del frontend"

# Copiar archivos del backend
log "Copiando archivos del backend al servidor..."
rsync -avz --delete api/ \$SERVER_USER@\$SERVER_HOST:\$SERVER_PATH/api/ || error "Error al copiar archivos del backend"

# Copiar configuración de Nginx
log "Copiando configuración de Nginx al servidor..."
ssh \$SERVER_USER@\$SERVER_HOST "sudo cp \$SERVER_PATH/config/nginx.conf /etc/nginx/sites-available/pos-system.conf" || warn "Error al copiar configuración de Nginx"
ssh \$SERVER_USER@\$SERVER_HOST "sudo ln -sf /etc/nginx/sites-available/pos-system.conf /etc/nginx/sites-enabled/" || warn "Error al habilitar sitio en Nginx"
ssh \$SERVER_USER@\$SERVER_HOST "sudo nginx -t && sudo systemctl reload nginx" || warn "Error al recargar Nginx"

# Instalar dependencias del backend
log "Instalando dependencias del backend en el servidor..."
ssh \$SERVER_USER@\$SERVER_HOST "cd \$SERVER_PATH/api && npm install --production" || error "Error al instalar dependencias del backend"

# Configurar servicio systemd para el backend
log "Configurando servicio systemd para el backend..."
cat > pos-backend.service << EOF2
[Unit]
Description=POS System Backend
After=network.target

[Service]
Type=simple
User=\$SERVER_USER
WorkingDirectory=\$SERVER_PATH/api
ExecStart=/usr/bin/node \$SERVER_PATH/api/dist/main.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF2

ssh \$SERVER_USER@\$SERVER_HOST "sudo cp pos-backend.service /etc/systemd/system/\$BACKEND_SERVICE.service" || warn "Error al copiar archivo de servicio"
ssh \$SERVER_USER@\$SERVER_HOST "sudo systemctl daemon-reload" || warn "Error al recargar systemd"
ssh \$SERVER_USER@\$SERVER_HOST "sudo systemctl enable \$BACKEND_SERVICE" || warn "Error al habilitar servicio"
ssh \$SERVER_USER@\$SERVER_HOST "sudo systemctl restart \$BACKEND_SERVICE" || warn "Error al reiniciar servicio"

log "Despliegue completado exitosamente."
log "Frontend: http://\$SERVER_HOST"
log "Backend API: http://\$SERVER_HOST/api"

exit 0
EOF

# Hacer ejecutable el script de despliegue
chmod +x "$DEPLOY_DIR/deploy-to-server.sh"

# Crear archivo README con instrucciones
cat > "$DEPLOY_DIR/README.md" << EOF
# Despliegue del Sistema POS

Este directorio contiene los archivos necesarios para desplegar el sistema POS en un servidor web.

## Estructura de directorios

- \`public/\`: Archivos estáticos del frontend
- \`api/\`: Archivos del backend
- \`config/\`: Archivos de configuración
- \`deploy-to-server.sh\`: Script para desplegar en el servidor

## Instrucciones de despliegue manual

### Requisitos del servidor

- Node.js 14 o superior
- Nginx
- PostgreSQL
- (Opcional) PM2 para gestión de procesos

### Pasos para el despliegue

1. Copiar los archivos del frontend a \`/var/www/pos-system/public\`
2. Copiar los archivos del backend a \`/var/www/pos-system/api\`
3. Instalar dependencias del backend: \`cd /var/www/pos-system/api && npm install --production\`
4. Configurar Nginx usando el archivo \`config/nginx.conf\`
5. Configurar un servicio systemd para el backend
6. Iniciar el servicio del backend

### Despliegue automatizado

Para un despliegue automatizado, edite el archivo \`deploy-to-server.sh\` con la información de su servidor y ejecute:

\`\`\`bash
./deploy-to-server.sh
\`\`\`

## Configuración adicional

### Base de datos

Asegúrese de que la base de datos PostgreSQL esté configurada correctamente y que las credenciales en el archivo \`.env\` sean correctas.

### HTTPS

Para habilitar HTTPS, configure Certbot con Let's Encrypt:

\`\`\`bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d su-dominio.com
\`\`\`

### Monitoreo

Para monitorear la aplicación, puede usar PM2:

\`\`\`bash
npm install -g pm2
cd /var/www/pos-system/api
pm2 start dist/main.js --name pos-backend
pm2 save
pm2 startup
\`\`\`
EOF

log "Preparación para despliegue completada exitosamente."
log "Archivos para despliegue disponibles en: $DEPLOY_DIR"
log "Para desplegar en un servidor, edite y ejecute: $DEPLOY_DIR/deploy-to-server.sh"

exit 0

