# Arquitectura para Compatibilidad Dual: Web y Escritorio

## Visión General

Este documento describe la arquitectura propuesta para mantener la compatibilidad dual del Sistema POS, permitiendo que funcione tanto como aplicación de escritorio (Electron) como aplicación web (navegador).

## Principios de Diseño

1. **Separación de Preocupaciones**: Aislar claramente las funcionalidades específicas de cada plataforma.
2. **Detección de Entorno**: Implementar mecanismos para detectar si la aplicación se está ejecutando en entorno web o escritorio.
3. **Abstracción de APIs**: Crear capas de abstracción para funcionalidades específicas de plataforma.
4. **Experiencia Consistente**: Mantener una experiencia de usuario coherente entre ambas plataformas.
5. **Código Compartido**: Maximizar la cantidad de código compartido entre ambas versiones.

## Arquitectura Propuesta

### 1. Estructura de Directorios

```
pos-system/
├── frontend/
│   ├── pos-frontend/           # Código compartido
│   │   ├── src/
│   │   │   ├── adapters/       # Adaptadores para funcionalidades específicas de plataforma
│   │   │   │   ├── storage/    # Adaptadores para almacenamiento
│   │   │   │   ├── platform/   # Adaptadores para funcionalidades de plataforma
│   │   │   │   └── ui/         # Adaptadores para componentes UI
│   │   │   ├── contexts/       # Contextos de React
│   │   │   ├── components/     # Componentes compartidos
│   │   │   ├── pages/          # Páginas de la aplicación
│   │   │   ├── services/       # Servicios compartidos
│   │   │   ├── utils/          # Utilidades compartidas
│   │   │   └── config/         # Configuraciones
│   │   ├── electron/           # Código específico de Electron
│   │   └── web/                # Código específico de Web
│   └── pos-web/                # Proyecto específico para la versión web
├── backend/
│   └── pos-backend/            # Backend compartido
└── docs/                       # Documentación
```

### 2. Detección de Entorno

Implementaremos un mecanismo para detectar si la aplicación se está ejecutando en un entorno web o de escritorio:

```typescript
// src/utils/environment.ts
export const isElectron = (): boolean => {
  return window && window.process && window.process.type === 'renderer';
};

export const isWeb = (): boolean => {
  return !isElectron();
};
```

### 3. Capa de Abstracción para APIs Específicas de Plataforma

#### Almacenamiento Local

```typescript
// src/adapters/storage/index.ts
import { ElectronStorage } from './electronStorage';
import { WebStorage } from './webStorage';
import { isElectron } from '../../utils/environment';

export interface StorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
}

export const createStorageAdapter = (): StorageAdapter => {
  if (isElectron()) {
    return new ElectronStorage();
  } else {
    return new WebStorage();
  }
};
```

#### Funcionalidades de Plataforma

```typescript
// src/adapters/platform/index.ts
import { ElectronPlatform } from './electronPlatform';
import { WebPlatform } from './webPlatform';
import { isElectron } from '../../utils/environment';

export interface PlatformAdapter {
  showSaveDialog(options: any): Promise<string>;
  showOpenDialog(options: any): Promise<string[]>;
  getAppVersion(): Promise<string>;
  printContent(content: string): Promise<void>;
}

export const createPlatformAdapter = (): PlatformAdapter => {
  if (isElectron()) {
    return new ElectronPlatform();
  } else {
    return new WebPlatform();
  }
};
```

### 4. Contexto de Plataforma

Crearemos un contexto de React para proporcionar acceso a las funcionalidades específicas de plataforma:

```typescript
// src/contexts/PlatformContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { createStorageAdapter, StorageAdapter } from '../adapters/storage';
import { createPlatformAdapter, PlatformAdapter } from '../adapters/platform';
import { isElectron, isWeb } from '../utils/environment';

interface PlatformContextType {
  isElectron: boolean;
  isWeb: boolean;
  storage: StorageAdapter;
  platform: PlatformAdapter;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = {
    isElectron: isElectron(),
    isWeb: isWeb(),
    storage: createStorageAdapter(),
    platform: createPlatformAdapter(),
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform debe ser usado dentro de un PlatformProvider');
  }
  return context;
};
```

