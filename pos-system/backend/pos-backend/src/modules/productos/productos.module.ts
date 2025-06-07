import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Unidad } from './entities/unidad.entity';
import { Impuesto } from './entities/impuesto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Unidad, Impuesto])],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}

