import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Persona } from '../../personas/entities/persona.entity';
import { Tienda } from '../../tiendas/entities/tienda.entity';
import { MetodoPago } from '../../metodos-pago/entities/metodo-pago.entity';
import { DetalleVenta } from './detalle-venta.entity';

@Entity('Ventas')
export class Venta {
  @ApiProperty({ description: 'ID único de la venta' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID del vendedor' })
  @Column()
  vendedor_id: number;

  @ApiProperty({ description: 'ID del cliente' })
  @Column()
  cliente_id: number;

  @ApiProperty({ description: 'ID de la tienda' })
  @Column()
  tienda_id: number;

  @ApiProperty({ description: 'Fecha de la venta' })
  @CreateDateColumn()
  fecha: Date;

  @ApiProperty({ description: 'Total de la venta' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({ description: 'ID del método de pago' })
  @Column()
  metodo_pago_id: number;

  @ManyToOne(() => Persona, persona => persona.ventasComoVendedor)
  @JoinColumn({ name: 'vendedor_id' })
  vendedor: Persona;

  @ManyToOne(() => Persona, persona => persona.ventasComoCliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Persona;

  @ManyToOne(() => Tienda, tienda => tienda.ventas)
  @JoinColumn({ name: 'tienda_id' })
  tienda: Tienda;

  @ManyToOne(() => MetodoPago, metodoPago => metodoPago.ventas)
  @JoinColumn({ name: 'metodo_pago_id' })
  metodoPago: MetodoPago;

  @OneToMany(() => DetalleVenta, detalleVenta => detalleVenta.venta)
  detalles: DetalleVenta[];
}

