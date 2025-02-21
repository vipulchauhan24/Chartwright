import { S3Client } from '@aws-sdk/client-s3';

const { S3_ENDPOINT_URL, REGION } = process.env;

export const s3Client = (): S3Client => {
  return new S3Client({
    region: REGION,
    endpoint: S3_ENDPOINT_URL,
  });
};
