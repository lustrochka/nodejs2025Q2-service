import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { TrackModule } from 'src/track/track.module';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorites } from 'src/db/favorite.entity';
import { Track } from 'src/db/track.entity';
import { Album } from 'src/db/album.entity';
import { Artist } from 'src/db/artist.entity';

@Module({
  imports: [
    ArtistModule,
    TrackModule,
    AlbumModule,
    TypeOrmModule.forFeature([Favorites, Track, Artist, Album]),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
