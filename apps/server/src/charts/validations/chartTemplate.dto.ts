import { IsString, IsJSON, IsOptional, IsNotEmpty } from 'class-validator';

export class ChartTemplateDTO {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsJSON()
  @IsNotEmpty()
  config!: JSON;

  @IsString()
  @IsNotEmpty()
  type!: string;
}
