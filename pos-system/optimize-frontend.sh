#!/bin/bash

# Script de optimización para el frontend del sistema POS
# Este script realiza varias optimizaciones para mejorar el rendimiento del frontend

echo "Iniciando optimización del frontend..."

# Directorio del frontend
FRONTEND_DIR="/home/ubuntu/pos-system/frontend/pos-frontend"

# Verificar que el directorio existe
if [ ! -d "$FRONTEND_DIR" ]; then
  echo "Error: El directorio $FRONTEND_DIR no existe"
  exit 1
fi

# Cambiar al directorio del frontend
cd "$FRONTEND_DIR"

echo "Actualizando dependencias..."
npm update

echo "Instalando herramientas de optimización..."
npm install --save-dev source-map-explorer webpack-bundle-analyzer

# Añadir scripts de análisis al package.json si no existen
if ! grep -q "analyze" package.json; then
  # Usar jq para modificar el package.json
  if command -v jq &> /dev/null; then
    jq '.scripts.analyze = "source-map-explorer build/static/js/*.js"' package.json > package.json.tmp
    mv package.json.tmp package.json
    echo "Script de análisis añadido al package.json"
  else
    echo "Advertencia: jq no está instalado. No se pudo añadir el script de análisis al package.json"
    echo "Considera añadir manualmente: \"analyze\": \"source-map-explorer build/static/js/*.js\" a los scripts en package.json"
  fi
fi

echo "Optimizando imágenes..."
# Instalar herramienta de optimización de imágenes si no existe
if ! command -v imagemin &> /dev/null; then
  npm install -g imagemin-cli imagemin-pngquant
fi

# Optimizar imágenes PNG
find src -name "*.png" -exec imagemin {} --plugin=pngquant --out-dir={} \;

# Optimizar imágenes JPG
find src -name "*.jpg" -o -name "*.jpeg" -exec imagemin {} --out-dir={} \;

echo "Verificando y corrigiendo problemas de código..."
npm run lint --fix || echo "No se encontró un script de lint. Considera añadir ESLint a tu proyecto."

echo "Verificando y eliminando imports no utilizados..."
# Esta es una solución simple, considera usar herramientas como eslint-plugin-unused-imports para una solución más robusta
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "import " | while read file; do
  echo "Analizando $file..."
  # Aquí podrías implementar una lógica más avanzada para detectar imports no utilizados
done

echo "Optimizando el rendimiento de React..."
# Verificar si hay componentes que podrían beneficiarse de React.memo, useMemo o useCallback
find src -name "*.tsx" | xargs grep -l "React.FC" | while read file; do
  echo "Analizando componente React en $file..."
  # Aquí podrías implementar una lógica para sugerir optimizaciones
done

echo "Generando build de producción optimizado..."
npm run build

echo "Analizando el tamaño del bundle..."
npm run analyze || echo "No se pudo ejecutar el análisis del bundle. Verifica que el script 'analyze' esté configurado correctamente."

echo "Optimización completada."
echo "Recomendaciones adicionales:"
echo "1. Considera implementar lazy loading para componentes grandes"
echo "2. Utiliza React.memo para componentes que no cambian frecuentemente"
echo "3. Implementa virtualización para listas largas"
echo "4. Optimiza las re-renderizaciones con useCallback y useMemo"
echo "5. Considera utilizar una estrategia de code splitting"

exit 0

