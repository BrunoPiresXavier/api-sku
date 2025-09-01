import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SkuDto } from '../sku.dto';
import { SkuRepository } from '../sku.repository';

@Injectable()
export class FindSkuByIdUseCase {
  constructor(private readonly skuRepository: SkuRepository) {}

  async execute(id: string): Promise<SkuDto> {
    const sku = await this.skuRepository.findOneById(id);

    if (!sku) {
      throw new HttpException(
        `SKU with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return sku;
  }
}
