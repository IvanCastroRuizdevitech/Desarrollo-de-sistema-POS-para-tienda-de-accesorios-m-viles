const axios = require('axios');
const { performance } = require('perf_hooks');

// Configuración
const API_URL = 'http://localhost:3001/api';
const NUM_REQUESTS = 100;
const CONCURRENT_REQUESTS = 10;

// Credenciales para autenticación
const credentials = {
  email: 'admin@example.com',
  password: 'admin123',
};

// Función para medir el tiempo de respuesta
async function measureResponseTime(url, method = 'get', data = null, headers = {}) {
  const start = performance.now();
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
      validateStatus: () => true, // No lanzar errores por códigos de estado
    });
    const end = performance.now();
    return {
      status: response.status,
      time: end - start,
      success: response.status >= 200 && response.status < 300,
    };
  } catch (error) {
    const end = performance.now();
    return {
      status: error.response?.status || 500,
      time: end - start,
      success: false,
      error: error.message,
    };
  }
}

// Función para ejecutar múltiples solicitudes
async function runMultipleRequests(url, method = 'get', data = null, headers = {}, numRequests = 1) {
  const results = [];
  for (let i = 0; i < numRequests; i++) {
    const result = await measureResponseTime(url, method, data, headers);
    results.push(result);
  }
  return results;
}

// Función para ejecutar solicitudes concurrentes
async function runConcurrentRequests(url, method = 'get', data = null, headers = {}, numRequests = 1) {
  const promises = [];
  for (let i = 0; i < numRequests; i++) {
    promises.push(measureResponseTime(url, method, data, headers));
  }
  return Promise.all(promises);
}

// Función para calcular estadísticas
function calculateStats(results) {
  const times = results.map(r => r.time);
  const successCount = results.filter(r => r.success).length;
  const successRate = (successCount / results.length) * 100;
  
  return {
    min: Math.min(...times),
    max: Math.max(...times),
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)],
    p95: times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)],
    successRate,
    totalRequests: results.length,
    successfulRequests: successCount,
  };
}

// Función principal para ejecutar las pruebas
async function runTests() {
  console.log('Iniciando pruebas de rendimiento...');
  
  // Autenticación
  console.log('\n--- Prueba de autenticación ---');
  const authResult = await measureResponseTime(`${API_URL}/auth/login`, 'post', credentials);
  console.log(`Estado: ${authResult.status}, Tiempo: ${authResult.time.toFixed(2)}ms`);
  
  if (!authResult.success) {
    console.error('Error de autenticación. No se pueden continuar las pruebas.');
    return;
  }
  
  const token = authResult.response?.data?.token || '';
  const headers = { Authorization: `Bearer ${token}` };
  
  // Prueba de obtención de productos (secuencial)
  console.log('\n--- Prueba de obtención de productos (secuencial) ---');
  const productResults = await runMultipleRequests(`${API_URL}/productos`, 'get', null, headers, NUM_REQUESTS);
  const productStats = calculateStats(productResults);
  console.log('Estadísticas:');
  console.log(`- Mínimo: ${productStats.min.toFixed(2)}ms`);
  console.log(`- Máximo: ${productStats.max.toFixed(2)}ms`);
  console.log(`- Promedio: ${productStats.avg.toFixed(2)}ms`);
  console.log(`- Mediana: ${productStats.median.toFixed(2)}ms`);
  console.log(`- P95: ${productStats.p95.toFixed(2)}ms`);
  console.log(`- Tasa de éxito: ${productStats.successRate.toFixed(2)}%`);
  
  // Prueba de obtención de productos (concurrente)
  console.log('\n--- Prueba de obtención de productos (concurrente) ---');
  const concurrentResults = await runConcurrentRequests(`${API_URL}/productos`, 'get', null, headers, CONCURRENT_REQUESTS);
  const concurrentStats = calculateStats(concurrentResults);
  console.log('Estadísticas:');
  console.log(`- Mínimo: ${concurrentStats.min.toFixed(2)}ms`);
  console.log(`- Máximo: ${concurrentStats.max.toFixed(2)}ms`);
  console.log(`- Promedio: ${concurrentStats.avg.toFixed(2)}ms`);
  console.log(`- Mediana: ${concurrentStats.median.toFixed(2)}ms`);
  console.log(`- P95: ${concurrentStats.p95.toFixed(2)}ms`);
  console.log(`- Tasa de éxito: ${concurrentStats.successRate.toFixed(2)}%`);
  
  // Prueba de creación de ventas
  console.log('\n--- Prueba de creación de ventas ---');
  const saleData = {
    tienda_id: 1,
    cliente_id: 1,
    metodo_pago_id: 1,
    detalles: [
      {
        producto_id: 1,
        cantidad: 1,
        precio_unitario: 25,
        descuento: 0,
      }
    ]
  };
  
  const saleResults = await runMultipleRequests(`${API_URL}/ventas`, 'post', saleData, headers, 5);
  const saleStats = calculateStats(saleResults);
  console.log('Estadísticas:');
  console.log(`- Mínimo: ${saleStats.min.toFixed(2)}ms`);
  console.log(`- Máximo: ${saleStats.max.toFixed(2)}ms`);
  console.log(`- Promedio: ${saleStats.avg.toFixed(2)}ms`);
  console.log(`- Mediana: ${saleStats.median.toFixed(2)}ms`);
  console.log(`- P95: ${saleStats.p95.toFixed(2)}ms`);
  console.log(`- Tasa de éxito: ${saleStats.successRate.toFixed(2)}%`);
  
  console.log('\nPruebas de rendimiento completadas.');
}

// Ejecutar las pruebas
runTests().catch(error => {
  console.error('Error al ejecutar las pruebas:', error);
});

