import { Injectable, UnauthorizedException, ConflictException, NotFoundException, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Persona } from '../personas/entities/persona.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { isElectronRequest, getClientType } from '../../utils/environment';

// Extender la interfaz SessionData para incluir userRole
declare module 'express-session' {
  interface SessionData {
    userRole?: string;
  }
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    private jwtService: JwtService,
  ) {}

  /**
   * Autenticar usuario y generar token JWT
   * @param loginDto Datos de inicio de sesión
   * @param req Objeto de petición Express
   * @returns Token JWT y datos del usuario
   */
  async login(loginDto: LoginDto, @Req() req: Request) {
    const { correo, contraseña } = loginDto;
    
    // Buscar usuario por correo
    const usuario = await this.usuarioRepository.findOne({
      where: { correo },
      relations: ['rol', 'persona'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Generar token JWT
    const payload = {
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol.nombre,
      permisos: usuario.rol.permisos,
      client_type: getClientType(req), // Incluir tipo de cliente en el token
    };

    // Configurar opciones del token según el tipo de cliente
    const tokenOptions = {
      expiresIn: isElectronRequest(req) ? '30d' : '1d', // Token más largo para Electron
    };

    // Si es una petición web, establecer la sesión
    if (!isElectronRequest(req) && req.session) {
      req.session.userId = usuario.id.toString();
      req.session.userRole = usuario.rol.nombre;
    }

    return {
      access_token: this.jwtService.sign(payload, tokenOptions),
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
        nombre: usuario.persona.nombre,
      },
      client_type: getClientType(req),
    };
  }

  /**
   * Registrar un nuevo usuario
   * @param registerDto Datos de registro
   * @returns Datos del usuario registrado
   */
  async register(registerDto: RegisterDto) {
    const { correo, contraseña, nombre, telefono, direccion, tipo, tipo_identificacion_id, numero_identificacion, rol_id } = registerDto;
    
    // Verificar si el correo ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { correo },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Verificar si el número de identificación ya existe
    const existingPersona = await this.personaRepository.findOne({
      where: { numero_identificacion },
    });

    if (existingPersona) {
      throw new ConflictException('El número de identificación ya está registrado');
    }

    // Crear persona
    const persona = this.personaRepository.create({
      nombre,
      telefono,
      direccion,
      tipo,
      tipo_identificacion_id,
      numero_identificacion,
    });

    const savedPersona = await this.personaRepository.save(persona);

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear usuario
    const usuario = this.usuarioRepository.create({
      correo,
      contraseña: hashedPassword,
      persona_id: savedPersona.id,
      rol_id,
      activo: true,
    });

    const savedUsuario = await this.usuarioRepository.save(usuario);

    return {
      id: savedUsuario.id,
      correo: savedUsuario.correo,
      persona_id: savedUsuario.persona_id,
      rol_id: savedUsuario.rol_id,
      activo: savedUsuario.activo,
    };
  }

  /**
   * Validar usuario por ID
   * @param userId ID del usuario
   * @returns Datos del usuario validado
   */
  async validateUser(userId: number): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: ['rol'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return {
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol.nombre,
      permisos: usuario.rol.permisos,
    };
  }

  /**
   * Validar usuario por sesión web
   * @param req Objeto de petición Express
   * @returns Datos del usuario validado
   */
  async validateUserBySession(req: Request): Promise<any> {
    if (!req.session || !req.session.userId) {
      throw new UnauthorizedException('Sesión no válida');
    }

    return this.validateUser(Number(req.session.userId));
  }

  /**
   * Cerrar sesión
   * @param req Objeto de petición Express
   * @returns Mensaje de confirmación
   */
  async logout(req: Request): Promise<{ message: string }> {
    // Si es una petición web, destruir la sesión
    if (!isElectronRequest(req) && req.session) {
      return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            reject(err);
          } else {
            resolve({ message: 'Sesión cerrada correctamente' });
          }
        });
      });
    }

    // Para Electron, no hay sesión que destruir
    return { message: 'Sesión cerrada correctamente' };
  }
}

