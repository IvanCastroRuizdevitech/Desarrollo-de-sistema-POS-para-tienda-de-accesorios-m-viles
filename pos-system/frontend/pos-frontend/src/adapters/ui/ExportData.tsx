import React, { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';

/**
 * Tipos de formato de exportación soportados
 */
export type ExportFormat = 'csv' | 'json' | 'pdf' | 'xlsx';

/**
 * Props para el componente ExportData
 */
interface ExportDataProps {
  /**
   * Datos a exportar
   */
  data: any;
  
  /**
   * Nombre del archivo (sin extensión)
   */
  filename: string;
  
  /**
   * Formatos disponibles para exportar
   */
  formats?: ExportFormat[];
  
  /**
   * Texto del botón
   */
  buttonText?: string;
  
  /**
   * Clase CSS para el botón
   */
  buttonClassName?: string;
  
  /**
   * Función que se llama antes de exportar
   */
  onBeforeExport?: () => void;
  
  /**
   * Función que se llama después de exportar
   */
  onAfterExport?: (format: ExportFormat) => void;
  
  /**
   * Función personalizada para convertir datos a formato específico
   */
  customConverter?: (data: any, format: ExportFormat) => string | Blob;
}

/**
 * Componente para exportar datos que se adapta al entorno (web o escritorio)
 */
export const ExportData: React.FC<ExportDataProps> = ({
  data,
  filename,
  formats = ['csv', 'json'],
  buttonText = 'Exportar',
  buttonClassName = '',
  onBeforeExport,
  onAfterExport,
  customConverter,
}) => {
  const { isElectron, platform } = usePlatform();
  const [isLoading, setIsLoading] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  
  /**
   * Convierte los datos al formato especificado
   */
  const convertData = (format: ExportFormat): string | Blob => {
    // Si hay un convertidor personalizado, usarlo
    if (customConverter) {
      return customConverter(data, format);
    }
    
    // Convertidores predeterminados
    switch (format) {
      case 'csv':
        return convertToCSV(data);
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'pdf':
        // La conversión a PDF es más compleja y normalmente requiere bibliotecas adicionales
        // Esta es una implementación básica que genera HTML para imprimir como PDF
        return new Blob([generatePdfHtml(data)], { type: 'text/html' });
      case 'xlsx':
        // La conversión a XLSX es compleja y requiere bibliotecas como SheetJS
        // Esta es una implementación básica que genera CSV como alternativa
        return convertToCSV(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  };
  
  /**
   * Convierte datos a formato CSV
   */
  const convertToCSV = (data: any): string => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return '';
    }
    
    // Obtener encabezados
    const headers = Object.keys(data[0]);
    
    // Crear línea de encabezados
    const headerRow = headers.join(',');
    
    // Crear filas de datos
    const rows = data.map(item => {
      return headers.map(header => {
        const cell = item[header];
        // Escapar comas y comillas
        if (cell === null || cell === undefined) {
          return '';
        } else if (typeof cell === 'string') {
          return `"${cell.replace(/"/g, '""')}"`;
        } else {
          return cell;
        }
      }).join(',');
    });
    
    // Combinar encabezados y filas
    return [headerRow, ...rows].join('\\n');
  };
  
  /**
   * Genera HTML para exportar como PDF
   */
  const generatePdfHtml = (data: any): string => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return '<p>No hay datos para exportar</p>';
    }
    
    // Obtener encabezados
    const headers = Object.keys(data[0]);
    
    // Crear tabla HTML
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <table>
            <thead>
              <tr>
    `;
    
    // Agregar encabezados
    headers.forEach(header => {
      html += `<th>${header}</th>`;
    });
    
    html += `
              </tr>
            </thead>
            <tbody>
    `;
    
    // Agregar filas de datos
    data.forEach((item: any) => {
      html += '<tr>';
      headers.forEach(header => {
        const cell = item[header];
        html += `<td>${cell !== null && cell !== undefined ? cell : ''}</td>`;
      });
      html += '</tr>';
    });
    
    html += `
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    return html;
  };
  
  /**
   * Obtiene el tipo MIME según el formato
   */
  const getMimeType = (format: ExportFormat): string => {
    switch (format) {
      case 'csv':
        return 'text/csv';
      case 'json':
        return 'application/json';
      case 'pdf':
        return 'application/pdf';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default:
        return 'text/plain';
    }
  };
  
  /**
   * Maneja la exportación en entorno web
   */
  const handleWebExport = (format: ExportFormat) => {
    try {
      setIsLoading(true);
      setShowFormats(false);
      
      if (onBeforeExport) {
        onBeforeExport();
      }
      
      // Convertir datos al formato seleccionado
      const content = convertData(format);
      const mimeType = getMimeType(format);
      
      // Crear blob y URL
      const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${format}`;
      link.style.display = 'none';
      
      // Agregar al DOM, hacer clic y limpiar
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsLoading(false);
        
        if (onAfterExport) {
          onAfterExport(format);
        }
      }, 100);
    } catch (error) {
      console.error(`Error al exportar en formato ${format}:`, error);
      setIsLoading(false);
    }
  };
  
  /**
   * Maneja la exportación en entorno Electron
   */
  const handleElectronExport = async (format: ExportFormat) => {
    try {
      setIsLoading(true);
      setShowFormats(false);
      
      if (onBeforeExport) {
        onBeforeExport();
      }
      
      // Convertir datos al formato seleccionado
      const content = convertData(format);
      
      // Mostrar diálogo para guardar archivo
      const options = {
        title: `Guardar ${filename}.${format}`,
        defaultPath: `${filename}.${format}`,
        filters: [
          { name: format.toUpperCase(), extensions: [format] },
          { name: 'Todos los archivos', extensions: ['*'] }
        ]
      };
      
      const filePath = await platform.showSaveDialog(options);
      
      if (filePath) {
        // En una implementación real, aquí usaríamos el API de Electron para escribir el archivo
        // Como estamos en un entorno simulado, mostramos un mensaje
        console.log(`Archivo guardado en: ${filePath}`);
        
        if (onAfterExport) {
          onAfterExport(format);
        }
      }
    } catch (error) {
      console.error(`Error al exportar en formato ${format}:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Maneja la exportación según el entorno
   */
  const handleExport = (format: ExportFormat) => {
    if (isElectron) {
      handleElectronExport(format);
    } else {
      handleWebExport(format);
    }
  };
  
  return (
    <div className="export-data-container">
      <button
        className={`export-button ${buttonClassName}`}
        onClick={() => setShowFormats(!showFormats)}
        disabled={isLoading}
      >
        {isLoading ? 'Exportando...' : buttonText}
      </button>
      
      {showFormats && (
        <div className="export-formats">
          {formats.map(format => (
            <button
              key={format}
              className="format-button"
              onClick={() => handleExport(format)}
              disabled={isLoading}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

