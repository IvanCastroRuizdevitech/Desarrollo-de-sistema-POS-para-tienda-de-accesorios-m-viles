import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Compania } from '../../companias/entities/compania.entity';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { Kardex } from '../../kardex/entities/kardex.entity';
import { Venta } from '../../ventas/entities/venta.entity';
import { Gasto } from '../../gastos/entities/gasto.entity';

@Entity('Tiendas')
export class Tienda {
  @ApiProperty({ description: 'ID único de la tienda' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre de la tienda' })
  @Column({ length: 100, nullable: true })
  nombre: string;

  @ApiProperty({ description: 'Dirección de la tienda' })
  @Column({ type: 'text', nullable: true })
  direccion: string;

  @ApiProperty({ description: 'ID de la compañía a la que pertenece la tienda' })
  @Column()
  compañia_id: number;

  @ManyToOne(() => Compania, compania => compania.tiendas)
  @JoinColumn({ name: 'compañia_id' })
  compania: Compania;

  @OneToMany(() => Inventario, inventario => inventario.tienda)
  inventarios: Inventario[];

  @OneToMany(() => Kardex, kardex => kardex.tienda)
  kardexs: Kardex[];

  @OneToMany(() => Venta, venta => venta.tienda)
  ventas: Venta[];

  @OneToMany(() => Gasto, gasto => gasto.tienda)
  gastos: Gasto[];
}

