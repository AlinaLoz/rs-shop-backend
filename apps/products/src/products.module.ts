import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { Product, Stock } from '@libs/entities';

import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { SqsSnsService } from "./services/sqs-sns.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Stock]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, SqsSnsService],
})
export class ProductsModule {}
