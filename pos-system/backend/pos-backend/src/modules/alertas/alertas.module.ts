import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertasService } from './alertas.service';
import { AlertasController } from './alertas.controller';
import { Inventario } from '../inventario/entities/inventario.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Tienda } from '../tiendas/entities/tienda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventario, Producto, Tienda])],
  controllers: [AlertasController],
  providers: [AlertasService],
  exports: [AlertasService],
})
export class AlertasModule {}

