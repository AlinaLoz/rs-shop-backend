import { Module } from '@nestjs/common';

import { ProductsModule } from '@apps/products/products.module';
import { ExceptionModule } from '@libs/exceptions/exception.module';

@Module({
  imports: [ExceptionModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
