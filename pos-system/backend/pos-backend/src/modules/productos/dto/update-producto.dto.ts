import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductoDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Funda para iPhone 12',
    required: false,
  })
  @IsString({ message: 'El nombre del producto debe ser una cadena de texto' })
  @IsOptional()
  nombre?: string;

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'Fundas',
    required: false,
  })
  @IsString({ message: 'La categoría debe ser una cadena de texto' })
  @IsOptional()
  categoria?: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 25.99,
    required: false,
  })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsOptional()
  precio?: number;

  @ApiProperty({
    description: 'ID de la unidad del producto',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'El ID de la unidad debe ser un número' })
  @IsOptional()
  unidad_id?: number;

  @ApiProperty({
    description: 'ID del impuesto aplicable al producto',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'El ID del impuesto debe ser un número' })
  @IsOptional()
  impuesto_id?: number;
}

