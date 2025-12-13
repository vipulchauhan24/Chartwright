import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsJSON,
} from 'class-validator';

export class SaveChartDTO {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsJSON()
  @IsNotEmpty()
  config!: JSON;

  @IsNotEmpty()
  @IsOptional()
  createdDate?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsNotEmpty()
  chartType!: string;

  @IsOptional()
  @IsDateString()
  updatedDate?: string;
}
