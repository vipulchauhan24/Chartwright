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

  @IsString()
  @IsOptional()
  createdBy?: string;

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
  @IsString()
  updatedBy?: string;

  @IsOptional()
  @IsDateString()
  updatedDate?: string;
}
