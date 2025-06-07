#!/bin/bash

# Script para ejecutar pruebas de integración del sistema POS

# Colores para la salida
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Ejecutando pruebas de integración del Sistema POS ===${NC}"

# Ir al directorio del backend
cd /home/ubuntu/pos-system/backend/pos-backend

# Ejecutar las pruebas de integración
echo -e "${BLUE}Ejecutando pruebas de integración...${NC}"
npm run test:integration

# Verificar el resultado
if [ $? -eq 0 ]; then
  echo -e "${GREEN}¡Todas las pruebas de integración pasaron correctamente!${NC}"
else
  echo -e "${RED}Algunas pruebas de integración fallaron. Revisa los errores arriba.${NC}"
fi

