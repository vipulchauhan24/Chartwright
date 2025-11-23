import { IsString, IsJSON, IsOptional, IsNotEmpty } from 'class-validator';

export class ChartFeatureAndBaseConfigDTO {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsJSON()
  @IsNotEmpty()
  config!: JSON;
}
