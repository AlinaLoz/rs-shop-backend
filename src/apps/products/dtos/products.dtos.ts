import { IsInt, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  ConstructableDTO,
  PaginationDTO,
} from '@libs/dtos';
import { ERRORS, MAX_INTEGER } from '@libs/constants';

export class GetProductByIdParamsDTO {
  @ApiProperty()
  @IsInt({ message: ERRORS.NOT_AN_INTEGER })
  @Min(1, { message: ERRORS.NOT_A_POSITIVE })
  @Max(MAX_INTEGER, { message: ERRORS.NOT_INT_32 })
  @Type(() => Number)
  id: number;
}

export class GetProductsQueryDTO extends PaginationDTO {}

export class GetProductByIdResponseDTO extends ConstructableDTO<GetProductByIdResponseDTO> {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;
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
