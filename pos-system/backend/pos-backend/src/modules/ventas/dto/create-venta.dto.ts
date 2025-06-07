import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { DetalleVentaDto } from './detalle-venta.dto';

export class CreateVentaDto {
  @ApiProperty({
    description: 'ID del vendedor',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID del vendedor es requerido' })
  @IsNumber({}, { message: 'El ID del vendedor debe ser un número' })
  vendedor_id: number;

  @ApiProperty({
    description: 'ID del cliente',
    example: 2,
  })
  @IsNotEmpty({ message: 'El ID del cliente es requerido' })
  @IsNumber({}, { message: 'El ID del cliente debe ser un número' })
  cliente_id: number;

  @ApiProperty({
    description: 'ID de la tienda',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID de la tienda es requerido' })
  @IsNumber({}, { message: 'El ID de la tienda debe ser un número' })
  tienda_id: number;

  @ApiProperty({
    description: 'ID del método de pago',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID del método de pago es requerido' })
  @IsNumber({}, { message: 'El ID del método de pago debe ser un número' })
  metodo_pago_id: number;

  @ApiProperty({
    description: 'Detalles de la venta',
    type: [DetalleVentaDto],
  })
  @IsArray({ message: 'Los detalles deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un detalle de venta' })
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];
}

