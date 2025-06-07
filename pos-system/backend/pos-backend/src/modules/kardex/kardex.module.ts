import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KardexService } from './kardex.service';
import { KardexController } from './kardex.controller';
import { Kardex } from './entities/kardex.entity';
import { Inventario } from '../inventario/entities/inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kardex, Inventario])],
  controllers: [KardexController],
  providers: [KardexService],
  exports: [KardexService],
})
export class KardexModule {}

