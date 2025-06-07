import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPago } from './entities/metodo-pago.entity';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';

@Injectable()
export class MetodosPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private metodoPagoRepository: Repository<MetodoPago>,
  ) {}

  async create(createMetodoPagoDto: CreateMetodoPagoDto): Promise<MetodoPago> {
    const { nombre } = createMetodoPagoDto;
    
    // Verificar si ya existe un método de pago con el mismo nombre
    const existingMetodoPago = await this.metodoPagoRepository.findOne({
      where: { nombre },
    });

    if (existingMetodoPago) {
      throw new ConflictException(`El método de pago con nombre ${nombre} ya existe`);
    }

    const metodoPago = this.metodoPagoRepository.create(createMetodoPagoDto);
    return this.metodoPagoRepository.save(metodoPago);
  }

  async findAll(): Promise<MetodoPago[]> {
    return this.metodoPagoRepository.find();
  }

  async findOne(id: number): Promise<MetodoPago> {
    const metodoPago = await this.metodoPagoRepository.findOne({
      where: { id },
    });

    if (!metodoPago) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado`);
    }

    return metodoPago;
  }

  async update(id: number, updateMetodoPagoDto: UpdateMetodoPagoDto): Promise<MetodoPago> {
    const metodoPago = await this.findOne(id);
    
    // Si se actualiza el nombre, verificar que no exista
    if (updateMetodoPagoDto.nombre && updateMetodoPagoDto.nombre !== metodoPago.nombre) {
      const existingMetodoPago = await this.metodoPagoRepository.findOne({
        where: { nombre: updateMetodoPagoDto.nombre },
      });

      if (existingMetodoPago) {
        throw new ConflictException(`El método de pago con nombre ${updateMetodoPagoDto.nombre} ya existe`);
      }
    }

    await this.metodoPagoRepository.update(id, updateMetodoPagoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const metodoPago = await this.findOne(id);
    await this.metodoPagoRepository.remove(metodoPago);
  }
}

