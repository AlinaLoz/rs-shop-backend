require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { S3, Endpoint } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';

@Injectable()
export class ImportsService {
	async importProductsFile(name: string): Promise<string> {
		const s3 = new S3({ region: process.env.AWS_REGION });
		const params = {
			Bucket: process.env.S3_BUCKET_PRODUCTS,
			Key: process.env.S3_UPLOAD_DIR + name,
			Expires: +process.env.S3_EXPIRES, // in seconds
		};
		console.log('params', params);
		return await new Promise((resolve, reject) => {
			s3.getSignedUrl('getObject', params, (err, url) => {
				err ? reject(err) : resolve(url);
			});
		});
	}
	
	// todo return products count
	async uploadProductsFile(data: S3Event): Promise<void> {
		const s3 = new S3({
			...(process.env.NODE_ENV === 'local' ? {
				s3ForcePathStyle: true,
				accessKeyId: process.env.AWS_ACCESS_KEY_ID_LOCAL,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				endpoint: new Endpoint(process.env.AWS_ENDPOINT),
			} : {
				region: process.env.AWS_REGION,
			})
		});
		for (const record of data.Records) {
			const s3Stream = await s3.getObject({
				Bucket: process.env.S3_BUCKET_PRODUCTS,
				Key: record.s3.object.key,
			}).createReadStream().pipe(csv());
			s3Stream
				.on('data', (data) => {
					console.log('product', data);
				})
				.on('error', (error) => {
					console.log('error', error);
				})
				.on('end', (...end) => {
					console.log('end', end);
				});
		}
	}
	
}
