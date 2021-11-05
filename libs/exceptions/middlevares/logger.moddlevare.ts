import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
	private logger = new Logger('HTTP');
	
	use(request: Request, response: Response, next: NextFunction): void {
		const { method, originalUrl} = request;
		response.on('close', () => {
			this.logger.log(
				`method: ${method}, url: ${originalUrl}`
			);
		});
		next();
	}
}
