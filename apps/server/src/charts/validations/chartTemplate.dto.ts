import { IsString, IsJSON, IsOptional } from 'class-validator';

export class ChartTemplateDTO {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @IsJSON()
  config!: JSON;
}
