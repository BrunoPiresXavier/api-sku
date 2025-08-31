import { Test, TestingModule } from '@nestjs/testing';
import { SkuController } from './sku.controller';
import { SkuService } from './sku.service';
import { SkuInputDTO, SkuStatusEnum, SkuDto } from './sku.dto';

describe('SkuController', () => {
  let controller: SkuController;
  let service: SkuService;

  const mockSkuService = {
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    findById: jest.fn(),
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
          provide: SkuService,
          useValue: mockSkuService,
        },
      ],
    }).compile();

    controller = module.get<SkuController>(SkuController);
    service = module.get<SkuService>(SkuService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new SKU', async () => {
      mockSkuService.create.mockResolvedValue(mockSkuDto);

      const result = await controller.create(mockSkuInputDTO);

      expect(service.create).toHaveBeenCalledWith(mockSkuInputDTO);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSkuDto);
    });

    it('should throw error when service throws', async () => {
      const error = new Error('Service error');
      mockSkuService.create.mockRejectedValue(error);

      await expect(controller.create(mockSkuInputDTO)).rejects.toThrow(
        'Service error',
      );
      expect(service.create).toHaveBeenCalledWith(mockSkuInputDTO);
    });
  });

  describe('update', () => {
    const skuId = '123e4567-e89b-12d3-a456-426614174000';
    const updatedSkuDto = { ...mockSkuDto, description: 'Updated Description' };

    it('should update a SKU', async () => {
      mockSkuService.update.mockResolvedValue(updatedSkuDto);

      const result = await controller.update(skuId, mockSkuInputDTO);

      expect(service.update).toHaveBeenCalledWith(skuId, mockSkuInputDTO);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedSkuDto);
    });

    it('should throw error when service throws', async () => {
      const error = new Error('SKU not found');
      mockSkuService.update.mockRejectedValue(error);

      await expect(controller.update(skuId, mockSkuInputDTO)).rejects.toThrow(
        'SKU not found',
      );
      expect(service.update).toHaveBeenCalledWith(skuId, mockSkuInputDTO);
    });
  });

  describe('updateStatus', () => {
    const skuId = '123e4567-e89b-12d3-a456-426614174000';
    const status = 'CADASTRO_COMPLETO';
    const updatedSkuDto = {
      ...mockSkuDto,
      status: SkuStatusEnum.CADASTRO_COMPLETO,
    };

    it('should update SKU status', async () => {
      mockSkuService.updateStatus.mockResolvedValue(updatedSkuDto);

      const result = await controller.updateStatus(skuId, status);

      expect(service.updateStatus).toHaveBeenCalledWith(
        skuId,
        SkuStatusEnum.CADASTRO_COMPLETO,
      );
      expect(service.updateStatus).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedSkuDto);
    });

    it('should throw error when service throws', async () => {
      const error = new Error('Invalid status transition');
      mockSkuService.updateStatus.mockRejectedValue(error);

      await expect(controller.updateStatus(skuId, status)).rejects.toThrow(
        'Invalid status transition',
      );
      expect(service.updateStatus).toHaveBeenCalledWith(
        skuId,
        SkuStatusEnum.CADASTRO_COMPLETO,
      );
    });

    it('should handle invalid status enum', async () => {
      const invalidStatus = 'INVALID_STATUS';
      mockSkuService.updateStatus.mockResolvedValue(mockSkuDto);

      await controller.updateStatus(skuId, invalidStatus);

      expect(service.updateStatus).toHaveBeenCalledWith(skuId, undefined);
    });
  });

  describe('findById', () => {
    const skuId = '123e4567-e89b-12d3-a456-426614174000';

    it('should find SKU by ID', async () => {
      mockSkuService.findById.mockResolvedValue(mockSkuDto);

      const result = await controller.findById(skuId);

      expect(service.findById).toHaveBeenCalledWith(skuId);
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSkuDto);
    });

    it('should throw error when SKU not found', async () => {
      const error = new Error('SKU not found');
      mockSkuService.findById.mockRejectedValue(error);

      await expect(controller.findById(skuId)).rejects.toThrow('SKU not found');
      expect(service.findById).toHaveBeenCalledWith(skuId);
    });

    it('should throw error for invalid UUID format', async () => {
      const invalidId = 'invalid-uuid';
      const error = new Error('Invalid UUID format');
      mockSkuService.findById.mockRejectedValue(error);

      await expect(controller.findById(invalidId)).rejects.toThrow(
        'Invalid UUID format',
      );
      expect(service.findById).toHaveBeenCalledWith(invalidId);
    });
  });
});
