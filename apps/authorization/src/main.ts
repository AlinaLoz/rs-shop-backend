import { NestFactory } from '@nestjs/core';

require('dotenv').config();
import { Handler, APIGatewayEvent } from 'aws-lambda';
import { errorResponse, successResponse } from '@libs/utils';
import { AuthorizationModule } from './authorization.module';
import { AuthorizationService } from '@apps/authorization/src/authorization.service';

export const basicAuthorizer: Handler<APIGatewayEvent> = async (event) => {
  const token = event.headers['Authorization'];
  const appContext = await NestFactory.createApplicationContext(AuthorizationModule);
  const authorizationService = appContext.get(AuthorizationService);
  try {
    await authorizationService.basicSignIn(token);
    return successResponse({});
  } catch(err) {
    return errorResponse(err, err.status);
  }
};
