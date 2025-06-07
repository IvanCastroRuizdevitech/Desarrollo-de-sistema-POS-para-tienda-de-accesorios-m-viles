import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateInventarioDto {
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
    description: 'Saldo inicial del producto en inventario',
    example: 100,
  })
  @IsNotEmpty({ message: 'El saldo es requerido' })
  @IsNumber({}, { message: 'El saldo debe ser un número' })
  @Min(0, { message: 'El saldo no puede ser negativo' })
  saldo: number;
}

