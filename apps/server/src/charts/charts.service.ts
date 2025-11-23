import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SERVER_ERROR_MESSAGES, TABLE_NAME } from '../lib/constants';
import { S3ORM } from '../lib/s3/orm/s3ORM';
import { Readable } from 'stream';
import { EMBEDDABLES, EmbedChartDTO } from './validations/embedChart.dto';
import { DBService } from '../db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { base64UrlEncode } from '../lib/lib';

const {
  CHART_TEMPLATE_THUMBNAILS,
  USER_CHART_STATIC_IMAGES,
  USER_CHART_STATIC_IMAGES_DOMAIN,
} = process.env;

@Injectable()
export class ChartService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: PostgresJsDatabase<Record<string, never>> & {
      $client: postgres.Sql;
    },
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
      const thumbnail = name.toLocaleLowerCase().split(' ').join('_');
      let query = '';

      if (id) {
        query = `UPDATE ${TABLE_NAME.CHART_TEMPLATES} SET name = '${name}', config='${config}', thumbnail='${thumbnail}' where id = '${id}';`;
      } else {
        query = `INSERT INTO ${TABLE_NAME.CHART_TEMPLATES} (name, config, type, thumbnail) VALUES ('${name}', '${config}', '${type}', '${type}');`;
      }

      if (query) {
        await this.db.execute(query);
        return id
          ? { status: HttpStatus.NO_CONTENT, message: 'Template data updated.' }
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
        `SELECT id, name, type, config, thumbnail, version_number FROM ${TABLE_NAME.CHART_TEMPLATES};`
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

      return { status: HttpStatus.NO_CONTENT, message: 'Template deleted.' };
    } catch (error) {
      console.error("Error in 'deleteChartTemplate' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getChartTemplateThumbnail(name: string) {
    try {
      const { Body, ContentType, ETag, LastModified } =
        await this.s3ORM.getObject(
          `${name}.png`,
          `${CHART_TEMPLATE_THUMBNAILS}`
        );
      return {
        imageStream: Body as Readable,
        type: ContentType,
        ETag,
        LastModified,
      };
    } catch (error) {
      console.error("Error in 'getChartTemplateThumbnail' service: ", error);
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
          ? {
              status: HttpStatus.NO_CONTENT,
              message: 'Base config data updated.',
            }
          : { status: HttpStatus.CREATED, message: 'Base config created.' };
      }
      throw new Error('Query not generated!');
    } catch (error: any) {
      console.error("Error in 'saveChartBaseConfigTemplate' service: ", error);
      this.dbService.validatePostgresError(error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getChartBaseConfigTemplates() {
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

      return { status: HttpStatus.NO_CONTENT, message: 'Base config deleted.' };
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
          ? {
              status: HttpStatus.NO_CONTENT,
              message: 'Chart features data updated.',
            }
          : { status: HttpStatus.CREATED, message: 'Chart feature added.' };
      }
      throw new Error('Query not generated!');
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

      return {
        status: HttpStatus.NO_CONTENT,
        message: 'Chart features info deleted.',
      };
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
    chartType?: string;
    thumbnail?: string;
    createdBy?: string;
    createdDate?: string;
    updatedBy?: string;
    updatedDate?: string;
  }) {
    try {
      const {
        id,
        title,
        config,
        chartType,
        thumbnail,
        createdBy,
        createdDate,
        updatedBy,
        updatedDate,
      } = params;

      let query = `INSERT INTO ${TABLE_NAME.USER_CHARTS} (title, config, chart_type, thumbnail, created_by, created_date) VALUES ('${title}', '${config}', '${chartType}', '${thumbnail}', '${createdBy}', '${createdDate}') RETURNING *;`;

      if (id) {
        query = `UPDATE ${TABLE_NAME.USER_CHARTS} SET title = '${title}', config='${config}', updated_by='${updatedBy}', updated_date='${updatedDate}' where id = '${id}' RETURNING *;`;
      }

      if (query) {
        const result = await this.db.execute(query);
        return id
          ? { status: HttpStatus.NO_CONTENT, message: 'User chart updated.' }
          : {
              status: HttpStatus.CREATED,
              message: 'User chart created.',
              id: result[0].id,
            };
      }
      throw new Error('Query not generated!');
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
        `SELECT id, title, chart_type, created_date, updated_date, version_number FROM ${TABLE_NAME.USER_CHARTS} WHERE created_by = '${user_id}';`
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
      return { status: HttpStatus.NO_CONTENT, message: 'User chart deleted.' };
    } catch (error) {
      console.error("Error in 'deleteUserChart' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Export APIs.
  async generateEmbedableChart({
    reqBody,
    file,
  }: {
    reqBody: EmbedChartDTO;
    file: Express.Multer.File;
  }) {
    try {
      const { type, chartId, createdBy, createdDate, updatedBy, updatedDate } =
        reqBody;
      let { id } = reqBody;

      if (!id) {
        id = uuidv4();
      }

      let query = '';

      if (updatedDate) {
        query = `UPDATE ${TABLE_NAME.EMBEDDED_CHARTS} SET updated_by='${updatedBy}', updated_date='${updatedDate}' where id='${id}';`;
      } else if (createdDate) {
        const expirationDate = new Date(createdDate);
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        query = `INSERT INTO ${
          TABLE_NAME.EMBEDDED_CHARTS
        } (id, type, chart_id, created_by, created_date, expiration_date) VALUES ('${id}', '${type}', '${chartId}', '${createdBy}', '${createdDate}', '${expirationDate.toISOString()}');`;
      }

      await this.db.transaction(async (tx) => {
        await tx.execute(query);
        if (type == EMBEDDABLES.STATIC_IMAGE) {
          try {
            const s3UploadRes = await this.s3ORM.putObject({
              key: `user-${createdBy || updatedBy}/${id}.png`,
              bucket: `${USER_CHART_STATIC_IMAGES}`,
              file,
              cacheControl: 'public, max-age=31536000, immutable',
            });
            if (
              !s3UploadRes ||
              s3UploadRes['$metadata']['httpStatusCode'] !== 200
            ) {
              throw Error('S3 File upload failed.');
            }
          } catch {
            throw Error('S3 File upload failed.');
          }
        }
      });

      switch (type) {
        case EMBEDDABLES.STATIC_IMAGE:
          return {
            'static-image': `http://localhost:3000/api/embed/${
              EMBEDDABLES.STATIC_IMAGE
            }/${id}?userId=${createdBy || updatedBy}`,
          };

        default:
          return {};
      }
    } catch (error: any) {
      console.error("Error in 'generateEmbedableChart' service: ", error);
      this.dbService.validatePostgresError(error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllEmbeddedDataByUserId(userId: string) {
    try {
      const query = `SELECT id, type, chart_id FROM ${TABLE_NAME.EMBEDDED_CHARTS} WHERE created_by = '${userId}';`;
      const result = await this.db.execute(query);
      const response: {
        [key: string]: {
          'static-image': string;
          'dynamic-iframe': string;
        };
      } = {};

      if (Array.isArray(result)) {
        result.forEach((chartData) => {
          const { type, id, chart_id } = chartData;

          response[`${chart_id}`] = {
            'static-image': '',
            'dynamic-iframe': '',
          };

          switch (type) {
            case EMBEDDABLES.STATIC_IMAGE:
              response[`${chart_id}`][
                EMBEDDABLES.STATIC_IMAGE
              ] = `http://localhost:3000/api/embed/${EMBEDDABLES.STATIC_IMAGE}/${id}?userId=${userId}`; // Enable API gateway to this API.
              break;

            default:
              break;
          }
        });
      }

      return response;
    } catch (error) {
      console.error("Error in 'getAllEmbeddedDataByChartId ' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getEmbeddedStaticImage(id: string, userId: string) {
    try {
      const query = `SELECT version_number FROM ${TABLE_NAME.EMBEDDED_CHARTS} WHERE created_by = '${userId}' and id = '${id}';`;
      const result = await this.db.execute(query);
      const encodedPath = base64UrlEncode(`user-${userId}/${id}.png`);

      return `${USER_CHART_STATIC_IMAGES_DOMAIN}/${encodedPath}?v=${result[0].version_number}`;
    } catch (error) {
      console.error("Error in 'getEmbeddedStaticImage ' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteEmbedChartByChartIdAndType(id: string, userId: string) {
    try {
      const s3DeleteRes = await this.s3ORM.deleteObject({
        key: `user-${userId}/${id}.png`,
        bucket: `${USER_CHART_STATIC_IMAGES}`,
      });

      if (!s3DeleteRes || s3DeleteRes['$metadata']['httpStatusCode'] !== 204) {
        throw Error('S3 File delete failed.');
      }

      await this.db.execute(
        `DELETE FROM ${TABLE_NAME.EMBEDDED_CHARTS} WHERE id = '${id}' and created_by='${userId}';`
      );

      return {
        status: HttpStatus.NO_CONTENT,
        message: 'Embedded chart link deleted.',
      };
    } catch (error) {
      console.error('Error in "deleteEmbedChartByChartIdAndType": ', error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  // others
  // async getImageStreamByKey(key: string) {
  //   try {
  //     const { Body, ContentType, ETag, LastModified } =
  //       await this.s3ORM.getObject(key, '');
  //     return {
  //       imageStream: Body as Readable,
  //       type: ContentType,
  //       ETag,
  //       LastModified,
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException(
  //       SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // async getEmbedChartURL(embedChartReqBody: {
  //   type: string;
  //   chart_id: string;
  //   user_id: string;
  // }) {
  //   try {
  //     const query = `SELECT id FROM ${TABLE_NAME.EMBEDDED_CHARTS} WHERE type = '${embedChartReqBody.type}' and chart_id = '${embedChartReqBody.chart_id}' and created_by = '${embedChartReqBody.user_id}';`;
  //     const result = await this.db.execute(query);
  //     return result[0] ? `/render/${result[0].id}` : '';
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException(
  //       SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // async deleteEmbedChartURL(id: string) {
  //   try {
  //     return await this.db.execute(
  //       `DELETE FROM ${TABLE_NAME.EMBEDDED_CHARTS} WHERE id = '${id}';`
  //     );
  //   } catch (error) {
  //     console.error('Error in deleting link: ', error);
  //     throw new InternalServerErrorException(
  //       SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // async getEmbedChartConfig(id: string) {
  //   try {
  //     const items = await this.db.execute(
  //       `SELECT chart_id FROM ${TABLE_NAME.EMBEDDED_CHARTS} WHERE id = '${id}';`
  //     );

  //     if (!items || !items.length) {
  //       return {};
  //     }
  //     return await this.getUserChartById(items[0]['chart_id']);
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException(
  //       SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }
}
