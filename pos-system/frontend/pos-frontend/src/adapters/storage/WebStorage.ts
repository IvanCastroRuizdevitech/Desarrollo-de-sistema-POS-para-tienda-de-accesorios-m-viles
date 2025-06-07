import { StorageAdapter } from './StorageAdapter';

/**
 * Adaptador de almacenamiento para entorno web
 * Utiliza localStorage para almacenar datos de forma persistente
 */
export class WebStorage implements StorageAdapter {
  /**
   * Prefijo para las claves en localStorage para evitar colisiones
   */
  private prefix: string = 'pos_system_';

  /**
   * Constructor del adaptador de almacenamiento web
   * @param usePrefix Indica si se debe usar un prefijo para las claves (por defecto: true)
   */
  constructor(usePrefix: boolean = true) {
    if (!usePrefix) {
      this.prefix = '';
    }
  }

  /**
   * Obtiene la clave completa con el prefijo
   * @param key Clave base
   * @returns Clave con prefijo
   */
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Obtiene un valor del localStorage
   * @param key Clave del valor a obtener
   * @returns Promesa que resuelve al valor almacenado, o null si no existe
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key);
      const item = localStorage.getItem(fullKey);
      
      if (item === null) {
        return null;
      }
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error al obtener ${key} del localStorage:`, error);
      return null;
    }
  }

  /**
   * Guarda un valor en el localStorage
   * @param key Clave con la que se guardará el valor
   * @param value Valor a guardar
   * @returns Promesa que resuelve cuando se completa la operación
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error al guardar ${key} en el localStorage:`, error);
      throw error;
    }
  }

  /**
   * Elimina un valor del localStorage
   * @param key Clave del valor a eliminar
   * @returns Promesa que resuelve cuando se completa la operación
   */
  async delete(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`Error al eliminar ${key} del localStorage:`, error);
      throw error;
    }
  }

  /**
   * Limpia todos los valores del localStorage que pertenecen a la aplicación
   * @returns Promesa que resuelve cuando se completa la operación
   */
  async clear(): Promise<void> {
    try {
      if (this.prefix === '') {
        // Si no hay prefijo, limpiar todo el localStorage
        localStorage.clear();
      } else {
        // Si hay prefijo, eliminar solo las claves que comienzan con el prefijo
        const keysToRemove: string[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('Error al limpiar el localStorage:', error);
      throw error;
    }
  }

  /**
   * Verifica si existe un valor con la clave especificada en el localStorage
   * @param key Clave a verificar
   * @returns Promesa que resuelve a true si existe, false en caso contrario
   */
  async has(key: string): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key);
      return localStorage.getItem(fullKey) !== null;
    } catch (error) {
      console.error(`Error al verificar la existencia de ${key} en el localStorage:`, error);
      return false;
    }
  }
}

