import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { s3Client } from '../config';
import { getSignedUrl, getSignedCookies } from '@aws-sdk/cloudfront-signer';
import fs from 'fs';

const { CF_KEYPAIR_ID, CF_PRIVATE_KEY_PATH } = process.env;

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

  async putObject(params: {
    key: string;
    bucket: string;
    file: Express.Multer.File;
    cacheControl: string;
  }) {
    const { key, bucket, file, cacheControl } = params;

    const response = await s3Client().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: cacheControl,
      })
    );
    return response;
  }

  async deleteObject(params: { key: string; bucket: string }) {
    const { key, bucket } = params;

    const response = await s3Client().send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return response;
  }

  async deleteManyObject(params: { keys: string[]; bucket: string }) {
    const { keys, bucket } = params;

    const response = await s3Client().send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: keys.map((k) => ({ Key: k })), // up to 1000 keys
        },
      })
    );
    return response;
  }

  generatePreSignedURL(params: { urlToSign: string; dateLessThan: number }) {
    const { urlToSign, dateLessThan } = params;
    const keyPairId = `${CF_KEYPAIR_ID}`;
    const privateKey = fs.readFileSync(`${CF_PRIVATE_KEY_PATH}`, 'utf8');
    const signedUrl = getSignedUrl({
      url: urlToSign,
      keyPairId,
      privateKey,
      dateLessThan,
    });

    return signedUrl;
  }

  generateCloudFrontSignedCookies(params: {
    cloudfrontDomain: string;
    expiry: number;
  }) {
    const { expiry, cloudfrontDomain } = params;
    const keyPairId = `${CF_KEYPAIR_ID}`;
    const privateKey = fs.readFileSync(`${CF_PRIVATE_KEY_PATH}`, 'utf8');

    const cookies = getSignedCookies({
      policy: JSON.stringify({
        Statement: [
          {
            Resource: `${cloudfrontDomain}/*`, // protect all paths
            Condition: {
              DateLessThan: { 'AWS:EpochTime': expiry },
            },
          },
        ],
      }),
      privateKey,
      keyPairId,
    });

    return {
      policy: cookies['CloudFront-Policy'],
      signature: cookies['CloudFront-Signature'],
      keyPairId: cookies['CloudFront-Key-Pair-Id'],
    };
  }
}
