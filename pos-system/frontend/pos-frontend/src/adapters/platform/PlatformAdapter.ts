/**
 * Interfaz para adaptadores de plataforma
 * Define los métodos que deben implementar todos los adaptadores de plataforma
 */
export interface PlatformAdapter {
  /**
   * Muestra un diálogo para guardar un archivo
   * @param options Opciones del diálogo
   * @returns Promesa que resuelve a la ruta del archivo seleccionado, o null si se canceló
   */
  showSaveDialog(options: SaveDialogOptions): Promise<string | null>;
  
  /**
   * Muestra un diálogo para abrir archivos
   * @param options Opciones del diálogo
   * @returns Promesa que resuelve a un array con las rutas de los archivos seleccionados, o array vacío si se canceló
   */
  showOpenDialog(options: OpenDialogOptions): Promise<string[]>;
  
  /**
   * Obtiene la versión de la aplicación
   * @returns Promesa que resuelve a la versión de la aplicación
   */
  getAppVersion(): Promise<string>;
  
  /**
   * Imprime contenido
   * @param content Contenido a imprimir (HTML)
   * @returns Promesa que resuelve cuando se completa la operación
   */
  printContent(content: string): Promise<void>;
  
  /**
   * Obtiene información sobre el sistema operativo
   * @returns Promesa que resuelve a la información del sistema operativo
   */
  getSystemInfo(): Promise<SystemInfo>;
}

/**
 * Opciones para el diálogo de guardar archivo
 */
export interface SaveDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
}

/**
 * Opciones para el diálogo de abrir archivos
 */
export interface OpenDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
  properties?: OpenDialogProperty[];
}

/**
 * Filtro de archivos para diálogos
 */
export interface FileFilter {
  name: string;
  extensions: string[];
}

/**
 * Propiedades para el diálogo de abrir archivos
 */
export type OpenDialogProperty = 
  | 'openFile' 
  | 'openDirectory' 
  | 'multiSelections' 
  | 'createDirectory';

/**
 * Información del sistema operativo
 */
export interface SystemInfo {
  platform: string;
  osVersion?: string;
  appVersion: string;
  isElectron: boolean;
  isWeb: boolean;
}

