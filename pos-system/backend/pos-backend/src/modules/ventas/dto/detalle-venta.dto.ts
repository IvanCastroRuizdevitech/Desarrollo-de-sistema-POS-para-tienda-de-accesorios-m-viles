import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DetalleVentaDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  producto_id: number;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
  })
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  cantidad: number;
}

