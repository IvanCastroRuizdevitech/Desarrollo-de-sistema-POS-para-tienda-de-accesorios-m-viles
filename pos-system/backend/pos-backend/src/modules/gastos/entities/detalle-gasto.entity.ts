import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Gasto } from './gasto.entity';

@Entity('Detalles_Gastos')
export class DetalleGasto {
  @ApiProperty({ description: 'ID único del detalle de gasto' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID del gasto' })
  @Column()
  gasto_id: number;

  @ApiProperty({ description: 'Concepto del gasto' })
  @Column({ type: 'text' })
  concepto: string;

  @ApiProperty({ description: 'Monto del detalle de gasto' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @ManyToOne(() => Gasto, gasto => gasto.detalles)
  @JoinColumn({ name: 'gasto_id' })
  gasto: Gasto;
}

