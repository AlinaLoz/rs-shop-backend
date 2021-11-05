import { Injectable, Logger, Request } from "@nestjs/common";
import axios, { Method } from 'axios';

import { BFF_SERVICE } from '../constants/bff.contsants';
import { ERRORS } from '@libs/constants';

import { BadRequestError} from "@libs/exceptions/errors";
process.env[BFF_SERVICE.PRODUCTS] = 'http://localhost:3004/dev';
process.env[BFF_SERVICE.CARTS] = 'http://localhost:4000'

// cache module
// env
// eb
@Injectable()
export class BffService {
	private logger = new Logger('bff.service');
	
	// cache module
	async handleRequest(
		service: BFF_SERVICE,
		req: Request,
		body: any,
	): Promise<any> {
		const serverUrl = process.env[service];
		if (!serverUrl) {
			throw new Error(ERRORS.INTERNAL_SERVER_ERROR);
		}
		const preparedUrl = `${serverUrl}${req.url
			.replace('carts', '')
			.replace('/api/v1', '')}`;
		let result: any = null;
		try {
			this.logger.log(`preparedUrl: ${preparedUrl}`);
			result = await axios(preparedUrl, {
				headers: req.headers as any,
				method: req.method as Method,
				...(req.method.toLowerCase() !== 'get' ? {
					data: body,
				} : {}),
			});
		} catch (err) {
			this.logger.error(`service: ${service} throw error ${err?.response?.data}, details: ${err}`);
			throw new BadRequestError(err?.response?.data);
		}
		if (!result) {
			throw new BadRequestError([{
				field: '', message: ERRORS.PENDING_ERROR
			}]);
		}
		return result?.data;
	}
	
 }
