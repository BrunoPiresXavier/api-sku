import { SkuInputDTO, SkuStatusEnum } from '../../sku/sku.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sku')
export class SkuEntity {
  applyUpdate(dto: SkuInputDTO) {
    if (dto.description) this.description = dto.description;
    if (dto.commercialDescription)
      this.commercialDescription = dto.commercialDescription;
    if (dto.sku) this.sku = dto.sku;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  commercialDescription: string;

  @Column({ type: 'varchar', length: 100 })
  sku: string;

  @Column({ type: 'varchar', length: 20 })
  status: SkuStatusEnum;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
