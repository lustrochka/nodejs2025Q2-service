import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Login is required' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  newPassword: string;
}
