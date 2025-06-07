import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'administrador',
  })
  @IsNotEmpty({ message: 'El nombre del rol es requerido' })
  @IsString({ message: 'El nombre del rol debe ser una cadena de texto' })
  nombre: string;

  @ApiProperty({
    description: 'Permisos asociados al rol (en formato JSON)',
    example: '{"usuarios": ["crear", "leer", "actualizar", "eliminar"]}',
    required: false,
  })
  @IsString({ message: 'Los permisos deben ser una cadena de texto' })
  @IsOptional()
  permisos?: string;
}

