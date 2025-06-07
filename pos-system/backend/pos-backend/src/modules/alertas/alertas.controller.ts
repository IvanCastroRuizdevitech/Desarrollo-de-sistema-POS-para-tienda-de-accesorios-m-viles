import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AlertasService } from './alertas.service';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Alertas')
@ApiBearerAuth()
@Controller('alertas')
export class AlertasController {
  constructor(private readonly alertasService: AlertasService) {}

  @Get('bajo-stock/:tienda_id')
  @ApiOperation({ summary: 'Obtener alertas de productos con bajo stock por tienda' })
  @ApiResponse({ status: 200, description: 'Lista de alertas de bajo stock' })
  getAlertasBajoStock(
    @Param('tienda_id') tienda_id: string,
    @Query('limite') limite: string = '10',
  ) {
    return this.alertasService.getAlertasBajoStock(+tienda_id, +limite);
  }

  @Get('bajo-stock')
  @Roles('administrador')
  @ApiOperation({ summary: 'Obtener alertas de productos con bajo stock en todas las tiendas' })
  @ApiResponse({ status: 200, description: 'Lista de alertas de bajo stock en todas las tiendas' })
  getAlertasBajoStockTodasTiendas(
    @Query('limite') limite: string = '10',
  ) {
    return this.alertasService.getAlertasBajoStockTodasTiendas(+limite);
  }

  @Get('stock-cero')
  @ApiOperation({ summary: 'Obtener alertas de productos con stock cero' })
  @ApiResponse({ status: 200, description: 'Lista de alertas de stock cero' })
  getAlertasStockCero() {
    return this.alertasService.getAlertasStockCero();
  }

  @Get('sin-movimiento')
  @ApiOperation({ summary: 'Obtener alertas de productos sin movimiento en un período' })
  @ApiResponse({ status: 200, description: 'Lista de alertas de productos sin movimiento' })
  getAlertasProductosSinMovimiento(
    @Query('dias') dias: string = '30',
  ) {
    return this.alertasService.getAlertasProductosSinMovimiento(+dias);
  }
}

