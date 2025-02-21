import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateChartDTO {
  @IsString()
  @IsNotEmpty()
  chartName: string;

  @IsString()
  @IsNotEmpty()
  chartConfig: string;

  @IsString()
  @IsNotEmpty()
  baseConfig: string;

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  timestamp: string;
}
