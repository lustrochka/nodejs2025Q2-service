import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './user.interface';
import { validate } from 'uuid';
import { UserDto } from './user.dto';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserEntity } from 'src/db/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userRepo.find();
    return users.map((user) => plainToClass(UserDto, user));
  }

  async getUser(id: string): Promise<User> {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetUser = await this.userRepo.findOne({ where: { id } });
    if (!targetUser) throw new NotFoundException('User does not exist');
    const userDto = plainToClass(UserDto, targetUser);
    return userDto;
  }

  async createUser(CreateUserDto: CreateUserDto): Promise<User> {
    const { login, password } = CreateUserDto;
    const newUser = this.userRepo.create({
      id: v4(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const savedUser = await this.userRepo.save(newUser);

    const userDto = plainToClass(UserDto, savedUser);
    return userDto;
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string) {
    const { oldPassword, newPassword } = updateUserDto;
    if (!validate(id)) throw new BadRequestException('Invalid id');

    const targetUser = await this.userRepo.findOne({ where: { id } });
    if (!targetUser) throw new NotFoundException('User does not exist');
    if (targetUser.password !== oldPassword)
      throw new ForbiddenException('Wrong old password');

    targetUser.password = newPassword;
    targetUser.version++;
    targetUser.updatedAt = Date.now();

    const updatedUser = await this.userRepo.save(targetUser);

    const userDto = plainToClass(UserDto, updatedUser);
    return userDto;
  }

  async deleteUser(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const res = await this.userRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('User does not exist');
  }

  async findByLogin(login: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { login } });
  }
}
