import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsNumber, IsEnum, IsString } from 'class-validator';
import { TipoPersona } from '../../../common/enums';

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre de la persona',
    example: 'Juan Pérez',
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @ApiProperty({
    description: 'Teléfono de la persona',
    example: '1234567890',
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono: string;

  @ApiProperty({
    description: 'Dirección de la persona',
    example: 'Calle 123, Ciudad',
  })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  direccion: string;

  @ApiProperty({
    description: 'Tipo de persona (Cliente, Empleado, Proveedor)',
    enum: TipoPersona,
    example: TipoPersona.EMPLEADO,
  })
  @IsEnum(TipoPersona, { message: 'El tipo de persona no es válido' })
  tipo: TipoPersona;

  @ApiProperty({
    description: 'ID del tipo de identificación',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID del tipo de identificación debe ser un número' })
  tipo_identificacion_id: number;

  @ApiProperty({
    description: 'Número de identificación',
    example: '1234567890',
  })
  @IsNotEmpty({ message: 'El número de identificación es requerido' })
  @IsString({ message: 'El número de identificación debe ser una cadena de texto' })
  numero_identificacion: string;

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
  rol_id: number;
}

