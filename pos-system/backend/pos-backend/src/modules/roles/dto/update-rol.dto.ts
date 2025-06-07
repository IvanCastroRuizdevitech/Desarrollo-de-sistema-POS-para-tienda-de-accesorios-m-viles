import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateRolDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'administrador',
    required: false,
  })
  @IsString({ message: 'El nombre del rol debe ser una cadena de texto' })
  @IsOptional()
  nombre?: string;

  @ApiProperty({
    description: 'Permisos asociados al rol (en formato JSON)',
    example: '{"usuarios": ["crear", "leer", "actualizar", "eliminar"]}',
    required: false,
  })
  @IsString({ message: 'Los permisos deben ser una cadena de texto' })
  @IsOptional()
  permisos?: string;
}

