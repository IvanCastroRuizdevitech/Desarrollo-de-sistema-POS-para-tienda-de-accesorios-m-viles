import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Producto } from '../../productos/entities/producto.entity';
import { Tienda } from '../../tiendas/entities/tienda.entity';

@Entity('Inventario')
export class Inventario {
  @ApiProperty({ description: 'ID único del registro de inventario' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID del producto' })
  @Column()
  producto_id: number;

  @ApiProperty({ description: 'ID de la tienda' })
  @Column()
  tienda_id: number;

  @ApiProperty({ description: 'Saldo actual del producto en inventario' })
  @Column({ default: 0 })
  saldo: number;

  @ManyToOne(() => Producto, producto => producto.inventarios)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @ManyToOne(() => Tienda, tienda => tienda.inventarios)
  @JoinColumn({ name: 'tienda_id' })
  tienda: Tienda;
}

