import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Put,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO } from '../charts/validations/userLogin.dto';
import { type Response } from 'express';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Put('/login')
  @UsePipes(ValidationPipe)
  async login(
    @Body() userLoginReqBody: UserLoginDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const response = await this.authService.login(userLoginReqBody);

    res.status(response?.status as HttpStatus);

    return response.userData;
  }
}
