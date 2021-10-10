require('dotenv').config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as Migrations from './migrations';

export const DB_CONFIG = {
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: +process.env.POSTGRES_PORT,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	migrationsRun: false,
	migrations: Object.values(Migrations),
	synchronize: false,
	autoLoadEntities: true,
} as TypeOrmModuleOptions;

export default DB_CONFIG;
