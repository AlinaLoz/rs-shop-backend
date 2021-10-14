import { Handler , SQSEvent } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';

import { winstonLogger } from '@libs/utils';

import { AppModule } from './app.module';
import { createHandler } from '../../../base-main';
import { SqsSnsService } from './services/sqs-sns.service';

export const httpProductsHandler = createHandler(AppModule);

export const catalogBatchProcess: Handler = async (
	event: SQSEvent,
) => {
	try {
		const appContext = await NestFactory.createApplicationContext(AppModule);
		const sqsSnsService = appContext.get(SqsSnsService);
		await sqsSnsService.catalogBatchProcess(event);
	} catch (err) {
		winstonLogger.logRequest(`catalogBatchProcess error ${err}`);
	}
};
