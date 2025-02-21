import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TABLE_NAME } from '../lib/constants';
import { DynamoORM } from '../../db/orm/dynamoORM';
import { S3ORM } from '../../s3/orm/s3ORM';
import { Readable } from 'stream';

@Injectable()
export class ChartService {
  constructor(private dynamoORM: DynamoORM, private s3ORM: S3ORM) {
    dynamoORM.tableName = TABLE_NAME.DEFAULT_CHARTS;
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
    chartId: string;
    chartName: string;
    chartConfig: string;
    baseConfig: string;
    user: string;
    image: string;
    timestamp: string;
  }) {
    try {
      return await this.dynamoORM.addOrUpdateItem({
        chart_id: {
          S: params.chartId,
        },
        chart_name: {
          S: params.chartName,
        },
        chart_config: {
          S: params.chartConfig,
        },
        base_config: {
          S: params.baseConfig,
        },
        user_name: {
          S: params.user,
        },
        chart_image: {
          S: params.image,
        },
        utc_timestamp: {
          S: params.timestamp,
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
