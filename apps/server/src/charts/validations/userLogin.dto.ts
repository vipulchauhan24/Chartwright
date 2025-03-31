import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class UserLoginDTO {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  cognito_id!: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  created_date!: string;
}
