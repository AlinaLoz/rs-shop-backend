import {ApiProperty} from '@nestjs/swagger';
import {IsEnum} from 'class-validator';

import {ERRORS} from '@libs/constants';
import {BFF_SERVICE} from '../constants/bff.contsants';

export class HandleRequestParamDTO {
	@ApiProperty({ enum: BFF_SERVICE })
	@IsEnum(BFF_SERVICE, { message: ERRORS.CANNOT_PROCESS_REQUEST })
	service: BFF_SERVICE;
}
