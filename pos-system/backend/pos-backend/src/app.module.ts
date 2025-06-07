import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { RolesModule } from './modules/roles/roles.module';
import { ProductosModule } from './modules/productos/productos.module';
import { InventarioModule } from './modules/inventario/inventario.module';
import { KardexModule } from './modules/kardex/kardex.module';
import { MetodosPagoModule } from './modules/metodos-pago/metodos-pago.module';
import { VentasModule } from './modules/ventas/ventas.module';
import { GastosModule } from './modules/gastos/gastos.module';
import { ReportesModule } from './modules/reportes/reportes.module';
import { AlertasModule } from './modules/alertas/alertas.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SessionMiddleware } from './common/middleware/session.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // No sincronizar automáticamente en producción
        logging: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    UsuariosModule,
    RolesModule,
    ProductosModule,
    InventarioModule,
    KardexModule,
    MetodosPagoModule,
    VentasModule,
    GastosModule,
    ReportesModule,
    AlertasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  /**
   * Configurar middleware para la aplicación
   * @param consumer Consumidor de middleware
   */
  configure(consumer: MiddlewareConsumer) {
    // Aplicar middleware de registro para todas las rutas
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    
    // Aplicar middleware de sesión para rutas específicas que no están en el módulo de autenticación
    // El módulo de autenticación ya tiene su propio middleware de sesión configurado
    consumer
      .apply(SessionMiddleware)
      .exclude(
        { path: 'auth/*', method: RequestMethod.ALL }, // Excluir rutas de autenticación (ya configuradas en AuthModule)
        { path: 'api-docs', method: RequestMethod.ALL }, // Excluir documentación de Swagger
      )
      .forRoutes(
        // Rutas que requieren sesión para usuarios web
        { path: 'usuarios/*', method: RequestMethod.ALL },
        { path: 'productos/*', method: RequestMethod.ALL },
        { path: 'inventario/*', method: RequestMethod.ALL },
        { path: 'ventas/*', method: RequestMethod.ALL },
        { path: 'gastos/*', method: RequestMethod.ALL },
        { path: 'reportes/*', method: RequestMethod.ALL },
        { path: 'alertas/*', method: RequestMethod.ALL },
      );
  }
}

