import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
  ) {}

  async create(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
    // Verificar si ya existe un registro para este producto en esta tienda
    const existingInventario = await this.inventarioRepository.findOne({
      where: {
        producto_id: createInventarioDto.producto_id,
        tienda_id: createInventarioDto.tienda_id,
      },
    });

    if (existingInventario) {
      throw new BadRequestException('Ya existe un registro de inventario para este producto en esta tienda');
    }

    const inventario = this.inventarioRepository.create(createInventarioDto);
    return this.inventarioRepository.save(inventario);
  }

  async findAll(): Promise<Inventario[]> {
    return this.inventarioRepository.find({
      relations: ['producto', 'tienda'],
    });
  }

  async findOne(id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
      relations: ['producto', 'tienda'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }

    return inventario;
  }

  async findByProductoAndTienda(producto_id: number, tienda_id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepository.findOne({
      where: { producto_id, tienda_id },
      relations: ['producto', 'tienda'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario para producto ${producto_id} en tienda ${tienda_id} no encontrado`);
    }

    return inventario;
  }

  async update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<Inventario> {
    const inventario = await this.findOne(id);
    await this.inventarioRepository.update(id, updateInventarioDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const inventario = await this.findOne(id);
    await this.inventarioRepository.remove(inventario);
  }

  async findByTienda(tienda_id: number): Promise<Inventario[]> {
    return this.inventarioRepository.find({
      where: { tienda_id },
      relations: ['producto', 'tienda'],
    });
  }

  async findByProducto(producto_id: number): Promise<Inventario[]> {
    return this.inventarioRepository.find({
      where: { producto_id },
      relations: ['producto', 'tienda'],
    });
  }

  async findBajoStock(tienda_id: number, limite: number): Promise<Inventario[]> {
    return this.inventarioRepository.find({
      where: { tienda_id, saldo: LessThanOrEqual(limite) },
      relations: ['producto', 'tienda'],
    });
  }
}

