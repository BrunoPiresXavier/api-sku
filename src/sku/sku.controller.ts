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
import {
  CreateSkuUseCase,
  FindAllSkusUseCase,
  FindSkuByIdUseCase,
  FindSkuByCodeUseCase,
  UpdateSkuUseCase,
  UpdateSkuStatusUseCase,
} from './use-cases';

@ApiTags('sku')
@Controller('sku')
export class SkuController {
  constructor(
    private readonly createSkuUseCase: CreateSkuUseCase,
    private readonly findAllSkusUseCase: FindAllSkusUseCase,
    private readonly findSkuByIdUseCase: FindSkuByIdUseCase,
    private readonly findSkuByCodeUseCase: FindSkuByCodeUseCase,
    private readonly updateSkuUseCase: UpdateSkuUseCase,
    private readonly updateSkuStatusUseCase: UpdateSkuStatusUseCase,
  ) {}

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
    return await this.createSkuUseCase.execute(sku);
  }

  @Get('/')
  @ApiOperation({
    summary: 'Buscar lista de SKU',
    description: 'Retorna uma lista de SKU',
  })
  @ApiOkResponse({
    description: 'Lista de SKU',
    type: SkuDto,
  })
  async findAll(): Promise<SkuDto[]> {
    return await this.findAllSkusUseCase.execute();
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
    return await this.updateSkuUseCase.execute(id, sku);
  }

  @Put('/:id/status')
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: Object.keys(SkuStatusEnum) },
      },
      example: {
        status: SkuStatusEnum.ATIVO,
      },
    },
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
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: SkuStatusEnum,
  ) {
    return await this.updateSkuStatusUseCase.execute(id, status);
  }

  @Get('/:sku')
  @ApiOperation({
    summary: 'Buscar por SKU',
    description: 'Retorna os dados completos de um SKU específico',
  })
  @ApiParam({
    name: 'sku',
    description: 'Código único do SKU',
    example: 'GB-12345',
  })
  @ApiOkResponse({
    description: 'SKU encontrado',
    type: SkuDto,
  })
  @ApiNotFoundResponse({
    description: 'SKU não encontrado',
  })
  async findBySku(@Param('sku') sku: string): Promise<SkuDto> {
    return await this.findSkuByCodeUseCase.execute(sku);
  }

  @Get('/id/:id')
  @ApiOperation({
    summary: 'Buscar por ID do SKU',
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
  async findById(@Param('id') id: string): Promise<SkuDto> {
    return await this.findSkuByIdUseCase.execute(id);
  }
}
