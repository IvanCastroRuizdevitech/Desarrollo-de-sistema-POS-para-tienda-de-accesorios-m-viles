import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMetodoPagoDto {
  @ApiProperty({
    description: 'Nombre del método de pago',
    example: 'Efectivo',
  })
  @IsNotEmpty({ message: 'El nombre del método de pago es requerido' })
  @IsString({ message: 'El nombre del método de pago debe ser una cadena de texto' })
  nombre: string;
}

