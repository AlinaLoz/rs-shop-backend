import { NestFactory } from '@nestjs/core';

require('dotenv').config();
import { Handler, APIGatewayAuthorizerEvent } from 'aws-lambda';
import { winstonLogger } from '@libs/utils';
import { AuthorizationModule } from './authorization.module';
import { AuthorizationService } from './authorization.service';

export const basicAuthorizer: Handler<APIGatewayAuthorizerEvent> = async (event, ctc, cb) => {
  const token = event['authorizationToken'];
  winstonLogger.logRequest(`event: ${JSON.stringify(event)}`);
  if (event.type?.toLowerCase() !== 'token' || !token) {
    return cb(`Unauthorized`);
  }
  const appContext = await NestFactory.createApplicationContext(AuthorizationModule);
  const authorizationService = appContext.get(AuthorizationService);
  try {
    const isLogin = await authorizationService.basicSignIn(token);
    winstonLogger.logRequest(`isLogin: ${isLogin}`);
    const policy = authorizationService.generatePolicy(token, event.methodArn, isLogin ? 'Allow' : 'Deny');
    cb(null, policy);
  } catch(err) {
    cb(`Unauthorized: ${err.message}`);
  }
};
