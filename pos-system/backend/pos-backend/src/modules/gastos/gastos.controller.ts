import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GastosService } from './gastos.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Gastos')
@ApiBearerAuth()
@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Post()
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear un nuevo gasto' })
  @ApiResponse({ status: 201, description: 'Gasto creado exitosamente' })
  create(@Body() createGastoDto: CreateGastoDto) {
    return this.gastosService.create(createGastoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los gastos' })
  @ApiResponse({ status: 200, description: 'Lista de gastos' })
  findAll() {
    return this.gastosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un gasto por ID' })
  @ApiResponse({ status: 200, description: 'Gasto encontrado' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.gastosService.findOne(+id);
  }

  @Get('tienda/:tienda_id')
  @ApiOperation({ summary: 'Obtener gastos por tienda' })
  @ApiResponse({ status: 200, description: 'Lista de gastos por tienda' })
  findByTienda(@Param('tienda_id') tienda_id: string) {
    return this.gastosService.findByTienda(+tienda_id);
  }

  @Get('fechas')
  @ApiOperation({ summary: 'Obtener gastos por rango de fechas' })
  @ApiResponse({ status: 200, description: 'Lista de gastos por rango de fechas' })
  findByFechas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.gastosService.findByFechas(new Date(fechaInicio), new Date(fechaFin));
  }

  @Get('reportes/conceptos')
  @ApiOperation({ summary: 'Obtener reporte de gastos por concepto' })
  @ApiResponse({ status: 200, description: 'Reporte de gastos por concepto' })
  getGastosPorConcepto(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.gastosService.getGastosPorConcepto(new Date(fechaInicio), new Date(fechaFin));
  }

  @Delete(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Eliminar un gasto' })
  @ApiResponse({ status: 200, description: 'Gasto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  remove(@Param('id') id: string) {
    return this.gastosService.remove(+id);
  }
}

