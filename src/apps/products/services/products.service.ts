import { Injectable } from '@nestjs/common';

import { Product } from '@libs/entities/product.entity';
import { ERRORS } from '@libs/constants';
import { NotFoundError } from '@libs/exceptions/errors';

import { PRODUCTS_MOCK } from '../mocks/products';

@Injectable()
export class ProductsService {
  getProductsById(productId: number): Product {
    const product = PRODUCTS_MOCK.find((product) => product.id === productId);
    if (!product) {
      throw new NotFoundError([
        {
          field: 'id',
          message: ERRORS.NOT_FOUND,
        },
      ]);
    }
    return product;
  }

  async getProducts({ limit, skip }: { skip: number; limit: number }): Promise<{
    count: number;
    items: Product[];
  }> {
    return {
      count: PRODUCTS_MOCK.length,
      items: PRODUCTS_MOCK.slice(skip, skip + limit),
    };
  }
}
