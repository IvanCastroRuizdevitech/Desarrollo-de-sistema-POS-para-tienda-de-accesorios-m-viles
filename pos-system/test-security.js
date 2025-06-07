/**
 * Script para realizar pruebas de seguridad en el sistema POS
 * 
 * Este script realiza pruebas básicas de seguridad en el backend y frontend
 * para verificar que la aplicación cumple con las mejores prácticas de seguridad.
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
  testResults: path.join(__dirname, 'security-test-results.json'),
};

// Resultados de las pruebas
const results = {
  timestamp: new Date().toISOString(),
  backend: {
    status: 'pending',
    details: {},
  },
  frontend: {
    status: 'pending',
    details: {},
  },
};

/**
 * Función principal
 */
async function runTests() {
  console.log('Iniciando pruebas de seguridad...');
  
  try {
    // Probar seguridad del backend
    await testBackendSecurity();
    
    // Probar seguridad del frontend
    await testFrontendSecurity();
    
    // Guardar resultados
    fs.writeFileSync(config.testResults, JSON.stringify(results, null, 2));
    
    // Mostrar resumen
    console.log('\n=== RESUMEN DE PRUEBAS DE SEGURIDAD ===');
    console.log(`Backend: ${results.backend.status}`);
    console.log(`Frontend: ${results.frontend.status}`);
    console.log('\nResultados guardados en:', config.testResults);
  } catch (error) {
    console.error('Error al ejecutar pruebas de seguridad:', error);
    process.exit(1);
  }
}

/**
 * Probar la seguridad del backend
 */
async function testBackendSecurity() {
  console.log('\n=== PROBANDO SEGURIDAD DEL BACKEND ===');
  
  try {
    // Verificar cabeceras de seguridad
    console.log('Verificando cabeceras de seguridad...');
    try {
      const response = await axios.get(`${config.backendUrl}/health`);
      const headers = response.headers;
      
      // Verificar X-Content-Type-Options
      if (headers['x-content-type-options'] === 'nosniff') {
        results.backend.details.xContentTypeOptions = {
          status: 'success',
          message: 'X-Content-Type-Options configurado correctamente',
        };
        console.log('✅ X-Content-Type-Options configurado correctamente');
      } else {
        results.backend.details.xContentTypeOptions = {
          status: 'warning',
          message: 'X-Content-Type-Options no configurado',
        };
        console.log('⚠️ X-Content-Type-Options no configurado');
      }
      
      // Verificar X-Frame-Options
      if (headers['x-frame-options']) {
        results.backend.details.xFrameOptions = {
          status: 'success',
          message: `X-Frame-Options configurado: ${headers['x-frame-options']}`,
        };
        console.log(`✅ X-Frame-Options configurado: ${headers['x-frame-options']}`);
      } else {
        results.backend.details.xFrameOptions = {
          status: 'warning',
          message: 'X-Frame-Options no configurado',
        };
        console.log('⚠️ X-Frame-Options no configurado');
      }
      
      // Verificar Content-Security-Policy
      if (headers['content-security-policy']) {
        results.backend.details.contentSecurityPolicy = {
          status: 'success',
          message: 'Content-Security-Policy configurado',
        };
        console.log('✅ Content-Security-Policy configurado');
      } else {
        results.backend.details.contentSecurityPolicy = {
          status: 'warning',
          message: 'Content-Security-Policy no configurado',
        };
        console.log('⚠️ Content-Security-Policy no configurado');
      }
      
      // Verificar Strict-Transport-Security
      if (headers['strict-transport-security']) {
        results.backend.details.strictTransportSecurity = {
          status: 'success',
          message: `Strict-Transport-Security configurado: ${headers['strict-transport-security']}`,
        };
        console.log(`✅ Strict-Transport-Security configurado`);
      } else {
        results.backend.details.strictTransportSecurity = {
          status: 'warning',
          message: 'Strict-Transport-Security no configurado',
        };
        console.log('⚠️ Strict-Transport-Security no configurado');
      }
    } catch (error) {
      results.backend.details.securityHeaders = {
        status: 'error',
        message: `Error al verificar cabeceras: ${error.message}`,
      };
      console.log('❌ Error al verificar cabeceras de seguridad');
    }
    
    // Probar protección CSRF
    console.log('Probando protección CSRF...');
    try {
      // Intentar una solicitud POST sin token CSRF
      try {
        await axios.post(`${config.backendUrl}/auth/login`, {
          correo: 'test@example.com',
          contraseña: 'password',
        }, {
          headers: {
            'Origin': 'http://malicious-site.com',
          },
        });
        
        results.backend.details.csrf = {
          status: 'warning',
          message: 'No se detectó protección CSRF',
        };
        console.log('⚠️ No se detectó protección CSRF');
      } catch (error) {
        // Si la solicitud falla con un error 403 o mensaje relacionado con CSRF, es buena señal
        if (error.response && (error.response.status === 403 || 
            error.response.data?.message?.toLowerCase().includes('csrf'))) {
          results.backend.details.csrf = {
            status: 'success',
            message: 'Protección CSRF detectada',
          };
          console.log('✅ Protección CSRF detectada');
        } else {
          results.backend.details.csrf = {
            status: 'warning',
            message: 'Resultado de prueba CSRF no concluyente',
          };
          console.log('⚠️ Resultado de prueba CSRF no concluyente');
        }
      }
    } catch (error) {
      results.backend.details.csrf = {
        status: 'error',
        message: `Error al probar protección CSRF: ${error.message}`,
      };
      console.log('❌ Error al probar protección CSRF');
    }
    
    // Probar autenticación
    console.log('Probando seguridad de autenticación...');
    try {
      // Intentar acceder a un endpoint protegido sin token
      try {
        await axios.get(`${config.backendUrl}/usuarios`);
        
        results.backend.details.authentication = {
          status: 'error',
          message: 'Se permitió acceso sin autenticación',
        };
        console.log('❌ Se permitió acceso sin autenticación');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          results.backend.details.authentication = {
            status: 'success',
            message: 'Autenticación requerida correctamente',
          };
          console.log('✅ Autenticación requerida correctamente');
        } else {
          results.backend.details.authentication = {
            status: 'warning',
            message: `Respuesta inesperada: ${error.response?.status || error.message}`,
          };
          console.log('⚠️ Respuesta inesperada al probar autenticación');
        }
      }
    } catch (error) {
      results.backend.details.authentication = {
        status: 'error',
        message: `Error al probar autenticación: ${error.message}`,
      };
      console.log('❌ Error al probar autenticación');
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
    
    console.log(`Seguridad del backend: ${results.backend.status}`);
  } catch (error) {
    results.backend.status = 'error';
    results.backend.details.general = {
      status: 'error',
      message: `Error: ${error.message}`,
    };
    console.log('❌ Error al probar seguridad del backend:', error.message);
  }
}

