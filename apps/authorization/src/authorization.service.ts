import { APIGatewayAuthorizerResult } from 'aws-lambda/trigger/api-gateway-authorizer';
import { Injectable } from '@nestjs/common';

const CONFIG = process.env;

@Injectable()
export class AuthorizationService {
  basicSignIn(token: string): boolean {
    const [, onlyToken] = token.split(' ');
    const decodedToken = Buffer.from(onlyToken, 'base64').toString('ascii');
    const [login, password] = decodedToken.split(':');
    return CONFIG[login] && CONFIG[login] === password;
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

