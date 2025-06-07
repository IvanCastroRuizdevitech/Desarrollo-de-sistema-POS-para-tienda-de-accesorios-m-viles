import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum, Min } from 'class-validator';
import { TipoMovimiento } from '../../../common/enums';

export class CreateKardexDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  producto_id: number;

  @ApiProperty({
    description: 'ID de la tienda',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID de la tienda es requerido' })
  @IsNumber({}, { message: 'El ID de la tienda debe ser un número' })
  tienda_id: number;

  @ApiProperty({
    description: 'Tipo de movimiento (Entrada, Salida, Venta)',
    enum: TipoMovimiento,
    example: TipoMovimiento.ENTRADA,
  })
  @IsNotEmpty({ message: 'El tipo de movimiento es requerido' })
  @IsEnum(TipoMovimiento, { message: 'El tipo de movimiento no es válido' })
  tipo_movimiento: TipoMovimiento;

  @ApiProperty({
    description: 'Cantidad del movimiento',
    example: 10,
  })
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  cantidad: number;
}

