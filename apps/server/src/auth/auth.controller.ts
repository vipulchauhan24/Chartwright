import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO } from '../charts/validations/userLogin.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/guest-signin')
  signinAsGuest() {
    return this.authService.signinAsGuest();
  }

  @Post('/user-signin')
  @UsePipes(ValidationPipe)
  signinAsUser(@Body() userLoginReqBody: UserLoginDTO) {
    return this.authService.signinAsUser(userLoginReqBody);
  }
}
