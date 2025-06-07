import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Persona } from '../personas/entities/persona.entity';
import { SessionMiddleware } from '../../common/middleware/session.middleware';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'pos-system-secret-key',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION') || '1d',
        },
      }),
    }),
    TypeOrmModule.forFeature([Usuario, Persona]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {
  /**
   * Configurar middleware para el módulo de autenticación
   * @param consumer Consumidor de middleware
   */
  configure(consumer: MiddlewareConsumer) {
    // Aplicar middleware de sesión a todas las rutas de autenticación
    consumer
      .apply(SessionMiddleware)
      .forRoutes(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/logout', method: RequestMethod.POST },
        { path: 'auth/check', method: RequestMethod.GET },
        { path: 'auth/profile', method: RequestMethod.GET },
      );
  }
}

