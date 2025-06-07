import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from '../inventario/entities/inventario.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Tienda } from '../tiendas/entities/tienda.entity';

@Injectable()
export class AlertasService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Tienda)
    private tiendaRepository: Repository<Tienda>,
  ) {}

  async getAlertasBajoStock(tienda_id: number, limite: number = 10): Promise<any[]> {
    // Consulta para obtener productos con bajo stock
    const query = this.inventarioRepository
      .createQueryBuilder('inventario')
      .innerJoin('inventario.producto', 'producto')
      .innerJoin('inventario.tienda', 'tienda')
      .select([
        'producto.id as producto_id',
        'producto.nombre as nombre_producto',
        'producto.categoria as categoria',
        'inventario.saldo as stock_actual',
        'tienda.id as tienda_id',
        'tienda.nombre as nombre_tienda',
      ])
      .where('inventario.tienda_id = :tienda_id', { tienda_id })
      .andWhere('inventario.saldo <= :limite', { limite })
      .orderBy('inventario.saldo', 'ASC');
    
    return query.getRawMany();
  }

  async getAlertasBajoStockTodasTiendas(limite: number = 10): Promise<any[]> {
    // Consulta para obtener productos con bajo stock en todas las tiendas
    const query = this.inventarioRepository
      .createQueryBuilder('inventario')
      .innerJoin('inventario.producto', 'producto')
      .innerJoin('inventario.tienda', 'tienda')
      .select([
        'producto.id as producto_id',
        'producto.nombre as nombre_producto',
        'producto.categoria as categoria',
        'inventario.saldo as stock_actual',
        'tienda.id as tienda_id',
        'tienda.nombre as nombre_tienda',
      ])
      .where('inventario.saldo <= :limite', { limite })
      .orderBy('inventario.saldo', 'ASC')
      .addOrderBy('tienda.nombre', 'ASC');
    
    return query.getRawMany();
  }

  async getAlertasStockCero(): Promise<any[]> {
    // Consulta para obtener productos con stock cero
    const query = this.inventarioRepository
      .createQueryBuilder('inventario')
      .innerJoin('inventario.producto', 'producto')
      .innerJoin('inventario.tienda', 'tienda')
      .select([
        'producto.id as producto_id',
        'producto.nombre as nombre_producto',
        'producto.categoria as categoria',
        'inventario.saldo as stock_actual',
        'tienda.id as tienda_id',
        'tienda.nombre as nombre_tienda',
      ])
      .where('inventario.saldo = 0')
      .orderBy('tienda.nombre', 'ASC')
      .addOrderBy('producto.nombre', 'ASC');
    
    return query.getRawMany();
  }

  async getAlertasProductosSinMovimiento(dias: number = 30): Promise<any[]> {
    // Calcular fecha límite
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);
    
    // Consulta para obtener productos sin movimiento en el período especificado
    const query = this.inventarioRepository
      .createQueryBuilder('inventario')
      .innerJoin('inventario.producto', 'producto')
      .innerJoin('inventario.tienda', 'tienda')
      .leftJoin('producto.kardexs', 'kardex', 'kardex.tienda_id = inventario.tienda_id AND kardex.fecha >= :fechaLimite', { fechaLimite })
      .select([
        'producto.id as producto_id',
        'producto.nombre as nombre_producto',
        'producto.categoria as categoria',
        'inventario.saldo as stock_actual',
        'tienda.id as tienda_id',
        'tienda.nombre as nombre_tienda',
      ])
      .where('kardex.id IS NULL')
      .andWhere('inventario.saldo > 0')
      .orderBy('tienda.nombre', 'ASC')
      .addOrderBy('producto.nombre', 'ASC');
    
    return query.getRawMany();
  }
}

