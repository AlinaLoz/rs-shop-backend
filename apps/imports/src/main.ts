require('dotenv').config();
import { HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Handler, APIGatewayEvent, S3Event } from 'aws-lambda';

import { ImportsModule } from './imports.module';
import { ImportsService } from './services/imports.service';
import { CROSS_ORIGIN_HEADERS } from './constants/http.constants';

export const importProductsFile: Handler = async (
	event: APIGatewayEvent,
) => {
	const appContext = await NestFactory.createApplicationContext(ImportsModule);
	const importsService = appContext.get(ImportsService);
	
	try {
		const body = await importsService.importProductsFile(event.queryStringParameters.name);
		return {
			body: body,
			statusCode: HttpStatus.OK,
			...CROSS_ORIGIN_HEADERS,
		};
	} catch (err) {
		return {
			body: JSON.stringify(err),
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			...CROSS_ORIGIN_HEADERS,
		};
	}
};

export const uploadProductsFile: Handler = async (
	event: S3Event,
) => {
	const appContext = await NestFactory.createApplicationContext(ImportsModule);
	const importsService = appContext.get(ImportsService);
	
	try {
		const body = await importsService.uploadProductsFile(event);
		return {
			body,
			statusCode: HttpStatus.OK,
		};
	} catch (err) {
		return {
			body: JSON.stringify(err),
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
		};
	}

};
