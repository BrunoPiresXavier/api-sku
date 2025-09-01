import { Injectable } from '@nestjs/common';
import { SkuDto } from '../sku.dto';
import { SkuRepository } from '../sku.repository';

@Injectable()
export class FindAllSkusUseCase {
  constructor(private readonly skuRepository: SkuRepository) {}

  async execute(): Promise<SkuDto[]> {
    return await this.skuRepository.findAll();
  }
}
