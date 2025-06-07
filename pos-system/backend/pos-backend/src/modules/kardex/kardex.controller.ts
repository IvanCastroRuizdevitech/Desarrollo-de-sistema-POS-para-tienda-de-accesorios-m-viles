import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KardexService } from './kardex.service';
import { CreateKardexDto } from './dto/create-kardex.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Kardex')
@ApiBearerAuth()
@Controller('kardex')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @Post()
  @Roles('administrador', 'vendedor')
  @ApiOperation({ summary: 'Crear un nuevo movimiento de kardex' })
  @ApiResponse({ status: 201, description: 'Movimiento de kardex creado exitosamente' })
  @ApiResponse({ status: 400, description: 'No hay suficiente stock o no existe inventario' })
  create(@Body() createKardexDto: CreateKardexDto) {
    return this.kardexService.create(createKardexDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los movimientos de kardex' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos de kardex' })
  findAll() {
    return this.kardexService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un movimiento de kardex por ID' })
  @ApiResponse({ status: 200, description: 'Movimiento de kardex encontrado' })
  @ApiResponse({ status: 404, description: 'Movimiento de kardex no encontrado' })
  findOne(@Param('id') id: string) {
    return this.kardexService.findOne(+id);
  }

  @Get('producto/:producto_id')
  @ApiOperation({ summary: 'Obtener movimientos de kardex por producto' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos de kardex por producto' })
  findByProducto(@Param('producto_id') producto_id: string) {
    return this.kardexService.findByProducto(+producto_id);
  }

  @Get('tienda/:tienda_id')
  @ApiOperation({ summary: 'Obtener movimientos de kardex por tienda' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos de kardex por tienda' })
  findByTienda(@Param('tienda_id') tienda_id: string) {
    return this.kardexService.findByTienda(+tienda_id);
  }

  @Get('producto/:producto_id/tienda/:tienda_id')
  @ApiOperation({ summary: 'Obtener movimientos de kardex por producto y tienda' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos de kardex por producto y tienda' })
  findByProductoAndTienda(
    @Param('producto_id') producto_id: string,
    @Param('tienda_id') tienda_id: string,
  ) {
    return this.kardexService.findByProductoAndTienda(+producto_id, +tienda_id);
  }

  @Get('fechas')
  @ApiOperation({ summary: 'Obtener movimientos de kardex por rango de fechas' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos de kardex por rango de fechas' })
  findByFechas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.kardexService.findByFechas(new Date(fechaInicio), new Date(fechaFin));
  }
}

