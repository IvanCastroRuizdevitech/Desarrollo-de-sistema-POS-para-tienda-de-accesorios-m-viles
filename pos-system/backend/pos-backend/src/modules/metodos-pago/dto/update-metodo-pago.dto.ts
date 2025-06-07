import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateMetodoPagoDto {
  @ApiProperty({
    description: 'Nombre del método de pago',
    example: 'Efectivo',
    required: false,
  })
  @IsString({ message: 'El nombre del método de pago debe ser una cadena de texto' })
  @IsOptional()
  nombre?: string;
}

