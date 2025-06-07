import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { correo, contraseña } = createUsuarioDto;
    
    // Verificar si el correo ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { correo },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear usuario
    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      contraseña: hashedPassword,
    });

    return this.usuarioRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      relations: ['persona', 'rol'],
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['persona', 'rol'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    // Si se actualiza el correo, verificar que no exista
    if (updateUsuarioDto.correo && updateUsuarioDto.correo !== usuario.correo) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { correo: updateUsuarioDto.correo },
      });

      if (existingUser) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
    }

    // Si se actualiza la contraseña, encriptarla
    if (updateUsuarioDto.contraseña) {
      updateUsuarioDto.contraseña = await bcrypt.hash(updateUsuarioDto.contraseña, 10);
    }

    // Actualizar usuario
    await this.usuarioRepository.update(id, updateUsuarioDto);
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }

  async changeStatus(id: number, activo: boolean): Promise<Usuario> {
    const usuario = await this.findOne(id);
    usuario.activo = activo;
    return this.usuarioRepository.save(usuario);
  }
}

