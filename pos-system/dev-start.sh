#!/bin/bash

# Script para iniciar el sistema POS en modo desarrollo
# Este script inicia tanto el backend como el frontend en terminales separadas

# Colores para la salida
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Iniciando Sistema POS en modo desarrollo ===${NC}"

# Verificar si tmux está instalado
if ! command -v tmux &> /dev/null; then
    echo -e "${YELLOW}tmux no está instalado. Instalando...${NC}"
    sudo apt-get update && sudo apt-get install -y tmux
fi

# Crear una nueva sesión de tmux
SESSION_NAME="pos-system"
tmux new-session -d -s $SESSION_NAME

# Dividir la ventana horizontalmente
tmux split-window -h -t $SESSION_NAME

# Iniciar el backend en el panel izquierdo
tmux send-keys -t $SESSION_NAME:0.0 "cd /home/ubuntu/pos-system/backend/pos-backend && echo -e '${BLUE}Iniciando backend...${NC}' && npm run start:dev" C-m

# Iniciar el frontend en el panel derecho
tmux send-keys -t $SESSION_NAME:0.1 "cd /home/ubuntu/pos-system/frontend/pos-frontend && echo -e '${BLUE}Iniciando frontend...${NC}' && npm run electron:dev" C-m

# Adjuntar a la sesión
echo -e "${GREEN}Sistema POS iniciado. Presiona Ctrl+B y luego D para desacoplar la sesión.${NC}"
tmux attach-session -t $SESSION_NAME

