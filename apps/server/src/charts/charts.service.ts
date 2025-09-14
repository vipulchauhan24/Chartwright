import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TABLE_NAME } from '../lib/constants';
import { S3ORM } from '../lib/s3/orm/s3ORM';
import { Readable } from 'stream';
import { EmbedChartDTO } from './validations/embedChart.dto';

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

  async getChartGlobalConfigsByType(type: string) {
    try {
      const items = await this.db.execute(
        `SELECT config FROM ${TABLE_NAME.CHART_FEATURE} where type='${type}';`
      );

      return items[0];
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Default Config Apis.
   */
  async setChartDefaultConfig(params: { type: string; config: JSON }) {
    try {
      const { type, config } = params;
      const query = `INSERT INTO ${
        TABLE_NAME.CHART_DEFAULT_CONFIG
      } (type, config) VALUES ('${type}', '${JSON.stringify(
        config
      )}') RETURNING *;`;

      const result = await this.db.execute(query);
      return result[0];
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getChartDefaultConfigByType(type: string) {
    try {
      const items = await this.db.execute(
        `SELECT config FROM ${TABLE_NAME.CHART_DEFAULT_CONFIG} where type='${type}';`
      );

      return items.length ? items[0] : {};
    } catch (error) {
      console.error("Error in 'getChartTemplates': ", error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * CHART TEMPLATES APIs.
   */
  async getChartTemplates() {
    try {
      const items = await this.db.execute(
        `SELECT id, title, config, chart_type, thumbnail FROM ${TABLE_NAME.CHART_TEMPLATES};`
      );

      return items;
    } catch (error) {
      console.error("Error in 'getChartTemplates': ", error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getChartGalleryData() {
    try {
      const items = await this.db.execute(
        `SELECT id, title, config, chart_type, thumbnail FROM ${TABLE_NAME.CHARTS};`
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

  async getAllUserCharts(user_id: string) {
    try {
      const items = await this.db.execute(
        `SELECT id, title, chart_type, created_Date FROM ${TABLE_NAME.CHARTS} WHERE created_by = '${user_id}';`
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
      } = params;

      let query = `INSERT INTO ${
        TABLE_NAME.CHARTS
      } (title, config, chart_type, thumbnail, created_by, created_date) VALUES ('${title}', '${JSON.stringify(
        config
      )}', '${chart_type}', '${thumbnail}', '${created_by}', '${created_date}') RETURNING *;`;

      if (id) {
        query = `UPDATE ${
          TABLE_NAME.CHARTS
        } SET title = '${title}', config='${JSON.stringify(
          config
        )}', updated_by='${updated_by}', updated_date='${updated_date}' where id = '${id}' RETURNING *;`;
      }
      const result = await this.db.execute(query);
      return result[0];
    } catch (error: any) {
      console.error(error);
      if (
        error?.message ===
        'duplicate key value violates unique constraint "title_unique"'
      ) {
        throw new HttpException('Chart title duplicate.', HttpStatus.CONFLICT);
      }
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
      const { Body, ContentType, ETag, LastModified } =
        await this.s3ORM.getObject(key);
      return {
        imageStream: Body as Readable,
        type: ContentType,
        ETag,
        LastModified,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async embedChart(embedChartReqBody: EmbedChartDTO) {
    try {
      const query = `INSERT INTO ${TABLE_NAME.EMBED} (type, chart_id, created_by, created_date) VALUES ('${embedChartReqBody.type}', '${embedChartReqBody.chart_id}', '${embedChartReqBody.user_id}', '${embedChartReqBody.created_date}') RETURNING *;`;
      const result = await this.db.execute(query);
      return result[0];
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getEmbedChartURL(embedChartReqBody: {
    type: string;
    chart_id: string;
    user_id: string;
  }) {
    try {
      const query = `SELECT id FROM ${TABLE_NAME.EMBED} WHERE type = '${embedChartReqBody.type}' and chart_id = '${embedChartReqBody.chart_id}' and created_by = '${embedChartReqBody.user_id}';`;
      const result = await this.db.execute(query);
      return result[0] ? `/render/${result[0].id}` : '';
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteEmbedChartURL(id: string) {
    try {
      return await this.db.execute(
        `DELETE FROM ${TABLE_NAME.EMBED} WHERE id = '${id}';`
      );
    } catch (error) {
      console.error('Error in deleting link: ', error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getEmbedChartConfig(id: string) {
    try {
      const items = await this.db.execute(
        `SELECT chart_id FROM ${TABLE_NAME.EMBED} WHERE id = '${id}';`
      );

      if (!items || !items.length) {
        return {};
      }
      return await this.getChartById(items[0]['chart_id']);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
