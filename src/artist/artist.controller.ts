import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Artist } from './artist.interface';
import { CreateArtistDto } from './create-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getArtists(): Artist[] {
    return this.artistService.getArtists();
  }

  @Get(':id')
  getArtist(@Param('id') id: string) {
    return this.artistService.getArtist(id);
  }

  @Post()
  createArtist(@Body() createUserDto: CreateArtistDto) {
    return this.artistService.createArtist(createUserDto);
  }

  @Put(':id')
  updateArtist(
    @Body() createArtistDto: CreateArtistDto,
    @Param('id') id: string,
  ) {
    return this.artistService.updateArtist(createArtistDto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string) {
    return this.artistService.deleteArtist(id);
  }
}
