import { Test, TestingModule } from '@nestjs/testing';
import { SkuController } from './sku.controller';
import { SkuInputDTO, SkuStatusEnum, SkuDto } from './sku.dto';
import {
  CreateSkuUseCase,
  FindAllSkusUseCase,
  FindSkuByIdUseCase,
  FindSkuByCodeUseCase,
  UpdateSkuUseCase,
  UpdateSkuStatusUseCase,
} from './use-cases';

describe('SkuController', () => {
  let controller: SkuController;
  let createSkuUseCase: CreateSkuUseCase;
  let findAllSkusUseCase: FindAllSkusUseCase;
  let findSkuByIdUseCase: FindSkuByIdUseCase;
  let findSkuByCodeUseCase: FindSkuByCodeUseCase;
  let updateSkuUseCase: UpdateSkuUseCase;
  let updateSkuStatusUseCase: UpdateSkuStatusUseCase;

  const mockCreateSkuUseCase = {
    execute: jest.fn(),
  };

  const mockFindAllSkusUseCase = {
    execute: jest.fn(),
  };

  const mockFindSkuByIdUseCase = {
    execute: jest.fn(),
  };

  const mockFindSkuByCodeUseCase = {
    execute: jest.fn(),
  };

  const mockUpdateSkuUseCase = {
    execute: jest.fn(),
  };

  const mockUpdateSkuStatusUseCase = {
    execute: jest.fn(),
  };

  const mockSkuInputDTO: SkuInputDTO = {
    description: 'Test',
    commercialDescription: 'Description comercial',
    sku: 'TEST-SKU-001',
  };

  const mockSkuDto: SkuDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Test',
    commercialDescription: 'Description comercial',
    sku: 'TEST-SKU-001',
    status: SkuStatusEnum.PRE_CADASTRO,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkuController],
      providers: [
        {
          provide: CreateSkuUseCase,
          useValue: mockCreateSkuUseCase,
        },
        {
          provide: FindAllSkusUseCase,
          useValue: mockFindAllSkusUseCase,
        },
        {
          provide: FindSkuByIdUseCase,
          useValue: mockFindSkuByIdUseCase,
        },
        {
          provide: FindSkuByCodeUseCase,
          useValue: mockFindSkuByCodeUseCase,
        },
        {
          provide: UpdateSkuUseCase,
          useValue: mockUpdateSkuUseCase,
        },
        {
          provide: UpdateSkuStatusUseCase,
          useValue: mockUpdateSkuStatusUseCase,
        },
      ],
    }).compile();

    controller = module.get<SkuController>(SkuController);
    createSkuUseCase = module.get<CreateSkuUseCase>(CreateSkuUseCase);
    findAllSkusUseCase = module.get<FindAllSkusUseCase>(FindAllSkusUseCase);
    findSkuByIdUseCase = module.get<FindSkuByIdUseCase>(FindSkuByIdUseCase);
    findSkuByCodeUseCase =
      module.get<FindSkuByCodeUseCase>(FindSkuByCodeUseCase);
    updateSkuUseCase = module.get<UpdateSkuUseCase>(UpdateSkuUseCase);
    updateSkuStatusUseCase = module.get<UpdateSkuStatusUseCase>(
      UpdateSkuStatusUseCase,
    );

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new SKU', async () => {
      mockCreateSkuUseCase.execute.mockResolvedValue(mockSkuDto);

      const result = await controller.create(mockSkuInputDTO);

      expect(createSkuUseCase.execute).toHaveBeenCalledWith(mockSkuInputDTO);
      expect(createSkuUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSkuDto);
    });

    it('should throw error when use case throws', async () => {
      const error = new Error('SKU already exists');
      mockCreateSkuUseCase.execute.mockRejectedValue(error);

      await expect(controller.create(mockSkuInputDTO)).rejects.toThrow(
        'SKU already exists',
      );
      expect(createSkuUseCase.execute).toHaveBeenCalledWith(mockSkuInputDTO);
    });
  });

  describe('findAll', () => {
    it('should return all SKUs', async () => {
      const mockSkuList = [mockSkuDto];
      mockFindAllSkusUseCase.execute.mockResolvedValue(mockSkuList);

      const result = await controller.findAll();

      expect(findAllSkusUseCase.execute).toHaveBeenCalledWith();
      expect(findAllSkusUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSkuList);
    });
  });

  describe('update', () => {
    const skuId = '123e4567-e89b-12d3-a456-426614174000';
    const updatedSkuDto = { ...mockSkuDto, description: 'Updated Description' };

    it('should update a SKU', async () => {
      mockUpdateSkuUseCase.execute.mockResolvedValue(updatedSkuDto);

      const result = await controller.update(skuId, mockSkuInputDTO);

      expect(updateSkuUseCase.execute).toHaveBeenCalledWith(
        skuId,
        mockSkuInputDTO,
      );
      expect(updateSkuUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedSkuDto);
    });

    it('should throw error when use case throws', async () => {
      const error = new Error('SKU not found');
      mockUpdateSkuUseCase.execute.mockRejectedValue(error);

      await expect(controller.update(skuId, mockSkuInputDTO)).rejects.toThrow(
        'SKU not found',
      );
      expect(updateSkuUseCase.execute).toHaveBeenCalledWith(
        skuId,
        mockSkuInputDTO,
      );
    });
  });

  describe('updateStatus', () => {
    const skuId = '123e4567-e89b-12d3-a456-426614174000';
    const status = SkuStatusEnum.CADASTRO_COMPLETO;
    const updatedSkuDto = {
      ...mockSkuDto,
      status: SkuStatusEnum.CADASTRO_COMPLETO,
    };

    it('should update SKU status', async () => {
      mockUpdateSkuStatusUseCase.execute.mockResolvedValue(updatedSkuDto);

      const result = await controller.updateStatus(skuId, status);

      expect(updateSkuStatusUseCase.execute).toHaveBeenCalledWith(
        skuId,
        status,
      );
      expect(updateSkuStatusUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedSkuDto);
    });

    it('should throw error when use case throws', async () => {
      const error = new Error('Invalid status transition');
      mockUpdateSkuStatusUseCase.execute.mockRejectedValue(error);

      await expect(controller.updateStatus(skuId, status)).rejects.toThrow(
        'Invalid status transition',
      );
      expect(updateSkuStatusUseCase.execute).toHaveBeenCalledWith(
        skuId,
        status,
      );
    });
  });

  describe('findById', () => {
    const skuId = '123e4567-e89b-12d3-a456-426614174000';

    it('should find SKU by ID', async () => {
      mockFindSkuByIdUseCase.execute.mockResolvedValue(mockSkuDto);

      const result = await controller.findById(skuId);

      expect(findSkuByIdUseCase.execute).toHaveBeenCalledWith(skuId);
      expect(findSkuByIdUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSkuDto);
    });

    it('should throw error when SKU not found', async () => {
      const error = new Error('SKU not found');
      mockFindSkuByIdUseCase.execute.mockRejectedValue(error);

      await expect(controller.findById(skuId)).rejects.toThrow('SKU not found');
      expect(findSkuByIdUseCase.execute).toHaveBeenCalledWith(skuId);
    });
  });

  describe('findBySku', () => {
    const skuCode = 'TEST-SKU-001';

    it('should find SKU by code', async () => {
      mockFindSkuByCodeUseCase.execute.mockResolvedValue(mockSkuDto);

      const result = await controller.findBySku(skuCode);

      expect(findSkuByCodeUseCase.execute).toHaveBeenCalledWith(skuCode);
      expect(findSkuByCodeUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSkuDto);
    });

    it('should throw error when SKU not found', async () => {
      const error = new Error('SKU not found');
      mockFindSkuByCodeUseCase.execute.mockRejectedValue(error);

      await expect(controller.findBySku(skuCode)).rejects.toThrow(
        'SKU not found',
      );
      expect(findSkuByCodeUseCase.execute).toHaveBeenCalledWith(skuCode);
    });
  });
});
