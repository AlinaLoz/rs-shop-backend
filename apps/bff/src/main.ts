import cors from 'cors';
import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cors());
	app.setGlobalPrefix('/api/v1')
	setupSwagger(app);
	await app.listen(process.env.BFF_PORT || 3000);
	Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

function setupSwagger(app: INestApplication): void {
	const options = new DocumentBuilder()
		.setTitle('Lozita bff-service Documentation')
		.setVersion('1.0.0')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document);
}
