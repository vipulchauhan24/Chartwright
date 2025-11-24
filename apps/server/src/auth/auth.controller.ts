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

  @Post('/guest-signin')
  signinAsGuest() {
    return this.authService.signinAsGuest();
  }

  @Put('/user-signin')
  @UsePipes(ValidationPipe)
  async signinAsUser(
    @Body() userLoginReqBody: UserLoginDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const response = await this.authService.signinAsUser(userLoginReqBody);

    res.status(response?.status as HttpStatus);

    return response.userData;
  }
}
