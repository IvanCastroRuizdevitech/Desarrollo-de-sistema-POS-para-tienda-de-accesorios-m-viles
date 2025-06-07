import React, { createContext, useContext, ReactNode } from 'react';
import { createStorageAdapter, StorageAdapter } from '../adapters/storage';
import { createPlatformAdapter, PlatformAdapter } from '../adapters/platform';
import { isElectron, isWeb } from '../utils/environment';

/**
 * Tipo para el contexto de plataforma
 */
interface PlatformContextType {
  isElectron: boolean;
  isWeb: boolean;
  storage: StorageAdapter;
  platform: PlatformAdapter;
}

// Crear el contexto
const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

/**
 * Props para el proveedor de plataforma
 */
interface PlatformProviderProps {
  children: ReactNode;
}

/**
 * Proveedor del contexto de plataforma
 * Proporciona acceso a los adaptadores de plataforma y almacenamiento
 */
export const PlatformProvider: React.FC<PlatformProviderProps> = ({ children }) => {
  // Crear los adaptadores una sola vez
  const storage = createStorageAdapter();
  const platform = createPlatformAdapter();
  
  // Valor del contexto
  const value: PlatformContextType = {
    isElectron: isElectron(),
    isWeb: isWeb(),
    storage,
    platform,
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};

/**
 * Hook para usar el contexto de plataforma
 * @returns Contexto de plataforma
 * @throws Error si se usa fuera de un PlatformProvider
 */
export const usePlatform = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  
  if (context === undefined) {
    throw new Error('usePlatform debe ser usado dentro de un PlatformProvider');
  }
  
  return context;
};

