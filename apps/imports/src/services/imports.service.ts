import { Injectable } from '@nestjs/common';
import { S3, Endpoint } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';

const S3_OPTIONS = {
	signatureVersion: 'v4',
	region: process.env.AWS_REGION,
	accessKeyId: process.env.RM_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.RM_AWS_SECRET_ACCESS_KEY,
	...(process.env.NODE_ENV === 'local' && {
		s3ForcePathStyle: true,
		accessKeyId: process.env.AWS_ACCESS_KEY_ID_LOCAL,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_LOCAL,
		endpoint: new Endpoint(process.env.AWS_ENDPOINT_LOCAL),
	}),
};

@Injectable()
export class ImportsService {
	async importProductsFile(name: string): Promise<string> {
		console.log('S3_OPTIONS', S3_OPTIONS);
		const s3 = new S3(S3_OPTIONS);
		const params = {
			Bucket: process.env.S3_BUCKET_PRODUCTS,
			Key: process.env.S3_UPLOAD_DIR + '/' + name,
			Expires: +process.env.S3_EXPIRES, // in seconds
		};
		return await new Promise((resolve, reject) => {
			s3.getSignedUrl('getObject', params, (err, url) => {
				err ? reject(err) : resolve(url);
			});
		});
	}
	
	async uploadProductsFile(data: S3Event): Promise<number> {
		const s3 = new S3(S3_OPTIONS);
		console.log('S3_OPTIONS', S3_OPTIONS);
		let countProducts = 0;
		return new Promise(async (resolve, reject) => {
			for (const record of data.Records) {
				await s3.getObject({
					Bucket: process.env.S3_BUCKET_PRODUCTS,
					Key: record.s3.object.key,
				}).createReadStream()
					.pipe(csv())
					.on('data', (data) => {
						countProducts++;
						console.log('product', data);
					})
					.on('error', (error) => {
						console.log('error', error);
					})
					.on('end', (...end) => {
						console.log('end', end);
						console.log('countProducts:', countProducts);
						resolve(countProducts);
					});
			}
		});
	}
	
}
