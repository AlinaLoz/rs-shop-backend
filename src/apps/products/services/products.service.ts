import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from '@libs/entities/product.entity';
import { ERRORS } from '@libs/constants';
import { NotFoundError } from '@libs/exceptions/errors';
import { PaginationDTO } from "@libs/dtos";

@Injectable()
export class ProductsService {
  @InjectRepository(Product) private readonly productRepository: Repository<Product>;
  
  async getProductsById(productId: number): Promise<Product> {
    return await this.findProductOrFail(productId);
  }

  async getProducts({ limit, skip }: PaginationDTO): Promise<{
    count: number;
    items: Product[];
  }> {
    const [products, count] = await this.productRepository.findAndCount({ skip, take: limit });
    return { count, items: products };
  }
  
  private async findProductOrFail(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ id });
    if (!product) {
      throw new NotFoundError([{ field: 'id', message: ERRORS.NOT_FOUND, }]);
    }
    return product;
  }
}
