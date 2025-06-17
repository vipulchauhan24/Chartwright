import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

enum type {
  IMAGE = 'image',
  IFRAME = 'iframe',
}

export class EmbedChartDTO {
  @IsString()
  type!: type;

  @IsString()
  chart_id!: string;

  @IsString()
  user_id!: string;

  @IsNotEmpty()
  @IsOptional()
  created_date?: string;
}
