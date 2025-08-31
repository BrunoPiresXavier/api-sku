import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SkuInputDTO, SkuDto, SkuStatusEnum } from './sku.dto';
import { SkuService } from './sku.service';

@ApiTags('sku')
@Controller('sku')
export class SkuController {
  constructor(private readonly skuService: SkuService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar um novo SKU',
    description: 'Cria um novo SKU com status inicial PRE_CADASTRO',
  })
  @ApiCreatedResponse({
    description: 'SKU criado com sucesso',
    type: SkuDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos',
  })
  @ApiBody({
    type: SkuInputDTO,
    description: 'Dados do SKU a ser criado',
    examples: {
      exemplo1: {
        summary: 'Exemplo básico',
        value: {
          description: 'Produto de exemplo',
          commercialDescription: 'Descrição comercial do produto',
          sku: 'PROD-001',
        },
      },
    },
  })
  async create(@Body() sku: SkuInputDTO) {
    return await this.skuService.create(sku);
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Atualizar SKU',
    description:
      'Atualiza os dados de um SKU existente. Campos editáveis dependem do status atual.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do SKU (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'SKU atualizado com sucesso',
    type: SkuDto,
  })
  @ApiNotFoundResponse({
    description: 'SKU não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou campo não editável para o status atual',
  })
  @ApiBody({
    type: SkuInputDTO,
    description: 'Dados para atualização do SKU',
  })
  async update(@Param('id') id: string, @Body() sku: SkuInputDTO) {
    return await this.skuService.update(id, sku);
  }

  @Put('/:id/status/:status')
  @ApiOperation({
    summary: 'Atualizar status do SKU',
    description:
      'Atualiza o status do SKU seguindo as regras de transição permitidas',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do SKU (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'status',
    description: 'Novo status do SKU',
    enum: SkuStatusEnum,
    example: 'CADASTRO_COMPLETO',
  })
  @ApiOkResponse({
    description: 'Status do SKU atualizado com sucesso',
    type: SkuDto,
  })
  @ApiNotFoundResponse({
    description: 'SKU não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Transição de status não permitida',
  })
  async updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return await this.skuService.updateStatus(id, SkuStatusEnum[status]);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Buscar SKU por ID',
    description: 'Retorna os dados completos de um SKU específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do SKU (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'SKU encontrado',
    type: SkuDto,
  })
  @ApiNotFoundResponse({
    description: 'SKU não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido (formato UUID incorreto)',
  })
  async findById(@Param('id') id: string): Promise<SkuDto> {
    return await this.skuService.findById(id);
  }
}
