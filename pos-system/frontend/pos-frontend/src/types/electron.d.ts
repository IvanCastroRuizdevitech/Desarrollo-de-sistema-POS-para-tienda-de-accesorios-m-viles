import { SaveDialogOptions, OpenDialogOptions } from '../adapters/platform/PlatformAdapter';

// Declaración de tipos global para window.electron
declare global {
  interface Window {
    electron?: {
      // Almacenamiento
      store: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<void>;
        delete: (key: string) => Promise<void>;
        clear?: () => Promise<void>;
        has?: (key: string) => Promise<boolean>;
      };
      // Diálogos
      showSaveDialog: (options: SaveDialogOptions) => Promise<{
        canceled: boolean;
        filePath?: string;
      }>;
      showOpenDialog: (options: OpenDialogOptions) => Promise<{
        canceled: boolean;
        filePaths: string[];
      }>;
      // Información de la aplicación
      getAppPath: () => Promise<string>;
      getAppVersion: () => Promise<string>;
      // Sistema operativo
      platform: string;
      // Otras APIs de Electron que puedan estar expuestas
      printContent?: (content: string) => Promise<void>;
    };
  }
}

