import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Persona } from './persona.entity';

@Entity('Tipos_Identificacion')
export class TipoIdentificacion {
  @ApiProperty({ description: 'ID único del tipo de identificación' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del tipo de identificación' })
  @Column({ length: 50, unique: true })
  nombre: string;

  @ApiProperty({ description: 'Descripción del tipo de identificación' })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => Persona, persona => persona.tipoIdentificacion)
  personas: Persona[];
}

