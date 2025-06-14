import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/create-user.dto';
import { ConflictException, ForbiddenException } from '@nestjs/common';
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

  async login(loginData: CreateUserDto) {
    const user = await this.userService.findByLogin(loginData.login);
    if (!user) throw new ForbiddenException('User does not exist');

    const passMatch = bcrypt.compare(loginData.password, user.password);
    if (!passMatch) throw new ForbiddenException('Wrong password');
  }
}
