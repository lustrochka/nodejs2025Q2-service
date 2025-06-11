import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Grammy is required' })
  grammy: boolean;
}
