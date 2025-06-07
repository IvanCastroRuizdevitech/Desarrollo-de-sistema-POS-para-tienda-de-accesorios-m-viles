/**
 * Script para pruebas de usabilidad básicas
 * 
 * Este script utiliza Puppeteer para simular interacciones de usuario
 * y verificar la usabilidad básica de la aplicación.
 */

const puppeteer = require('puppeteer');

// URL de la aplicación
const APP_URL = 'http://localhost:3000';

// Credenciales para autenticación
const credentials = {
  email: 'admin@example.com',
  password: 'admin123',
};

// Función para esperar a que un elemento sea visible
async function waitForElement(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { visible: true, timeout });
    return true;
  } catch (error) {
    console.error(`Error esperando por el selector "${selector}":`, error.message);
    return false;
  }
}

// Función para realizar pruebas de usabilidad
async function runUsabilityTests() {
  console.log('Iniciando pruebas de usabilidad...');
  
  // Iniciar navegador
  const browser = await puppeteer.launch({
    headless: false, // Cambiar a true para modo headless
    args: ['--window-size=1366,768'],
    defaultViewport: { width: 1366, height: 768 },
  });
  
  const page = await browser.newPage();
  
  try {
    // Prueba 1: Cargar la página de inicio
    console.log('\n--- Prueba 1: Cargar la página de inicio ---');
    await page.goto(APP_URL, { waitUntil: 'networkidle2' });
    
    const loginFormVisible = await waitForElement(page, 'form');
    console.log(`Formulario de login visible: ${loginFormVisible ? 'Sí ✅' : 'No ❌'}`);
    
    // Prueba 2: Iniciar sesión
    console.log('\n--- Prueba 2: Iniciar sesión ---');
    await page.type('input[name="email"]', credentials.email);
    await page.type('input[name="password"]', credentials.password);
    await page.click('button[type="submit"]');
    
    // Esperar a que se cargue el dashboard
    const dashboardVisible = await waitForElement(page, '[data-testid="dashboard"]', 10000);
    console.log(`Dashboard visible después del login: ${dashboardVisible ? 'Sí ✅' : 'No ❌'}`);
    
    // Prueba 3: Navegación por el menú
    console.log('\n--- Prueba 3: Navegación por el menú ---');
    const menuItems = [
      { name: 'Productos', selector: '[data-testid="menu-productos"]' },
      { name: 'Ventas', selector: '[data-testid="menu-ventas"]' },
      { name: 'Gastos', selector: '[data-testid="menu-gastos"]' },
      { name: 'Reportes', selector: '[data-testid="menu-reportes"]' },
    ];
    
    for (const item of menuItems) {
      const menuItemVisible = await waitForElement(page, item.selector);
      if (menuItemVisible) {
        await page.click(item.selector);
        await page.waitForTimeout(1000); // Esperar a que se cargue la página
        
        // Verificar que se cargó la página correcta
        const pageContentVisible = await waitForElement(page, `[data-testid="${item.name.toLowerCase()}-page"]`);
        console.log(`Navegación a ${item.name}: ${pageContentVisible ? 'Exitosa ✅' : 'Fallida ❌'}`);
      } else {
        console.log(`Elemento de menú ${item.name} no encontrado ❌`);
      }
    }
    
    // Prueba 4: Cambio de tema
    console.log('\n--- Prueba 4: Cambio de tema ---');
    const themeToggleVisible = await waitForElement(page, '[data-testid="theme-toggle"]');
    if (themeToggleVisible) {
      await page.click('[data-testid="theme-toggle"]');
      await page.waitForTimeout(1000);
      
      // Verificar cambio de tema (esto depende de cómo se implementa el cambio de tema)
      const darkThemeActive = await page.evaluate(() => {
        return document.body.classList.contains('dark-theme') || 
               document.documentElement.getAttribute('data-theme') === 'dark';
      });
      
      console.log(`Cambio de tema: ${darkThemeActive ? 'Exitoso ✅' : 'No verificable ⚠️'}`);
    } else {
      console.log('Botón de cambio de tema no encontrado ❌');
    }
    
    // Prueba 5: Cerrar sesión
    console.log('\n--- Prueba 5: Cerrar sesión ---');
    const logoutButtonVisible = await waitForElement(page, '[data-testid="logout-button"]');
    if (logoutButtonVisible) {
      await page.click('[data-testid="logout-button"]');
      
      // Verificar que volvimos a la página de login
      const loginFormVisibleAgain = await waitForElement(page, 'form', 5000);
      console.log(`Cerrar sesión: ${loginFormVisibleAgain ? 'Exitoso ✅' : 'Fallido ❌'}`);
    } else {
      console.log('Botón de cerrar sesión no encontrado ❌');
    }
    
  } catch (error) {
    console.error('Error durante las pruebas de usabilidad:', error);
  } finally {
    // Cerrar el navegador
    await browser.close();
    console.log('\nPruebas de usabilidad completadas.');
  }
}

// Ejecutar las pruebas
runUsabilityTests().catch(error => {
  console.error('Error al ejecutar las pruebas de usabilidad:', error);
});

