/**
 * Interfaz para adaptadores de almacenamiento
 * Define los métodos que deben implementar todos los adaptadores de almacenamiento
 */
export interface StorageAdapter {
  /**
   * Obtiene un valor del almacenamiento
   * @param key Clave del valor a obtener
   * @returns Promesa que resuelve al valor almacenado, o null si no existe
   */
  get<T>(key: string): Promise<T | null>;
  
  /**
   * Guarda un valor en el almacenamiento
   * @param key Clave con la que se guardará el valor
   * @param value Valor a guardar
   * @returns Promesa que resuelve cuando se completa la operación
   */
  set<T>(key: string, value: T): Promise<void>;
  
  /**
   * Elimina un valor del almacenamiento
   * @param key Clave del valor a eliminar
   * @returns Promesa que resuelve cuando se completa la operación
   */
  delete(key: string): Promise<void>;
  
  /**
   * Limpia todo el almacenamiento
   * @returns Promesa que resuelve cuando se completa la operación
   */
  clear(): Promise<void>;
  
  /**
   * Verifica si existe un valor con la clave especificada
   * @param key Clave a verificar
   * @returns Promesa que resuelve a true si existe, false en caso contrario
   */
  has(key: string): Promise<boolean>;
}

