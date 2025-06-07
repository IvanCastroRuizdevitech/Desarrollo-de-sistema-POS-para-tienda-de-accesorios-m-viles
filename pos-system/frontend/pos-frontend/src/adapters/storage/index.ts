import { StorageAdapter } from './StorageAdapter';
import { ElectronStorage } from './ElectronStorage';
import { WebStorage } from './WebStorage';
import { isElectron } from '../../utils/environment';

/**
 * Crea un adaptador de almacenamiento apropiado para el entorno actual
 * @returns Instancia de StorageAdapter para el entorno actual
 */
export const createStorageAdapter = (): StorageAdapter => {
  if (isElectron()) {
    return new ElectronStorage();
  } else {
    return new WebStorage();
  }
};

// Exportar interfaces y clases para uso directo
export { StorageAdapter, ElectronStorage, WebStorage };

