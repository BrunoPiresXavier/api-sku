import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SkuService } from './sku.service';
import { SkuEntity } from '../db/entities/sku.entity';
import { SkuInputDTO, SkuStatusEnum } from './sku.dto';

describe('SkuService', () => {
  let service: SkuService;

  const mockRepository = {
    save: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  };

  const mockSkuEntity: SkuEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Test',
    commercialDescription: 'Test Comercial',
    sku: 'GB123',
    status: SkuStatusEnum.PRE_CADASTRO,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
    applyUpdate: jest.fn(),
  };

  const mockSkuInputDTO: SkuInputDTO = {
    description: 'Test SKU',
    commercialDescription: 'Test Comercial',
    sku: 'GB123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkuService,
        {
          provide: getRepositoryToken(SkuEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SkuService>(SkuService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create', async () => {
      mockRepository.save.mockResolvedValue(mockSkuEntity);

      const result = await service.create(mockSkuInputDTO);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        id: mockSkuEntity.id,
        description: mockSkuEntity.description,
        commercialDescription: mockSkuEntity.commercialDescription,
        sku: mockSkuEntity.sku,
        status: mockSkuEntity.status,
        createdAt: mockSkuEntity.createdAt,
        updatedAt: mockSkuEntity.updatedAt,
      });
    });

    it('should set status to PRE_CADASTRO when create', async () => {
      mockRepository.save.mockResolvedValue(mockSkuEntity);

      const result = await service.create(mockSkuInputDTO);

      expect(result.status).toBe(SkuStatusEnum.PRE_CADASTRO);
    });
  });

  describe('update', () => {
    it('should update with status allows editing', async () => {
      const existingSku = {
        ...mockSkuEntity,
        status: SkuStatusEnum.PRE_CADASTRO,
      };
      mockRepository.findOne.mockResolvedValueOnce(existingSku);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValueOnce({
        ...existingSku,
        description: 'Updated Description',
      });

      const updateDto = {
        ...mockSkuInputDTO,
        description: 'Updated Description',
      };
      const result = await service.update(existingSku.id, updateDto);

      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(result.description).toBe('Updated Description');
    });

    it('should throw exception when field is not editable for current status', async () => {
      const existingSku = { ...mockSkuEntity, status: SkuStatusEnum.ATIVO };
      mockRepository.findOne.mockResolvedValue(existingSku);

      const updateDto = {
        ...mockSkuInputDTO,
        description: 'Updated Description',
      };

      await expect(service.update(existingSku.id, updateDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should change status to PRE_CADASTRO when commercialDescription is updated and current status is not PRE_CADASTRO', async () => {
      const existingSku = {
        ...mockSkuEntity,
        status: SkuStatusEnum.CADASTRO_COMPLETO,
      };
      mockRepository.findOne.mockResolvedValueOnce(existingSku);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValueOnce(existingSku);

      const updateDto = {
        ...mockSkuInputDTO,
        commercialDescription: 'New Description',
      };

      // Mock the updateStatus method call
      const updateStatusSpy = jest
        .spyOn(service, 'updateStatus')
        .mockResolvedValue({
          ...existingSku,
          status: SkuStatusEnum.PRE_CADASTRO,
        });

      await service.update(existingSku.id, updateDto);

      expect(updateStatusSpy).toHaveBeenCalledWith(
        existingSku.id,
        SkuStatusEnum.PRE_CADASTRO,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update status successfully when transition is valid', async () => {
      const existingSku = {
        ...mockSkuEntity,
        status: SkuStatusEnum.PRE_CADASTRO,
      };
      mockRepository.findOne.mockResolvedValueOnce(existingSku);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValueOnce({
        ...existingSku,
        status: SkuStatusEnum.CADASTRO_COMPLETO,
      });

      const result = await service.updateStatus(
        existingSku.id,
        SkuStatusEnum.CADASTRO_COMPLETO,
      );

      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(result.status).toBe(SkuStatusEnum.CADASTRO_COMPLETO);
    });

    it('should throw exception when status transition is not allowed', async () => {
      const existingSku = {
        ...mockSkuEntity,
        status: SkuStatusEnum.PRE_CADASTRO,
      };
      mockRepository.findOne.mockResolvedValue(existingSku);

      await expect(
        service.updateStatus(existingSku.id, SkuStatusEnum.ATIVO),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findById', () => {
    it('should return SKU when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockSkuEntity);

      const result = await service.findById(mockSkuEntity.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockSkuEntity.id },
      });
      expect(result).toEqual({
        id: mockSkuEntity.id,
        description: mockSkuEntity.description,
        commercialDescription: mockSkuEntity.commercialDescription,
        sku: mockSkuEntity.sku,
        status: mockSkuEntity.status,
        createdAt: mockSkuEntity.createdAt,
        updatedAt: mockSkuEntity.updatedAt,
      });
    });

    it('should throw NOT_FOUND exception when SKU does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        new HttpException(
          'SKU with ID non-existent-id not found',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('validateStatusTransition', () => {
    it('should return true for valid transitions', () => {
      const result = service['validateStatusTransition'](
        SkuStatusEnum.PRE_CADASTRO,
        SkuStatusEnum.CADASTRO_COMPLETO,
      );

      expect(result).toBe(true);
    });

    it('should throw exception for invalid transitions', () => {
      expect(() =>
        service['validateStatusTransition'](
          SkuStatusEnum.CANCELADO,
          SkuStatusEnum.ATIVO,
        ),
      ).toThrow(HttpException);
    });
  });

  describe('rules configuration', () => {
    it('should have correct rule for PRE_CADASTRO', () => {
      const rule = service.rules[SkuStatusEnum.PRE_CADASTRO];

      expect(rule.editablefields).toEqual([
        'description',
        'commercialDescription',
        'sku',
      ]);
      expect(rule.statusAllowed).toEqual([
        SkuStatusEnum.CADASTRO_COMPLETO,
        SkuStatusEnum.CANCELADO,
      ]);
    });

    it('should have correct rule for CADASTRO_COMPLETO', () => {
      const rule = service.rules[SkuStatusEnum.CADASTRO_COMPLETO];

      expect(rule.editablefields).toEqual(['commercialDescription']);
      expect(rule.statusAllowed).toEqual([
        SkuStatusEnum.PRE_CADASTRO,
        SkuStatusEnum.ATIVO,
        SkuStatusEnum.CANCELADO,
      ]);
    });

    it('should have correct rule for ATIVO', () => {
      const rule = service.rules[SkuStatusEnum.ATIVO];

      expect(rule.editablefields).toEqual([]);
      expect(rule.statusAllowed).toEqual([SkuStatusEnum.DESATIVADO]);
    });

    it('should have correct rule for DESATIVADO', () => {
      const rule = service.rules[SkuStatusEnum.DESATIVADO];

      expect(rule.editablefields).toEqual([]);
      expect(rule.statusAllowed).toEqual([
        SkuStatusEnum.ATIVO,
        SkuStatusEnum.PRE_CADASTRO,
      ]);
    });

    it('should have correct rule for CANCELADO', () => {
      const rule = service.rules[SkuStatusEnum.CANCELADO];

      expect(rule.editablefields).toEqual([]);
      expect(rule.statusAllowed).toEqual([]);
    });
  });
});