/**
 * Probar la seguridad del frontend
 */
async function testFrontendSecurity() {
  console.log('\n=== PROBANDO SEGURIDAD DEL FRONTEND ===');
  
  try {
    // Verificar cabeceras de seguridad del frontend
    console.log('Verificando cabeceras de seguridad del frontend...');
    try {
      const response = await axios.get(config.webFrontendUrl);
      const headers = response.headers;
      
      // Verificar X-Content-Type-Options
      if (headers['x-content-type-options'] === 'nosniff') {
        results.frontend.details.xContentTypeOptions = {
          status: 'success',
          message: 'X-Content-Type-Options configurado correctamente',
        };
        console.log('✅ X-Content-Type-Options configurado correctamente');
      } else {
        results.frontend.details.xContentTypeOptions = {
          status: 'warning',
          message: 'X-Content-Type-Options no configurado',
        };
        console.log('⚠️ X-Content-Type-Options no configurado');
      }
      
      // Verificar Content-Security-Policy
      if (headers['content-security-policy']) {
        results.frontend.details.contentSecurityPolicy = {
          status: 'success',
          message: 'Content-Security-Policy configurado',
        };
        console.log('✅ Content-Security-Policy configurado');
      } else {
        results.frontend.details.contentSecurityPolicy = {
          status: 'warning',
          message: 'Content-Security-Policy no configurado',
        };
        console.log('⚠️ Content-Security-Policy no configurado');
      }
    } catch (error) {
      results.frontend.details.securityHeaders = {
        status: 'warning',
        message: `No se pudo conectar al frontend: ${error.message}`,
      };
      console.log('⚠️ No se pudo conectar al frontend');
    }
    
    // Verificar configuración de cookies
    console.log('Verificando configuración de cookies...');
    try {
      const response = await axios.get(config.webFrontendUrl);
      const cookies = response.headers['set-cookie'] || [];
      
      if (cookies.length === 0) {
        results.frontend.details.cookies = {
          status: 'info',
          message: 'No se detectaron cookies en la respuesta inicial',
        };
        console.log('ℹ️ No se detectaron cookies en la respuesta inicial');
      } else {
        // Verificar atributos de seguridad en las cookies
        const secureCookies = cookies.every(cookie => 
          cookie.includes('Secure') && 
          cookie.includes('HttpOnly') && 
          (cookie.includes('SameSite=Strict') || cookie.includes('SameSite=Lax'))
        );
        
        if (secureCookies) {
          results.frontend.details.cookies = {
            status: 'success',
            message: 'Cookies configuradas con atributos de seguridad',
          };
          console.log('✅ Cookies configuradas con atributos de seguridad');
        } else {
          results.frontend.details.cookies = {
            status: 'warning',
            message: 'Cookies sin atributos de seguridad completos',
          };
          console.log('⚠️ Cookies sin atributos de seguridad completos');
        }
      }
    } catch (error) {
      results.frontend.details.cookies = {
        status: 'warning',
        message: `Error al verificar cookies: ${error.message}`,
      };
      console.log('⚠️ Error al verificar cookies');
    }
    
    // Evaluar resultado general del frontend
    const hasErrors = Object.values(results.frontend.details).some(detail => detail.status === 'error');
    const hasWarnings = Object.values(results.frontend.details).some(detail => detail.status === 'warning');
    
    if (hasErrors) {
      results.frontend.status = 'error';
    } else if (hasWarnings) {
      results.frontend.status = 'warning';
    } else {
      results.frontend.status = 'success';
    }
    
    console.log(`Seguridad del frontend: ${results.frontend.status}`);
  } catch (error) {
    results.frontend.status = 'error';
    results.frontend.details.general = {
      status: 'error',
      message: `Error: ${error.message}`,
    };
    console.log('❌ Error al probar seguridad del frontend:', error.message);
  }
}

// Ejecutar pruebas
runTests();

