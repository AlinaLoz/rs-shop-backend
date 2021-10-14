import { ForbiddenException } from '@nestjs/common';
import { ErrorDetail, IAbstractError } from './abstract.error';

const defaultError = [
  {
    field: '',
    message: 'Forbidden',
  },
];

export class ForbiddenError
  extends ForbiddenException
  implements IAbstractError
{
  constructor(public readonly details: ErrorDetail[] = defaultError) {
    super();
  }
}
