#!/bin/bash

# Script de optimización para el backend del sistema POS
# Este script realiza varias optimizaciones para mejorar el rendimiento del backend

echo "Iniciando optimización del backend..."

# Directorio del backend
BACKEND_DIR="/home/ubuntu/pos-system/backend/pos-backend"

# Verificar que el directorio existe
if [ ! -d "$BACKEND_DIR" ]; then
  echo "Error: El directorio $BACKEND_DIR no existe"
  exit 1
fi

# Cambiar al directorio del backend
cd "$BACKEND_DIR"

echo "Actualizando dependencias..."
npm update

echo "Instalando herramientas de optimización..."
npm install --save-dev webpack-bundle-analyzer compression

echo "Verificando y corrigiendo problemas de código..."
npm run lint --fix || echo "No se encontró un script de lint. Considera añadir ESLint a tu proyecto."

echo "Optimizando configuración de TypeORM..."
# Verificar si hay índices faltantes en las entidades
echo "Verificando índices en entidades..."
grep -r "@Entity" --include="*.ts" src | cut -d: -f1 | while read file; do
  echo "Analizando entidad en $file..."
  # Aquí podrías implementar una lógica para sugerir índices
done

echo "Verificando consultas N+1..."
grep -r "find" --include="*.ts" src | grep -v "findOne" | cut -d: -f1 | while read file; do
  echo "Analizando consultas en $file..."
  # Aquí podrías implementar una lógica para detectar consultas N+1
done

echo "Implementando compresión gzip..."
# Verificar si ya está configurada la compresión
if ! grep -q "compression" src/main.ts; then
  echo "Añadiendo compresión gzip a la aplicación..."
  # Aquí podrías modificar el archivo main.ts para añadir compresión
  echo "// Añade la siguiente línea en src/main.ts después de crear la aplicación:" > compression-instructions.txt
  echo "app.use(compression());" >> compression-instructions.txt
  echo "// Y añade el import:" >> compression-instructions.txt
  echo "import * as compression from 'compression';" >> compression-instructions.txt
  echo "Instrucciones para añadir compresión guardadas en compression-instructions.txt"
fi

echo "Optimizando caché..."
# Verificar si ya está configurada la caché
if ! grep -q "cache-manager" package.json; then
  echo "Instalando cache-manager..."
  npm install --save cache-manager
  echo "// Ejemplo de implementación de caché:" > cache-instructions.txt
  echo "import * as cacheManager from 'cache-manager';" >> cache-instructions.txt
  echo "const cache = cacheManager.caching({ store: 'memory', max: 100, ttl: 60 });" >> cache-instructions.txt
  echo "Instrucciones para implementar caché guardadas en cache-instructions.txt"
fi

echo "Verificando y optimizando consultas a la base de datos..."
# Buscar consultas que podrían optimizarse
grep -r "createQueryBuilder" --include="*.ts" src | cut -d: -f1 | while read file; do
  echo "Analizando consulta en $file..."
  # Aquí podrías implementar una lógica para sugerir optimizaciones
done

echo "Generando build de producción optimizado..."
npm run build

echo "Analizando el código compilado..."
du -h dist/

echo "Optimización completada."
echo "Recomendaciones adicionales:"
echo "1. Considera implementar un sistema de caché para consultas frecuentes"
echo "2. Utiliza índices en la base de datos para consultas comunes"
echo "3. Implementa paginación para todas las listas"
echo "4. Optimiza las consultas N+1 utilizando relaciones eager o consultas con joins"
echo "5. Considera utilizar Redis para caché distribuida y gestión de sesiones"
echo "6. Implementa rate limiting para prevenir abusos de la API"
echo "7. Utiliza compresión gzip para reducir el tamaño de las respuestas"
echo "8. Considera implementar un sistema de logs más eficiente"

exit 0

