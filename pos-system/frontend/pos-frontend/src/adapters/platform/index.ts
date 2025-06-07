import { PlatformAdapter } from './PlatformAdapter';
import { ElectronPlatform } from './ElectronPlatform';
import { WebPlatform } from './WebPlatform';
import { isElectron } from '../../utils/environment';

/**
 * Crea un adaptador de plataforma apropiado para el entorno actual
 * @returns Instancia de PlatformAdapter para el entorno actual
 */
export const createPlatformAdapter = (): PlatformAdapter => {
  if (isElectron()) {
    return new ElectronPlatform();
  } else {
    return new WebPlatform();
  }
};

// Exportar interfaces y clases para uso directo
export * from './PlatformAdapter';
export { ElectronPlatform, WebPlatform };

