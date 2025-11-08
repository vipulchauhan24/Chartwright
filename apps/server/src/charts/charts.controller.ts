import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
  Query,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { ChartService } from './charts.service';
import { SaveChartDTO } from './validations/saveChart.dto';
import { type Response } from 'express';
import { EmbedChartDTO } from './validations/embedChart.dto';
import { ChartTemplateDTO } from './validations/chartTemplate.dto';
import { ChartFeatureAndBaseConfigDTO } from './validations/chartBaseConfig.dto';

@Controller()
export class ChartsController {
  constructor(private chartService: ChartService) {}

  // CHART TEMPLATE APIS.

  @Put('chart-template')
  @UsePipes(ValidationPipe)
  saveChartTemplate(
    @Body() chartTemplateReqBody: ChartTemplateDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const params = {
      id: chartTemplateReqBody.id,
      name: chartTemplateReqBody.name,
      config: chartTemplateReqBody.config,
      type: chartTemplateReqBody.type,
    };
    res.status(params.id ? HttpStatus.OK : HttpStatus.CREATED);
    return this.chartService.saveChartTemplate(params);
  }

  @Get('chart-template')
  getChartTemplates() {
    return this.chartService.getChartTemplates();
  }

  @Delete('chart-template/:id')
  deleteChartTemplate(@Param('id') id: string) {
    return this.chartService.deleteChartTemplate(id);
  }

  // CHART BASE CONFIG APIS.

  @Put('chart-base-config')
  @UsePipes(ValidationPipe)
  saveChartBaseConfigTemplate(
    @Body() chartTemplateReqBody: ChartFeatureAndBaseConfigDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const params = {
      id: chartTemplateReqBody.id,
      type: chartTemplateReqBody.type,
      config: chartTemplateReqBody.config,
    };
    res.status(params.id ? HttpStatus.OK : HttpStatus.CREATED);
    return this.chartService.saveChartBaseConfigTemplate(params);
  }

  @Get('chart-base-config')
  getChartBaseConfigTemplate() {
    return this.chartService.getChartBaseConfigTemplate();
  }

  @Delete('chart-base-config/:id')
  deleteChartBaseConfigTemplate(@Param('id') id: string) {
    return this.chartService.deleteChartBaseConfigTemplate(id);
  }

  // CHART FEATURES API.

  @Put('chart-feature')
  @UsePipes(ValidationPipe)
  saveChartFeatureData(
    @Body() chartTemplateReqBody: ChartFeatureAndBaseConfigDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const params = {
      id: chartTemplateReqBody.id,
      type: chartTemplateReqBody.type,
      config: chartTemplateReqBody.config,
    };
    res.status(params.id ? HttpStatus.OK : HttpStatus.CREATED);
    return this.chartService.saveChartFeatureData(params);
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
  @UsePipes(ValidationPipe)
  saveUserChart(
    @Body() saveChartReqBody: SaveChartDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const params = {
      id: saveChartReqBody.id,
      title: saveChartReqBody.title,
      config: saveChartReqBody.config,
      created_by: saveChartReqBody.created_by,
      created_date: saveChartReqBody.created_date,
      thumbnail: saveChartReqBody.thumbnail,
      chart_type: saveChartReqBody.chart_type,
      updated_by: saveChartReqBody.updated_by,
      updated_date: saveChartReqBody.updated_date,
    };
    res.status(params.id ? HttpStatus.OK : HttpStatus.CREATED);
    return this.chartService.saveUserChart(params);
  }

  @Get('user-chart/:id')
  async getUserChartById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const chart = await this.chartService.getUserChartById(id);
    res.status(chart.id ? HttpStatus.OK : HttpStatus.NOT_FOUND);

    return chart.id ? chart : `Chart not found!`;
  }

  @Get('user-chart/all/:user_id')
  getAllUserCharts(@Param('user_id') user_id: string) {
    return this.chartService.getAllUserCharts(user_id);
  }

  @Delete('user-chart/:id')
  deleteChart(@Param('id') id: string) {
    return this.chartService.deleteUserChart(id);
  }

  @Get('chart/image/:key')
  async getChartImageByKey(@Param('key') key: string, @Res() res: Response) {
    const { imageStream, type, ETag, LastModified } =
      await this.chartService.getImageStreamByKey(key);
    res.setHeader('Content-Type', `${type}`);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', `${ETag}`);
    res.setHeader('Last-Modified', `${LastModified?.toUTCString()}`);
    imageStream.pipe(res);
    return imageStream;
  }

  @Post('embed')
  @UsePipes(ValidationPipe)
  async embedChart(@Body() embedChartReqBody: EmbedChartDTO) {
    return this.chartService.embedChart(embedChartReqBody);
  }

  @Get('embed')
  async getEmbedChartURL(@Query() query: EmbedChartDTO) {
    return this.chartService.getEmbedChartURL({
      chart_id: query.chart_id,
      user_id: query.user_id,
      type: query.type,
    });
  }

  @Delete('embed/:id')
  async deleteEmbedChartURL(@Param('id') id: string) {
    return this.chartService.deleteEmbedChartURL(id);
  }

  @Get('embed-config/:id')
  async getEmbedChartConfig(@Param('id') id: string) {
    return this.chartService.getEmbedChartConfig(id);
  }
}
