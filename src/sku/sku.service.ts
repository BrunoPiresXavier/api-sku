import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SkuInputDTO, SkuDto, SkuStatusEnum } from './sku.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SkuEntity } from '../db/entities/sku.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkuService {
  constructor(
    @InjectRepository(SkuEntity)
    private readonly skuRepository: Repository<SkuEntity>,
  ) {}

  async create(newSku: SkuInputDTO): Promise<SkuDto> {
    const dbSku = new SkuEntity();
    dbSku.description = newSku.description;
    dbSku.commercialDescription = newSku.commercialDescription;
    dbSku.sku = newSku.sku;
    dbSku.status = SkuStatusEnum.PRE_CADASTRO;

    const skuEntity = await this.skuRepository.save(dbSku);

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

  async update(id: string, updatedSku: SkuInputDTO): Promise<SkuDto> {
    const sku = await this.findById(id);
    const editablefields = this.rules[sku.status].editablefields;
    if (editablefields.length === 0) {
      throw new HttpException(
        `SKU with status ${sku.status} is not editable`,
        HttpStatus.BAD_REQUEST,
      );
    }
    editablefields.forEach((field) => {
      if (!(field in updatedSku)) {
        throw new HttpException(
          `Field ${field} is not editable in status ${sku.status}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    const dbSku = new SkuEntity();
    dbSku.applyUpdate(updatedSku);

    await this.skuRepository.update(id, dbSku);

    if (
      updatedSku.commercialDescription &&
      sku.status !== SkuStatusEnum.PRE_CADASTRO
    ) {
      await this.updateStatus(id, SkuStatusEnum.PRE_CADASTRO);
    }

    return await this.findById(id);
  }

  async updateStatus(id: string, newStatus: SkuStatusEnum): Promise<SkuDto> {
    const sku = await this.findById(id);
    this.validateStatusTransition(sku.status, newStatus);
    const dbSku = new SkuEntity();
    dbSku.status = newStatus;
    await this.skuRepository.update(id, dbSku);
    return await this.findById(id);
  }

  async findById(id: string): Promise<SkuDto> {
    const foundSku = await this.skuRepository.findOne({ where: { id } });

    if (!foundSku) {
      throw new HttpException(
        `SKU with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      id: foundSku.id,
      description: foundSku.description,
      commercialDescription: foundSku.commercialDescription,
      sku: foundSku.sku,
      status: foundSku.status,
      createdAt: foundSku.createdAt,
      updatedAt: foundSku.updatedAt,
    };
  }

  private validateStatusTransition(
    currentStatus: SkuStatusEnum,
    newStatus: SkuStatusEnum,
  ): boolean {
    const rule = this.rules[currentStatus];
    if (!rule.statusAllowed.includes(newStatus)) {
      throw new HttpException(
        `Transition from ${currentStatus} to ${newStatus} is not allowed`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }

  rules: Record<
    SkuStatusEnum,
    { editablefields: string[]; statusAllowed: SkuStatusEnum[] }
  > = {
    [SkuStatusEnum.PRE_CADASTRO]: {
      editablefields: ['description', 'commercialDescription', 'sku'],
      statusAllowed: [SkuStatusEnum.CADASTRO_COMPLETO, SkuStatusEnum.CANCELADO],
    },
    [SkuStatusEnum.CADASTRO_COMPLETO]: {
      editablefields: ['commercialDescription'],
      statusAllowed: [
        SkuStatusEnum.PRE_CADASTRO,
        SkuStatusEnum.ATIVO,
        SkuStatusEnum.CANCELADO,
      ],
    },
    [SkuStatusEnum.ATIVO]: {
      editablefields: [],
      statusAllowed: [SkuStatusEnum.DESATIVADO],
    },
    [SkuStatusEnum.DESATIVADO]: {
      editablefields: [],
      statusAllowed: [SkuStatusEnum.ATIVO, SkuStatusEnum.PRE_CADASTRO],
    },
    [SkuStatusEnum.CANCELADO]: { editablefields: [], statusAllowed: [] },
  };
}
