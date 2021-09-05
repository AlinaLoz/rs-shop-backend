import { IsInt, IsOptional, IsString, IsUUID, Max, Min, IsNumber } from 'class-validator';
import {Expose, Transform, Type} from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  ConstructableDTO,
  PaginationDTO,
} from '@libs/dtos';
import {ERRORS, MAX_INTEGER} from '@libs/constants';

export class GetProductByIdParamsDTO {
  @ApiProperty()
  @IsUUID('all')
  id: string;
}

export class GetProductsQueryDTO extends PaginationDTO {}

export class GetProductByIdResponseDTO extends ConstructableDTO<GetProductByIdResponseDTO> {
  @ApiProperty()
  @Expose() id: string;
  
  @ApiProperty()
  @Expose() title: string;
  
  @ApiProperty({ nullable: true })
  @Expose() description: string;
  
  @ApiProperty()
  @Expose() price: number;
  
  @ApiProperty()
  @Expose() count: number;
}

export class GetProductsResponseDTO {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  count: number;

  @ApiProperty({ isArray: true, type: GetProductByIdResponseDTO })
  items: GetProductByIdResponseDTO[];
}

export class CreateProductBodyDTO {
  @ApiProperty()
  @IsString()
  title: string;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
  
  @ApiProperty({ example: 1 })
  @IsInt({ message: ERRORS.NOT_INT_32 })
  @Max(MAX_INTEGER, { message: ERRORS.INVALID_LIMIT_VALUE })
  @Min(0, { message: ERRORS.NOT_A_POSITIVE })
  @Type(() => Number)
  count: number;
  
  @ApiProperty({ example: 1 })
  @IsInt({ message: ERRORS.NOT_INT_32 })
  @Max(MAX_INTEGER, { message: ERRORS.INVALID_LIMIT_VALUE })
  @Min(1, { message: ERRORS.NOT_A_POSITIVE })
  @Type(() => Number)
  price: number;
}

export class CreateProductResponseDTO extends GetProductByIdResponseDTO {}