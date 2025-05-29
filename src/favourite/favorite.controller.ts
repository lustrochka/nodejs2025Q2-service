import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  getFavs() {
    return this.favoriteService.getFavs();
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  postArtist(@Param('id') id: string) {
    return this.favoriteService.postArtist(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  postAlbum(@Param('id') id: string) {
    return this.favoriteService.postAlbum(id);
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  postTrack(@Param('id') id: string) {
    return this.favoriteService.postTrack(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string) {
    return this.favoriteService.deleteArtist(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id') id: string) {
    return this.favoriteService.deleteAlbum(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string) {
    return this.favoriteService.deleteTrack(id);
  }
}
