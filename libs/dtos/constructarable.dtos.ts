import { plainToClass } from 'class-transformer';

type ClassType<T> = {
  new (...args: any[]): T;
};

export class ConstructableDTO<T> {
  constructor(body: T) {
    Object.assign(this, plainToClass(this.constructor as ClassType<T>, body, { excludeExtraneousValues: true }));
  }
}
