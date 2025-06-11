import { Expose, Exclude } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Exclude()
  password: string;

  @Expose()
  version: number;

  @Expose()
  createdAt: number;

  @Expose()
  updatedAt: number;
}
