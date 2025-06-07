import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('Metodos_Pago')
export class MetodoPago {
  @ApiProperty({ description: 'ID único del método de pago' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del método de pago' })
  @Column({ length: 50 })
  nombre: string;

  @OneToMany(() => Venta, venta => venta.metodoPago)
  ventas: Venta[];
}

