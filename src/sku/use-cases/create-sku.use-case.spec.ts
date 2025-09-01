import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateSkuUseCase } from './create-sku.use-case';
import { SkuRepository } from '../sku.repository';
import { SkuInputDTO, SkuStatusEnum, SkuDto } from '../sku.dto';

describe('CreateSkuUseCase', () => {
  let useCase: CreateSkuUseCase;
  let skuRepository: SkuRepository;

  const mockSkuRepository = {
    findOneBySku: jest.fn(),
    save: jest.fn(),
  };

  const mockSkuInputDTO: SkuInputDTO = {
    description: 'Test SKU',
    commercialDescription: 'Test Commercial Description',
    sku: 'TEST-SKU-001',
  };

  const mockSkuDto: SkuDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Test SKU',
    commercialDescription: 'Test Commercial Description',
    sku: 'TEST-SKU-001',
    status: SkuStatusEnum.PRE_CADASTRO,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSkuUseCase,
        {
          provide: SkuRepository,
          useValue: mockSkuRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateSkuUseCase>(CreateSkuUseCase);
    skuRepository = module.get<SkuRepository>(SkuRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new SKU successfully', async () => {
      mockSkuRepository.findOneBySku.mockResolvedValue(null);
      mockSkuRepository.save.mockResolvedValue(mockSkuDto);

      const result = await useCase.execute(mockSkuInputDTO);

      expect(skuRepository.findOneBySku).toHaveBeenCalledWith(
        mockSkuInputDTO.sku,
      );
      expect(skuRepository.save).toHaveBeenCalledWith(
        mockSkuInputDTO,
        SkuStatusEnum.PRE_CADASTRO,
      );
      expect(result).toEqual(mockSkuDto);
    });

    it('should throw HttpException when SKU already exists', async () => {
      mockSkuRepository.findOneBySku.mockResolvedValue(mockSkuDto);

      await expect(useCase.execute(mockSkuInputDTO)).rejects.toThrow(
        new HttpException(
          `SKU with code ${mockSkuInputDTO.sku} already exists`,
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(skuRepository.findOneBySku).toHaveBeenCalledWith(
        mockSkuInputDTO.sku,
      );
      expect(skuRepository.save).not.toHaveBeenCalled();
    });
  });
});
