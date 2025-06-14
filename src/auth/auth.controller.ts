import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signUp(@Body() signUpData: CreateUserDto) {
    return this.authService.signUp(signUpData);
  }

  @Post()
  async login(@Body() loginData: CreateUserDto) {
    return this.authService.login(loginData);
  }
}
