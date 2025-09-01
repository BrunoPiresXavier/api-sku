import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkuEntity } from '../db/entities/sku.entity';
import { Repository } from 'typeorm';
import { SkuDto, SkuInputDTO, SkuStatusEnum } from './sku.dto';

@Injectable()
export class SkuRepository {
  constructor(
    @InjectRepository(SkuEntity)
    private readonly skuTypeOrmRepository: Repository<SkuEntity>,
  ) {}

  async findOneBySku(sku: string): Promise<SkuDto | null> {
    const skuEntity = await this.skuTypeOrmRepository.findOne({
      where: { sku },
    });
    if (!skuEntity) {
      return null;
    }
    return {
      id: skuEntity.id,
      description: skuEntity.description,
      commercialDescription: skuEntity.commercialDescription,
      sku: skuEntity.sku,
      status: skuEntity.status,
      createdAt: skuEntity.createdAt,
      updatedAt: skuEntity.updatedAt,
    };
  }

  async save(newSku: SkuInputDTO, status: SkuStatusEnum): Promise<SkuDto> {
    const dbSku = { ...newSku, status };

    const skuEntity = await this.skuTypeOrmRepository.save(dbSku);
    return {
      id: skuEntity.id,
      description: skuEntity.description,
      commercialDescription: skuEntity.commercialDescription,
      sku: skuEntity.sku,
      status: skuEntity.status,
      createdAt: skuEntity.createdAt,
      updatedAt: skuEntity.updatedAt,
    };
  }

  async findAll(): Promise<SkuDto[]> {
    const skus = await this.skuTypeOrmRepository.find();
    return skus.map((sku) => ({
      id: sku.id,
      description: sku.description,
      commercialDescription: sku.commercialDescription,
      sku: sku.sku,
      status: sku.status,
      createdAt: sku.createdAt,
      updatedAt: sku.updatedAt,
    }));
  }

  async findOneById(id: string): Promise<SkuDto | null> {
    const skuEntity = await this.skuTypeOrmRepository.findOne({
      where: { id },
    });
    if (!skuEntity) return null;
    return {
      id: skuEntity.id,
      description: skuEntity.description,
      commercialDescription: skuEntity.commercialDescription,
      sku: skuEntity.sku,
      status: skuEntity.status,
      createdAt: skuEntity.createdAt,
      updatedAt: skuEntity.updatedAt,
    };
  }

  async update(id: string, updatedSku: SkuInputDTO): Promise<void> {
    await this.skuTypeOrmRepository.update(id, updatedSku);
  }

  async updateStatus(id: string, newStatus: SkuStatusEnum): Promise<void> {
    await this.skuTypeOrmRepository.update(id, { status: newStatus });
  }
}
