import { AppModule } from './app.module';
import { createHandler } from '../../../base-main';
import {Handler, SNSEvent, SQSEvent} from "aws-lambda";
import {NestFactory} from "@nestjs/core";

import {SqsSnsService} from "./services/sqs-sns.service";
import {errorResponse, successResponse} from "@libs/utils";

export const httpProductsHandler = createHandler(AppModule);

export const catalogBatchProcess: Handler = async (
	event: SQSEvent,
) => {
	const appContext = await NestFactory.createApplicationContext(AppModule);
	const sqsSnsService = appContext.get(SqsSnsService);
	try {
		await sqsSnsService.catalogBatchProcess(event);
		return successResponse('');
	} catch (err) {
		return errorResponse(err);
	}
};

export const createProductTopic: Handler = async(
	event: SNSEvent,
) => {
	const appContext = await NestFactory.createApplicationContext(AppModule);
	const sqsSnsService = appContext.get(SqsSnsService);
	try {
		await sqsSnsService.createProductTopic(event);
		return successResponse('');
	} catch (err) {
		return errorResponse(err);
	}
};
