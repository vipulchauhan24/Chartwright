import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TABLE_NAME } from '../lib/constants';
import { DynamoORM } from '../lib/db/orm/dynamoORM';
import { S3ORM } from '../lib/s3/orm/s3ORM';
import { Readable } from 'stream';

@Injectable()
export class ChartService {
  constructor(private dynamoORM: DynamoORM, private s3ORM: S3ORM) {}

  async getChartGlobalConfigByChartType(type: string) {
    try {
      this.dynamoORM.tableName = TABLE_NAME.CHART_FEATURE; //set table name.
      const items = await this.dynamoORM.getItem({
        type: {
          S: type,
        },
      });

      return items || {};
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllChartIds() {
    try {
      return await this.dynamoORM.getAllItems(
        'chart_id, utc_timestamp, user_name, chart_name, chart_image'
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getChartConfigById(id: string) {
    try {
      return await this.dynamoORM.getItem({
        chart_id: {
          S: id,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addOrUpdateChartConfig(params: {
    id: string;
    title: string;
    config: JSON;
    created_by: string;
    created_date: string;
    thumbnail: string;
    type: string;
  }) {
    try {
      this.dynamoORM.tableName = TABLE_NAME.CHARTS; //set table name.

      return await this.dynamoORM.addOrUpdateItem({
        id: {
          S: params.id,
        },
        title: {
          S: params.title,
        },
        config: {
          S: JSON.stringify(params.config),
        },
        created_by: {
          S: params.created_by,
        },
        created_date: {
          S: params.created_date,
        },
        thumbnail: {
          S: params.thumbnail,
        },
        type: {
          S: params.type,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteChartConfigById(id: string) {
    try {
      return await this.dynamoORM.deleteItem({
        chart_id: {
          S: id,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getImageStreamByKey(key: string) {
    try {
      const { Body, ContentType } = await this.s3ORM.getObject(key);
      return { imageStream: Body as Readable, type: ContentType };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
