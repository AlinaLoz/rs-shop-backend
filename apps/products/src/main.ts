import { AppModule } from "./app.module";
import { createHandler, bootstrap } from '../../../base-main';

bootstrap(AppModule);
export const handler = createHandler(AppModule);
