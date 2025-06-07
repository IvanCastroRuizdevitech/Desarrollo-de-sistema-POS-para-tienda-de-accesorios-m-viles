#!/bin/bash

# Script de instalación para el Sistema POS
# Fecha: 6 de junio de 2025
# Versión: 1.0

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ADVERTENCIA]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar requisitos
check_requirements() {
    print_message "Verificando requisitos del sistema..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado. Por favor, instale Node.js v14.0.0 o superior."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d 'v' -f 2)
    if [[ $(echo "$NODE_VERSION 14.0.0" | awk '{print ($1 < $2)}') -eq 1 ]]; then
        print_error "La versión de Node.js es $NODE_VERSION. Se requiere v14.0.0 o superior."
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado. Por favor, instale npm v6.0.0 o superior."
        exit 1
    fi
    
    NPM_VERSION=$(npm -v)
    if [[ $(echo "$NPM_VERSION 6.0.0" | awk '{print ($1 < $2)}') -eq 1 ]]; then
        print_error "La versión de npm es $NPM_VERSION. Se requiere v6.0.0 o superior."
        exit 1
    fi
    
    # Verificar PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL no está instalado. Se instalará durante el proceso."
    else
        PSQL_VERSION=$(psql --version | awk '{print $3}' | cut -d '.' -f 1)
        if [[ $PSQL_VERSION -lt 12 ]]; then
            print_warning "La versión de PostgreSQL es $PSQL_VERSION. Se recomienda v12.0 o superior."
        fi
    fi
    
    print_message "Requisitos verificados correctamente."
}

# Función para instalar PostgreSQL
install_postgresql() {
    print_message "Instalando PostgreSQL..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update
        sudo apt-get install -y postgresql postgresql-contrib
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install postgresql
        brew services start postgresql
    else
        print_error "Sistema operativo no soportado para la instalación automática de PostgreSQL."
        print_message "Por favor, instale PostgreSQL manualmente y luego ejecute este script nuevamente."
        exit 1
    fi
    
    print_message "PostgreSQL instalado correctamente."
}

# Función para configurar la base de datos
setup_database() {
    print_message "Configurando la base de datos..."
    
    # Crear usuario y base de datos
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo -u postgres psql -c "CREATE USER posadmin WITH PASSWORD 'posadmin123';" || true
        sudo -u postgres psql -c "CREATE DATABASE pos_db;" || true
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE pos_db TO posadmin;" || true
        sudo -u postgres psql -c "ALTER USER posadmin WITH SUPERUSER;" || true
        
        # Importar esquema
        sudo -u postgres psql -d pos_db -f ./backend/pos-backend/src/database/schema.sql || true
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        psql postgres -c "CREATE USER posadmin WITH PASSWORD 'posadmin123';" || true
        psql postgres -c "CREATE DATABASE pos_db;" || true
        psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE pos_db TO posadmin;" || true
        psql postgres -c "ALTER USER posadmin WITH SUPERUSER;" || true
        
        # Importar esquema
        psql -d pos_db -f ./backend/pos-backend/src/database/schema.sql || true
    else
        print_error "Sistema operativo no soportado para la configuración automática de la base de datos."
        print_message "Por favor, configure la base de datos manualmente según las instrucciones en el manual de instalación."
    fi
    
    print_message "Base de datos configurada correctamente."
}

# Función para instalar dependencias del backend
install_backend_dependencies() {
    print_message "Instalando dependencias del backend..."
    
    cd backend/pos-backend
    npm install
    
    print_message "Dependencias del backend instaladas correctamente."
}

# Función para configurar el backend
setup_backend() {
    print_message "Configurando el backend..."
    
    cd backend/pos-backend
    
    # Crear archivo .env si no existe
    if [ ! -f .env ]; then
        cat > .env << EOF
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=posadmin
DB_PASSWORD=posadmin123
DB_DATABASE=pos_db

# Configuración de JWT
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRATION=1d

# Configuración del servidor
PORT=3001
NODE_ENV=development
EOF
    fi
    
    # Compilar el backend
    npm run build
    
    print_message "Backend configurado correctamente."
}

# Función para instalar dependencias del frontend
install_frontend_dependencies() {
    print_message "Instalando dependencias del frontend..."
    
    cd ../../frontend/pos-frontend
    npm install
    
    print_message "Dependencias del frontend instaladas correctamente."
}

# Función para configurar el frontend
setup_frontend() {
    print_message "Configurando el frontend..."
    
    cd ../../frontend/pos-frontend
    
    # Crear archivo .env.development si no existe
    if [ ! -f .env.development ]; then
        cat > .env.development << EOF
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
EOF
    fi
    
    # Crear archivo .env.production si no existe
    if [ ! -f .env.production ]; then
        cat > .env.production << EOF
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
EOF
    fi
    
    print_message "Frontend configurado correctamente."
}

# Función para compilar el proyecto
build_project() {
    print_message "Compilando el proyecto..."
    
    # Compilar el backend
    cd ../../backend/pos-backend
    npm run build
    
    # Compilar el frontend
    cd ../../frontend/pos-frontend
    npm run build
    
    print_message "Proyecto compilado correctamente."
}

# Función para finalizar la instalación
finish_installation() {
    cd ../../
    
    print_message "Instalación completada correctamente."
    print_message "Para iniciar el sistema en modo desarrollo, ejecute: ./dev-start.sh"
    print_message "Para compilar la aplicación Electron, ejecute: cd frontend/pos-frontend && npm run electron:build"
    print_message "Para más información, consulte la documentación en el directorio docs/"
}

# Función principal
main() {
    print_message "Iniciando instalación del Sistema POS..."
    
    # Verificar requisitos
    check_requirements
    
    # Preguntar si se desea instalar PostgreSQL
    if ! command -v psql &> /dev/null; then
        read -p "¿Desea instalar PostgreSQL? (s/n): " install_psql
        if [[ $install_psql =~ ^[Ss]$ ]]; then
            install_postgresql
        else
            print_warning "Saltando la instalación de PostgreSQL. Asegúrese de instalarlo manualmente."
        fi
    fi
    
    # Preguntar si se desea configurar la base de datos
    read -p "¿Desea configurar la base de datos? (s/n): " setup_db
    if [[ $setup_db =~ ^[Ss]$ ]]; then
        setup_database
    else
        print_warning "Saltando la configuración de la base de datos. Asegúrese de configurarla manualmente."
    fi
    
    # Instalar dependencias y configurar el backend
    install_backend_dependencies
    setup_backend
    
    # Instalar dependencias y configurar el frontend
    install_frontend_dependencies
    setup_frontend
    
    # Preguntar si se desea compilar el proyecto
    read -p "¿Desea compilar el proyecto? (s/n): " build_proj
    if [[ $build_proj =~ ^[Ss]$ ]]; then
        build_project
    else
        print_warning "Saltando la compilación del proyecto. Puede compilarlo manualmente más tarde."
    fi
    
    # Finalizar la instalación
    finish_installation
}

# Ejecutar la función principal
main

