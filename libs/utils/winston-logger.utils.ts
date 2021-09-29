import winston from 'winston';

interface ILogger {
	logRequest: (message: string) => void
	logError: (message: string) => void
}

class WinstonLogger implements ILogger {
	private readonly logger: winston.Logger;
	
	constructor() {
		this.logger = winston.createLogger({
			level: process.env.NODE_ENV === 'prod' ? 'error' : 'info',
			transports: [
				new winston.transports.Console({})
			]
		});
	}
	logRequest( message: string ){
		this.logger.info( message );
	}
	
	logError( message: string ){
		this.logger.error( message );
	}
}

const winstonLogger = new WinstonLogger();

export { winstonLogger };
