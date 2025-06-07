import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Unidad } from './entities/unidad.entity';
import { Impuesto } from './entities/impuesto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { CreateImpuestoDto } from './dto/create-impuesto.dto';
import { UpdateImpuestoDto } from './dto/update-impuesto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Unidad)
    private unidadRepository: Repository<Unidad>,
    @InjectRepository(Impuesto)
    private impuestoRepository: Repository<Impuesto>,
  ) {}

  // Métodos para Productos
  async createProducto(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productoRepository.create(createProductoDto);
    return this.productoRepository.save(producto);
  }

  async findAllProductos(): Promise<Producto[]> {
    return this.productoRepository.find({
      relations: ['unidad', 'impuesto'],
    });
  }

  async findProductoById(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['unidad', 'impuesto'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async updateProducto(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findProductoById(id);
    await this.productoRepository.update(id, updateProductoDto);
    return this.findProductoById(id);
  }

  async removeProducto(id: number): Promise<void> {
    const producto = await this.findProductoById(id);
    await this.productoRepository.remove(producto);
  }

  async findProductosByCategoria(categoria: string): Promise<Producto[]> {
    return this.productoRepository.find({
      where: { categoria },
      relations: ['unidad', 'impuesto'],
    });
  }

  // Métodos para Unidades
  async createUnidad(createUnidadDto: CreateUnidadDto): Promise<Unidad> {
    const unidad = this.unidadRepository.create(createUnidadDto);
    return this.unidadRepository.save(unidad);
  }

  async findAllUnidades(): Promise<Unidad[]> {
    return this.unidadRepository.find();
  }

  async findUnidadById(id: number): Promise<Unidad> {
    const unidad = await this.unidadRepository.findOne({
      where: { id },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con ID ${id} no encontrada`);
    }

    return unidad;
  }

  async updateUnidad(id: number, updateUnidadDto: UpdateUnidadDto): Promise<Unidad> {
    const unidad = await this.findUnidadById(id);
    await this.unidadRepository.update(id, updateUnidadDto);
    return this.findUnidadById(id);
  }

  async removeUnidad(id: number): Promise<void> {
    const unidad = await this.findUnidadById(id);
    await this.unidadRepository.remove(unidad);
  }

  // Métodos para Impuestos
  async createImpuesto(createImpuestoDto: CreateImpuestoDto): Promise<Impuesto> {
    const impuesto = this.impuestoRepository.create(createImpuestoDto);
    return this.impuestoRepository.save(impuesto);
  }

  async findAllImpuestos(): Promise<Impuesto[]> {
    return this.impuestoRepository.find();
  }

  async findImpuestoById(id: number): Promise<Impuesto> {
    const impuesto = await this.impuestoRepository.findOne({
      where: { id },
    });

    if (!impuesto) {
      throw new NotFoundException(`Impuesto con ID ${id} no encontrado`);
    }

    return impuesto;
  }

  async updateImpuesto(id: number, updateImpuestoDto: UpdateImpuestoDto): Promise<Impuesto> {
    const impuesto = await this.findImpuestoById(id);
    await this.impuestoRepository.update(id, updateImpuestoDto);
    return this.findImpuestoById(id);
  }

  async removeImpuesto(id: number): Promise<void> {
    const impuesto = await this.findImpuestoById(id);
    await this.impuestoRepository.remove(impuesto);
  }
}

