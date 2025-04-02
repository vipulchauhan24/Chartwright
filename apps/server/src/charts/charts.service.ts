import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TABLE_NAME } from '../lib/constants';
import { S3ORM } from '../lib/s3/orm/s3ORM';
import { Readable } from 'stream';

@Injectable()
export class ChartService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: any,
    private s3ORM: S3ORM
  ) {}

  async getChartGlobalConfigs() {
    try {
      const items = await this.db.execute(
        `SELECT * FROM ${TABLE_NAME.CHART_FEATURE};`
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

  async getChartGalleryData() {
    try {
      const items = await this.db.execute(
        `SELECT id, title, config, chart_type, thumbnail FROM ${TABLE_NAME.CHARTS} WHERE is_for_gallery = true;`
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

  async getChartById(id: string) {
    try {
      const items = await this.db.execute(
        `SELECT id, title, config, chart_type FROM ${TABLE_NAME.CHARTS} WHERE id = '${id}';`
      );

      return items.length ? items[0] : {};
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async saveChart(params: {
    id?: string;
    title: string;
    config: JSON;
    chart_type?: string;
    thumbnail?: string;
    created_by?: string;
    created_date?: string;
    updated_by?: string;
    updated_date?: string;
    is_for_gallery?: string;
  }) {
    try {
      const {
        id,
        title,
        config,
        chart_type,
        thumbnail,
        created_by,
        created_date,
        updated_by,
        updated_date,
        is_for_gallery,
      } = params;

      let query = `INSERT INTO ${
        TABLE_NAME.CHARTS
      } (title, config, chart_type, thumbnail, created_by, created_date, is_for_gallery) VALUES ('${title}', '${JSON.stringify(
        config
      )}', '${chart_type}', '${thumbnail}', '${created_by}', '${created_date}', ${
        is_for_gallery ? true : false
      })`;

      if (id) {
        query = `UPDATE ${
          TABLE_NAME.CHARTS
        } SET title = '${title}', config='${JSON.stringify(
          config
        )}', updated_by='${updated_by}', updated_date='${updated_date}' where id = '${id}';`;
      }
      return await this.db.execute(query);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteChart(id: string) {
    try {
      return await this.db.execute(
        `DELETE FROM ${TABLE_NAME.CHARTS} WHERE id = '${id}';`
      );
    } catch (error) {
      console.error('Error in deleting chart: ', error);
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
