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
} from '@nestjs/common';
import { ChartService } from './charts.service';
import { SaveChartDTO } from './validations/saveChart.dto';
import { type Response } from 'express';

@Controller()
export class ChartsController {
  constructor(private chartService: ChartService) {}

  @Get('chart-global-configs')
  getChartGlobalConfigs() {
    return this.chartService.getChartGlobalConfigs();
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
}
