import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SERVER_ERROR_MESSAGES, TABLE_NAME } from '../lib/constants';
import { S3ORM } from '../lib/s3/orm/s3ORM';
import { Readable } from 'stream';
import { EmbedChartDTO } from './validations/embedChart.dto';
import { DBService } from '../db/db.service';

@Injectable()
export class ChartService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: any,
    private dbService: DBService,
    private s3ORM: S3ORM
  ) {}

  // CHART TEMPLATE APIS.

  async saveChartTemplate(params: {
    id?: string;
    name: string;
    config: JSON;
    type: string;
  }) {
    try {
      const { id, name, config, type } = params;
      let query = '';

      if (id) {
        query = `UPDATE ${TABLE_NAME.CHART_TEMPLATES} SET name = '${name}', config='${config}' where id = '${id}';`;
      } else {
        query = `INSERT INTO ${TABLE_NAME.CHART_TEMPLATES} (name, config, type) VALUES ('${name}', '${config}', '${type}');`;
      }

      if (query) {
        await this.db.execute(query);
        return id
          ? { status: HttpStatus.OK, message: 'Template data updated.' }
          : { status: HttpStatus.CREATED, message: 'Template created.' };
      }
      return;
    } catch (error: any) {
      console.error("Error in 'saveChartTemplate' service: ", error);
      this.dbService.validatePostgresError(error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getChartTemplates() {
    try {
      const items = await this.db.execute(
        `SELECT id, name, type, config FROM ${TABLE_NAME.CHART_TEMPLATES};`
      );

      return items;
    } catch (error) {
      console.error("Error in 'getChartTemplates' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteChartTemplate(id: string) {
    try {
      await this.db.execute(
        `DELETE FROM ${TABLE_NAME.CHART_TEMPLATES} WHERE id='${id}';`
      );

      return { status: HttpStatus.OK, message: 'Template deleted.' };
    } catch (error) {
      console.error("Error in 'deleteChartTemplate' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  // CHART BASE CONFIG APIS.

  async saveChartBaseConfigTemplate(params: {
    id?: string;
    type: string;
    config: JSON;
  }) {
    try {
      const { id, type, config } = params;
      let query = '';

      if (id) {
        query = `UPDATE ${TABLE_NAME.CHART_BASE_CONFIG} SET type = '${type}', config='${config}' where id = '${id}';`;
      } else {
        query = `INSERT INTO ${TABLE_NAME.CHART_BASE_CONFIG} (type, config) VALUES ('${type}', '${config}');`;
      }

      if (query) {
        await this.db.execute(query);
        return id
          ? { status: HttpStatus.OK, message: 'Base config data updated.' }
          : { status: HttpStatus.CREATED, message: 'Base config created.' };
      }
      return;
    } catch (error: any) {
      console.error("Error in 'saveChartBaseConfigTemplate' service: ", error);
      this.dbService.validatePostgresError(error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getChartBaseConfigTemplate() {
    try {
      const items = await this.db.execute(
        `SELECT id, type, config FROM ${TABLE_NAME.CHART_BASE_CONFIG};`
      );

      return items;
    } catch (error) {
      console.error("Error in 'getChartBaseConfigTemplate' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteChartBaseConfigTemplate(id: string) {
    try {
      await this.db.execute(
        `DELETE FROM ${TABLE_NAME.CHART_BASE_CONFIG} WHERE id='${id}';`
      );

      return { status: HttpStatus.OK, message: 'Base config deleted.' };
    } catch (error) {
      console.error(
        "Error in 'deleteChartBaseConfigTemplate' service: ",
        error
      );
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  // CHART FEATURES API.

  async saveChartFeatureData(params: {
    id?: string;
    type: string;
    config: JSON;
  }) {
    try {
      const { id, type, config } = params;
      let query = '';

      if (id) {
        query = `UPDATE ${TABLE_NAME.CHART_FEATURE} SET type = '${type}', config='${config}' where id = '${id}';`;
      } else {
        query = `INSERT INTO ${TABLE_NAME.CHART_FEATURE} (type, config) VALUES ('${type}', '${config}');`;
      }

      if (query) {
        await this.db.execute(query);
        return id
          ? { status: HttpStatus.OK, message: 'Chart features data updated.' }
          : { status: HttpStatus.CREATED, message: 'Chart feature added.' };
      }
      return;
    } catch (error: any) {
      console.error("Error in 'saveChartFeatureData' service: ", error);
      this.dbService.validatePostgresError(error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllChartFeatures() {
    try {
      const items = await this.db.execute(
        `SELECT id, type, config FROM ${TABLE_NAME.CHART_FEATURE};`
      );

      return items;
    } catch (error) {
      console.error("Error in 'getAllChartFeatures' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteChartFeatureData(id: string) {
    try {
      await this.db.execute(
        `DELETE FROM ${TABLE_NAME.CHART_FEATURE} WHERE id='${id}';`
      );

      return { status: HttpStatus.OK, message: 'Chart features info deleted.' };
    } catch (error) {
      console.error("Error in 'deleteChartFeatureData' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  // USER CHARTS API.

  async saveUserChart(params: {
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

      let query = `INSERT INTO ${TABLE_NAME.USER_CHARTS} (title, config, chart_type, thumbnail, created_by, created_date) VALUES ('${title}', '${config}', '${chart_type}', '${thumbnail}', '${created_by}', '${created_date}') RETURNING *;`;

      if (id) {
        query = `UPDATE ${TABLE_NAME.USER_CHARTS} SET title = '${title}', config='${config}', updated_by='${updated_by}', updated_date='${updated_date}' where id = '${id}' RETURNING *;`;
      }

      if (query) {
        const result = await this.db.execute(query);
        return id
          ? { status: HttpStatus.OK, message: 'User chart updated.' }
          : {
              status: HttpStatus.CREATED,
              message: 'User chart created.',
              id: result[0].id,
            };
      }
      return;
    } catch (error: any) {
      console.error("Error in 'saveUserChart' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserChartById(id: string) {
    try {
      const items = await this.db.execute(
        `SELECT id, title, config, chart_type, thumbnail FROM ${TABLE_NAME.USER_CHARTS} WHERE id = '${id}';`
      );

      return items.length ? items[0] : {};
    } catch (error) {
      console.error("Error in 'getUserChartById' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllUserCharts(user_id: string) {
    try {
      const items = await this.db.execute(
        `SELECT id, title, chart_type, created_Date FROM ${TABLE_NAME.USER_CHARTS} WHERE created_by = '${user_id}';`
      );

      return items;
    } catch (error) {
      console.error("Error in 'getAllUserCharts' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteUserChart(id: string) {
    try {
      await this.db.execute(
        `DELETE FROM ${TABLE_NAME.USER_CHARTS} WHERE id = '${id}';`
      );
      return { status: HttpStatus.OK, message: 'User chart deleted.' };
    } catch (error) {
      console.error("Error in 'deleteUserChart' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
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
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
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
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
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
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
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
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
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
      return await this.getUserChartById(items[0]['chart_id']);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }
}
