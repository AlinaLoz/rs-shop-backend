require('dotenv').config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as Migrations from './migrations';

export const DB_CONFIG = {
	type: 'postgres',
	host: process.env.PG_HOST,
	port: +process.env.PG_PORT,
	username: process.env.PG_USERNAME,
	password: process.env.PG_PASSWORD,
	database: process.env.PG_DB,
	migrationsRun: false,
	migrations: Object.values(Migrations),
	synchronize: false,
	autoLoadEntities: true,
} as TypeOrmModuleOptions;

export default DB_CONFIG;
