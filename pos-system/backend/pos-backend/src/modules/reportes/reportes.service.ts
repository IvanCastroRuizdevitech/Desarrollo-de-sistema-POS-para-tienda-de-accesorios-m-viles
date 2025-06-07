import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Venta } from '../ventas/entities/venta.entity';
import { Gasto } from '../gastos/entities/gasto.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(Gasto)
    private gastoRepository: Repository<Gasto>,
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async getBalanceMensual(tienda_id: number, año: number, mes: number): Promise<any> {
    // Calcular fechas de inicio y fin del mes
    const fechaInicio = new Date(año, mes - 1, 1);
    const fechaFin = new Date(año, mes, 0, 23, 59, 59);
    
    // Obtener ventas del mes
    const ventas = await this.ventaRepository.find({
      where: {
        tienda_id,
        fecha: Between(fechaInicio, fechaFin),
      },
    });
    
    // Obtener gastos del mes
    const gastos = await this.gastoRepository.find({
      where: {
        tienda_id,
        fecha: Between(fechaInicio, fechaFin),
      },
    });
    
    // Calcular totales
    const totalVentas = ventas.reduce((sum, venta) => sum + Number(venta.total), 0);
    const totalGastos = gastos.reduce((sum, gasto) => sum + Number(gasto.total), 0);
    const balance = totalVentas - totalGastos;
    
    return {
      tienda_id,
      año,
      mes,
      fechaInicio,
      fechaFin,
      totalVentas,
      totalGastos,
      balance,
      cantidadVentas: ventas.length,
      cantidadGastos: gastos.length,
    };
  }

  async getProductosMasVendidos(tienda_id: number, fechaInicio: Date, fechaFin: Date, limite: number = 10): Promise<any[]> {
    // Consulta personalizada para obtener productos más vendidos
    const query = this.ventaRepository
      .createQueryBuilder('venta')
      .innerJoin('venta.detalles', 'detalle')
      .innerJoin('detalle.producto', 'producto')
      .select([
        'producto.id as producto_id',
        'producto.nombre as nombre',
        'SUM(detalle.cantidad) as cantidad_vendida',
        'SUM(detalle.subtotal) as total_ventas',
      ])
      .where('venta.tienda_id = :tienda_id', { tienda_id })
      .andWhere('venta.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .groupBy('producto.id, producto.nombre')
      .orderBy('cantidad_vendida', 'DESC')
      .limit(limite);
    
    return query.getRawMany();
  }

  async getProductosBajoStock(tienda_id: number, limite: number = 10): Promise<any[]> {
    // Consulta para obtener productos con bajo stock
    const query = this.inventarioRepository
      .createQueryBuilder('inventario')
      .innerJoin('inventario.producto', 'producto')
      .select([
        'producto.id as producto_id',
        'producto.nombre as nombre',
        'inventario.saldo as stock_actual',
      ])
      .where('inventario.tienda_id = :tienda_id', { tienda_id })
      .andWhere('inventario.saldo <= :limite', { limite })
      .orderBy('inventario.saldo', 'ASC');
    
    return query.getRawMany();
  }

  async getVentasPorDia(tienda_id: number, fechaInicio: Date, fechaFin: Date): Promise<any[]> {
    // Consulta para obtener ventas agrupadas por día
    const query = this.ventaRepository
      .createQueryBuilder('venta')
      .select([
        'DATE(venta.fecha) as fecha',
        'COUNT(venta.id) as cantidad_ventas',
        'SUM(venta.total) as total_ventas',
      ])
      .where('venta.tienda_id = :tienda_id', { tienda_id })
      .andWhere('venta.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .groupBy('DATE(venta.fecha)')
      .orderBy('fecha', 'ASC');
    
    return query.getRawMany();
  }

  async getGastosPorDia(tienda_id: number, fechaInicio: Date, fechaFin: Date): Promise<any[]> {
    // Consulta para obtener gastos agrupados por día
    const query = this.gastoRepository
      .createQueryBuilder('gasto')
      .select([
        'DATE(gasto.fecha) as fecha',
        'COUNT(gasto.id) as cantidad_gastos',
        'SUM(gasto.total) as total_gastos',
      ])
      .where('gasto.tienda_id = :tienda_id', { tienda_id })
      .andWhere('gasto.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .groupBy('DATE(gasto.fecha)')
      .orderBy('fecha', 'ASC');
    
    return query.getRawMany();
  }

  async getVentasPorVendedor(tienda_id: number, fechaInicio: Date, fechaFin: Date): Promise<any[]> {
    // Consulta para obtener ventas agrupadas por vendedor
    const query = this.ventaRepository
      .createQueryBuilder('venta')
      .innerJoin('venta.vendedor', 'vendedor')
      .select([
        'vendedor.id as vendedor_id',
        'vendedor.nombre as nombre_vendedor',
        'COUNT(venta.id) as cantidad_ventas',
        'SUM(venta.total) as total_ventas',
      ])
      .where('venta.tienda_id = :tienda_id', { tienda_id })
      .andWhere('venta.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .groupBy('vendedor.id, vendedor.nombre')
      .orderBy('total_ventas', 'DESC');
    
    return query.getRawMany();
  }

  async getVentasPorCategoria(tienda_id: number, fechaInicio: Date, fechaFin: Date): Promise<any[]> {
    // Consulta para obtener ventas agrupadas por categoría de producto
    const query = this.ventaRepository
      .createQueryBuilder('venta')
      .innerJoin('venta.detalles', 'detalle')
      .innerJoin('detalle.producto', 'producto')
      .select([
        'producto.categoria as categoria',
        'COUNT(DISTINCT venta.id) as cantidad_ventas',
        'SUM(detalle.subtotal) as total_ventas',
      ])
      .where('venta.tienda_id = :tienda_id', { tienda_id })
      .andWhere('venta.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .groupBy('producto.categoria')
      .orderBy('total_ventas', 'DESC');
    
    return query.getRawMany();
  }
}

