/**
 * Script para probar la compatibilidad del sistema POS en entornos web y Electron
 * 
 * Este script realiza pruebas básicas de funcionalidad en ambos entornos
 * para verificar que la aplicación funciona correctamente en cada uno.
 */

const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// Configuración
const config = {
  backendUrl: 'http://localhost:3001/api',
  webFrontendUrl: 'http://localhost:3000',
  electronAppPath: path.join(__dirname, 'frontend', 'pos-frontend'),
  testResults: path.join(__dirname, 'test-results.json'),
};

// Credenciales de prueba
const testCredentials = {
  correo: 'admin@example.com',
  contraseña: 'admin123',
};

// Resultados de las pruebas
const results = {
  timestamp: new Date().toISOString(),
  backend: {
    status: 'pending',
    details: {},
  },
  web: {
    status: 'pending',
    details: {},
  },
  electron: {
    status: 'pending',
    details: {},
  },
};

/**
 * Función principal
 */
async function runTests() {
  console.log('Iniciando pruebas de compatibilidad...');
  
  try {
    // Probar backend
    await testBackend();
    
    // Probar frontend web
    await testWebFrontend();
    
    // Probar aplicación Electron
    await testElectronApp();
    
    // Guardar resultados
    fs.writeFileSync(config.testResults, JSON.stringify(results, null, 2));
    
    // Mostrar resumen
    console.log('\n=== RESUMEN DE PRUEBAS ===');
    console.log(`Backend: ${results.backend.status}`);
    console.log(`Web: ${results.web.status}`);
    console.log(`Electron: ${results.electron.status}`);
    console.log('\nResultados guardados en:', config.testResults);
  } catch (error) {
    console.error('Error al ejecutar pruebas:', error);
    process.exit(1);
  }
}

/**
 * Probar el backend
 */
async function testBackend() {
  console.log('\n=== PROBANDO BACKEND ===');
  
  try {
    // Verificar que el backend está en ejecución
    console.log('Verificando estado del backend...');
    const healthResponse = await axios.get(`${config.backendUrl}/health`);
    results.backend.details.health = {
      status: 'success',
      message: `Estado: ${healthResponse.data.status}`,
    };
    console.log('✅ Backend en ejecución');
    
    // Probar autenticación
    console.log('Probando autenticación...');
    try {
      const authResponse = await axios.post(`${config.backendUrl}/auth/login`, testCredentials);
      results.backend.details.auth = {
        status: 'success',
        message: 'Autenticación exitosa',
      };
      console.log('✅ Autenticación exitosa');
    } catch (error) {
      results.backend.details.auth = {
        status: 'error',
        message: `Error: ${error.response?.data?.message || error.message}`,
      };
      console.log('❌ Error en autenticación');
    }
    
    // Probar CORS
    console.log('Probando configuración CORS...');
    try {
      const corsResponse = await axios.options(`${config.backendUrl}/auth/login`, {
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
        },
      });
      
      const corsHeaders = corsResponse.headers;
      const allowOrigin = corsHeaders['access-control-allow-origin'];
      const allowMethods = corsHeaders['access-control-allow-methods'];
      
      if (allowOrigin && allowMethods) {
        results.backend.details.cors = {
          status: 'success',
          message: `CORS configurado correctamente: ${allowOrigin}`,
        };
        console.log('✅ CORS configurado correctamente');
      } else {
        results.backend.details.cors = {
          status: 'warning',
          message: 'Respuesta CORS incompleta',
        };
        console.log('⚠️ Respuesta CORS incompleta');
      }
    } catch (error) {
      results.backend.details.cors = {
        status: 'error',
        message: `Error: ${error.message}`,
      };
      console.log('❌ Error en configuración CORS');
    }
    
    // Evaluar resultado general del backend
    const hasErrors = Object.values(results.backend.details).some(detail => detail.status === 'error');
    const hasWarnings = Object.values(results.backend.details).some(detail => detail.status === 'warning');
    
    if (hasErrors) {
      results.backend.status = 'error';
    } else if (hasWarnings) {
      results.backend.status = 'warning';
    } else {
      results.backend.status = 'success';
    }
    
    console.log(`Backend: ${results.backend.status}`);
  } catch (error) {
    results.backend.status = 'error';
    results.backend.details.general = {
      status: 'error',
      message: `Error: ${error.message}`,
    };
    console.log('❌ Error al probar backend:', error.message);
  }
}

