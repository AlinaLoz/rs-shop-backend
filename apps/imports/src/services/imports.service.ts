import { Injectable } from '@nestjs/common';
import {S3, Endpoint, SQS} from 'aws-sdk';
import { S3Event, S3EventRecord } from 'aws-lambda';
import csv from 'csv-parser';

import { winstonLogger } from '@libs/utils';

const CONFIG = process.env;
const S3_OPTIONS = {
	region: CONFIG.AWS_REGION,
	...(CONFIG.NODE_ENV === 'local' && {
		s3ForcePathStyle: true,
		accessKeyId: CONFIG.AWS_ACCESS_KEY_ID_LOCAL,
		secretAccessKey: CONFIG.AWS_SECRET_ACCESS_KEY_LOCAL,
		endpoint: new Endpoint(CONFIG.AWS_ENDPOINT_LOCAL),
	}),
};

@Injectable()
export class ImportsService {
	private readonly logger = winstonLogger;
	private readonly sqs = new SQS();
	
	async importProductsFile(name: string): Promise<string> {
		const s3 = new S3(S3_OPTIONS);
		const params = {
			Bucket: CONFIG.S3_BUCKET_PRODUCTS,
			Key: CONFIG.S3_UPLOAD_DIR + '/' + name,
			Expires: +CONFIG.S3_EXPIRES, // in seconds
			ContentType: 'text/csv',
		};
		return await s3.getSignedUrlPromise('putObject', params);
	}
	
	async uploadProductsFile(data: S3Event): Promise<void> {
		const s3 = new S3(S3_OPTIONS);
		return new Promise(async (resolve) => {
			data.Records.forEach((record) => {
				return s3.getObject({
					Bucket: CONFIG.S3_BUCKET_PRODUCTS,
					Key: record.s3.object.key,
				}).createReadStream()
					.pipe(csv())
					.on('data', (data) => this.sendDataToSQS(data))
					.on('error', (error) => this.handleErrorParsingFile(error))
					.on('end', async () => {
						await this.completionOfFileProcessing(s3, record);
						resolve();
					});
			});
		});
	}
	
	private sendDataToSQS(data: object): void {
		this.logger.logRequest('send csv item to sqs');
		const queueUrl = CONFIG.NODE_ENV !== 'local' ? CONFIG.SQS_URL : `${CONFIG.SQS_URL_LOCAL}/queue/${CONFIG.SQS_QUEUE_NAME}`;
		this.sqs.sendMessage({
			QueueUrl: queueUrl,
			MessageBody: JSON.stringify(data),
		}, (err) => {
			if (!err) {
				this.logger.logRequest(`success send to sqs: ${JSON.stringify(data)}`);
			} else {
				this.logger.logError(`error to send to sqs: ${err}`);
			}
		});
	}
	
	private handleErrorParsingFile(error: Error): void {
		this.logger.logError(`error: ${JSON.stringify(error)}`);
	}
	
	private async completionOfFileProcessing(s3: S3, record: S3EventRecord): Promise<void> {
		this.logger.logRequest('end of csv file');
		try {
			const pathToFile = `${CONFIG.S3_BUCKET_PRODUCTS}/${record.s3.object.key}`;
			await s3.copyObject({
				Bucket: CONFIG.S3_BUCKET_PRODUCTS,
				CopySource: pathToFile,
				Key: record.s3.object.key.replace(process.env.S3_UPLOAD_DIR, 'parsed')
			}).promise();
			this.logger.logRequest(`${record.s3.object.key} was copied to parsed dir`);
			await s3.deleteObject({
				Bucket: CONFIG.S3_BUCKET_PRODUCTS,
				Key: record.s3.object.key,
			}).promise();
			this.logger.logRequest(`${record.s3.object.key} was deleted from uploaded dir`);
		} catch (error) {
			this.logger.logError(`err to delete from uploaded and copy to parsed: ${JSON.stringify(error)}`);
		}
	}
}
