import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Venta } from './venta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('Detalles_Ventas')
export class DetalleVenta {
  @ApiProperty({ description: 'ID único del detalle de venta' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID de la venta' })
  @Column()
  venta_id: number;

  @ApiProperty({ description: 'ID del producto' })
  @Column()
  producto_id: number;

  @ApiProperty({ description: 'Cantidad vendida' })
  @Column()
  cantidad: number;

  @ApiProperty({ description: 'Subtotal del detalle' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Venta, venta => venta.detalles)
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @ManyToOne(() => Producto, producto => producto.detallesVenta)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
}

