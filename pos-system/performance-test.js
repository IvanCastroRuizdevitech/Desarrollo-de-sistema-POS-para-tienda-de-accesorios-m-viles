/**
 * Script para pruebas de rendimiento del Sistema POS
 * 
 * Este script utiliza autocannon para realizar pruebas de carga en el backend
 * 
 * Instalación:
 * npm install -g autocannon
 * 
 * Uso:
 * node performance-test.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración
const API_URL = 'http://localhost:3001/api';
const AUTH_ENDPOINT = '/auth/login';
const PRODUCTOS_ENDPOINT = '/productos';
const VENTAS_ENDPOINT = '/ventas';
const REPORTES_ENDPOINT = '/reportes/ventas/dia';

// Credenciales para autenticación
const AUTH_PAYLOAD = JSON.stringify({
  email: 'admin@example.com',
  password: 'admin123'
});

// Directorio para guardar resultados
const RESULTS_DIR = path.join(__dirname, 'performance-results');
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR);
}

// Función para ejecutar autocannon
function runAutocannon(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(RESULTS_DIR, `${endpoint.replace(/\//g, '-')}-${timestamp}.json`);
    
    console.log(`\nEjecutando prueba para ${API_URL}${endpoint}`);
    console.log(`Guardando resultados en ${outputFile}`);
    
    const args = [
      `${API_URL}${endpoint}`,
      '-m', options.method || 'GET',
      '-c', options.connections || '10',
      '-d', options.duration || '10',
      '-j', // Formato JSON
      '--renderStatusCodes',
      '--latency'
    ];
    
    // Agregar headers si se proporcionan
    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        args.push('-H', `${key}: ${value}`);
      }
    }
    
    // Agregar body si se proporciona
    if (options.body) {
      args.push('-b', options.body);
    }
    
    const autocannon = spawn('autocannon', args);
    
    let output = '';
    let errorOutput = '';
    
    autocannon.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write('.');
    });
    
    autocannon.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    autocannon.on('close', (code) => {
      console.log(`\nPrueba completada con código ${code}`);
      
      if (code !== 0) {
        console.error(`Error: ${errorOutput}`);
        return reject(new Error(`autocannon exited with code ${code}`));
      }
      
      try {
        const results = JSON.parse(output);
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
        
        // Mostrar resumen
        console.log('\nResumen:');
        console.log(`Solicitudes por segundo: ${results.requests.average}`);
        console.log(`Latencia promedio: ${results.latency.average} ms`);
        console.log(`Errores: ${results.errors}`);
        
        resolve(results);
      } catch (error) {
        console.error('Error al analizar resultados:', error);
        reject(error);
      }
    });
  });
}

// Función principal
async function runTests() {
  console.log('=== Iniciando pruebas de rendimiento del Sistema POS ===');
  
  try {
    // Prueba de autenticación
    console.log('\n1. Prueba de autenticación');
    const authTest = await runAutocannon(AUTH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: AUTH_PAYLOAD,
      connections: 5,
      duration: 5
    });
    
    // Obtener token para pruebas autenticadas
    let token = '';
    try {
      const response = await fetch(`${API_URL}${AUTH_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: AUTH_PAYLOAD
      });
      const data = await response.json();
      token = data.data.token;
    } catch (error) {
      console.error('Error al obtener token:', error);
    }
    
    // Prueba de listado de productos
    console.log('\n2. Prueba de listado de productos');
    await runAutocannon(PRODUCTOS_ENDPOINT, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      connections: 20,
      duration: 10
    });
    
    // Prueba de listado de ventas
    console.log('\n3. Prueba de listado de ventas');
    await runAutocannon(VENTAS_ENDPOINT, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      connections: 15,
      duration: 10
    });
    
    // Prueba de generación de reportes
    console.log('\n4. Prueba de generación de reportes');
    await runAutocannon(REPORTES_ENDPOINT, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      connections: 5,
      duration: 10
    });
    
    console.log('\n=== Pruebas de rendimiento completadas ===');
    console.log(`Los resultados se han guardado en ${RESULTS_DIR}`);
    
  } catch (error) {
    console.error('Error durante las pruebas:', error);
  }
}

// Ejecutar pruebas
runTests();

