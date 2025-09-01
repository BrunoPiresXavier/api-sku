import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { AppModule } from '../src/app.module';
import { SkuDto, SkuStatusEnum } from '../src/sku/sku.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SkuEntity } from '../src/db/entities/sku.entity';
import { Repository } from 'typeorm';

describe('SkuController (e2e)', () => {
  let app: INestApplication<Server>;
  let skuRepository: Repository<SkuEntity>;

  const validSkuData = {
    description: 'Test ',
    commercialDescription: 'Test comercial',
    sku: 'GB123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    skuRepository = moduleFixture.get<Repository<SkuEntity>>(
      getRepositoryToken(SkuEntity),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await skuRepository.clear();
  });

  it('should create', () => {
    return request(app.getHttpServer())
      .post('/sku')
      .send(validSkuData)
      .expect(201)
      .expect((res: { body: SkuDto }) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.description).toBe(validSkuData.description);
        expect(res.body.status).toBe(SkuStatusEnum.PRE_CADASTRO);
      });
  });

  it('should get by ID', async () => {
    const createResponse: { body: SkuDto } = await request(app.getHttpServer())
      .post('/sku')
      .send(validSkuData);

    const skuId = createResponse.body.id;

    return request(app.getHttpServer())
      .get(`/sku/id/${skuId}`)
      .expect(200)
      .expect((res: { body: SkuDto }) => {
        expect(res.body.id).toBe(skuId);
        expect(res.body.description).toBe(validSkuData.description);
      });
  });

  it('should update by ID', async () => {
    const createResponse: { body: SkuDto } = await request(app.getHttpServer())
      .post('/sku')
      .send(validSkuData);

    const skuId = createResponse.body.id;
    const updateData = { description: 'Updated Description' };

    return request(app.getHttpServer())
      .put(`/sku/${skuId}`)
      .send(updateData)
      .expect(200)
      .expect((res: { body: SkuDto }) => {
        expect(res.body.description).toBe(updateData.description);
      });
  });

  it('should update status', async () => {
    const createResponse: { body: SkuDto } = await request(app.getHttpServer())
      .post('/sku')
      .send(validSkuData);

    const skuId = createResponse.body.id;

    return request(app.getHttpServer())
      .put(`/sku/${skuId}/status`)
      .send({ status: SkuStatusEnum.CADASTRO_COMPLETO })
      .expect(200)
      .expect((res: { body: SkuDto }) => {
        expect(res.body.status).toBe(SkuStatusEnum.CADASTRO_COMPLETO);
      });
  });
});