### 5. Adaptación de Componentes UI

Para componentes que necesitan comportarse de manera diferente según la plataforma:

```typescript
// src/adapters/ui/FileUploader.tsx
import React from 'react';
import { usePlatform } from '../../contexts/PlatformContext';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const { isElectron, platform } = usePlatform();

  const handleFileSelect = async () => {
    if (isElectron) {
      const filePaths = await platform.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
      });
      
      if (filePaths && filePaths.length > 0) {
        // Convertir la ruta del archivo a un objeto File
        // Implementación específica para Electron
      }
    }
  };

  return (
    <div>
      {isElectron ? (
        <button onClick={handleFileSelect}>Seleccionar Archivo</button>
      ) : (
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileSelect(e.target.files[0]);
            }
          }}
        />
      )}
    </div>
  );
};
```

### 6. Configuración del Backend

El backend necesitará algunas adaptaciones para soportar ambos entornos:

1. **Configuración de CORS**: Para permitir peticiones desde el navegador.
2. **Manejo de Sesiones**: Implementar un sistema de sesiones compatible con ambos entornos.
3. **Seguridad**: Configurar medidas de seguridad adicionales para el entorno web.

```typescript
// backend/pos-backend/src/config/cors.config.ts
export const corsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://pos-web.example.com', 'electron://localhost'] 
    : ['http://localhost:3000', 'electron://localhost'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
```

### 7. Autenticación

Adaptaremos el sistema de autenticación para soportar ambos entornos:

```typescript
// src/contexts/AuthContext.tsx (modificado)
import { usePlatform } from './PlatformContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { storage } = usePlatform();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // Cargar token al inicio
  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await storage.get('token');
      if (savedToken) {
        setToken(savedToken);
      }
    };
    
    loadToken();
  }, [storage]);
  
  // Resto del código...
  
  const login = async (username: string, password: string) => {
    try {
      // Código de login...
      
      // Guardar token
      await storage.set('token', access_token);
      
      // Resto del código...
    } catch (error) {
      // Manejo de errores...
    }
  };
  
  const logout = async () => {
    await storage.delete('token');
    // Resto del código...
  };
  
  // Resto del código...
};
```

## Estrategia de Implementación

### Fase 1: Preparación

1. Crear la estructura de directorios propuesta.
2. Implementar la detección de entorno.
3. Crear las interfaces para los adaptadores.

### Fase 2: Implementación de Adaptadores

1. Implementar adaptadores de almacenamiento.
2. Implementar adaptadores de plataforma.
3. Implementar adaptadores de UI.

### Fase 3: Refactorización del Código Existente

1. Refactorizar el contexto de autenticación.
2. Refactorizar componentes que utilizan APIs específicas de Electron.
3. Adaptar el sistema de rutas.

### Fase 4: Configuración del Backend

1. Configurar CORS.
2. Adaptar el sistema de autenticación.
3. Implementar medidas de seguridad adicionales.

### Fase 5: Pruebas y Despliegue

1. Realizar pruebas en ambos entornos.
2. Corregir problemas identificados.
3. Desplegar la versión web.
4. Actualizar la versión de escritorio.

## Consideraciones de Seguridad

1. **Almacenamiento de Tokens**: En la versión web, los tokens se almacenarán en localStorage o sessionStorage, que son menos seguros que el almacenamiento de Electron.
2. **CSRF**: Implementar protección contra CSRF para la versión web.
3. **XSS**: Asegurar que la aplicación esté protegida contra ataques XSS.
4. **CORS**: Configurar correctamente CORS para permitir solo orígenes confiables.

## Conclusión

Esta arquitectura permite mantener una base de código compartida entre las versiones web y de escritorio, minimizando la duplicación de código y facilitando el mantenimiento. Al mismo tiempo, proporciona la flexibilidad necesaria para adaptar la aplicación a las particularidades de cada plataforma.

