#!/bin/bash

# Script para optimizar y corregir errores en el sistema POS
# Este script realiza varias optimizaciones y correcciones en el backend y frontend

# Colores para la salida
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Optimización y corrección de errores del Sistema POS ===${NC}"

# Directorio del proyecto
BACKEND_DIR="/home/ubuntu/pos-system/backend/pos-backend"
FRONTEND_DIR="/home/ubuntu/pos-system/frontend/pos-frontend"

# Función para verificar si un comando fue exitoso
check_success() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ $1${NC}"
  else
    echo -e "${RED}✗ $1${NC}"
    exit 1
  fi
}

# 0. Ejecutar scripts específicos de optimización
echo -e "\n${BLUE}Ejecutando scripts específicos de optimización...${NC}"

# 0.1 Ejecutar script de optimización del backend
echo -e "${YELLOW}Ejecutando script de optimización del backend...${NC}"
chmod +x /home/ubuntu/pos-system/optimize-backend.sh
/home/ubuntu/pos-system/optimize-backend.sh
check_success "Optimización específica del backend"

# 0.2 Ejecutar script de optimización del frontend
echo -e "${YELLOW}Ejecutando script de optimización del frontend...${NC}"
chmod +x /home/ubuntu/pos-system/optimize-frontend.sh
/home/ubuntu/pos-system/optimize-frontend.sh
check_success "Optimización específica del frontend"

# 1. Optimizar el backend
echo -e "\n${BLUE}Optimizando el backend...${NC}"

# 1.1 Limpiar dependencias no utilizadas
echo -e "${YELLOW}Limpiando dependencias no utilizadas...${NC}"
cd $BACKEND_DIR && npm prune
check_success "Limpieza de dependencias del backend"

# 1.2 Compilar el backend en modo producción
echo -e "${YELLOW}Compilando el backend en modo producción...${NC}"
cd $BACKEND_DIR && npm run build
check_success "Compilación del backend"

# 1.3 Optimizar la configuración de TypeORM
echo -e "${YELLOW}Optimizando la configuración de TypeORM...${NC}"
cat > $BACKEND_DIR/src/config/typeorm.config.ts << EOL
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'posadmin',
  password: process.env.DB_PASSWORD || 'posadmin123',
  database: process.env.DB_DATABASE || 'pos_db',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  cache: {
    duration: 30000, // 30 segundos de caché
  },
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false,
  } : false,
  extra: {
    max: 20, // máximo de conexiones en el pool
    connectionTimeoutMillis: 10000, // tiempo de espera para conexión
  },
};
EOL
check_success "Optimización de TypeORM"

# 1.4 Implementar compresión en el backend
echo -e "${YELLOW}Implementando compresión en el backend...${NC}"
cd $BACKEND_DIR && npm install --save compression
check_success "Instalación de compression"

# Actualizar main.ts para usar compresión
sed -i '/import { NestFactory } from/a import * as compression from '\''compression'\'';\' $BACKEND_DIR/src/main.ts
sed -i '/app.enableCors/a \  app.use(compression());' $BACKEND_DIR/src/main.ts
check_success "Configuración de compresión"

# 2. Optimizar el frontend
echo -e "\n${BLUE}Optimizando el frontend...${NC}"

# 2.1 Limpiar dependencias no utilizadas
echo -e "${YELLOW}Limpiando dependencias no utilizadas...${NC}"
cd $FRONTEND_DIR && npm prune
check_success "Limpieza de dependencias del frontend"

# 2.2 Optimizar importaciones de Material UI
echo -e "${YELLOW}Optimizando importaciones de Material UI...${NC}"
find $FRONTEND_DIR/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/@mui\/material\/[A-Za-z]*/@mui\/material/g'
check_success "Optimización de importaciones"

# 2.3 Configurar React para producción
echo -e "${YELLOW}Configurando React para producción...${NC}"
cat > $FRONTEND_DIR/.env.production << EOL
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
EOL
check_success "Configuración de React para producción"

