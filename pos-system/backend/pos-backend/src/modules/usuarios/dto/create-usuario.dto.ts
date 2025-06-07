import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'ID de la persona asociada al usuario',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID de la persona debe ser un número' })
  @IsNotEmpty({ message: 'El ID de la persona es requerido' })
  persona_id: number;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  correo: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'contraseña123',
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña: string;

  @ApiProperty({
    description: 'ID del rol del usuario',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID del rol debe ser un número' })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  rol_id: number;

  @ApiProperty({
    description: 'Estado del usuario (activo/inactivo)',
    example: true,
    default: true,
  })
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  @IsOptional()
  activo?: boolean;
}

