import * as config from 'config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as Migrations from './migrations';

export const DB_CONFIG = {
	type: 'postgres',
	host: config.POSTGRES.HOST,
	port: config.POSTGRES.PORT,
	username: config.POSTGRES.USERNAME,
	password: config.POSTGRES.PASSWORD,
	database: config.POSTGRES.DB,
	migrationsRun: false,
	migrations: Object.values(Migrations),
	synchronize: false,
	autoLoadEntities: true,
} as TypeOrmModuleOptions;

export default DB_CONFIG;
