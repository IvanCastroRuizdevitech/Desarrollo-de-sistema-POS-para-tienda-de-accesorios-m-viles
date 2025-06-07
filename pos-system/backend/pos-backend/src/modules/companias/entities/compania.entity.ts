import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tienda } from '../../tiendas/entities/tienda.entity';

@Entity('Compañias')
export class Compania {
  @ApiProperty({ description: 'ID único de la compañía' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre de la compañía' })
  @Column({ length: 100, nullable: true })
  nombre: string;

  @ApiProperty({ description: 'NIT de la compañía' })
  @Column({ length: 20, unique: true, nullable: true })
  NIT: string;

  @ApiProperty({ description: 'Dirección de la compañía' })
  @Column({ type: 'text', nullable: true })
  direccion: string;

  @OneToMany(() => Tienda, tienda => tienda.compania)
  tiendas: Tienda[];
}

