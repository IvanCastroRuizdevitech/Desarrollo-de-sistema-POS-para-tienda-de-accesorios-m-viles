import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Ventas')
@ApiBearerAuth()
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @Roles('administrador', 'vendedor')
  @ApiOperation({ summary: 'Crear una nueva venta' })
  @ApiResponse({ status: 201, description: 'Venta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'No hay suficiente stock' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ventas' })
  @ApiResponse({ status: 200, description: 'Lista de ventas' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  @ApiResponse({ status: 200, description: 'Venta encontrada' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }

  @Get('tienda/:tienda_id')
  @ApiOperation({ summary: 'Obtener ventas por tienda' })
  @ApiResponse({ status: 200, description: 'Lista de ventas por tienda' })
  findByTienda(@Param('tienda_id') tienda_id: string) {
    return this.ventasService.findByTienda(+tienda_id);
  }

  @Get('vendedor/:vendedor_id')
  @ApiOperation({ summary: 'Obtener ventas por vendedor' })
  @ApiResponse({ status: 200, description: 'Lista de ventas por vendedor' })
  findByVendedor(@Param('vendedor_id') vendedor_id: string) {
    return this.ventasService.findByVendedor(+vendedor_id);
  }

  @Get('cliente/:cliente_id')
  @ApiOperation({ summary: 'Obtener ventas por cliente' })
  @ApiResponse({ status: 200, description: 'Lista de ventas por cliente' })
  findByCliente(@Param('cliente_id') cliente_id: string) {
    return this.ventasService.findByCliente(+cliente_id);
  }

  @Get('fechas')
  @ApiOperation({ summary: 'Obtener ventas por rango de fechas' })
  @ApiResponse({ status: 200, description: 'Lista de ventas por rango de fechas' })
  findByFechas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.ventasService.findByFechas(new Date(fechaInicio), new Date(fechaFin));
  }

  @Get('reportes/metodos-pago')
  @ApiOperation({ summary: 'Obtener reporte de ventas por método de pago' })
  @ApiResponse({ status: 200, description: 'Reporte de ventas por método de pago' })
  getVentasPorMetodoPago(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.ventasService.getVentasPorMetodoPago(new Date(fechaInicio), new Date(fechaFin));
  }
}

