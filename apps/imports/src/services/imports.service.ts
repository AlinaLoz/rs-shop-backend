import { Injectable } from '@nestjs/common';
import { S3, Endpoint } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';

const S3_OPTIONS = {
	region: process.env.AWS_REGION,
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
		const s3 = new S3(S3_OPTIONS);
		const params = {
			Bucket: process.env.S3_BUCKET_PRODUCTS,
			Key: process.env.S3_UPLOAD_DIR + '/' + name,
			Expires: +process.env.S3_EXPIRES, // in seconds
			ContentType: 'text/csv',
		};
		return await s3.getSignedUrlPromise('putObject', params);
	}
	
	async uploadProductsFile(data: S3Event): Promise<number> {
		const s3 = new S3(S3_OPTIONS);
		let countProducts = 0;
		return new Promise(async (resolve) => {
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
					.on('end', async (...end) => {
						console.log('end', end);
						console.log('countProducts:', countProducts);
						try {
							const pathToFile = `${process.env.S3_BUCKET_PRODUCTS}/${record.s3.object.key}`;
							await s3.copyObject({
								Bucket: process.env.S3_BUCKET_PRODUCTS,
								CopySource: pathToFile,
								Key: record.s3.object.key.replace(process.env.S3_UPLOAD_DIR, 'parsed')
							}).promise()
							console.log(`${record.s3.object.key} was copied to parsed dir`);
							await s3.deleteObject({
								Bucket: process.env.S3_BUCKET_PRODUCTS,
								Key: record.s3.object.key,
							}).promise();
							console.log(`${record.s3.object.key} was deleted from uploaded dir`);
						} catch (err) {
							console.log('err to delete from uploaded and copy to parsed', err);
						}
						resolve(countProducts);
					});
			}
		});
	}
	
}
