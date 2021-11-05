import {MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {ExceptionModule} from "@libs/exceptions/exception.module";
import {BffController} from './controllers/bff.controller';
import {BffService} from './services/bff.service';
import { AppLoggerMiddleware } from '@libs/exceptions';

@Module({
	imports: [
		ExceptionModule,
	],
	controllers: [BffController],
	providers: [BffService]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}
