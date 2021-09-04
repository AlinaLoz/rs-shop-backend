import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from '@apps/products/products.module';
import { ExceptionModule } from '@libs/exceptions/exception.module';
import config from "config";

import * as Entities from '@libs/entities';
// import * as Migrations from './migrations/index.ts';

const entities = Object.values(Entities);
// const migrations = Object.values(Migrations);


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.POSTGRES.HOST,
      port: config.POSTGRES.PORT,
      username: config.POSTGRES.USER,
      password: config.POSTGRES.PASSWORD,
      database: config.POSTGRES.DB,
      migrationsRun: true,
      migrations: [],
      entities,
      synchronize: false,
      cli: {
        migrationsDir: 'migrations',
      },
      logger: 'file',
    }),
    ExceptionModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

