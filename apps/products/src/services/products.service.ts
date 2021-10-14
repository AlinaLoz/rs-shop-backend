import { Connection, Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product, Stock } from '@libs/entities'
import { ERRORS } from '@libs/constants';
import { NotFoundError } from '@libs/exceptions/errors';
import { PaginationDTO } from "@libs/dtos";
import { CreateProductBodyDTO } from "../dtos/products.dtos";

@Injectable()
export class ProductsService {
  @Inject() private readonly connection: Connection;
  @InjectRepository(Product) private readonly productRepository: Repository<Product>;
  
  async getProductsById(productId: string): Promise<Product> {
    return await this.findProductOrFail(productId);
  }

  async getProducts({ limit, skip }: PaginationDTO): Promise<{
    count: number;
    items: Product[];
  }> {
    const [products, count] = await this.productRepository.findAndCount({ skip, take: limit, relations: ['stock'] });
    return { count, items: products };
  }
  
  async createProduct(data: CreateProductBodyDTO): Promise<Product> {
    let product: Product = null;
    await this.connection.transaction(async (manager) => {
      product = await manager.save(Product, new Product(data));
      product.stock = await manager.save(Stock, new Stock({ productId: product.id, count: data.count }));
    });
    return product;
  }
  
  private async findProductOrFail(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ id }, { relations: ['stock'] });
    if (!product) {
      throw new NotFoundError([{ field: 'id', message: ERRORS.NOT_FOUND, }]);
    }
    return product;
  }
}
