import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { CreateImpuestoDto } from './dto/create-impuesto.dto';
import { UpdateImpuestoDto } from './dto/update-impuesto.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Productos')
@ApiBearerAuth()
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // Endpoints para Productos
  @Post()
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  createProducto(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.createProducto(createProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos' })
  findAllProductos() {
    return this.productosService.findAllProductos();
  }

  @Get('categoria/:categoria')
  @ApiOperation({ summary: 'Obtener productos por categoría' })
  @ApiResponse({ status: 200, description: 'Lista de productos por categoría' })
  findProductosByCategoria(@Param('categoria') categoria: string) {
    return this.productosService.findProductosByCategoria(categoria);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findProductoById(@Param('id') id: string) {
    return this.productosService.findProductoById(+id);
  }

  @Patch(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  updateProducto(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.updateProducto(+id, updateProductoDto);
  }

  @Delete(':id')
  @Roles('administrador')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  removeProducto(@Param('id') id: string) {
    return this.productosService.removeProducto(+id);
  }

  // Endpoints para Unidades
  @Post('unidades')
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear una nueva unidad' })
  @ApiResponse({ status: 201, description: 'Unidad creada exitosamente' })
  createUnidad(@Body() createUnidadDto: CreateUnidadDto) {
    return this.productosService.createUnidad(createUnidadDto);
  }

  @Get('unidades')
  @ApiOperation({ summary: 'Obtener todas las unidades' })
  @ApiResponse({ status: 200, description: 'Lista de unidades' })
  findAllUnidades() {
    return this.productosService.findAllUnidades();
  }

  @Get('unidades/:id')
  @ApiOperation({ summary: 'Obtener una unidad por ID' })
  @ApiResponse({ status: 200, description: 'Unidad encontrada' })
  @ApiResponse({ status: 404, description: 'Unidad no encontrada' })
  findUnidadById(@Param('id') id: string) {
    return this.productosService.findUnidadById(+id);
  }

  @Patch('unidades/:id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar una unidad' })
  @ApiResponse({ status: 200, description: 'Unidad actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Unidad no encontrada' })
  updateUnidad(@Param('id') id: string, @Body() updateUnidadDto: UpdateUnidadDto) {
    return this.productosService.updateUnidad(+id, updateUnidadDto);
  }

  @Delete('unidades/:id')
  @Roles('administrador')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una unidad' })
  @ApiResponse({ status: 204, description: 'Unidad eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Unidad no encontrada' })
  removeUnidad(@Param('id') id: string) {
    return this.productosService.removeUnidad(+id);
  }

  // Endpoints para Impuestos
  @Post('impuestos')
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear un nuevo impuesto' })
  @ApiResponse({ status: 201, description: 'Impuesto creado exitosamente' })
  createImpuesto(@Body() createImpuestoDto: CreateImpuestoDto) {
    return this.productosService.createImpuesto(createImpuestoDto);
  }

  @Get('impuestos')
  @ApiOperation({ summary: 'Obtener todos los impuestos' })
  @ApiResponse({ status: 200, description: 'Lista de impuestos' })
  findAllImpuestos() {
    return this.productosService.findAllImpuestos();
  }

  @Get('impuestos/:id')
  @ApiOperation({ summary: 'Obtener un impuesto por ID' })
  @ApiResponse({ status: 200, description: 'Impuesto encontrado' })
  @ApiResponse({ status: 404, description: 'Impuesto no encontrado' })
  findImpuestoById(@Param('id') id: string) {
    return this.productosService.findImpuestoById(+id);
  }

  @Patch('impuestos/:id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar un impuesto' })
  @ApiResponse({ status: 200, description: 'Impuesto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Impuesto no encontrado' })
  updateImpuesto(@Param('id') id: string, @Body() updateImpuestoDto: UpdateImpuestoDto) {
    return this.productosService.updateImpuesto(+id, updateImpuestoDto);
  }

  @Delete('impuestos/:id')
  @Roles('administrador')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un impuesto' })
  @ApiResponse({ status: 204, description: 'Impuesto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Impuesto no encontrado' })
  removeImpuesto(@Param('id') id: string) {
    return this.productosService.removeImpuesto(+id);
  }
}

