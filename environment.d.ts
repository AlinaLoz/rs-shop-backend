declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PG: IPostgres;
			PG_HOST: string;
			PG_PORT: number;
			PG_USERNAME: string;
			PG_PASSWORD: string;
			PG_DB: string;
			
			S3_BUCKET_PRODUCTS: string;
			S3_UPLOAD_DIR: string;
			S3_EXPIRES: number;
			
			AWS_REGION: string;
			
			NODE_ENV: 'local' | 'production';
			AWS_ACCESS_KEY_ID_LOCAL: string;
			AWS_SECRET_ACCESS_KEY: string;
			AWS_ENDPOINT: string;
			AWS_S3_LOCALLY_DIR: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
