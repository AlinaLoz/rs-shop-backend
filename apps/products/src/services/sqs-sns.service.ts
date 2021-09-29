import { Injectable } from '@nestjs/common';
import { SNS } from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { validate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { winstonLogger } from '@libs/utils';
import { Product } from '@libs/entities';
import { CreateProductBodyDTO } from '../dtos/products.dtos';

const CONFIG = process.env;

@Injectable()
export class SqsSnsService {
	private readonly logger = winstonLogger;
	@InjectRepository(Product) private readonly productRepository: Repository<Product>;
	
	private readonly sns = new SNS({
		region: CONFIG.AWS_REGION,
		...(CONFIG.NODE_ENV === 'local' && { endpoint: `http://127.0.0.1:${CONFIG.SNS_LOCAL_PORT}` }),
	});
	
	async catalogBatchProcess(event: SQSEvent): Promise<void> {
		const productsToSave: Product[] = [];
		const invalidProducts: Product[] = [];
		await event.Records.reduce(async (promise, record) => {
			await promise;
			const rawProduct = JSON.parse(record.body);
			const product = rawProduct ? new CreateProductBodyDTO(rawProduct) : rawProduct;
			const errors = await validate(product);
			if (!errors.length) {
				productsToSave.push(product);
			} else {
				invalidProducts.push(rawProduct);
			}
		}, Promise.resolve());
		if (invalidProducts.length > 0) {
			this.logger.logRequest(`Invalid products: ${JSON.stringify(invalidProducts)}`);
		}
		if (productsToSave.length > 0) {
			await this.productRepository.insert(productsToSave);
			const productsTitles = productsToSave.map(({ title }) => title).join(',');
			this.logger.logRequest(`Success save products: ${productsTitles}`);
			await this.completionOfProductsProcessing(productsTitles);
		}
	}
	
	private completionOfProductsProcessing(productsTitles: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.sns.publish({
				Subject: 'products from csv file were saved',
				Message: `products name: ${productsTitles}`,
				TopicArn: CONFIG.SNS_ARN,
			}, (error) => {
				if (error) {
					this.logger.logError(`error sns send: ${error}`);
					reject(error);
				} else {
					this.logger.logRequest('success send to sns');
					resolve();
				}
			});
		})
		
	}
}
