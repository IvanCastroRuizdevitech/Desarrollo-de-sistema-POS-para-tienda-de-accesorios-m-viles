import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateImpuestoDto {
  @ApiProperty({
    description: 'Nombre del impuesto',
    example: 'IVA',
  })
  @IsNotEmpty({ message: 'El nombre del impuesto es requerido' })
  @IsString({ message: 'El nombre del impuesto debe ser una cadena de texto' })
  nombre: string;

  @ApiProperty({
    description: 'Porcentaje del impuesto',
    example: 19.00,
  })
  @IsNotEmpty({ message: 'El porcentaje del impuesto es requerido' })
  @IsNumber({}, { message: 'El porcentaje debe ser un número' })
  @Min(0, { message: 'El porcentaje no puede ser negativo' })
  @Max(100, { message: 'El porcentaje no puede ser mayor a 100' })
  porcentaje: number;
}

