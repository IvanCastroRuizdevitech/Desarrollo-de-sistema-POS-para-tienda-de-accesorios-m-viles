import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Producto } from './producto.entity';

@Entity('Impuestos')
export class Impuesto {
  @ApiProperty({ description: 'ID único del impuesto' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del impuesto' })
  @Column({ length: 50, unique: true })
  nombre: string;

  @ApiProperty({ description: 'Porcentaje del impuesto' })
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  porcentaje: number;

  @OneToMany(() => Producto, producto => producto.impuesto)
  productos: Producto[];
}

