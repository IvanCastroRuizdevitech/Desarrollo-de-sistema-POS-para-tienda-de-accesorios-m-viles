import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Producto } from '../../productos/entities/producto.entity';
import { Tienda } from '../../tiendas/entities/tienda.entity';
import { TipoMovimiento } from '../../../common/enums';

@Entity('Kardex')
export class Kardex {
  @ApiProperty({ description: 'ID único del registro kardex' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID del producto' })
  @Column()
  producto_id: number;

  @ApiProperty({ description: 'ID de la tienda' })
  @Column()
  tienda_id: number;

  @ApiProperty({ description: 'Fecha del movimiento' })
  @CreateDateColumn()
  fecha: Date;

  @ApiProperty({ description: 'Tipo de movimiento (Entrada, Salida, Venta)' })
  @Column({
    type: 'enum',
    enum: TipoMovimiento,
  })
  tipo_movimiento: TipoMovimiento;

  @ApiProperty({ description: 'Cantidad del movimiento' })
  @Column()
  cantidad: number;

  @ApiProperty({ description: 'Saldo después del movimiento' })
  @Column()
  saldo: number;

  @ManyToOne(() => Producto, producto => producto.kardexs)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @ManyToOne(() => Tienda, tienda => tienda.kardexs)
  @JoinColumn({ name: 'tienda_id' })
  tienda: Tienda;
}

