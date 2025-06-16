import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/create-user.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() signUpData: CreateUserDto) {
    return this.authService.signUp(signUpData);
  }

  @Public()
  @Post('login')
  async login(@Body() loginData: CreateUserDto) {
    return this.authService.login(loginData);
  }
}
