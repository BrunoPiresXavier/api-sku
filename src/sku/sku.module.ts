import { Module } from '@nestjs/common';
import { SkuController } from './sku.controller';
import { SkuService } from './sku.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkuEntity } from '../db/entities/sku.entity';

@Module({
  controllers: [SkuController],
  imports: [TypeOrmModule.forFeature([SkuEntity])],
  providers: [SkuService],
})
export class SkuModule {}
