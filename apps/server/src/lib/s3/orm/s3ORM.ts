import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config';

export class S3ORM {
  async getObject(key: string, bucket: string) {
    const response = await s3Client().send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return response;
  }
}
