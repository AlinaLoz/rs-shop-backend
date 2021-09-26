import winston from 'winston';

interface ILogger {
	logRequest: (message: string) => void
	logError: (message: string) => void
}

class WinstonLogger implements ILogger {
	private readonly logger: winston.Logger;
	private readonly format: winston.Logform.Format;
	
	constructor() {
		this.format = winston.format.combine(
			winston.format.colorize(),
			winston.format.timestamp(),
			winston.format.align(),
			winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
		);
		
		this.logger = winston.createLogger({
			level: process.env.NODE_ENV === 'prod' ? 'error' : 'info',
			transports: [
				new winston.transports.Console({
					format: this.format
				})
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
