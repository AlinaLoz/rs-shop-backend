import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { PipeTransform } from '@nestjs/common';

import { BadRequestError } from '../errors';

export class ClassValidationPipe implements PipeTransform {
  async transform(value, metadata) {
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const details = [];
      errors.forEach(({ property, constraints }) => {
        Object.keys(constraints).forEach((key) => {
          details.push({
            field: property,
            message: constraints[key].replace(property, '').trim(),
          });
        });
      });
      throw new BadRequestError(details);
    }

    return object;
  }
}
