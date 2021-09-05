import { NestFactory } from '@nestjs/core';
import { createServer, proxy } from 'aws-serverless-express';
import { Context, Handler } from 'aws-lambda';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { AppModule } from './app.module';

let server: Handler = null;

import cors from 'cors';

function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Lozita shop Documentation')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();
  setupSwagger(app);
  app.use(cors());
  await app.init();
  await app.listen(3000);
  return createServer(expressApp, undefined, []);
}

export const handler: Handler = async (event: any, context: Context) => {
  if (event.path === '/api') {
    event.path = '/dev/api/';
  }
  event.path = event.path.includes('swagger-ui')
    ? `/api${event.path}`
    : event.path;
  server = server ?? (await bootstrap());
  return proxy(server, event, context, 'PROMISE').promise;
};
