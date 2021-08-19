import { IsOptional, Max, Min, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { ERRORS, MAX_INTEGER, PAGINATION_LIMIT_DEFAULT } from '@libs/constants';

export class PaginationDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: ERRORS.INVALID_SKIP_VALUE })
  @Min(0, { message: ERRORS.INVALID_SKIP_VALUE })
  @Max(MAX_INTEGER, { message: ERRORS.INVALID_SKIP_VALUE })
  @Type(() => Number)
  skip: number = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: ERRORS.INVALID_LIMIT_VALUE })
  @Min(0, { message: ERRORS.INVALID_LIMIT_VALUE })
  @Max(PAGINATION_LIMIT_DEFAULT, { message: ERRORS.INVALID_LIMIT_VALUE })
  @Type(() => Number)
  limit: number = PAGINATION_LIMIT_DEFAULT;
}

export class PaginationResponseDTO<ItemEntity> {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  count: number;

  @ApiProperty({ isArray: true })
  items: ItemEntity[];

  constructor(data: PaginationResponseDTO<ItemEntity>) {
    Object.assign(this, data);
  }
}
