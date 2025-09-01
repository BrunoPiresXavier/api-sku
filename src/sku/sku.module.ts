import { Module } from '@nestjs/common';
import { SkuController } from './sku.controller';
import { SkuRepository } from './sku.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkuEntity } from '../db/entities/sku.entity';
import {
  CreateSkuUseCase,
  FindAllSkusUseCase,
  FindSkuByIdUseCase,
  FindSkuByCodeUseCase,
  UpdateSkuUseCase,
  UpdateSkuStatusUseCase,
} from './use-cases';

@Module({
  controllers: [SkuController],
  imports: [TypeOrmModule.forFeature([SkuEntity])],
  providers: [
    SkuRepository,
    CreateSkuUseCase,
    FindAllSkusUseCase,
    FindSkuByIdUseCase,
    FindSkuByCodeUseCase,
    UpdateSkuUseCase,
    UpdateSkuStatusUseCase,
  ],
})
export class SkuModule {}
