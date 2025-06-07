import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class DetalleGastoDto {
  @ApiProperty({
    description: 'Concepto del gasto',
    example: 'Pago de servicios',
  })
  @IsNotEmpty({ message: 'El concepto es requerido' })
  @IsString({ message: 'El concepto debe ser una cadena de texto' })
  concepto: string;

  @ApiProperty({
    description: 'Monto del gasto',
    example: 100.50,
  })
  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  monto: number;
}

