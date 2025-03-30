import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TABLE_NAME } from '../lib/constants';
import { DynamoORM } from '../lib/db/orm/dynamoORM';
import { S3ORM } from '../lib/s3/orm/s3ORM';
import { Readable } from 'stream';
import { PostgresORM } from '../lib/db/postgres';

@Injectable()
export class ChartService {
  constructor(
    private postgresORM: PostgresORM,
    private dynamoORM: DynamoORM,
    private s3ORM: S3ORM
  ) {}

  async getChartGlobalConfigByChartType(type: string) {
    try {
      const items = await this.postgresORM.runQuery(
        `SELECT * FROM ${TABLE_NAME.CHART_FEATURE} WHERE type = $1`,
        [type]
      );

      return items;
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

  async saveChart(params: {
    title: string;
    config: JSON;
    chart_type: string;
    thumbnail: string;
    created_by: string;
    created_date: string;
  }) {
    try {
      const { title, config, chart_type, thumbnail, created_by, created_date } =
        params;
      return await this.postgresORM.runQuery(
        `INSERT INTO ${TABLE_NAME.CHARTS} (title, config, chart_type, thumbnail, created_by, created_date) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          title,
          JSON.stringify(config),
          chart_type,
          thumbnail,
          created_by,
          created_date,
        ]
      );
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
