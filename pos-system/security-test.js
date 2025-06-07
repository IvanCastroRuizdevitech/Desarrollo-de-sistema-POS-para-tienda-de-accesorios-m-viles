/**
 * Script para pruebas de seguridad básicas del Sistema POS
 * 
 * Este script realiza pruebas de seguridad básicas en el backend
 * 
 * Uso:
 * node security-test.js
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuración
const API_URL = 'http://localhost:3001/api';
const RESULTS_DIR = path.join(__dirname, 'security-results');

// Crear directorio para resultados si no existe
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR);
}

// Función para guardar resultados
function saveResults(testName, results) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(RESULTS_DIR, `${testName}-${timestamp}.json`);
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
  console.log(`Resultados guardados en ${filePath}`);
}

// Función para realizar solicitudes HTTP
async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data
    };
  } catch (error) {
    return {
      error: error.message
    };
  }
}

// Pruebas de seguridad
const securityTests = {
  // Prueba de autenticación
  async testAuthentication() {
    console.log('\n1. Prueba de autenticación');
    
    const results = {
      validCredentials: null,
      invalidCredentials: null,
      emptyCredentials: null,
      sqlInjection: null
    };
    
    // Prueba con credenciales válidas
    console.log('- Probando con credenciales válidas');
    results.validCredentials = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    // Prueba con credenciales inválidas
    console.log('- Probando con credenciales inválidas');
    results.invalidCredentials = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'wrongpassword'
      })
    });
    
    // Prueba con credenciales vacías
    console.log('- Probando con credenciales vacías');
    results.emptyCredentials = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: '',
        password: ''
      })
    });
    
    // Prueba con intento de SQL injection
    console.log('- Probando con intento de SQL injection');
    results.sqlInjection = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "' OR 1=1 --",
        password: "' OR 1=1 --"
      })
    });
    
    // Análisis de resultados
    const analysis = {
      authenticationWorks: results.validCredentials.status === 200,
      rejectsInvalidCredentials: results.invalidCredentials.status !== 200,
      rejectsEmptyCredentials: results.emptyCredentials.status !== 200,
      resistsSqlInjection: results.sqlInjection.status !== 200
    };
    
    results.analysis = analysis;
    saveResults('authentication', results);
    
    return {
      name: 'Prueba de autenticación',
      passed: Object.values(analysis).every(result => result === true),
      details: analysis
    };
  },
  
  // Prueba de autorización
  async testAuthorization() {
    console.log('\n2. Prueba de autorización');
    
    const results = {
      withoutToken: null,
      withInvalidToken: null,
      withValidToken: null
    };
    
    // Obtener token válido
    let token = '';
    const authResponse = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    if (authResponse.status === 200 && authResponse.data && authResponse.data.data) {
      token = authResponse.data.data.token;
    }
    
    // Prueba sin token
    console.log('- Probando acceso sin token');
    results.withoutToken = await makeRequest('/usuarios');
    
    // Prueba con token inválido
    console.log('- Probando acceso con token inválido');
    results.withInvalidToken = await makeRequest('/usuarios', {
      headers: { 'Authorization': 'Bearer invalid_token_here' }
    });
    
    // Prueba con token válido
    if (token) {
      console.log('- Probando acceso con token válido');
      results.withValidToken = await makeRequest('/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
    
    // Análisis de resultados
    const analysis = {
      rejectsRequestsWithoutToken: results.withoutToken.status === 401,
      rejectsInvalidTokens: results.withInvalidToken.status === 401,
      acceptsValidToken: token ? results.withValidToken.status === 200 : null
    };
    
    results.analysis = analysis;
    saveResults('authorization', results);
    
    return {
      name: 'Prueba de autorización',
      passed: Object.values(analysis).every(result => result === true || result === null),
      details: analysis
    };
  },
  
  // Prueba de validación de entrada
  async testInputValidation() {
    console.log('\n3. Prueba de validación de entrada');
    
    // Obtener token válido
    let token = '';
    const authResponse = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    if (authResponse.status === 200 && authResponse.data && authResponse.data.data) {
      token = authResponse.data.data.token;
    }
    
    if (!token) {
      console.log('No se pudo obtener token para pruebas de validación');
      return {
        name: 'Prueba de validación de entrada',
        passed: false,
        details: { error: 'No se pudo obtener token para pruebas' }
      };
    }
    
    const results = {
      validInput: null,
      missingRequiredFields: null,
      invalidDataTypes: null,
      xssAttempt: null
    };
    
    // Prueba con datos válidos
    console.log('- Probando con datos válidos');
    results.validInput = await makeRequest('/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre: 'Producto de Prueba',
        descripcion: 'Descripción del producto de prueba',
        codigo: 'TEST001',
        precio_compra: 10.5,
        precio_venta: 15.75,
        stock_minimo: 5,
        unidad_id: 1,
        impuesto_id: 1
      })
    });
    
    // Prueba con campos requeridos faltantes
    console.log('- Probando con campos requeridos faltantes');
    results.missingRequiredFields = await makeRequest('/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        descripcion: 'Descripción sin nombre'
      })
    });
    
    // Prueba con tipos de datos inválidos
    console.log('- Probando con tipos de datos inválidos');
    results.invalidDataTypes = await makeRequest('/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre: 'Producto Inválido',
        descripcion: 'Descripción del producto',
        codigo: 'TEST002',
        precio_compra: 'no es un número',
        precio_venta: 'tampoco es un número',
        stock_minimo: 'cinco',
        unidad_id: 'uno',
        impuesto_id: 'uno'
      })
    });
    
    // Prueba con intento de XSS
    console.log('- Probando con intento de XSS');
    results.xssAttempt = await makeRequest('/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre: '<script>alert("XSS")</script>',
        descripcion: '<img src="x" onerror="alert(\'XSS\')">',
        codigo: 'TEST003',
        precio_compra: 10,
        precio_venta: 15,
        stock_minimo: 5,
        unidad_id: 1,
        impuesto_id: 1
      })
    });
    
    // Análisis de resultados
    const analysis = {
      acceptsValidInput: results.validInput.status === 201,
      rejectsMissingRequiredFields: results.missingRequiredFields.status === 400,
      rejectsInvalidDataTypes: results.invalidDataTypes.status === 400,
      sanitizesXssAttempts: results.xssAttempt.status === 201 && 
                           (!results.xssAttempt.data.data.nombre.includes('<script>') || 
                            !results.xssAttempt.data.data.descripcion.includes('onerror'))
    };
    
    results.analysis = analysis;
    saveResults('input-validation', results);
    
    return {
      name: 'Prueba de validación de entrada',
      passed: Object.values(analysis).every(result => result === true),
      details: analysis
    };
  },
  
  // Prueba de cabeceras de seguridad
  async testSecurityHeaders() {
    console.log('\n4. Prueba de cabeceras de seguridad');
    
    const response = await makeRequest('/');
    const headers = response.headers || {};
    
    const results = {
      headers,
      hasContentTypeHeader: !!headers['content-type'],
      hasXContentTypeOptionsHeader: headers['x-content-type-options'] === 'nosniff',
      hasXFrameOptionsHeader: !!headers['x-frame-options'],
      hasXXssProtectionHeader: !!headers['x-xss-protection'],
      hasStrictTransportSecurityHeader: !!headers['strict-transport-security'],
      hasContentSecurityPolicyHeader: !!headers['content-security-policy']
    };
    
    saveResults('security-headers', results);
    
    return {
      name: 'Prueba de cabeceras de seguridad',
      passed: results.hasContentTypeHeader && 
              (results.hasXContentTypeOptionsHeader || 
               results.hasXFrameOptionsHeader || 
               results.hasXXssProtectionHeader),
      details: results
    };
  }
};

// Función principal
async function runTests() {
  console.log('=== Iniciando pruebas de seguridad del Sistema POS ===');
  
  const results = [];
  
  for (const [testName, testFunction] of Object.entries(securityTests)) {
    try {
      const result = await testFunction();
      results.push(result);
    } catch (error) {
      console.error(`Error en ${testName}:`, error);
      results.push({
        name: testName,
        passed: false,
        error: error.message
      });
    }
  }
  
  // Resumen de resultados
  console.log('\n=== Resumen de pruebas de seguridad ===');
  results.forEach(result => {
    const status = result.passed ? '✅ PASÓ' : '❌ FALLÓ';
    console.log(`${status} - ${result.name}`);
  });
  
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  console.log(`\nResultado final: ${passedCount}/${totalCount} pruebas pasadas`);
  
  // Guardar resumen
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const summaryPath = path.join(RESULTS_DIR, `summary-${timestamp}.json`);
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
  console.log(`\nResumen guardado en ${summaryPath}`);
}

// Ejecutar pruebas
runTests().catch(console.error);

