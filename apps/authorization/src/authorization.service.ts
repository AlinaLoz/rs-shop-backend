import { APIGatewayAuthorizerResult } from 'aws-lambda/trigger/api-gateway-authorizer';
import { Injectable } from '@nestjs/common';
import {winstonLogger} from '@libs/utils';

const CONFIG = process.env;

@Injectable()
export class AuthorizationService {
  private readonly logger = winstonLogger;
  
  basicSignIn(token: string): boolean {
    const [, onlyToken] = token.split(' ');
    if (!onlyToken) {
      return false;
    }
    const decodedToken = Buffer.from(onlyToken, 'base64').toString('utf-8');
    const [login, password] = decodedToken.split(':');
    this.logger.logRequest(`decodedToken: ${decodedToken}, login: ${login}, pass: ${password}`);
    this.logger.logRequest(`config: ${CONFIG[login]}`);
    return !!(CONFIG[login] && CONFIG[login] === password);
  }
  
  generatePolicy(principalId: string, resource: string, effect: 'Allow' | 'Deny'): APIGatewayAuthorizerResult {
    return {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      }
    }
  }
  
}

