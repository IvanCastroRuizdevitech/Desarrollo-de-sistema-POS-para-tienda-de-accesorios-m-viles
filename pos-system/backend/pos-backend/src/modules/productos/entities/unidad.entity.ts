import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Producto } from './producto.entity';

@Entity('Unidades')
export class Unidad {
  @ApiProperty({ description: 'ID único de la unidad' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre de la unidad' })
  @Column({ length: 50, unique: true })
  nombre: string;

  @ApiProperty({ description: 'Descripción de la unidad' })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => Producto, producto => producto.unidad)
  productos: Producto[];
}

