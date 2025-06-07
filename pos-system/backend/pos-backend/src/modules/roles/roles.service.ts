import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const { nombre } = createRolDto;
    
    // Verificar si el nombre ya existe
    const existingRol = await this.rolRepository.findOne({
      where: { nombre },
    });

    if (existingRol) {
      throw new ConflictException(`El rol con nombre ${nombre} ya existe`);
    }

    // Crear rol
    const rol = this.rolRepository.create(createRolDto);
    return this.rolRepository.save(rol);
  }

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find();
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { id },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    const rol = await this.findOne(id);

    // Si se actualiza el nombre, verificar que no exista
    if (updateRolDto.nombre && updateRolDto.nombre !== rol.nombre) {
      const existingRol = await this.rolRepository.findOne({
        where: { nombre: updateRolDto.nombre },
      });

      if (existingRol) {
        throw new ConflictException(`El rol con nombre ${updateRolDto.nombre} ya existe`);
      }
    }

    // Actualizar rol
    await this.rolRepository.update(id, updateRolDto);
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const rol = await this.findOne(id);
    await this.rolRepository.remove(rol);
  }
}

