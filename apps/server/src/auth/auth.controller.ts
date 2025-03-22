import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/guest-signin')
  signinAsGuest() {
    return this.authService.signinAsGuest();
  }
}
