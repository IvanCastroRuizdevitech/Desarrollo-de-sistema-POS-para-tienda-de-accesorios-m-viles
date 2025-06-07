import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { DetalleGastoDto } from './detalle-gasto.dto';

export class CreateGastoDto {
  @ApiProperty({
    description: 'ID de la tienda',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID de la tienda es requerido' })
  @IsNumber({}, { message: 'El ID de la tienda debe ser un número' })
  tienda_id: number;

  @ApiProperty({
    description: 'Detalles del gasto',
    type: [DetalleGastoDto],
  })
  @IsArray({ message: 'Los detalles deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un detalle de gasto' })
  @ValidateNested({ each: true })
  @Type(() => DetalleGastoDto)
  detalles: DetalleGastoDto[];
}

