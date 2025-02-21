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
import { v4 as uuidv4 } from 'uuid';
import { UpdateChartDTO } from './updateChart.dto';
import { Response } from 'express';
@Controller()
export class ChartsController {
  constructor(private chartService: ChartService) {}

  @Get('chart-id-all')
  getAllChartIds() {
    return this.chartService.getAllChartIds();
  }

  @Get('chart-config/:id')
  getChartById(@Param('id') id) {
    return this.chartService.getChartConfigById(id);
  }

  @Post('chart-config')
  @UsePipes(ValidationPipe)
  addChartConfig(@Body() chartUpdateReqBody: UpdateChartDTO) {
    try {
      const params = {
        chartId: uuidv4(),
        chartName: chartUpdateReqBody.chartName,
        chartConfig: chartUpdateReqBody.chartConfig,
        baseConfig: chartUpdateReqBody.baseConfig,
        user: chartUpdateReqBody.user,
        image: chartUpdateReqBody.image,
        timestamp: chartUpdateReqBody.timestamp,
      };
      return this.chartService.addOrUpdateChartConfig(params);
    } catch (error) {
      console.log(error);
    }
  }

  @Delete('chart-config/:id')
  deleteChartConfig(@Param('id') id) {
    return this.chartService.deleteChartConfigById(id);
  }

  @Put('chart-config/:id')
  @UsePipes(ValidationPipe)
  updateChartConfig(
    @Param('id') id,
    @Body() chartUpdateReqBody: UpdateChartDTO
  ) {
    const params = {
      chartId: id,
      chartName: chartUpdateReqBody.chartName,
      chartConfig: chartUpdateReqBody.chartConfig,
      baseConfig: chartUpdateReqBody.baseConfig,
      user: chartUpdateReqBody.user,
      image: chartUpdateReqBody.image,
      timestamp: chartUpdateReqBody.timestamp,
    };
    return this.chartService.addOrUpdateChartConfig(params);
  }

  @Get('chart-config/image/:key')
  async getChartImageByKey(@Param('key') key, @Res() res: Response) {
    const { imageStream, type } = await this.chartService.getImageStreamByKey(
      key
    );
    res.setHeader('Content-Type', type);
    imageStream.pipe(res);
    return imageStream;
  }
}
