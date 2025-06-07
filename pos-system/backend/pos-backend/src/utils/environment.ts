/**
 * Utilidades para detectar el entorno de ejecución de la aplicación
 */

/**
 * Verifica si la aplicación se está ejecutando en un entorno de producción
 * @returns {boolean} true si se está ejecutando en producción, false en caso contrario
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Verifica si la aplicación se está ejecutando en un entorno de desarrollo
 * @returns {boolean} true si se está ejecutando en desarrollo, false en caso contrario
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
};

/**
 * Verifica si la aplicación se está ejecutando en un entorno de pruebas
 * @returns {boolean} true si se está ejecutando en pruebas, false en caso contrario
 */
export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};

/**
 * Detecta si la petición proviene de una aplicación Electron
 * @param {Request} req - Objeto de petición Express
 * @returns {boolean} true si la petición proviene de Electron, false en caso contrario
 */
export const isElectronRequest = (req: any): boolean => {
  // Verificar el origen de la petición
  const origin = req.headers.origin || '';
  if (origin.startsWith('app://') || origin.startsWith('electron://')) {
    return true;
  }
  
  // Verificar el user-agent
  const userAgent = req.headers['user-agent'] || '';
  if (userAgent.includes('Electron/')) {
    return true;
  }
  
  // Verificar cabecera personalizada (si se implementa en el cliente)
  const clientType = req.headers['x-client-type'] || '';
  if (clientType === 'electron') {
    return true;
  }
  
  return false;
};

/**
 * Detecta si la petición proviene de un navegador web
 * @param {Request} req - Objeto de petición Express
 * @returns {boolean} true si la petición proviene de un navegador web, false en caso contrario
 */
export const isWebRequest = (req: any): boolean => {
  return !isElectronRequest(req);
};

/**
 * Obtiene el tipo de cliente que realiza la petición
 * @param {Request} req - Objeto de petición Express
 * @returns {string} 'electron' o 'web'
 */
export const getClientType = (req: any): 'electron' | 'web' => {
  return isElectronRequest(req) ? 'electron' : 'web';
};

