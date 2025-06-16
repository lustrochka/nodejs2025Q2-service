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
    const existingLogin = await this.userService.findByLogin(signUpData.login);
    if (existingLogin) throw new ConflictException('Login already exists');

    const hashedPass = await bcrypt.hash(signUpData.password, 10);
    const user = await this.userService.createUser({
      login: signUpData.login,
      password: hashedPass,
    });

    return { id: user.id, login: user.login };
  }

  async login(loginData: CreateUserDto) {
    const user = await this.userService.findByLogin(loginData.login);
    if (!user) throw new ForbiddenException('User does not exist');

    const passMatch = bcrypt.compare(loginData.password, user.password);
    if (!passMatch) throw new ForbiddenException('Wrong password');

    const payload = { sub: user.id, login: loginData.login };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });

    return { accessToken };
  }
}
