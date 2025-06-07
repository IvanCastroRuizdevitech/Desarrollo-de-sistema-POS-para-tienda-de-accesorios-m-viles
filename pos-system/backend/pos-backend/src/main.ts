import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { corsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar prefijo global para la API
  app.setGlobalPrefix('api');
  
  // Configurar CORS
  app.enableCors(corsConfig);
  
  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Configurar filtros de excepciones
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(),
  );
  
  // Configurar interceptores
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('POS System API')
    .setDescription('API para el sistema POS de tienda de accesorios móviles')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Iniciar servidor
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Aplicación iniciada en: http://localhost:${port}/api`);
  console.log(`Documentación disponible en: http://localhost:${port}/api/docs`);
}
bootstrap();

