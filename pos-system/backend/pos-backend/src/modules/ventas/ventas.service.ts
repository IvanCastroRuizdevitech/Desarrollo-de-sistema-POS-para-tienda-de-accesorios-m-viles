import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { Kardex } from '../kardex/entities/kardex.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { TipoMovimiento } from '../../common/enums';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    @InjectRepository(Kardex)
    private kardexRepository: Repository<Kardex>,
    private dataSource: DataSource,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const { vendedor_id, cliente_id, tienda_id, metodo_pago_id, detalles } = createVentaDto;
    
    // Iniciar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Calcular total y verificar stock
      let total = 0;
      
      // Verificar stock y calcular subtotales
      for (const detalle of detalles) {
        const { producto_id, cantidad } = detalle;
        
        // Buscar producto
        const producto = await this.productoRepository.findOne({
          where: { id: producto_id },
          relations: ['impuesto'],
        });
        
        if (!producto) {
          throw new NotFoundException(`Producto con ID ${producto_id} no encontrado`);
        }
        
        // Verificar stock
        const inventario = await this.inventarioRepository.findOne({
          where: { producto_id, tienda_id },
        });
        
        if (!inventario || inventario.saldo < cantidad) {
          throw new BadRequestException(`No hay suficiente stock para el producto ${producto.nombre}`);
        }
        
        // Calcular subtotal con impuesto
        const precioUnitario = producto.precio;
        const impuestoPorcentaje = producto.impuesto ? producto.impuesto.porcentaje / 100 : 0;
        const subtotal = precioUnitario * cantidad * (1 + impuestoPorcentaje);
        
        total += subtotal;
      }
      
      // Crear venta
      const venta = this.ventaRepository.create({
        vendedor_id,
        cliente_id,
        tienda_id,
        metodo_pago_id,
        total,
      });
      
      const savedVenta = await this.ventaRepository.save(venta);
      
      // Crear detalles de venta y actualizar inventario
      for (const detalle of detalles) {
        const { producto_id, cantidad } = detalle;
        
        // Buscar producto
        const producto = await this.productoRepository.findOne({
          where: { id: producto_id },
          relations: ['impuesto'],
        });
        
        // Calcular subtotal con impuesto
        const precioUnitario = producto.precio;
        const impuestoPorcentaje = producto.impuesto ? producto.impuesto.porcentaje / 100 : 0;
        const subtotal = precioUnitario * cantidad * (1 + impuestoPorcentaje);
        
        // Crear detalle de venta
        const detalleVenta = this.detalleVentaRepository.create({
          venta_id: savedVenta.id,
          producto_id,
          cantidad,
          subtotal,
        });
        
        await this.detalleVentaRepository.save(detalleVenta);
        
        // Actualizar inventario
        const inventario = await this.inventarioRepository.findOne({
          where: { producto_id, tienda_id },
        });
        
        const nuevoSaldo = inventario.saldo - cantidad;
        
        await this.inventarioRepository.update(
          { producto_id, tienda_id },
          { saldo: nuevoSaldo }
        );
        
        // Crear registro kardex
        const kardex = this.kardexRepository.create({
          producto_id,
          tienda_id,
          tipo_movimiento: TipoMovimiento.VENTA,
          cantidad,
          saldo: nuevoSaldo,
        });
        
        await this.kardexRepository.save(kardex);
      }
      
      // Confirmar transacción
      await queryRunner.commitTransaction();
      
      // Retornar venta completa con detalles
      return this.findOne(savedVenta.id);
    } catch (error) {
      // Revertir transacción en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({
      relations: ['vendedor', 'cliente', 'tienda', 'metodoPago', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['vendedor', 'cliente', 'tienda', 'metodoPago', 'detalles', 'detalles.producto'],
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return venta;
  }

  async findByTienda(tienda_id: number): Promise<Venta[]> {
    return this.ventaRepository.find({
      where: { tienda_id },
      relations: ['vendedor', 'cliente', 'tienda', 'metodoPago', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' },
    });
  }

  async findByVendedor(vendedor_id: number): Promise<Venta[]> {
    return this.ventaRepository.find({
      where: { vendedor_id },
      relations: ['vendedor', 'cliente', 'tienda', 'metodoPago', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' },
    });
  }

  async findByCliente(cliente_id: number): Promise<Venta[]> {
    return this.ventaRepository.find({
      where: { cliente_id },
      relations: ['vendedor', 'cliente', 'tienda', 'metodoPago', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' },
    });
  }

  async findByFechas(fechaInicio: Date, fechaFin: Date): Promise<Venta[]> {
    return this.ventaRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin),
      },
      relations: ['vendedor', 'cliente', 'tienda', 'metodoPago', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' },
    });
  }

  async getVentasPorMetodoPago(fechaInicio: Date, fechaFin: Date): Promise<any[]> {
    const ventas = await this.ventaRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin),
      },
      relations: ['metodoPago'],
    });

    const ventasPorMetodo = {};
    
    ventas.forEach(venta => {
      const metodoPago = venta.metodoPago.nombre;
      if (!ventasPorMetodo[metodoPago]) {
        ventasPorMetodo[metodoPago] = {
          metodo: metodoPago,
          cantidad: 0,
          total: 0,
        };
      }
      ventasPorMetodo[metodoPago].cantidad += 1;
      ventasPorMetodo[metodoPago].total += Number(venta.total);
    });

    return Object.values(ventasPorMetodo);
  }
}

