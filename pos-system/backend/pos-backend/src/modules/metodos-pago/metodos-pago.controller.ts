import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MetodosPagoService } from './metodos-pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Métodos de Pago')
@ApiBearerAuth()
@Controller('metodos-pago')
export class MetodosPagoController {
  constructor(private readonly metodosPagoService: MetodosPagoService) {}

  @Post()
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear un nuevo método de pago' })
  @ApiResponse({ status: 201, description: 'Método de pago creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El método de pago ya existe' })
  create(@Body() createMetodoPagoDto: CreateMetodoPagoDto) {
    return this.metodosPagoService.create(createMetodoPagoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los métodos de pago' })
  @ApiResponse({ status: 200, description: 'Lista de métodos de pago' })
  findAll() {
    return this.metodosPagoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un método de pago por ID' })
  @ApiResponse({ status: 200, description: 'Método de pago encontrado' })
  @ApiResponse({ status: 404, description: 'Método de pago no encontrado' })
  findOne(@Param('id') id: string) {
    return this.metodosPagoService.findOne(+id);
  }

  @Patch(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar un método de pago' })
  @ApiResponse({ status: 200, description: 'Método de pago actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Método de pago no encontrado' })
  @ApiResponse({ status: 409, description: 'El método de pago ya existe' })
  update(@Param('id') id: string, @Body() updateMetodoPagoDto: UpdateMetodoPagoDto) {
    return this.metodosPagoService.update(+id, updateMetodoPagoDto);
  }

  @Delete(':id')
  @Roles('administrador')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un método de pago' })
  @ApiResponse({ status: 204, description: 'Método de pago eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Método de pago no encontrado' })
  remove(@Param('id') id: string) {
    return this.metodosPagoService.remove(+id);
  }
}

