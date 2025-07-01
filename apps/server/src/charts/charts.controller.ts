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
} from '@nestjs/common';
import { ChartService } from './charts.service';
import { SaveChartDTO } from './validations/saveChart.dto';
import { type Response } from 'express';
import { EmbedChartDTO } from './validations/embedChart.dto';

@Controller()
export class ChartsController {
  constructor(private chartService: ChartService) {}

  @Get('chart-global-configs')
  getChartGlobalConfigs() {
    return this.chartService.getChartGlobalConfigs();
  }

  @Get('chart-global-configs/:type')
  getChartGlobalConfigsByType(@Param('type') type: string) {
    return this.chartService.getChartGlobalConfigsByType(type);
  }

  @Get('chart-gallery')
  getChartGalleryData() {
    return this.chartService.getChartGalleryData();
  }

  @Get('chart/:id')
  getChartById(@Param('id') id: string) {
    return this.chartService.getChartById(id);
  }

  @Get('my-charts/:user_id')
  getAllUserCharts(@Param('user_id') user_id: string) {
    return this.chartService.getAllUserCharts(user_id);
  }

  @Post('save-chart')
  @UsePipes(ValidationPipe)
  saveChart(@Body() saveChartReqBody: SaveChartDTO) {
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
      is_for_gallery: saveChartReqBody.is_for_gallery,
    };
    return this.chartService.saveChart(params);
  }

  @Delete('delete-chart/:id')
  deleteChart(@Param('id') id: string) {
    return this.chartService.deleteChart(id);
  }

  @Get('chart/image/:key')
  async getChartImageByKey(@Param('key') key: string, @Res() res: Response) {
    const { imageStream, type } = await this.chartService.getImageStreamByKey(
      key
    );
    res.setHeader('Content-Type', `${type}`);
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
