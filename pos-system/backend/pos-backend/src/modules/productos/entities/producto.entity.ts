import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Unidad } from './unidad.entity';
import { Impuesto } from './impuesto.entity';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { Kardex } from '../../kardex/entities/kardex.entity';
import { DetalleVenta } from '../../ventas/entities/detalle-venta.entity';
import { ProveedorProducto } from '../../proveedores/entities/proveedor-producto.entity';

@Entity('Productos')
export class Producto {
  @ApiProperty({ description: 'ID único del producto' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del producto' })
  @Column({ length: 100, nullable: true })
  nombre: string;

  @ApiProperty({ description: 'Categoría del producto' })
  @Column({ length: 50, nullable: true })
  categoria: string;

  @ApiProperty({ description: 'Precio del producto' })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio: number;

  @ApiProperty({ description: 'ID de la unidad del producto' })
  @Column({ nullable: true })
  unidad_id: number;

  @ApiProperty({ description: 'ID del impuesto aplicable al producto' })
  @Column({ nullable: true })
  impuesto_id: number;

  @ManyToOne(() => Unidad, unidad => unidad.productos)
  @JoinColumn({ name: 'unidad_id' })
  unidad: Unidad;

  @ManyToOne(() => Impuesto, impuesto => impuesto.productos)
  @JoinColumn({ name: 'impuesto_id' })
  impuesto: Impuesto;

  @OneToMany(() => Inventario, inventario => inventario.producto)
  inventarios: Inventario[];

  @OneToMany(() => Kardex, kardex => kardex.producto)
  kardexs: Kardex[];

  @OneToMany(() => DetalleVenta, detalleVenta => detalleVenta.producto)
  detallesVenta: DetalleVenta[];

  @OneToMany(() => ProveedorProducto, proveedorProducto => proveedorProducto.producto)
  proveedores: ProveedorProducto[];
}

