import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { Venta } from '../ventas/entities/venta.entity';
import { Gasto } from '../gastos/entities/gasto.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, Gasto, Inventario, Producto])],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}

