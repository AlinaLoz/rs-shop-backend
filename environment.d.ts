declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'local' | 'dev' | 'prod';
			AWS_REGION: string;
			
			POSTGRES_HOST: string;
			POSTGRES_PORT: number;
			POSTGRES_USER: string;
			POSTGRES_PASSWORD: string;
			POSTGRES_DB: string;
			
			S3_BUCKET_PRODUCTS: string;
			S3_UPLOAD_DIR: string;
			S3_EXPIRES: number;
			
			AWS_ACCESS_KEY_ID_LOCAL: string;
			AWS_SECRET_ACCESS_KEY_LOCAL: string;
			AWS_ENDPOINT_LOCAL: string;
			AWS_S3_DIR_LOCAL: string;
			
			SQS_URL: string;
			SQS_URL_LOCAL: string;
			SQS_QUEUE_NAME: string;
			
			SNS_ARN: string;
			SNS_LOCAL_PORT: string;
			
			BFF_PORT: number;
			PRODUCTS_PORT: number;
			
			[serviceUrl: string]: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
