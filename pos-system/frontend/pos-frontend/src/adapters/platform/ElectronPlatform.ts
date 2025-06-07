import { 
  PlatformAdapter, 
  SaveDialogOptions, 
  OpenDialogOptions, 
  SystemInfo 
} from './PlatformAdapter';

/**
 * Adaptador de plataforma para Electron
 * Implementa funcionalidades específicas de Electron
 */
export class ElectronPlatform implements PlatformAdapter {
  /**
   * Muestra un diálogo para guardar un archivo usando el API de Electron
   * @param options Opciones del diálogo
   * @returns Promesa que resuelve a la ruta del archivo seleccionado, o null si se canceló
   */
  async showSaveDialog(options: SaveDialogOptions): Promise<string | null> {
    try {
      if (window.electron && window.electron.showSaveDialog) {
        const result = await window.electron.showSaveDialog(options);
        return result.canceled ? null : result.filePath;
      }
      console.warn('API de Electron no disponible para showSaveDialog');
      return null;
    } catch (error) {
      console.error('Error al mostrar diálogo de guardar archivo:', error);
      return null;
    }
  }

  /**
   * Muestra un diálogo para abrir archivos usando el API de Electron
   * @param options Opciones del diálogo
   * @returns Promesa que resuelve a un array con las rutas de los archivos seleccionados, o array vacío si se canceló
   */
  async showOpenDialog(options: OpenDialogOptions): Promise<string[]> {
    try {
      if (window.electron && window.electron.showOpenDialog) {
        const result = await window.electron.showOpenDialog(options);
        return result.canceled ? [] : result.filePaths;
      }
      console.warn('API de Electron no disponible para showOpenDialog');
      return [];
    } catch (error) {
      console.error('Error al mostrar diálogo de abrir archivos:', error);
      return [];
    }
  }

  /**
   * Obtiene la versión de la aplicación desde el API de Electron
   * @returns Promesa que resuelve a la versión de la aplicación
   */
  async getAppVersion(): Promise<string> {
    try {
      if (window.electron && window.electron.getAppVersion) {
        return await window.electron.getAppVersion();
      }
      console.warn('API de Electron no disponible para getAppVersion');
      return 'desconocida';
    } catch (error) {
      console.error('Error al obtener versión de la aplicación:', error);
      return 'error';
    }
  }

  /**
   * Imprime contenido usando el API de Electron
   * @param content Contenido a imprimir (HTML)
   * @returns Promesa que resuelve cuando se completa la operación
   */
  async printContent(content: string): Promise<void> {
    try {
      if (window.electron && window.electron.printContent) {
        await window.electron.printContent(content);
      } else {
        // Alternativa: crear una ventana oculta y usar window.print()
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(content);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        } else {
          throw new Error('No se pudo abrir ventana de impresión');
        }
      }
    } catch (error) {
      console.error('Error al imprimir contenido:', error);
      throw error;
    }
  }

  /**
   * Obtiene información sobre el sistema operativo desde el API de Electron
   * @returns Promesa que resuelve a la información del sistema operativo
   */
  async getSystemInfo(): Promise<SystemInfo> {
    try {
      const platform = window.electron?.platform || 'unknown';
      const appVersion = await this.getAppVersion();
      
      return {
        platform,
        appVersion,
        isElectron: true,
        isWeb: false,
        // Podríamos obtener más información si el API de Electron lo expone
      };
    } catch (error) {
      console.error('Error al obtener información del sistema:', error);
      return {
        platform: 'unknown',
        appVersion: 'unknown',
        isElectron: true,
        isWeb: false,
      };
    }
  }
}

// Ampliar la declaración de tipos para TypeScript
declare global {
  interface Window {
    electron?: {
      showSaveDialog?: (options: SaveDialogOptions) => Promise<{
        canceled: boolean;
        filePath?: string;
      }>;
      showOpenDialog?: (options: OpenDialogOptions) => Promise<{
        canceled: boolean;
        filePaths: string[];
      }>;
      getAppVersion?: () => Promise<string>;
      printContent?: (content: string) => Promise<void>;
      platform?: string;
      // Otras APIs de Electron que puedan estar expuestas
    };
  }
}

