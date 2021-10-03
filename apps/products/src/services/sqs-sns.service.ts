import {Inject, Injectable } from '@nestjs/common';
import { SNS } from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { validate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { winstonLogger } from '@libs/utils';
import { Product } from '@libs/entities';
import { CreateProductBodyDTO } from '../dtos/products.dtos';
import { ProductsService } from './products.service';

const CONFIG = process.env;

@Injectable()
export class SqsSnsService {
	private readonly logger = winstonLogger;
	
	@Inject() private readonly productService: ProductsService;
	@InjectRepository(Product) private readonly productRepository: Repository<Product>;
	
	private readonly sns = new SNS({
		region: CONFIG.AWS_REGION,
		...(CONFIG.NODE_ENV === 'local' && { endpoint: `http://127.0.0.1:${CONFIG.SNS_LOCAL_PORT}` }),
	});
	
	async catalogBatchProcess(event: SQSEvent): Promise<void> {
		const validProducts: CreateProductBodyDTO[] = [];
		const invalidProducts: CreateProductBodyDTO[] = [];
		await event.Records.reduce(async (promise, record) => {
			await promise;
			const rawProduct = JSON.parse(record.body);
			const product = rawProduct ? new CreateProductBodyDTO(rawProduct) : rawProduct;
			const errors = await validate(product);
			if (!errors.length) {
				validProducts.push(product);
			} else {
				invalidProducts.push(rawProduct);
			}
		}, Promise.resolve());
		const validProductsTitles = validProducts.map((product) => product.title);
		const invalidProductsTitles = invalidProducts.map((product) => product.title);
		if (invalidProducts.length > 0) {
			this.logger.logRequest(`Invalid products: ${validProducts}`);
		} else if (validProducts.length > 0) {
			await validProducts.reduce(async (promise, product) => {
				await promise;
				await this.productService.createProduct(product);
			}, Promise.resolve());
			this.logger.logRequest(`Success saved products: ${validProductsTitles}`);
		}
		if (invalidProductsTitles.length) {
			await this.completionOfProductsProcessing({ validProducts: [], invalidProducts: invalidProductsTitles });
		}
		if (validProductsTitles.length) {
			await this.completionOfProductsProcessing({ validProducts: validProductsTitles, invalidProducts: [] });
		}
	}
	
	private completionOfProductsProcessing({ validProducts, invalidProducts }: {
		invalidProducts: string[],
		validProducts: string[],
	}): Promise<void> {
		const isValidProduct = validProducts.length > 0;
		this.logger.logRequest(`isValidProduct: ${isValidProduct}`);
		return new Promise((resolve, reject) => {
			this.sns.publish({
				Subject: 'products from csv file were saved',
				Message: `products: ${isValidProduct ? `valid ${validProducts}` : `invalid ${invalidProducts}`}`,
				TopicArn: CONFIG.SNS_ARN,
				MessageAttributes: {
					isValidProduct: {
						DataType: 'String',
						StringValue: `${isValidProduct}`,
					},
				}
			}, (error) => {
				if (error) {
					this.logger.logError(`error sns send: ${error}`);
					reject(error);
				} else {
					this.logger.logRequest('success send to sns change');
					resolve();
				}
			});
		})
		
	}
}
