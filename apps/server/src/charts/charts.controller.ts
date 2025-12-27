import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  Res,
  Put,
  HttpStatus,
  Req,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ChartService } from './charts.service';
import { SaveChartDTO } from './validations/saveChart.dto';
import { type Response, type Request } from 'express';
import { EMBEDDABLES, EmbedChartDTO } from './validations/embedChart.dto';
import { ChartTemplateDTO } from './validations/chartTemplate.dto';
import { ChartFeatureAndBaseConfigDTO } from './validations/chartBaseConfig.dto';
import { ParseFilePipe, FileTypeValidator } from '@nestjs/common/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type multer from 'multer'; //DO NOT REMOVE
import { AuthGaurd } from '../auth/auth.gaurd';

@Controller()
export class ChartsController {
  constructor(private chartService: ChartService) {}

  // CHART TEMPLATE APIS.

  @Put('chart-template')
  @UsePipes(ValidationPipe)
  async saveChartTemplate(
    @Body() chartTemplateReqBody: ChartTemplateDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const params = {
      id: chartTemplateReqBody.id,
      name: chartTemplateReqBody.name,
      config: chartTemplateReqBody.config,
      type: chartTemplateReqBody.type,
    };
    const response = await this.chartService.saveChartTemplate(params);
    res.status(response?.status as HttpStatus);
    return response;
  }

  @Get('chart-template')
  getChartTemplates() {
    return this.chartService.getChartTemplates();
  }

  @Delete('chart-template/:id')
  deleteChartTemplate(@Param('id') id: string) {
    return this.chartService.deleteChartTemplate(id);
  }

  @Get('chart-template/thumbnail/:name')
  async getChartTemplateThumbnail(
    @Req() req: Request,
    @Param('name') name: string,
    @Res() res: Response
  ) {
    const { imageStream, type, ETag, LastModified } =
      await this.chartService.getChartTemplateThumbnail(name);
    res.setHeader('Content-Type', `${type}`);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', `${ETag}`);
    res.setHeader('Last-Modified', `${LastModified?.toUTCString()}`);
    if (req.headers['if-none-match'] === `${ETag}`) {
      res.status(HttpStatus.NOT_MODIFIED).end();
    }
    imageStream.pipe(res);
    return imageStream;
  }

  // CHART BASE CONFIG APIS.

  @Put('chart-base-config')
  @UsePipes(ValidationPipe)
  async saveChartBaseConfigTemplate(
    @Body() chartTemplateReqBody: ChartFeatureAndBaseConfigDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const params = {
      id: chartTemplateReqBody.id,
      type: chartTemplateReqBody.type,
      config: chartTemplateReqBody.config,
    };
    const response = await this.chartService.saveChartBaseConfigTemplate(
      params
    );
    res.status(response?.status as HttpStatus);
    return response;
  }

  @Get('chart-base-config')
  getChartBaseConfigTemplates() {
    return this.chartService.getChartBaseConfigTemplates();
  }

  @Delete('chart-base-config/:id')
  deleteChartBaseConfigTemplate(@Param('id') id: string) {
    return this.chartService.deleteChartBaseConfigTemplate(id);
  }

  // CHART FEATURES API.

  @Put('chart-feature')
  @UsePipes(ValidationPipe)
  async saveChartFeatureData(
    @Body() chartTemplateReqBody: ChartFeatureAndBaseConfigDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const params = {
      id: chartTemplateReqBody.id,
      type: chartTemplateReqBody.type,
      config: chartTemplateReqBody.config,
    };
    const response = await this.chartService.saveChartFeatureData(params);
    res.status(response?.status as HttpStatus);
    return response;
  }

  @Get('chart-feature')
  getAllChartFeatures() {
    return this.chartService.getAllChartFeatures();
  }

  @Delete('chart-feature/:id')
  deleteChartFeatureData(@Param('id') id: string) {
    return this.chartService.deleteChartFeatureData(id);
  }

  // USER CHARTS API.

