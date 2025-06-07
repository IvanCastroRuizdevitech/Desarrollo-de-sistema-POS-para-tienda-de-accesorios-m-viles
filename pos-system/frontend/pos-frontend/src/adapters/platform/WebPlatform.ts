import { 
  PlatformAdapter, 
  SaveDialogOptions, 
  OpenDialogOptions, 
  SystemInfo 
} from './PlatformAdapter';

/**
 * Adaptador de plataforma para entorno web
 * Implementa alternativas web para funcionalidades de plataforma
 */
export class WebPlatform implements PlatformAdapter {
  /**
   * Simula un diálogo para guardar un archivo en entorno web
   * En navegadores, esto se maneja a través de descargas
   * @param options Opciones del diálogo
   * @returns Promesa que resuelve a null ya que los navegadores no permiten seleccionar rutas de guardado
   */
  async showSaveDialog(options: SaveDialogOptions): Promise<string | null> {
    console.warn('showSaveDialog no está completamente soportado en entorno web');
    // En entorno web, no podemos obtener la ruta donde el usuario guarda el archivo
    // En su lugar, podríamos iniciar una descarga
    return null;
  }

  /**
   * Simula un diálogo para abrir archivos en entorno web
   * En navegadores, esto se maneja a través del elemento input[type=file]
   * @param options Opciones del diálogo
   * @returns Promesa que resuelve a un array vacío ya que esta función debe ser llamada desde un componente UI
   */
  async showOpenDialog(options: OpenDialogOptions): Promise<string[]> {
    console.warn('showOpenDialog debe ser llamado desde un componente UI en entorno web');
    // En entorno web, esto debe manejarse a través de un componente UI con input[type=file]
    return [];
  }

  /**
   * Obtiene la versión de la aplicación web
   * @returns Promesa que resuelve a la versión de la aplicación web (desde variables de entorno)
   */
  async getAppVersion(): Promise<string> {
    // En entorno web, podemos obtener la versión desde variables de entorno o un endpoint
    return process.env.REACT_APP_VERSION || 'web-1.0.0';
  }

  /**
   * Imprime contenido usando la API de impresión del navegador
   * @param content Contenido a imprimir (HTML)
   * @returns Promesa que resuelve cuando se completa la operación
   */
  async printContent(content: string): Promise<void> {
    try {
      // Crear una ventana oculta y usar window.print()
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        // Usar una aserción de tipo para indicar a TypeScript que printWindow tiene la propiedad document
        (printWindow as any).document.write(content);
        (printWindow as any).document.close();
        printWindow.focus();
        (printWindow as any).print();
        printWindow.close();
      } else {
        throw new Error('No se pudo abrir ventana de impresión');
      }
    } catch (error) {
      console.error('Error al imprimir contenido:', error);
      throw error;
    }
  }

  /**
   * Obtiene información sobre el sistema operativo en entorno web
   * @returns Promesa que resuelve a la información del sistema operativo
   */
  async getSystemInfo(): Promise<SystemInfo> {
    try {
      const appVersion = await this.getAppVersion();
      const userAgent = navigator.userAgent;
      let platform = 'unknown';
      
      // Detectar plataforma basada en userAgent
      if (/Windows/.test(userAgent)) {
        platform = 'windows';
      } else if (/Macintosh|Mac OS X/.test(userAgent)) {
        platform = 'darwin';
      } else if (/Linux/.test(userAgent)) {
        platform = 'linux';
      } else if (/Android/.test(userAgent)) {
        platform = 'android';
      } else if (/iPhone|iPad|iPod/.test(userAgent)) {
        platform = 'ios';
      }
      
      return {
        platform,
        osVersion: navigator.platform,
        appVersion,
        isElectron: false,
        isWeb: true,
      };
    } catch (error) {
      console.error('Error al obtener información del sistema:', error);
      return {
        platform: 'unknown',
        appVersion: 'unknown',
        isElectron: false,
        isWeb: true,
      };
    }
  }

  /**
   * Método auxiliar para descargar un archivo en el navegador
   * @param filename Nombre del archivo
   * @param content Contenido del archivo
   * @param mimeType Tipo MIME del archivo
   */
  downloadFile(filename: string, content: string | Blob, mimeType: string = 'text/plain'): void {
    try {
      let blob: Blob;
      
      if (typeof content === 'string') {
        blob = new Blob([content], { type: mimeType });
      } else {
        blob = content;
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      throw error;
    }
  }
}

