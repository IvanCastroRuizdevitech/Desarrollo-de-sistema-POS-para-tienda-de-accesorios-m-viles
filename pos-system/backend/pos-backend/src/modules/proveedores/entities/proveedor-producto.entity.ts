import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Persona } from '../../personas/entities/persona.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('Proveedores_Productos')
export class ProveedorProducto {
  @ApiProperty({ description: 'ID único de la relación proveedor-producto' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID del proveedor' })
  @Column()
  proveedor_id: number;

  @ApiProperty({ description: 'ID del producto' })
  @Column()
  producto_id: number;

  @ApiProperty({ description: 'Precio del producto para este proveedor' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @ApiProperty({ description: 'Disponibilidad del producto con este proveedor' })
  @Column({ default: true })
  disponibilidad: boolean;

  @ManyToOne(() => Persona, persona => persona.productosProveidos)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Persona;

  @ManyToOne(() => Producto, producto => producto.proveedores)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
}