  @Put('user-chart')
  @UseGuards(AuthGaurd)
  @UsePipes(ValidationPipe)
  async saveUserChart(
    @Req() req: Request,
    @Body() saveChartReqBody: SaveChartDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const userId = (req as any).user.userDbId;
    if (!userId) {
      throw new UnauthorizedException('User not logged in!');
    }
    const params = {
      id: saveChartReqBody.id,
      title: saveChartReqBody.title,
      config: saveChartReqBody.config,
      createdBy: userId,
      createdDate: saveChartReqBody.createdDate,
      thumbnail: saveChartReqBody.thumbnail,
      chartType: saveChartReqBody.chartType,
      updatedBy: userId,
      updatedDate: saveChartReqBody.updatedDate,
    };
    const response = await this.chartService.saveUserChart(params);
    res.status(response?.status as HttpStatus);
    return response;
  }

  @Get('user-chart/:id')
  @UseGuards(AuthGaurd)
  async getUserChartById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const chart = await this.chartService.getUserChartById(id);
    res.status(
      chart.length && chart[0].id ? HttpStatus.OK : HttpStatus.NOT_FOUND
    );

    return chart.length && chart[0].id ? chart[0] : `Chart not found!`;
  }

  @Get('user-chart/all/charts')
  @UseGuards(AuthGaurd)
  getAllUserCharts(@Req() req: Request) {
    const userId = (req as any).user.userDbId;
    if (!userId) {
      throw new UnauthorizedException('User not logged in!');
    }
    return this.chartService.getAllUserCharts(userId);
  }

  @Delete('user-chart/:id')
  @UseGuards(AuthGaurd)
  deleteChart(@Param('id') id: string) {
    return this.chartService.deleteUserChart(id);
  }

  // Export APIs.
  @Put('embed')
  @UseGuards(AuthGaurd)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  async generateEmbedableChart(
    @Req() req: Request,
    @Body() reqBody: EmbedChartDTO,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/png' })],
        fileIsRequired: false,
      })
    )
    file?: Express.Multer.File
  ) {
    const userId = (req as any).user.userDbId;
    if (!userId) {
      throw new UnauthorizedException('User not logged in!');
    }

    const response = await this.chartService.generateEmbedableChart({
      reqBody: { ...reqBody, createdBy: userId, updatedBy: userId },
      file,
    });

    if (response?.status) {
      res.status(response?.status as HttpStatus);
    } else {
      res.status(reqBody.id ? HttpStatus.OK : HttpStatus.CREATED);
    }

    return response;
  }

  @Get('embed')
  @UseGuards(AuthGaurd)
  async getAllEmbeddedDataByUserId(@Req() req: Request) {
    const userId = (req as any).user.userDbId;
    if (!userId) {
      throw new UnauthorizedException('User not logged in!');
    }
    return this.chartService.getAllEmbeddedDataByUserId(userId);
  }

  @Get(`embed/${EMBEDDABLES.STATIC_IMAGE}/:id`)
  async getEmbeddedStaticImage(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = await this.chartService.getEmbeddedStaticImage(id);

    if (!url || !url.length) {
      throw new NotFoundException('Embeddable data not found!');
    }

    res.redirect(url);
  }

  @Get(`embed/${EMBEDDABLES.DYNAMIC_IFRAME}/:id`)
  async getEmbeddedIframe(@Param('id') id: string) {
    return this.chartService.getEmbeddedIframe(id);
  }

  @Delete('embed/:id')
  @UseGuards(AuthGaurd)
  async deleteEmbedChartById(@Param('id') id: string) {
    return this.chartService.deleteEmbedChartById(id);
  }

  // others

  // @Get('chart/image/:key')
  // async getChartImageByKey(@Param('key') key: string, @Res() res: Response) {
  //   const { imageStream, type, ETag, LastModified } =
  //     await this.chartService.getImageStreamByKey(key);
  //   res.setHeader('Content-Type', `${type}`);
  //   res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  //   res.setHeader('ETag', `${ETag}`);
  //   res.setHeader('Last-Modified', `${LastModified?.toUTCString()}`);
  //   imageStream.pipe(res);
  //   return imageStream;
  // }

  // @Get('embed')
  // async getEmbedChartURL(@Query() query: EmbedChartDTO) {
  //   return this.chartService.getEmbedChartURL({
  //     chart_id: query.chart_id,
  //     user_id: query.createdBy,
  //     type: query.type,
  //   });
  // }

  // @Delete('embed/:id')
  // async deleteEmbedChartURL(@Param('id') id: string) {
  //   return this.chartService.deleteEmbedChartURL(id);
  // }

  // @Get('embed-config/:id')
  // async getEmbedChartConfig(@Param('id') id: string) {
  //   return this.chartService.getEmbedChartConfig(id);
  // }
}
