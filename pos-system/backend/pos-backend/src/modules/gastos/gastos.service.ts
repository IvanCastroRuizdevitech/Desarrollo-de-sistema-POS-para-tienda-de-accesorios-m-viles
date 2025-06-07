import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Gasto } from './entities/gasto.entity';
import { DetalleGasto } from './entities/detalle-gasto.entity';
import { CreateGastoDto } from './dto/create-gasto.dto';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private gastoRepository: Repository<Gasto>,
    @InjectRepository(DetalleGasto)
    private detalleGastoRepository: Repository<DetalleGasto>,
    private dataSource: DataSource,
  ) {}

  async create(createGastoDto: CreateGastoDto): Promise<Gasto> {
    const { tienda_id, detalles } = createGastoDto;
    
    // Iniciar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Calcular total
      const total = detalles.reduce((sum, detalle) => sum + detalle.monto, 0);
      
      // Crear gasto
      const gasto = this.gastoRepository.create({
        tienda_id,
        total,
      });
      
      const savedGasto = await this.gastoRepository.save(gasto);
      
      // Crear detalles de gasto
      for (const detalle of detalles) {
        const { concepto, monto } = detalle;
        
        const detalleGasto = this.detalleGastoRepository.create({
          gasto_id: savedGasto.id,
          concepto,
          monto,
        });
        
        await this.detalleGastoRepository.save(detalleGasto);
      }
      
      // Confirmar transacción
      await queryRunner.commitTransaction();
      
      // Retornar gasto completo con detalles
      return this.findOne(savedGasto.id);
    } catch (error) {
      // Revertir transacción en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Gasto[]> {
    return this.gastoRepository.find({
      relations: ['tienda', 'detalles'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Gasto> {
    const gasto = await this.gastoRepository.findOne({
      where: { id },
      relations: ['tienda', 'detalles'],
    });

    if (!gasto) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
    }

    return gasto;
  }

  async findByTienda(tienda_id: number): Promise<Gasto[]> {
    return this.gastoRepository.find({
      where: { tienda_id },
      relations: ['tienda', 'detalles'],
      order: { fecha: 'DESC' },
    });
  }

  async findByFechas(fechaInicio: Date, fechaFin: Date): Promise<Gasto[]> {
    return this.gastoRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin),
      },
      relations: ['tienda', 'detalles'],
      order: { fecha: 'DESC' },
    });
  }

  async getGastosPorConcepto(fechaInicio: Date, fechaFin: Date): Promise<any[]> {
    const gastos = await this.gastoRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin),
      },
      relations: ['detalles'],
    });

    const gastosPorConcepto = {};
    
    gastos.forEach(gasto => {
      gasto.detalles.forEach(detalle => {
        const concepto = detalle.concepto;
        if (!gastosPorConcepto[concepto]) {
          gastosPorConcepto[concepto] = {
            concepto,
            cantidad: 0,
            total: 0,
          };
        }
        gastosPorConcepto[concepto].cantidad += 1;
        gastosPorConcepto[concepto].total += Number(detalle.monto);
      });
    });

    return Object.values(gastosPorConcepto);
  }

  async remove(id: number): Promise<void> {
    const gasto = await this.findOne(id);
    
    // Iniciar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Eliminar detalles de gasto
      await this.detalleGastoRepository.delete({ gasto_id: id });
      
      // Eliminar gasto
      await this.gastoRepository.remove(gasto);
      
      // Confirmar transacción
      await queryRunner.commitTransaction();
    } catch (error) {
      // Revertir transacción en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }
}

