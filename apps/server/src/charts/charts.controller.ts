import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { ChartService } from './charts.service';
import { AddChartDTO } from './validations/addChart.dto';
import { type Response } from 'express';

@Controller()
export class ChartsController {
  constructor(private chartService: ChartService) {}

  @Get('chart-global-config/:type')
  @UsePipes(ValidationPipe)
  getChartGlobalConfigByChartType(@Param('type') type: string) {
    return this.chartService.getChartGlobalConfigByChartType(type);
  }

  @Get('chart-id-all')
  getAllChartIds() {
    return this.chartService.getAllChartIds();
  }

  @Get('chart-config/:id')
  getChartById(@Param('id') id: string) {
    return this.chartService.getChartConfigById(id);
  }

  @Post('save-chart')
  @UsePipes(ValidationPipe)
  saveChart(@Body() chartUpdateReqBody: AddChartDTO) {
    const params = {
      title: chartUpdateReqBody.title,
      config: chartUpdateReqBody.config,
      created_by: chartUpdateReqBody.created_by,
      created_date: chartUpdateReqBody.created_date,
      thumbnail: chartUpdateReqBody.thumbnail,
      chart_type: chartUpdateReqBody.type,
    };
    return this.chartService.saveChart(params);
  }

  @Delete('chart-config/:id')
  deleteChartConfig(@Param('id') id: string) {
    return this.chartService.deleteChartConfigById(id);
  }

  @Put('chart-config/:id')
  @UsePipes(ValidationPipe)
  updateChartConfig(
    @Param('id') id: string,
    @Body() chartUpdateReqBody: AddChartDTO
  ) {
    // const params = {
    //   chartId: id,
    //   chartName: chartUpdateReqBody.chartName,
    //   chartConfig: chartUpdateReqBody.chartConfig,
    //   baseConfig: chartUpdateReqBody.baseConfig,
    //   user: chartUpdateReqBody.user,
    //   image: chartUpdateReqBody.image,
    //   timestamp: chartUpdateReqBody.timestamp,
    // };
    // return this.chartService.addOrUpdateChartConfig(params);
  }

  @Get('chart-config/image/:key')
  async getChartImageByKey(@Param('key') key: string, @Res() res: Response) {
    const { imageStream, type } = await this.chartService.getImageStreamByKey(
      key
    );
    res.setHeader('Content-Type', `${type}`);
    imageStream.pipe(res);
    return imageStream;
  }
}
