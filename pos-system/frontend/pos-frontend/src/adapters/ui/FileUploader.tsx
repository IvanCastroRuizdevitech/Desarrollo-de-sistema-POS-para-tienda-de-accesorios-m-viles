import React, { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { OpenDialogProperty } from '../platform/PlatformAdapter';

/**
 * Props para el componente FileUploader
 */
interface FileUploaderProps {
  /**
   * Función que se llama cuando se selecciona un archivo
   */
  onFileSelect: (file: File) => void;
  
  /**
   * Tipos de archivo permitidos (ej: 'image/*', '.pdf,.doc')
   */
  accept?: string;
  
  /**
   * Texto del botón
   */
  buttonText?: string;
  
  /**
   * Clase CSS para el botón
   */
  buttonClassName?: string;
  
  /**
   * Indica si se permiten múltiples archivos
   */
  multiple?: boolean;
  
  /**
   * Función que se llama cuando se seleccionan múltiples archivos
   */
  onFilesSelect?: (files: File[]) => void;
}

/**
 * Componente para subir archivos que se adapta al entorno (web o escritorio)
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  onFilesSelect,
  accept = '*/*',
  buttonText = 'Seleccionar archivo',
  buttonClassName = '',
  multiple = false,
}) => {
  const { isElectron, platform } = usePlatform();
  const [isLoading, setIsLoading] = useState(false);
  
  // Referencia al input de archivo (para entorno web)
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  /**
   * Maneja la selección de archivos en entorno web
   */
  const handleWebFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    if (multiple && onFilesSelect) {
      const fileArray: File[] = Array.from(files);
      onFilesSelect(fileArray);
    } else if (files[0]) {
      onFileSelect(files[0]);
    }
    
    // Resetear el input para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  /**
   * Maneja la selección de archivos en entorno Electron
   */
  const handleElectronFileSelect = async () => {
    try {
      setIsLoading(true);
      
      // Configurar opciones para el diálogo
      // Usar aserciones de tipo para asegurar que properties sea de tipo OpenDialogProperty[]
      const properties: OpenDialogProperty[] = multiple ? ['openFile', 'multiSelections'] : ['openFile'];
      
      const options = {
        properties,
        filters: [
          { name: 'Todos los archivos', extensions: ['*'] }
        ]
      };
      
      // Si hay tipos específicos, intentar configurar filtros
      if (accept && accept !== '*/*') {
        const filters = parseAcceptToFilters(accept);
        if (filters.length > 0) {
          options.filters = filters;
        }
      }
      
      // Mostrar diálogo de selección de archivos
      const filePaths = await platform.showOpenDialog(options);
      
      if (filePaths.length === 0) {
        return;
      }
      
      // En Electron, necesitamos convertir las rutas de archivo a objetos File
      // Esto es una simulación, ya que en realidad necesitaríamos leer los archivos
      // y crear objetos File con su contenido
      if (multiple && onFilesSelect) {
        // Simulación: crear objetos File a partir de las rutas
        const files = filePaths.map(path => {
          const name = path.split('/').pop() || path.split('\\').pop() || 'archivo';
          // Nota: esto es una simulación, en una implementación real
          // necesitaríamos leer el contenido del archivo
          return new File([''], name, { type: getMimeType(name) });
        });
        
        onFilesSelect(files);
      } else if (filePaths[0]) {
        const path = filePaths[0];
        const name = path.split('/').pop() || path.split('\\').pop() || 'archivo';
        // Simulación de objeto File
        const file = new File([''], name, { type: getMimeType(name) });
        onFileSelect(file);
      }
    } catch (error) {
      console.error('Error al seleccionar archivo en Electron:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Convierte una cadena de tipos aceptados a filtros para el diálogo de Electron
   */
  const parseAcceptToFilters = (accept: string) => {
    const filters: { name: string; extensions: string[] }[] = [];
    
    // Dividir por comas
    const types = accept.split(',').map(t => t.trim());
    
    // Procesar cada tipo
    types.forEach(type => {
      if (type.startsWith('.')) {
        // Es una extensión
        const extension = type.substring(1);
        filters.push({
          name: `Archivos ${extension.toUpperCase()}`,
          extensions: [extension]
        });
      } else if (type.includes('/')) {
        // Es un MIME type
        const [category, subtype] = type.split('/');
        
        if (subtype === '*') {
          // Categoría general
          if (category === 'image') {
            filters.push({
              name: 'Imágenes',
              extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
            });
          } else if (category === 'audio') {
            filters.push({
              name: 'Audio',
              extensions: ['mp3', 'wav', 'ogg', 'flac']
            });
          } else if (category === 'video') {
            filters.push({
              name: 'Video',
              extensions: ['mp4', 'webm', 'avi', 'mov']
            });
          } else if (category === 'application') {
            filters.push({
              name: 'Documentos',
              extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
            });
          }
        } else if (subtype !== '*') {
          // Tipo específico
          const extension = subtype;
          filters.push({
            name: `Archivos ${extension.toUpperCase()}`,
            extensions: [extension]
          });
        }
      }
    });
    
    return filters;
  };
  
  /**
   * Obtiene el tipo MIME a partir del nombre de archivo
   */
  const getMimeType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'txt': 'text/plain',
      'csv': 'text/csv',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript',
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
  };
  
  // Renderizar componente según el entorno
  return (
    <div className="file-uploader">
      {isElectron ? (
        // Versión para Electron
        <button
          className={`electron-file-button ${buttonClassName}`}
          onClick={handleElectronFileSelect}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : buttonText}
        </button>
      ) : (
        // Versión para Web
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleWebFileSelect}
            style={{ display: 'none' }}
            multiple={multiple}
          />
          <button
            className={`web-file-button ${buttonClassName}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {buttonText}
          </button>
        </>
      )}
    </div>
  );
};

