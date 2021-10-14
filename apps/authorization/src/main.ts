import { NestFactory } from '@nestjs/core';

require('dotenv').config();
import { Handler, APIGatewayAuthorizerEvent } from 'aws-lambda';
import { AuthorizationModule } from './authorization.module';
import { AuthorizationService } from './authorization.service';
import {winstonLogger} from "@libs/utils";

export const basicAuthorizer: Handler<APIGatewayAuthorizerEvent> = async (event, ctc, cb) => {
  const token = event['authorizedToken'];
  winstonLogger.logRequest(`event.token: ${token}`);
  winstonLogger.logRequest(`event.type: ${event.type}`);
  if (event.type?.toLowerCase() !== 'token' || !token) {
    return cb(`Unathorized`);
  }
  const appContext = await NestFactory.createApplicationContext(AuthorizationModule);
  const authorizationService = appContext.get(AuthorizationService);
  try {
    const isLogin = await authorizationService.basicSignIn(token);
    const policy = authorizationService.generatePolicy(token, event.methodArn, isLogin ? 'Allow' : 'Deny');
    cb(null, policy);
  } catch(err) {
    cb(`Unathorized: ${err.message}`);
  }
};
