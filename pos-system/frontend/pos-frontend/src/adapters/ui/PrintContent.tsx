import React, { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';

/**
 * Props para el componente PrintContent
 */
interface PrintContentProps {
  /**
   * Contenido HTML a imprimir
   */
  content: string;
  
  /**
   * Función que se llama antes de imprimir
   */
  onBeforePrint?: () => void;
  
  /**
   * Función que se llama después de imprimir
   */
  onAfterPrint?: () => void;
  
  /**
   * Texto del botón
   */
  buttonText?: string;
  
  /**
   * Clase CSS para el botón
   */
  buttonClassName?: string;
  
  /**
   * Título del documento a imprimir
   */
  documentTitle?: string;
}

/**
 * Componente para imprimir contenido que se adapta al entorno (web o escritorio)
 */
export const PrintContent: React.FC<PrintContentProps> = ({
  content,
  onBeforePrint,
  onAfterPrint,
  buttonText = 'Imprimir',
  buttonClassName = '',
  documentTitle = 'Documento',
}) => {
  const { isElectron, platform } = usePlatform();
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Maneja la impresión en entorno web
   */
  const handleWebPrint = () => {
    try {
      setIsLoading(true);
      
      if (onBeforePrint) {
        onBeforePrint();
      }
      
      // Crear iframe oculto para imprimir
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Escribir contenido en el iframe
      const iframeDoc = iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${documentTitle}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                }
                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                  }
                }
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `);
        iframeDoc.close();
        
        // Esperar a que se carguen los estilos y las imágenes
        setTimeout(() => {
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            // Limpiar después de imprimir
            setTimeout(() => {
              document.body.removeChild(iframe);
              setIsLoading(false);
              
              if (onAfterPrint) {
                onAfterPrint();
              }
            }, 500);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error al imprimir en entorno web:', error);
      setIsLoading(false);
    }
  };
  
  /**
   * Maneja la impresión en entorno Electron
   */
  const handleElectronPrint = async () => {
    try {
      setIsLoading(true);
      
      if (onBeforePrint) {
        onBeforePrint();
      }
      
      // Usar el API de Electron para imprimir
      await platform.printContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${documentTitle}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      
      if (onAfterPrint) {
        onAfterPrint();
      }
    } catch (error) {
      console.error('Error al imprimir en entorno Electron:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar la impresión según el entorno
  const handlePrint = () => {
    if (isElectron) {
      handleElectronPrint();
    } else {
      handleWebPrint();
    }
  };
  
  return (
    <button
      className={`print-button ${buttonClassName}`}
      onClick={handlePrint}
      disabled={isLoading}
    >
      {isLoading ? 'Imprimiendo...' : buttonText}
    </button>
  );
};

