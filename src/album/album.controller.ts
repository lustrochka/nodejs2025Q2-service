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
import { AlbumService } from './album.service';
import { Album } from './album.interface';
import { CreateAlbumDto } from './create-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAlbums(): Promise<Album[]> {
    return this.albumService.getAlbums();
  }

  @Get(':id')
  getAlbum(@Param('id') id: string) {
    return this.albumService.getAlbum(id);
  }

  @Post()
  createAlbum(@Body() createUserDto: CreateAlbumDto) {
    return this.albumService.createAlbum(createUserDto);
  }

  @Put(':id')
  updateAlbum(@Body() createAlbumDto: CreateAlbumDto, @Param('id') id: string) {
    return this.albumService.updateAlbum(createAlbumDto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id') id: string) {
    return this.albumService.deleteAlbum(id);
  }
}
