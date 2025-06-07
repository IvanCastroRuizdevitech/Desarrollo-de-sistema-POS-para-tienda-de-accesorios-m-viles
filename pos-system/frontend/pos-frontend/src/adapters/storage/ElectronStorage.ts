import { StorageAdapter } from './StorageAdapter';

/**
 * Adaptador de almacenamiento para Electron
 * Utiliza el API de Electron Store para almacenar datos de forma persistente
 */
export class ElectronStorage implements StorageAdapter {
  /**
   * Obtiene un valor del almacenamiento de Electron
   * @param key Clave del valor a obtener
   * @returns Promesa que resuelve al valor almacenado, o null si no existe
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Acceder al API de Electron a través del puente expuesto en preload.js
      if (window.electron && window.electron.store) {
        const value = await window.electron.store.get(key);
        return value as T || null;
      }
      return null;
    } catch (error) {
      console.error(`Error al obtener ${key} del almacenamiento de Electron:`, error);
      return null;
    }
  }

  /**
   * Guarda un valor en el almacenamiento de Electron
   * @param key Clave con la que se guardará el valor
   * @param value Valor a guardar
   * @returns Promesa que resuelve cuando se completa la operación
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      if (window.electron && window.electron.store) {
        await window.electron.store.set(key, value);
      }
    } catch (error) {
      console.error(`Error al guardar ${key} en el almacenamiento de Electron:`, error);
      throw error;
    }
  }

  /**
   * Elimina un valor del almacenamiento de Electron
   * @param key Clave del valor a eliminar
   * @returns Promesa que resuelve cuando se completa la operación
   */
  async delete(key: string): Promise<void> {
    try {
      if (window.electron && window.electron.store) {
        await window.electron.store.delete(key);
      }
    } catch (error) {
      console.error(`Error al eliminar ${key} del almacenamiento de Electron:`, error);
      throw error;
    }
  }

  /**
   * Limpia todo el almacenamiento de Electron
   * @returns Promesa que resuelve cuando se completa la operación
   */
  async clear(): Promise<void> {
    try {
      // Implementación específica para limpiar todo el almacenamiento
      // Esto dependerá de cómo esté implementado el API en preload.js
      if (window.electron && window.electron.store && window.electron.store.clear) {
        await window.electron.store.clear();
      } else {
        // Alternativa: obtener todas las claves y eliminarlas una por una
        console.warn('La función clear no está disponible en el API de Electron Store');
      }
    } catch (error) {
      console.error('Error al limpiar el almacenamiento de Electron:', error);
      throw error;
    }
  }

  /**
   * Verifica si existe un valor con la clave especificada en el almacenamiento de Electron
   * @param key Clave a verificar
   * @returns Promesa que resuelve a true si existe, false en caso contrario
   */
  async has(key: string): Promise<boolean> {
    try {
      if (window.electron && window.electron.store && window.electron.store.has) {
        return await window.electron.store.has(key);
      } else {
        // Alternativa: intentar obtener el valor y verificar si es null
        const value = await this.get(key);
        return value !== null;
      }
    } catch (error) {
      console.error(`Error al verificar la existencia de ${key} en el almacenamiento de Electron:`, error);
      return false;
    }
  }
}

// Declaración de tipos para TypeScript
declare global {
  interface Window {
    electron?: {
      store: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<void>;
        delete: (key: string) => Promise<void>;
        clear?: () => Promise<void>;
        has?: (key: string) => Promise<boolean>;
      };
      // Otras APIs de Electron que puedan estar expuestas
    };
  }
}

