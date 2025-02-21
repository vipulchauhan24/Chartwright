import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { TABLE_NAME } from '../../src/lib/constants';
import { dynamoDBClient } from '../config';

export class DynamoORM {
  tableName: TABLE_NAME;

  async getItem(key: Record<string, AttributeValue>) {
    const { Item } = await dynamoDBClient().send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: key,
      })
    );
    return Item;
  }

  async getAllItems(projectionExpression: string) {
    const { Items } = await dynamoDBClient().send(
      new ScanCommand({
        TableName: this.tableName,
        ProjectionExpression: projectionExpression,
      })
    );
    return Items;
  }

  async addOrUpdateItem(item: Record<string, AttributeValue>) {
    const response = await dynamoDBClient().send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: item,
        ReturnValues: 'NONE',
      })
    );
    return response;
  }

  async deleteItem(key: Record<string, AttributeValue>) {
    const response = await dynamoDBClient().send(
      new DeleteItemCommand({
        TableName: this.tableName,
        Key: key,
      })
    );
    return response;
  }
}
