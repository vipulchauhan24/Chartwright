import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config';

const { CHART_GALLERY_BUCKET_NAME } = process.env;

export class S3ORM {
  async getObject(key: string) {
    const response = await s3Client().send(
      new GetObjectCommand({
        Bucket: CHART_GALLERY_BUCKET_NAME,
        Key: key,
      })
    );
    return response;
  }
}
