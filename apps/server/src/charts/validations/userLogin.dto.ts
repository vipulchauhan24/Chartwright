import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class UserLoginDTO {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  cognitoId!: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  createdDate!: string;
}
