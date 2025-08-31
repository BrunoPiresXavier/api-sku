import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'postgres',
          host: process.env.DB_HOST ?? 'localhost',
          port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
          username: process.env.DB_USERNAME ?? 'user',
          password: process.env.DB_PASSWORD ?? 'password',
          database: process.env.DB_NAME ?? 'sku_management',
          entities: [__dirname + '/entities/**'],
          migrations: [__dirname + '/migrations/*.ts'],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}
