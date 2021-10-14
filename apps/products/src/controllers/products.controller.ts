import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ProductsService } from '../services/products.service';
import {
  GetProductByIdParamsDTO,
  GetProductByIdResponseDTO,
  GetProductsQueryDTO,
  GetProductsResponseDTO,
  CreateProductBodyDTO, CreateProductResponseDTO,
} from '../dtos/products.dtos';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @ApiOkResponse({ type: GetProductsResponseDTO })
  async getProducts(
    @Query() query: GetProductsQueryDTO,
  ): Promise<GetProductsResponseDTO> {
    const { items, count } = await this.productsService.getProducts(query);
    return {
      skip: query.skip,
      limit: query.limit,
      count,
      items: items.map((item) => new GetProductByIdResponseDTO({ ...item, ...item.stock })),
    };
  }

  @Get(':id')
  @ApiOkResponse({ type: GetProductsResponseDTO })
  async getProductsById(
    @Param() { id }: GetProductByIdParamsDTO,
  ): Promise<GetProductByIdResponseDTO> {
    const product = await this.productsService.getProductsById(id);
    return new GetProductByIdResponseDTO({ ...product, ...product.stock });
  }
  
  @Post('/')
  @ApiOkResponse({ type: CreateProductResponseDTO })
  async createProduct(
    @Body() body: CreateProductBodyDTO,
  ): Promise<CreateProductResponseDTO> {
    const product = await this.productsService.createProduct(body);
    return new GetProductByIdResponseDTO({ ...product, ...product.stock });
  }
}
