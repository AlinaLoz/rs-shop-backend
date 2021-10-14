import { NestFactory } from '@nestjs/core';

require('dotenv').config();
import { Handler, APIGatewayAuthorizerEvent } from 'aws-lambda';
import { AuthorizationModule } from './authorization.module';
import { AuthorizationService } from './authorization.service';

export const basicAuthorizer: Handler<APIGatewayAuthorizerEvent> = async (event, ctc, cb) => {
  console.log('basicAuthorizer');
  const token = event['authorizedToken'];
  console.log('dasd', token, event.type);
  if (event.type?.toLowerCase() !== 'token' || !token) {
    return cb(`Unathorized`);
  }
  const appContext = await NestFactory.createApplicationContext(AuthorizationModule);
  const authorizationService = appContext.get(AuthorizationService);
  try {
    const isLogin = await authorizationService.basicSignIn(token);
    console.log('heheheh');
    const policy = authorizationService.generatePolicy(token, event.methodArn, isLogin ? 'Allow' : 'Deny');
    cb(null, policy);
  } catch(err) {
    cb(`Unathorized: ${err.message}`);
  }
};
