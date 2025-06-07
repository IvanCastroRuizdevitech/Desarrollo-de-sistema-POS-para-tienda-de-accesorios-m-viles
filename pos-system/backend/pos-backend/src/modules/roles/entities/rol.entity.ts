import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('Roles')
export class Rol {
  @ApiProperty({ description: 'ID único del rol' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del rol' })
  @Column({ length: 50, unique: true })
  nombre: string;

  @ApiProperty({ description: 'Permisos asociados al rol' })
  @Column({ type: 'text', nullable: true })
  permisos: string;

  @OneToMany(() => Usuario, usuario => usuario.rol)
  usuarios: Usuario[];
}

