/**
 * Utilidades para detectar el entorno de ejecución de la aplicación
 */

/**
 * Verifica si la aplicación se está ejecutando en Electron
 * @returns {boolean} true si se está ejecutando en Electron, false en caso contrario
 */
export const isElectron = (): boolean => {
  // Verificar si window existe (para evitar errores en SSR)
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }
  
  // Verificar si existe el objeto electron en window
  if (typeof window !== 'undefined' && window.electron) {
    return true;
  }
  
  return false;
};

/**
 * Verifica si la aplicación se está ejecutando en un navegador web
 * @returns {boolean} true si se está ejecutando en un navegador web, false en caso contrario
 */
export const isWeb = (): boolean => {
  return !isElectron();
};

/**
 * Verifica si la aplicación se está ejecutando en un entorno de desarrollo
 * @returns {boolean} true si se está ejecutando en desarrollo, false en caso contrario
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Verifica si la aplicación se está ejecutando en un entorno de producción
 * @returns {boolean} true si se está ejecutando en producción, false en caso contrario
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Obtiene la URL base de la API según el entorno
 * @returns {string} URL base de la API
 */
export const getApiBaseUrl = (): string => {
  if (isElectron()) {
    return process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  } else {
    // Para la versión web, podemos usar una URL relativa o absoluta según la configuración
    return process.env.REACT_APP_WEB_API_URL || '/api';
  }
};

