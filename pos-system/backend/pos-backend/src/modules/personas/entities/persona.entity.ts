import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TipoPersona } from '../../../common/enums';
import { TipoIdentificacion } from './tipo-identificacion.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Venta } from '../../ventas/entities/venta.entity';
import { ProveedorProducto } from '../../proveedores/entities/proveedor-producto.entity';

@Entity('Personas')
export class Persona {
  @ApiProperty({ description: 'ID único de la persona' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre de la persona' })
  @Column({ length: 100, nullable: true })
  nombre: string;

  @ApiProperty({ description: 'Teléfono de la persona' })
  @Column({ length: 20, nullable: true })
  telefono: string;

  @ApiProperty({ description: 'Dirección de la persona' })
  @Column({ type: 'text', nullable: true })
  direccion: string;

  @ApiProperty({ description: 'Tipo de persona (Cliente, Empleado, Proveedor)' })
  @Column({
    type: 'enum',
    enum: TipoPersona,
    nullable: true,
  })
  tipo: TipoPersona;

  @ApiProperty({ description: 'ID del tipo de identificación' })
  @Column({ nullable: true })
  tipo_identificacion_id: number;

  @ApiProperty({ description: 'Número de identificación' })
  @Column({ length: 30, unique: true })
  numero_identificacion: string;

  @ManyToOne(() => TipoIdentificacion, tipoIdentificacion => tipoIdentificacion.personas)
  @JoinColumn({ name: 'tipo_identificacion_id' })
  tipoIdentificacion: TipoIdentificacion;

  @OneToMany(() => Usuario, usuario => usuario.persona)
  usuarios: Usuario[];

  @OneToMany(() => Venta, venta => venta.vendedor)
  ventasComoVendedor: Venta[];

  @OneToMany(() => Venta, venta => venta.cliente)
  ventasComoCliente: Venta[];

  @OneToMany(() => ProveedorProducto, proveedorProducto => proveedorProducto.proveedor)
  productosProveidos: ProveedorProducto[];
}

