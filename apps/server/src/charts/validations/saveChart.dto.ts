import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsJSON,
  IsBooleanString,
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
  created_by?: string;

  @IsNotEmpty()
  @IsOptional()
  created_date?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  chart_type?: string;

  @IsOptional()
  @IsString()
  updated_by?: string;

  @IsOptional()
  @IsDateString()
  updated_date?: string;
}
