import { Controller, Get, Param } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PaginationResponseDTO } from '@libs/dtos';

import { ProductsService } from '../services/products.service';
import {
  GetProductByIdParamsDTO,
  GetProductByIdResponseDTO,
  GetProductsQueryDTO,
  GetProductsResponseDTO,
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
      items: items.map((item) => new GetProductByIdResponseDTO(item)),
    };
  }

  @Get(':id')
  @ApiOkResponse({ type: GetProductsResponseDTO })
  async getProductsById(
    @Param() { id }: GetProductByIdParamsDTO,
  ): Promise<GetProductByIdResponseDTO> {
    const product = await this.productsService.getProductsById(id);
    return new GetProductByIdResponseDTO(product);
  }
}
