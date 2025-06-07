import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { TrackModule } from 'src/track/track.module';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorites } from 'src/db/favorite.entity';

@Module({
  imports: [
    ArtistModule,
    TrackModule,
    AlbumModule,
    TypeOrmModule.forFeature([Favorites]),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
