import {
  ForbiddenException,
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
import { base64UrlEncode } from '../lib/lib';
import { DRIZZLE_PROVIDER } from '../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  chartBaseConfig,
  chartFeatures,
  chartTemplates,
  embeddedCharts,
  userCharts,
} from '../db/db.schema';
import { eq } from 'drizzle-orm';

const {
  CHART_TEMPLATE_THUMBNAILS,
  USER_CHART_STATIC_IMAGES,
  USER_CHART_STATIC_IMAGES_DOMAIN,
  S3_TTL,
} = process.env;

@Injectable()
export class ChartService {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: NodePgDatabase,
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

      if (id) {
        await this.db
          .update(chartTemplates)
          .set({
            name: name,
            config: config,
            thumbnail: thumbnail,
          })
          .where(eq(chartTemplates.id, id));
        return { status: HttpStatus.OK, message: 'Template data updated.' };
      }

      await this.db.insert(chartTemplates).values({
        name: name,
        config: config,
        type: type as 'bar' | 'line' | 'area' | 'column',
        thumbnail: thumbnail,
      });
      return { status: HttpStatus.CREATED, message: 'Template created.' };
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
      return await this.db
        .select({
          id: chartTemplates.id,
          name: chartTemplates.name,
          type: chartTemplates.type,
          config: chartTemplates.config,
          thumbnail: chartTemplates.thumbnail,
          versionNumber: chartTemplates.versionNumber,
        })
        .from(chartTemplates);
    } catch (error) {
      console.error("Error in 'getChartTemplates' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteChartTemplate(id: string) {
    try {
      await this.db.delete(chartTemplates).where(eq(chartTemplates.id, id));

      return { status: HttpStatus.OK, message: 'Template deleted.' };
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

      if (id) {
        await this.db
          .update(chartBaseConfig)
          .set({
            type: type as 'bar' | 'line' | 'area' | 'column',
            config: config,
          })
          .where(eq(chartBaseConfig.id, id));
        return {
          status: HttpStatus.OK,
          message: 'Base config data updated.',
        };
      }

      await this.db.insert(chartBaseConfig).values({
        type: type as 'bar' | 'line' | 'area' | 'column',
        config: config,
      });

      return { status: HttpStatus.CREATED, message: 'Base config created.' };
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
      return await this.db
        .select({
          id: chartBaseConfig.id,
          type: chartBaseConfig.type,
          config: chartBaseConfig.config,
        })
        .from(chartBaseConfig);
    } catch (error) {
      console.error("Error in 'getChartBaseConfigTemplate' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteChartBaseConfigTemplate(id: string) {
    try {
      await this.db.delete(chartBaseConfig).where(eq(chartBaseConfig.id, id));

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

      if (id) {
        await this.db
          .update(chartFeatures)
          .set({
            type: type as 'bar' | 'line' | 'area' | 'column',
            config: config,
          })
          .where(eq(chartFeatures.id, id));
        return {
          status: HttpStatus.OK,
          message: 'Chart feature data updated.',
        };
      }

      await this.db.insert(chartFeatures).values({
        type: type as 'bar' | 'line' | 'area' | 'column',
        config: config,
      });

      return { status: HttpStatus.CREATED, message: 'Chart feature created.' };
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
      return await this.db
        .select({
          id: chartFeatures.id,
          type: chartFeatures.type,
          config: chartFeatures.config,
        })
        .from(chartFeatures);
    } catch (error) {
      console.error("Error in 'getAllChartFeatures' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteChartFeatureData(id: string) {
    try {
      await this.db.delete(chartFeatures).where(eq(chartFeatures.id, id));

      return {
        status: HttpStatus.OK,
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

      if (id) {
        await this.db
          .update(userCharts)
          .set({
            title,
            config,
            updatedBy,
            updatedDate,
          })
          .where(eq(userCharts.id, id));
        return {
          status: HttpStatus.OK,
          message: 'User chart updated.',
        };
      }

      const res = await this.db
        .insert(userCharts)
        .values({
          title: title,
          config: config,
          chartType: chartType as 'bar' | 'line' | 'area' | 'column',
          createdBy: `${createdBy}`,
          createdDate: `${createdDate}`,
          thumbnail: thumbnail,
        })
        .returning({
          id: userCharts.id,
        });

      return {
        status: HttpStatus.CREATED,
        message: 'User chart saved.',
        id: res[0].id,
      };
    } catch (error: any) {
      console.error("Error in 'saveUserChart' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserChartById(id: string) {
    try {
      return await this.db
        .select({
          id: userCharts.id,
          title: userCharts.title,
          config: userCharts.config,
          chartType: userCharts.chartType,
          thumbnail: userCharts.thumbnail,
        })
        .from(userCharts)
        .where(eq(userCharts.id, id));
    } catch (error) {
      console.error("Error in 'getUserChartById' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllUserCharts(userId: string) {
    try {
      return await this.db
        .select({
          id: userCharts.id,
          title: userCharts.title,
          chartType: userCharts.chartType,
          createdDate: userCharts.createdDate,
          updatedDate: userCharts.updatedDate,
          versionNumber: userCharts.versionNumber,
        })
        .from(userCharts)
        .where(eq(userCharts.createdBy, userId));
    } catch (error) {
      console.error("Error in 'getAllUserCharts' service: ", error);
      throw new InternalServerErrorException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteUserChart(id: string) {
    try {
      // TODO: JWT Implementation
      const embedCharts = await this.db
        .select({
          embedChartId: embeddedCharts.id,
          userId: embeddedCharts.createdBy,
        })
        .from(embeddedCharts)
        .where(eq(embeddedCharts.chartId, id));

      if (embedCharts?.length) {
        const keys = embedCharts.map(
          (embedData: { embedChartId: string; userId: string }) => {
            return `user-${embedData.userId}/${embedData.embedChartId}.png`;
          }
        );
        const s3DeleteRes = await this.s3ORM.deleteManyObject({
          keys: keys,
          bucket: `${USER_CHART_STATIC_IMAGES}`,
        });

        if (
          !s3DeleteRes ||
          s3DeleteRes['$metadata']['httpStatusCode'] !== 200
        ) {
          throw Error('S3 File delete failed.');
        }

        await this.db
          .delete(embeddedCharts)
          .where(eq(embeddedCharts.chartId, id));
      }

      await this.db.delete(userCharts).where(eq(userCharts.id, id));

      return { status: HttpStatus.OK, message: 'User chart deleted.' };
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

      await this.db.transaction(async (tx) => {
        if (updatedDate) {
          await tx
            .update(embeddedCharts)
            .set({
              updatedBy: updatedBy,
              updatedDate: updatedDate,
            })
            .where(eq(embeddedCharts.id, id));
        } else if (createdDate) {
          const expirationDate = new Date(createdDate);
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
          await tx.insert(embeddedCharts).values({
            id: id,
            type: type,
            chartId: chartId,
            createdBy: createdBy as string,
            createdDate: createdDate,
            expirationDate: expirationDate.toISOString(),
          });
        }
        if (type == EMBEDDABLES.STATIC_IMAGE) {
          try {
            const s3UploadRes = await this.s3ORM.putObject({
              key: `user-${createdBy || updatedBy}/${id}.png`,
              bucket: `${USER_CHART_STATIC_IMAGES}`,
              file,
              cacheControl: `public, max-age=${S3_TTL}, s-maxage=${
                Number(S3_TTL) * 7
              }, immutable`,
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
            'static-image': `${EMBEDDABLES.STATIC_IMAGE}/${id}`,
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
      const result = await this.db
        .select({
          id: embeddedCharts.id,
          type: embeddedCharts.type,
          chartId: embeddedCharts.chartId,
        })
        .from(embeddedCharts)
        .where(eq(embeddedCharts.createdBy, userId));

      const response: {
        [key: string]: {
          'static-image': string;
          'dynamic-iframe': string;
        };
      } = {};

      if (Array.isArray(result)) {
        result.forEach((chartData) => {
          const { type, id, chartId } = chartData;

          response[chartId] = {
            'static-image': '',
            'dynamic-iframe': '',
          };

          switch (type) {
            case EMBEDDABLES.STATIC_IMAGE:
              response[chartId][
                EMBEDDABLES.STATIC_IMAGE
              ] = `${EMBEDDABLES.STATIC_IMAGE}/${id}`; // Enable API gateway to this API.
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

  async getEmbeddedStaticImage(id: string) {
    try {
      const result = await this.db
        .select({
          versionNumber: embeddedCharts.versionNumber,
          expirationDate: embeddedCharts.expirationDate,
          userId: embeddedCharts.createdBy,
        })
        .from(embeddedCharts)
        .where(eq(embeddedCharts.id, id));

      if (!result?.length) {
        throw Error('Chart details not found!');
      }

      const expiryDate = new Date(`${result[0].expirationDate}`);
      expiryDate.setDate(expiryDate.getDate() + 1);

      if (new Date() > expiryDate) {
        throw new Error('User access expired!');
      }

      const encodedPath = base64UrlEncode(`user-${result[0].userId}/${id}.png`);

      await this.db
        .update(embeddedCharts)
        .set({
          lastAccessed: new Date().toISOString(),
        })
        .where(eq(embeddedCharts.id, id));

      const cdnURL = `${USER_CHART_STATIC_IMAGES_DOMAIN}/${encodedPath}?v=${result[0].versionNumber}`;

      const expireTime = Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000); // 24 hours.

      const signedUrl = this.s3ORM.generatePreSignedURL({
        urlToSign: cdnURL,
        dateLessThan: expireTime,
      });

      return signedUrl;
    } catch (error) {
      console.error("Error in 'getEmbeddedStaticImage ' service: ", error);

      if (`${error}`.includes('User access expired!')) {
        throw new ForbiddenException(SERVER_ERROR_MESSAGES.FORRBIDDEN_ERROR);
      } else {
        throw new InternalServerErrorException(
          SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async deleteEmbedChartById(id: string) {
    try {
      // TODO: JWT Implementation
      const embedCharts = await this.db
        .select({
          userId: embeddedCharts.createdBy,
        })
        .from(embeddedCharts)
        .where(eq(embeddedCharts.id, id));

      if (!embedCharts?.length) {
        throw Error('Chart details not found!');
      }

      const s3DeleteRes = await this.s3ORM.deleteObject({
        key: `user-${embedCharts[0].userId}/${id}.png`,
        bucket: `${USER_CHART_STATIC_IMAGES}`,
      });

      if (!s3DeleteRes || s3DeleteRes['$metadata']['httpStatusCode'] !== 204) {
        throw Error('S3 File delete failed.');
      }

      await this.db.delete(embeddedCharts).where(eq(embeddedCharts.id, id));

      return {
        status: HttpStatus.OK,
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
