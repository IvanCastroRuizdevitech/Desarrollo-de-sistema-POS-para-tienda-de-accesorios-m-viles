import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Inventario')
@ApiBearerAuth()
@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post()
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear un nuevo registro de inventario' })
  @ApiResponse({ status: 201, description: 'Registro de inventario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Ya existe un registro para este producto en esta tienda' })
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventarioService.create(createInventarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de inventario' })
  @ApiResponse({ status: 200, description: 'Lista de registros de inventario' })
  findAll() {
    return this.inventarioService.findAll();
  }

  @Get('tienda/:tienda_id')
  @ApiOperation({ summary: 'Obtener inventario por tienda' })
  @ApiResponse({ status: 200, description: 'Lista de inventario por tienda' })
  findByTienda(@Param('tienda_id') tienda_id: string) {
    return this.inventarioService.findByTienda(+tienda_id);
  }

  @Get('producto/:producto_id')
  @ApiOperation({ summary: 'Obtener inventario por producto' })
  @ApiResponse({ status: 200, description: 'Lista de inventario por producto' })
  findByProducto(@Param('producto_id') producto_id: string) {
    return this.inventarioService.findByProducto(+producto_id);
  }

  @Get('bajo-stock/:tienda_id')
  @ApiOperation({ summary: 'Obtener productos con bajo stock' })
  @ApiResponse({ status: 200, description: 'Lista de productos con bajo stock' })
  findBajoStock(
    @Param('tienda_id') tienda_id: string,
    @Query('limite') limite: string = '10',
  ) {
    return this.inventarioService.findBajoStock(+tienda_id, +limite);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de inventario por ID' })
  @ApiResponse({ status: 200, description: 'Registro de inventario encontrado' })
  @ApiResponse({ status: 404, description: 'Registro de inventario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.inventarioService.findOne(+id);
  }

  @Get('producto/:producto_id/tienda/:tienda_id')
  @ApiOperation({ summary: 'Obtener inventario por producto y tienda' })
  @ApiResponse({ status: 200, description: 'Registro de inventario encontrado' })
  @ApiResponse({ status: 404, description: 'Registro de inventario no encontrado' })
  findByProductoAndTienda(
    @Param('producto_id') producto_id: string,
    @Param('tienda_id') tienda_id: string,
  ) {
    return this.inventarioService.findByProductoAndTienda(+producto_id, +tienda_id);
  }

  @Patch(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar un registro de inventario' })
  @ApiResponse({ status: 200, description: 'Registro de inventario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Registro de inventario no encontrado' })
  update(@Param('id') id: string, @Body() updateInventarioDto: UpdateInventarioDto) {
    return this.inventarioService.update(+id, updateInventarioDto);
  }

  @Delete(':id')
  @Roles('administrador')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un registro de inventario' })
  @ApiResponse({ status: 204, description: 'Registro de inventario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Registro de inventario no encontrado' })
  remove(@Param('id') id: string) {
    return this.inventarioService.remove(+id);
  }
}

