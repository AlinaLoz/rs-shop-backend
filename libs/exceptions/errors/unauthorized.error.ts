import { UnauthorizedException } from '@nestjs/common';
import { ErrorDetail, IAbstractError } from './abstract.error';

const defaultError = [
	{
		field: '',
		message: 'Unauthorized',
	},
];

export class UnauthorizedError
	extends UnauthorizedException
	implements IAbstractError
{
	constructor(public readonly details: ErrorDetail[] = defaultError) {
		super();
	}
}
