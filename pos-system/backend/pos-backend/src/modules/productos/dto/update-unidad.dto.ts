import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUnidadDto {
  @ApiProperty({
    description: 'Nombre de la unidad',
    example: 'Unidad',
    required: false,
  })
  @IsString({ message: 'El nombre de la unidad debe ser una cadena de texto' })
  @IsOptional()
  nombre?: string;

  @ApiProperty({
    description: 'Descripción de la unidad',
    example: 'Unidad individual de producto',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  descripcion?: string;
}

