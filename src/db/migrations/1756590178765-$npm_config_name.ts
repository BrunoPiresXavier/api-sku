import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1756590178765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(`CREATE TABLE "sku" (
            "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
            "description" VARCHAR(100) NOT NULL,
            "commercialDescription" VARCHAR(100),
            "sku" VARCHAR(100) NOT NULL,
            "status" VARCHAR(20) NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "sku";`);
  }
}
