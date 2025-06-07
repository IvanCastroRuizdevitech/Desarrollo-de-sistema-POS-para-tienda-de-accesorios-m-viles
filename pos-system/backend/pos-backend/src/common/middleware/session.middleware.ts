import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import { isProduction } from '../../utils/environment';

/**
 * Middleware para manejar sesiones web
 * Configura express-session para mantener sesiones de usuario en entorno web
 */
@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Configuración de la sesión
    const sessionConfig = {
      secret: process.env.SESSION_SECRET || 'pos-system-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction(), // Usar HTTPS en producción
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 día
        sameSite: isProduction() ? 'none' as 'none' : 'lax' as 'lax', // Permitir cookies en peticiones cross-site en producción
      },
    };
    
    // Aplicar middleware de sesión
    session(sessionConfig)(req, res, () => {
      // Inicializar passport después de la sesión
      passport.initialize()(req, res, () => {
        passport.session()(req, res, next);
      });
    });
  }
}

