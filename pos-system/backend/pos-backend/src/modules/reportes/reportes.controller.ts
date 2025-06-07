import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Reportes')
@ApiBearerAuth()
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('balance-mensual/:tienda_id/:año/:mes')
  @Roles('administrador')
  @ApiOperation({ summary: 'Obtener balance mensual de ingresos y gastos' })
  @ApiResponse({ status: 200, description: 'Balance mensual' })
  getBalanceMensual(
    @Param('tienda_id') tienda_id: string,
    @Param('año') año: string,
    @Param('mes') mes: string,
  ) {
    return this.reportesService.getBalanceMensual(+tienda_id, +año, +mes);
  }

  @Get('productos-mas-vendidos/:tienda_id')
  @ApiOperation({ summary: 'Obtener productos más vendidos' })
  @ApiResponse({ status: 200, description: 'Lista de productos más vendidos' })
  getProductosMasVendidos(
    @Param('tienda_id') tienda_id: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('limite') limite: string = '10',
  ) {
    return this.reportesService.getProductosMasVendidos(
      +tienda_id,
      new Date(fechaInicio),
      new Date(fechaFin),
      +limite,
    );
  }

  @Get('productos-bajo-stock/:tienda_id')
  @ApiOperation({ summary: 'Obtener productos con bajo stock' })
  @ApiResponse({ status: 200, description: 'Lista de productos con bajo stock' })
  getProductosBajoStock(
    @Param('tienda_id') tienda_id: string,
    @Query('limite') limite: string = '10',
  ) {
    return this.reportesService.getProductosBajoStock(+tienda_id, +limite);
  }

  @Get('ventas-por-dia/:tienda_id')
  @ApiOperation({ summary: 'Obtener ventas agrupadas por día' })
  @ApiResponse({ status: 200, description: 'Lista de ventas por día' })
  getVentasPorDia(
    @Param('tienda_id') tienda_id: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.reportesService.getVentasPorDia(
      +tienda_id,
      new Date(fechaInicio),
      new Date(fechaFin),
    );
  }

  @Get('gastos-por-dia/:tienda_id')
  @ApiOperation({ summary: 'Obtener gastos agrupados por día' })
  @ApiResponse({ status: 200, description: 'Lista de gastos por día' })
  getGastosPorDia(
    @Param('tienda_id') tienda_id: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.reportesService.getGastosPorDia(
      +tienda_id,
      new Date(fechaInicio),
      new Date(fechaFin),
    );
  }

  @Get('ventas-por-vendedor/:tienda_id')
  @ApiOperation({ summary: 'Obtener ventas agrupadas por vendedor' })
  @ApiResponse({ status: 200, description: 'Lista de ventas por vendedor' })
  getVentasPorVendedor(
    @Param('tienda_id') tienda_id: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.reportesService.getVentasPorVendedor(
      +tienda_id,
      new Date(fechaInicio),
      new Date(fechaFin),
    );
  }

  @Get('ventas-por-categoria/:tienda_id')
  @ApiOperation({ summary: 'Obtener ventas agrupadas por categoría de producto' })
  @ApiResponse({ status: 200, description: 'Lista de ventas por categoría' })
  getVentasPorCategoria(
    @Param('tienda_id') tienda_id: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.reportesService.getVentasPorCategoria(
      +tienda_id,
      new Date(fechaInicio),
      new Date(fechaFin),
    );
  }
}

