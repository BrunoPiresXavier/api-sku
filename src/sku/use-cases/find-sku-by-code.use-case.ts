import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SkuDto } from '../sku.dto';
import { SkuRepository } from '../sku.repository';

@Injectable()
export class FindSkuByCodeUseCase {
  constructor(private readonly skuRepository: SkuRepository) {}

  async execute(skuCode: string): Promise<SkuDto> {
    const sku = await this.skuRepository.findOneBySku(skuCode);

    if (!sku) {
      throw new HttpException(
        `SKU with code ${skuCode} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return sku;
  }
}
