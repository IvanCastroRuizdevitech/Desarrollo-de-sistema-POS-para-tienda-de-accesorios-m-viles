import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    
    return next.handle().pipe(
      map(data => ({
        statusCode,
        message: this.getMessageForStatusCode(statusCode),
        data,
      })),
    );
  }
  
  private getMessageForStatusCode(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return 'Operación exitosa';
      case 201:
        return 'Recurso creado exitosamente';
      case 204:
        return 'Recurso eliminado exitosamente';
      default:
        return 'Operación procesada';
    }
  }
}

