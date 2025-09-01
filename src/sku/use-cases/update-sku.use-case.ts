import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SkuInputDTO, SkuDto, SkuStatusEnum } from '../sku.dto';
import { SkuRepository } from '../sku.repository';
import { FindSkuByIdUseCase } from './find-sku-by-id.use-case';

@Injectable()
export class UpdateSkuUseCase {
  constructor(
    private readonly skuRepository: SkuRepository,
    private readonly findSkuByIdUseCase: FindSkuByIdUseCase,
  ) {}

  async execute(id: string, updatedSku: SkuInputDTO): Promise<SkuDto> {
    const skuById = await this.findSkuByIdUseCase.execute(id);

    if (
      updatedSku.description === skuById.description &&
      updatedSku.commercialDescription === skuById.commercialDescription &&
      updatedSku.sku === skuById.sku
    ) {
      return skuById;
    }

    if (updatedSku.sku !== skuById.sku) {
      const skuBySku = await this.skuRepository.findOneBySku(updatedSku.sku);
      if (updatedSku.sku === skuBySku?.sku) {
        throw new HttpException(
          `SKU with code ${updatedSku.sku} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const editableFields = this.getEditableFields(skuById.status);
    if (editableFields.length === 0) {
      throw new HttpException(
        `SKU with status ${skuById.status} is not editable`,
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const field in updatedSku) {
      if (
        !editableFields.includes(field) &&
        updatedSku[field] !== skuById[field]
      ) {
        throw new HttpException(
          `Field ${field} is not editable in status ${skuById.status}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this.skuRepository.update(id, updatedSku);

    if (
      updatedSku.commercialDescription &&
      skuById.status !== SkuStatusEnum.PRE_CADASTRO
    ) {
      await this.skuRepository.updateStatus(id, SkuStatusEnum.PRE_CADASTRO);
    }

    return await this.findSkuByIdUseCase.execute(id);
  }

  private getEditableFields(status: SkuStatusEnum): string[] {
    const rules: Record<SkuStatusEnum, string[]> = {
      [SkuStatusEnum.PRE_CADASTRO]: [
        'description',
        'commercialDescription',
        'sku',
      ],
      [SkuStatusEnum.CADASTRO_COMPLETO]: ['commercialDescription'],
      [SkuStatusEnum.ATIVO]: [],
      [SkuStatusEnum.DESATIVADO]: [],
      [SkuStatusEnum.CANCELADO]: [],
    };

    return rules[status] || [];
  }
}
