import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let errors = null;
    
    // Manejar errores específicos de TypeORM
    if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Error en la consulta a la base de datos';
      
      // Manejar errores específicos de PostgreSQL
      const pgError = exception as any;
      if (pgError.code) {
        switch (pgError.code) {
          case '23505': // unique_violation
            message = 'Violación de restricción de unicidad';
            break;
          case '23503': // foreign_key_violation
            message = 'Violación de clave foránea';
            break;
          case '23502': // not_null_violation
            message = 'Violación de restricción NOT NULL';
            break;
          case '22P02': // invalid_text_representation
            message = 'Formato de datos inválido';
            break;
        }
      }
    }
    
    // Registrar el error en la consola para depuración
    console.error('Exception:', exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      errors,
    });
  }
}

