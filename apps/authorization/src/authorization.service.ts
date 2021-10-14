import { Injectable } from '@nestjs/common';
import { ForbiddenError, UnauthorizedError } from '@libs/exceptions/errors';

const CONFIG = process.env;

@Injectable()
export class AuthorizationService {
  basicSignIn(token: string): void {
    const [prefix, onlyToken] = token.split(' ');
    if (!token || prefix.toLowerCase() !== 'basic') {
      throw new UnauthorizedError();
    }
    const decodedToken = Buffer.from(onlyToken, 'base64').toString('ascii';
    const [login, password] = decodedToken.split(':');
    if (!login || !password || CONFIG[login] !== password) {
      throw new ForbiddenError();
    }
  }
}
