import { Injectable } from '@nestjs/common';
import { SNS, SQS } from 'aws-sdk';
import { SNSEvent, SQSEvent } from 'aws-lambda';

import { winstonLogger } from '@libs/utils';
import { Product } from '@libs/entities';

const CONFIG = process.env;

@Injectable()
export class SqsSnsService {
	private readonly logger = winstonLogger;

	private readonly sns = new SNS({
		region: CONFIG.AWS_REGION,
		...(CONFIG.NODE_ENV === 'local' && { endpoint: `http://127.0.0.1:${CONFIG.SNS_LOCAL_PORT}` }),
	});
	
	async catalogBatchProcess(event: SQSEvent): Promise<void> {
		this.logger.logRequest('catalogBatchProcess');
		const products = event.Records.map((record) => {
			const product: Product = JSON.parse(record.body);
			return new Product(product);
		});
		// save to db
		// todo проверить что это конец файла
		this.completionOfProductsProcessing();
	}
	
	private completionOfProductsProcessing(): void {
		this.sns.publish({
			Subject: 'qwertty',
			Message: 'message',
			TopicArn: CONFIG.SNS_ARN,
		}, (error) => {
			if (error) {
				this.logger.logError(`error sns send: ${error}`);
			} else {
				this.logger.logRequest('success send to sns');
			}
		});
	}
}
