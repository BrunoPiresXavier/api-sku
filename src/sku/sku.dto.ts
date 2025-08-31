import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SkuStatusEnum {
  PRE_CADASTRO = 'PRE_CADASTRO',
  CADASTRO_COMPLETO = 'CADASTRO_COMPLETO',
  ATIVO = 'ATIVO',
  DESATIVADO = 'DESATIVADO',
  CANCELADO = 'CANCELADO',
}

export class SkuDto {
  @ApiProperty({
    description: 'ID único do SKU',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Produto de exemplo',
    maxLength: 100,
  })
  description: string;

  @ApiProperty({
    description: 'Descrição comercial do produto',
    example: 'Descrição comercial detalhada',
    maxLength: 100,
  })
  commercialDescription: string;

  @ApiProperty({
    description: 'Código SKU único do produto',
    example: 'PROD-001',
    maxLength: 100,
  })
  sku: string;

  @ApiProperty({
    description: 'Status atual do SKU',
    enum: SkuStatusEnum,
    example: SkuStatusEnum.PRE_CADASTRO,
  })
  status: SkuStatusEnum;

  @ApiProperty({
    description: 'Data de criação do SKU',
    example: '2023-01-01T10:00:00Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do SKU',
    example: '2023-01-01T10:00:00Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}

export class SkuInputDTO {
  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Produto de exemplo',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    description: 'Descrição comercial do produto',
    example: 'Descrição comercial detalhada',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsOptional()
  commercialDescription: string;

  @ApiPropertyOptional({
    description: 'Código SKU único do produto',
    example: 'PROD-001',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsOptional()
  sku: string;
}
