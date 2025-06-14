import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/create-user.dto';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpData: CreateUserDto) {
    const existingLogin = this.userService.findByLogin(signUpData.login);
    if (existingLogin) throw new ConflictException('Login already exists');

    const hashedPass = await bcrypt.hash(signUpData.password, 10);
    await this.userService.createUser({
      login: signUpData.login,
      password: hashedPass,
    });
  }
}
