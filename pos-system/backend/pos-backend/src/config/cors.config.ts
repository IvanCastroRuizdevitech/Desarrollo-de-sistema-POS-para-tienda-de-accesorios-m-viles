import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * Configuración de CORS para permitir peticiones desde diferentes orígenes
 * Incluye soporte para entornos de desarrollo, producción, Electron y web
 */
export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (process.env.NODE_ENV === 'development') {
      // Permitir cualquier origen en desarrollo
      callback(null, true);
    } else {
      const allowedOrigins = [
        'http://localhost:3000',  // Frontend React en desarrollo
        'http://localhost:8080',  // Frontend en Electron desarrollo
        'app://*',                // Electron en producción
        'electron://*',           // Electron en producción (alternativo)
        'https://pos-system-web.example.com',  // Dominio de producción (reemplazar con el dominio real)
      ];
      if (!origin || allowedOrigins.some(o => {
        if (o.endsWith('*')) {
          // Soporte para comodines simples
          return origin.startsWith(o.replace('*', ''));
        }
        return origin === o;
      })) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    }
  },
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  exposedHeaders: ['Content-Disposition', 'X-Total-Count'],
  maxAge: 3600,
  
  // Configuración adicional para entornos de producción
  ...(process.env.NODE_ENV === 'production' ? {
    // En producción, podemos ser más restrictivos si es necesario
    preflightContinue: false,
    optionsSuccessStatus: 204,
  } : {}),
};

