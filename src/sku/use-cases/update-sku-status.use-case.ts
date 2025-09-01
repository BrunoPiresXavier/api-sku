import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SkuDto, SkuStatusEnum } from '../sku.dto';
import { SkuRepository } from '../sku.repository';
import { FindSkuByIdUseCase } from './find-sku-by-id.use-case';

@Injectable()
export class UpdateSkuStatusUseCase {
  constructor(
    private readonly skuRepository: SkuRepository,
    private readonly findSkuByIdUseCase: FindSkuByIdUseCase,
  ) {}

  async execute(id: string, newStatus: SkuStatusEnum): Promise<SkuDto> {
    const sku = await this.findSkuByIdUseCase.execute(id);

    this.validateStatusTransition(sku.status, newStatus);

    await this.skuRepository.updateStatus(id, newStatus);

    return await this.findSkuByIdUseCase.execute(id);
  }

  private validateStatusTransition(
    currentStatus: SkuStatusEnum,
    newStatus: SkuStatusEnum,
  ): void {
    const allowedTransitions: Record<SkuStatusEnum, SkuStatusEnum[]> = {
      [SkuStatusEnum.PRE_CADASTRO]: [
        SkuStatusEnum.CADASTRO_COMPLETO,
        SkuStatusEnum.CANCELADO,
      ],
      [SkuStatusEnum.CADASTRO_COMPLETO]: [
        SkuStatusEnum.PRE_CADASTRO,
        SkuStatusEnum.ATIVO,
        SkuStatusEnum.CANCELADO,
      ],
      [SkuStatusEnum.ATIVO]: [SkuStatusEnum.DESATIVADO],
      [SkuStatusEnum.DESATIVADO]: [
        SkuStatusEnum.ATIVO,
        SkuStatusEnum.PRE_CADASTRO,
      ],
      [SkuStatusEnum.CANCELADO]: [],
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new HttpException(
        `Transition from ${currentStatus} to ${newStatus} is not allowed`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
