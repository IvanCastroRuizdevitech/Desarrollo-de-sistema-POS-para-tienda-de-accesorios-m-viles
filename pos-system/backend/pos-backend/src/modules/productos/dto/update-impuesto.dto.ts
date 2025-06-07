import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateImpuestoDto {
  @ApiProperty({
    description: 'Nombre del impuesto',
    example: 'IVA',
    required: false,
  })
  @IsString({ message: 'El nombre del impuesto debe ser una cadena de texto' })
  @IsOptional()
  nombre?: string;

  @ApiProperty({
    description: 'Porcentaje del impuesto',
    example: 19.00,
    required: false,
  })
  @IsNumber({}, { message: 'El porcentaje debe ser un número' })
  @Min(0, { message: 'El porcentaje no puede ser negativo' })
  @Max(100, { message: 'El porcentaje no puede ser mayor a 100' })
  @IsOptional()
  porcentaje?: number;
}

