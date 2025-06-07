import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength, IsNumber, IsBoolean } from 'class-validator';

export class UpdateUsuarioDto {
  @ApiProperty({
    description: 'ID de la persona asociada al usuario',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'El ID de la persona debe ser un número' })
  @IsOptional()
  persona_id?: number;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
    required: false,
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsOptional()
  correo?: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'contraseña123',
    required: false,
  })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsOptional()
  contraseña?: string;

  @ApiProperty({
    description: 'ID del rol del usuario',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'El ID del rol debe ser un número' })
  @IsOptional()
  rol_id?: number;

  @ApiProperty({
    description: 'Estado del usuario (activo/inactivo)',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  @IsOptional()
  activo?: boolean;
}

