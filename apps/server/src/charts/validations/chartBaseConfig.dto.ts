import { IsString, IsJSON, IsOptional } from 'class-validator';

export class ChartFeatureAndBaseConfigDTO {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  type!: string;

  @IsJSON()
  config!: JSON;
}
