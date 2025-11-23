import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export enum EMBEDDABLES {
  STATIC_IMAGE = 'static-image',
  DYNAMIC_IFRAME = 'dynamic-iframe',
}

export class EmbedChartDTO {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  type!: EMBEDDABLES;

  @IsString()
  @IsNotEmpty()
  chartId!: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  createdDate?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;

  @IsString()
  @IsOptional()
  updatedDate?: string;
}
