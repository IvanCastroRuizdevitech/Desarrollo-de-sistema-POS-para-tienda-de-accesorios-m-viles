import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateInventarioDto {
  @ApiProperty({
    description: 'Saldo del producto en inventario',
    example: 100,
    required: false,
  })
  @IsNumber({}, { message: 'El saldo debe ser un número' })
  @Min(0, { message: 'El saldo no puede ser negativo' })
  @IsOptional()
  saldo?: number;
}

