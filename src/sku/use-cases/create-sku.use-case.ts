import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SkuInputDTO, SkuDto, SkuStatusEnum } from '../sku.dto';
import { SkuRepository } from '../sku.repository';

@Injectable()
export class CreateSkuUseCase {
  constructor(private readonly skuRepository: SkuRepository) {}

  async execute(newSku: SkuInputDTO): Promise<SkuDto> {
    const existingSku = await this.skuRepository.findOneBySku(newSku.sku);
    if (existingSku) {
      throw new HttpException(
        `SKU with code ${newSku.sku} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.skuRepository.save(newSku, SkuStatusEnum.PRE_CADASTRO);
  }
}
