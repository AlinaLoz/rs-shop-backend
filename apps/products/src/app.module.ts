import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExceptionModule } from '@libs/exceptions/exception.module';
import { ProductsModule } from './products.module';
import DB_CONFIG from "../../../ormconfig";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...DB_CONFIG,
      migrationsRun: true,
    }),
    ExceptionModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

