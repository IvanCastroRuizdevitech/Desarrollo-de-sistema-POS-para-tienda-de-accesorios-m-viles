import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Kardex } from './entities/kardex.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { CreateKardexDto } from './dto/create-kardex.dto';
import { TipoMovimiento } from '../../common/enums';

@Injectable()
export class KardexService {
  constructor(
    @InjectRepository(Kardex)
    private kardexRepository: Repository<Kardex>,
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    private dataSource: DataSource,
  ) {}

  async create(createKardexDto: CreateKardexDto): Promise<Kardex> {
    const { producto_id, tienda_id, tipo_movimiento, cantidad } = createKardexDto;
    
    // Iniciar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Buscar el inventario actual
      let inventario = await this.inventarioRepository.findOne({
        where: { producto_id, tienda_id },
      });
      
      // Si no existe el inventario y es una entrada, crearlo
      if (!inventario && tipo_movimiento === TipoMovimiento.ENTRADA) {
        inventario = this.inventarioRepository.create({
          producto_id,
          tienda_id,
          saldo: 0,
        });
        await this.inventarioRepository.save(inventario);
      } else if (!inventario) {
        throw new BadRequestException('No existe inventario para este producto en esta tienda');
      }
      
      // Calcular nuevo saldo según el tipo de movimiento
      let nuevoSaldo = inventario.saldo;
      
      if (tipo_movimiento === TipoMovimiento.ENTRADA) {
        nuevoSaldo += cantidad;
      } else {
        // Para salidas y ventas, verificar que haya suficiente stock
        if (inventario.saldo < cantidad) {
          throw new BadRequestException('No hay suficiente stock para realizar este movimiento');
        }
        nuevoSaldo -= cantidad;
      }
      
      // Actualizar inventario
      await this.inventarioRepository.update(
        { producto_id, tienda_id },
        { saldo: nuevoSaldo }
      );
      
      // Crear registro kardex
      const kardex = this.kardexRepository.create({
        ...createKardexDto,
        saldo: nuevoSaldo,
      });
      
      const result = await this.kardexRepository.save(kardex);
      
      // Confirmar transacción
      await queryRunner.commitTransaction();
      
      return result;
    } catch (error) {
      // Revertir transacción en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Kardex[]> {
    return this.kardexRepository.find({
      relations: ['producto', 'tienda'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Kardex> {
    const kardex = await this.kardexRepository.findOne({
      where: { id },
      relations: ['producto', 'tienda'],
    });

    if (!kardex) {
      throw new NotFoundException(`Kardex con ID ${id} no encontrado`);
    }

    return kardex;
  }

  async findByProducto(producto_id: number): Promise<Kardex[]> {
    return this.kardexRepository.find({
      where: { producto_id },
      relations: ['producto', 'tienda'],
      order: { fecha: 'DESC' },
    });
  }

  async findByTienda(tienda_id: number): Promise<Kardex[]> {
    return this.kardexRepository.find({
      where: { tienda_id },
      relations: ['producto', 'tienda'],
      order: { fecha: 'DESC' },
    });
  }

  async findByProductoAndTienda(producto_id: number, tienda_id: number): Promise<Kardex[]> {
    return this.kardexRepository.find({
      where: { producto_id, tienda_id },
      relations: ['producto', 'tienda'],
      order: { fecha: 'DESC' },
    });
  }

  async findByFechas(fechaInicio: Date, fechaFin: Date): Promise<Kardex[]> {
    return this.kardexRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin),
      },
      relations: ['producto', 'tienda'],
      order: { fecha: 'DESC' },
    });
  }
}