/**
 * Probar el frontend web
 */
async function testWebFrontend() {
  console.log('\n=== PROBANDO FRONTEND WEB ===');
  
  try {
    // Verificar que el frontend web está en ejecución
    console.log('Verificando estado del frontend web...');
    try {
      const response = await axios.get(config.webFrontendUrl);
      results.web.details.health = {
        status: 'success',
        message: 'Frontend web en ejecución',
      };
      console.log('✅ Frontend web en ejecución');
    } catch (error) {
      results.web.details.health = {
        status: 'warning',
        message: `No se pudo conectar al frontend web: ${error.message}`,
      };
      console.log('⚠️ No se pudo conectar al frontend web');
    }
    
    // Nota: Para pruebas más completas del frontend web, se necesitaría un navegador automatizado
    // como Puppeteer o Playwright. Aquí solo verificamos que el servidor esté en ejecución.
    
    results.web.status = results.web.details.health.status;
    console.log(`Frontend web: ${results.web.status}`);
  } catch (error) {
    results.web.status = 'error';
    results.web.details.general = {
      status: 'error',
      message: `Error: ${error.message}`,
    };
    console.log('❌ Error al probar frontend web:', error.message);
  }
}

/**
 * Probar la aplicación Electron
 */
async function testElectronApp() {
  console.log('\n=== PROBANDO APLICACIÓN ELECTRON ===');
  
  try {
    // Verificar que la aplicación Electron está instalada
    console.log('Verificando instalación de Electron...');
    try {
      const packageJsonPath = path.join(config.electronAppPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      if (packageJson.dependencies.electron) {
        results.electron.details.installation = {
          status: 'success',
          message: `Electron ${packageJson.dependencies.electron} instalado`,
        };
        console.log(`✅ Electron ${packageJson.dependencies.electron} instalado`);
      } else {
        results.electron.details.installation = {
          status: 'error',
          message: 'Electron no está instalado',
        };
        console.log('❌ Electron no está instalado');
      }
    } catch (error) {
      results.electron.details.installation = {
        status: 'error',
        message: `Error al verificar instalación: ${error.message}`,
      };
      console.log('❌ Error al verificar instalación de Electron');
    }
    
    // Verificar scripts de construcción
    console.log('Verificando scripts de construcción...');
    try {
      const packageJsonPath = path.join(config.electronAppPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      if (packageJson.scripts && (packageJson.scripts['electron:build'] || packageJson.scripts.build)) {
        results.electron.details.build = {
          status: 'success',
          message: 'Scripts de construcción configurados',
        };
        console.log('✅ Scripts de construcción configurados');
      } else {
        results.electron.details.build = {
          status: 'warning',
          message: 'Scripts de construcción no encontrados',
        };
        console.log('⚠️ Scripts de construcción no encontrados');
      }
    } catch (error) {
      results.electron.details.build = {
        status: 'error',
        message: `Error al verificar scripts: ${error.message}`,
      };
      console.log('❌ Error al verificar scripts de construcción');
    }
    
    // Evaluar resultado general de Electron
    const hasErrors = Object.values(results.electron.details).some(detail => detail.status === 'error');
    const hasWarnings = Object.values(results.electron.details).some(detail => detail.status === 'warning');
    
    if (hasErrors) {
      results.electron.status = 'error';
    } else if (hasWarnings) {
      results.electron.status = 'warning';
    } else {
      results.electron.status = 'success';
    }
    
    console.log(`Aplicación Electron: ${results.electron.status}`);
  } catch (error) {
    results.electron.status = 'error';
    results.electron.details.general = {
      status: 'error',
      message: `Error: ${error.message}`,
    };
    console.log('❌ Error al probar aplicación Electron:', error.message);
  }
}

// Ejecutar pruebas
runTests();

