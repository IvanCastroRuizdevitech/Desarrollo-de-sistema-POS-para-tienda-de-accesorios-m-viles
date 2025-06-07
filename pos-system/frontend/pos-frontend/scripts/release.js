/**
 * Script para facilitar la distribución de la aplicación
 * 
 * Uso:
 * node scripts/release.js [version] [platform]
 * 
 * Ejemplos:
 * node scripts/release.js patch
 * node scripts/release.js minor linux
 * node scripts/release.js major win
 * 
 * Versiones: patch, minor, major
 * Plataformas: all (default), linux, win, mac
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Obtener argumentos de la línea de comandos
const args = process.argv.slice(2);
const versionType = args[0] || 'patch';
const platform = args[1] || 'all';

// Validar tipo de versión
if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error('Tipo de versión no válido. Use: patch, minor o major');
  process.exit(1);
}

// Validar plataforma
if (!['all', 'linux', 'win', 'mac'].includes(platform)) {
  console.error('Plataforma no válida. Use: all, linux, win o mac');
  process.exit(1);
}

// Función para ejecutar comandos
function runCommand(command) {
  console.log(`Ejecutando: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error al ejecutar: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Incrementar versión
console.log(`\n🔄 Incrementando versión (${versionType})...`);
runCommand(`npm version ${versionType} --no-git-tag-version`);

// Leer la nueva versión
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const newVersion = packageJson.version;
console.log(`✅ Nueva versión: ${newVersion}\n`);

// Construir la aplicación React
console.log('🔨 Construyendo aplicación React...');
runCommand('npm run build');
console.log('✅ Aplicación React construida\n');

// Empaquetar con Electron Builder según la plataforma
console.log(`📦 Empaquetando aplicación para ${platform === 'all' ? 'todas las plataformas' : platform}...`);

switch (platform) {
  case 'linux':
    runCommand('npm run electron:build:linux');
    break;
  case 'win':
    runCommand('npm run electron:build:win');
    break;
  case 'mac':
    runCommand('npm run electron:build:mac');
    break;
  case 'all':
  default:
    runCommand('npm run electron:build');
    break;
}

console.log(`\n✅ Empaquetado completado para la versión ${newVersion}`);
console.log(`📁 Los archivos de distribución están disponibles en la carpeta 'dist'`);

