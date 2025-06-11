import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsOptional()
  artistId?: string;

  @IsString()
  @IsOptional()
  albumId?: string;

  @IsInt()
  @IsNotEmpty({ message: 'Duration is required' })
  duration: number;
}
