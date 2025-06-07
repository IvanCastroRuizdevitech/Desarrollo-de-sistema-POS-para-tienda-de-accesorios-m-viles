import { Controller, Post, Body, HttpCode, HttpStatus, Req, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';

// Extiende la interfaz SessionData para incluir userId
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { getClientType } from '../../utils/environment';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Iniciar sesión
   * @param loginDto Datos de inicio de sesión
   * @param req Objeto de petición Express
   * @returns Token JWT y datos del usuario
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    return this.authService.login(loginDto, req);
  }

  /**
   * Registrar un nuevo usuario
   * @param registerDto Datos de registro
   * @returns Datos del usuario registrado
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'El correo o número de identificación ya está registrado' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Obtener perfil del usuario autenticado
   * @param req Objeto de petición Express
   * @returns Datos del usuario autenticado
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getProfile(@Req() req: Request) {
    // El usuario ya está validado por el guard
    return {
      ...req.user,
      client_type: getClientType(req),
    };
  }

  /**
   * Cerrar sesión
   * @param req Objeto de petición Express
   * @returns Mensaje de confirmación
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async logout(@Req() req: Request) {
    return this.authService.logout(req);
  }

  /**
   * Verificar estado de autenticación
   * @param req Objeto de petición Express
   * @returns Estado de autenticación
   */
  @Get('check')
  @ApiOperation({ summary: 'Verificar estado de autenticación' })
  @ApiResponse({ status: 200, description: 'Estado de autenticación' })
  async checkAuth(@Req() req: Request) {
    try {
      // Intentar validar por JWT o sesión
      if (req.user) {
        // Usuario autenticado por JWT
        return {
          authenticated: true,
          user: req.user,
          client_type: getClientType(req),
        };
      } else if (req.session && req.session.userId) {
        // Usuario autenticado por sesión
        const user = await this.authService.validateUserBySession(req);
        return {
          authenticated: true,
          user,
          client_type: getClientType(req),
        };
      }
      
      // No autenticado
      return {
        authenticated: false,
        client_type: getClientType(req),
      };
    } catch (error) {
      return {
        authenticated: false,
        client_type: getClientType(req),
      };
    }
  }
}

