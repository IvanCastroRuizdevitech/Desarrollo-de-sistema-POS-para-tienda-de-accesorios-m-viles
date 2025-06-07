import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tienda } from '../../tiendas/entities/tienda.entity';
import { DetalleGasto } from './detalle-gasto.entity';

@Entity('Gastos')
export class Gasto {
  @ApiProperty({ description: 'ID único del gasto' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID de la tienda' })
  @Column()
  tienda_id: number;

  @ApiProperty({ description: 'Total del gasto' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({ description: 'Fecha del gasto' })
  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => Tienda, tienda => tienda.gastos)
  @JoinColumn({ name: 'tienda_id' })
  tienda: Tienda;

  @OneToMany(() => DetalleGasto, detalleGasto => detalleGasto.gasto)
  detalles: DetalleGasto[];
}