# 2.4 Compilar el frontend en modo producción
echo -e "${YELLOW}Compilando el frontend en modo producción...${NC}"
cd $FRONTEND_DIR && npm run build
check_success "Compilación del frontend"

# 3. Optimizar la base de datos
echo -e "\n${BLUE}Optimizando la base de datos...${NC}"

# 3.1 Crear índices para mejorar el rendimiento
echo -e "${YELLOW}Creando índices para mejorar el rendimiento...${NC}"
sudo -u postgres psql -d pos_db -c "
-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_inventario_producto_tienda ON inventario(producto_id, tienda_id);
CREATE INDEX IF NOT EXISTS idx_kardex_producto_fecha ON kardex(producto_id, fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_usuario ON ventas(usuario_id);
"
check_success "Creación de índices"

# 3.2 Optimizar consultas
echo -e "${YELLOW}Optimizando consultas...${NC}"
sudo -u postgres psql -d pos_db -c "
-- Analizar tablas para optimizar el planificador de consultas
ANALYZE;
"
check_success "Optimización de consultas"

# 4. Verificar y corregir errores comunes
echo -e "\n${BLUE}Verificando y corrigiendo errores comunes...${NC}"

# 4.1 Verificar errores de lint en el backend
echo -e "${YELLOW}Verificando errores de lint en el backend...${NC}"
cd $BACKEND_DIR && npm run lint
check_success "Verificación de lint en el backend"

# 4.2 Verificar errores de lint en el frontend
echo -e "${YELLOW}Verificando errores de lint en el frontend...${NC}"
cd $FRONTEND_DIR && npm run lint || echo -e "${YELLOW}⚠️ Algunos errores de lint pueden requerir corrección manual${NC}"

# 4.3 Ejecutar pruebas del sistema de notificaciones
echo -e "${YELLOW}Ejecutando pruebas del sistema de notificaciones...${NC}"
cd $FRONTEND_DIR && npm test -- src/test/notification.test.js || echo -e "${YELLOW}⚠️ Algunas pruebas pueden requerir configuración adicional${NC}"

# 5. Crear script de inicio para producción
echo -e "\n${BLUE}Creando script de inicio para producción...${NC}"
cat > /home/ubuntu/pos-system/start-production.sh << EOL
#!/bin/bash

# Script para iniciar el sistema POS en modo producción

# Colores para la salida
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "\${GREEN}=== Iniciando Sistema POS en modo producción ===${NC}"

# Verificar si tmux está instalado
if ! command -v tmux &> /dev/null; then
    echo -e "\${YELLOW}tmux no está instalado. Instalando...${NC}"
    sudo apt-get update && sudo apt-get install -y tmux
fi

# Crear una nueva sesión de tmux
SESSION_NAME="pos-system-prod"
tmux new-session -d -s \$SESSION_NAME

# Dividir la ventana horizontalmente
tmux split-window -h -t \$SESSION_NAME

# Iniciar el backend en el panel izquierdo
tmux send-keys -t \$SESSION_NAME:0.0 "cd /home/ubuntu/pos-system/backend/pos-backend && echo -e '\${BLUE}Iniciando backend en modo producción...${NC}' && npm run start:prod" C-m

# Iniciar el frontend en el panel derecho
tmux send-keys -t \$SESSION_NAME:0.1 "cd /home/ubuntu/pos-system/frontend/pos-frontend && echo -e '\${BLUE}Iniciando frontend en modo producción...${NC}' && npx serve -s build -l 3000" C-m

# Adjuntar a la sesión
echo -e "\${GREEN}Sistema POS iniciado en modo producción. Presiona Ctrl+B y luego D para desacoplar la sesión.${NC}"
tmux attach-session -t \$SESSION_NAME
EOL
chmod +x /home/ubuntu/pos-system/start-production.sh
check_success "Creación de script de inicio para producción"

echo -e "\n${GREEN}¡Optimización y corrección de errores completada!${NC}"
echo -e "Para iniciar el sistema en modo producción, ejecute: ${YELLOW}./start-production.sh${NC}"

