import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class AddChartDTO {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  config!: JSON;

  @IsString()
  @IsNotEmpty()
  created_by!: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  created_date!: string;

  @IsString()
  thumbnail!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;
}
