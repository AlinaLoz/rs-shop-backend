import {Injectable} from '@nestjs/common';
import {ForbiddenError, UnauthorizedError} from "@libs/exceptions/errors";

const CONFIG = process.env;

@Injectable()
export class AuthorizationService {
  basicSignIn(token: string): void {
    if (!token) {
      throw new UnauthorizedError();
    }
    const onlyToken = token.split(' ')[1];
    const decodedToken = (new Buffer(onlyToken)).toString('ascii');
    const [login, password] = decodedToken.split(':');
    if (CONFIG[login] !== password) {
      throw new ForbiddenError();
    }
  }
}
