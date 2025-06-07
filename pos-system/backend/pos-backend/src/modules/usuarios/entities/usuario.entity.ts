import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Persona } from '../../personas/entities/persona.entity';
import { Rol } from '../../roles/entities/rol.entity';

@Entity('Usuarios')
export class Usuario {
  @ApiProperty({ description: 'ID único del usuario' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID de la persona asociada al usuario' })
  @Column()
  persona_id: number;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @Column({ length: 100, unique: true })
  correo: string;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @Column({ type: 'text' })
  contraseña: string;

  @ApiProperty({ description: 'ID del rol del usuario' })
  @Column()
  rol_id: number;

  @ApiProperty({ description: 'Estado del usuario (activo/inactivo)' })
  @Column({ default: true })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación del usuario' })
  @CreateDateColumn()
  fecha_creacion: Date;

  @ManyToOne(() => Persona, persona => persona.usuarios)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @ManyToOne(() => Rol, rol => rol.usuarios)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;
}

