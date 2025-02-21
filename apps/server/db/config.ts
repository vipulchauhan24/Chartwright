import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import 'dotenv/config';

const { ENDPOINT_URL, REGION } = process.env;

export const dynamoDBClient = (): DynamoDBClient => {
  return new DynamoDBClient({
    region: REGION,
    endpoint: ENDPOINT_URL,
  });
};
