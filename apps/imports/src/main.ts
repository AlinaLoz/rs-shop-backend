require('dotenv').config();
import { HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Handler, APIGatewayEvent, S3Event } from 'aws-lambda';

import { errorResponse, successResponse } from '@libs/utils';
import { ERRORS } from '@libs/constants';
import { ImportsModule } from './imports.module';
import { ImportsService } from './services/imports.service';

export const importProductsFile: Handler = async (
	event: APIGatewayEvent,
) => {
	if (!/\.csv$/.test(event.queryStringParameters.name)) {
		return errorResponse(new Error(ERRORS.NOT_A_CSV), HttpStatus.UNPROCESSABLE_ENTITY);
	}
	
	const appContext = await NestFactory.createApplicationContext(ImportsModule);
	const importsService = appContext.get(ImportsService);
	
	try {
		const body = await importsService.importProductsFile(event.queryStringParameters.name);
		return successResponse(body);
	} catch (err) {
		return errorResponse(err);
	}
};

	export const uploadProductsFile: Handler = async (
	event: S3Event,
) => {
	const appContext = await NestFactory.createApplicationContext(ImportsModule);
	const importsService = appContext.get(ImportsService);
	
	try {
		const body = await importsService.uploadProductsFile(event);
		return successResponse(body);
	} catch (err) {
		return errorResponse(err);
	}
};
