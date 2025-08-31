import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SkuModule } from './sku/sku.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SkuModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
