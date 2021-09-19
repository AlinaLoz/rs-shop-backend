require('dotenv').config();
import { HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Handler, APIGatewayEvent, S3Event } from 'aws-lambda';

import { ImportsModule } from './imports.module';
import { ImportsService } from './services/imports.service';

export const importProductsFile: Handler = async (
	event: APIGatewayEvent,
) => {
	const appContext = await NestFactory.createApplicationContext(ImportsModule);
	const importsService = appContext.get(ImportsService);
	
	try {
		const body = await importsService.importProductsFile(event.queryStringParameters.name);
		return {
			body,
			statusCode: HttpStatus.OK,
		};
	} catch (err) {
		return {
			body: err.message,
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
			body: err.message,
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
		};
	}

};
