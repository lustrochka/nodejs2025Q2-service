import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsOptional()
  artistId?: string;

  @IsInt()
  @IsNotEmpty({ message: 'Year is required' })
  year: number;
}
