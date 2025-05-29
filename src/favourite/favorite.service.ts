import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Favorite } from './favorite.interface';
import { FavoritesResponse } from './favRes.interface';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { validate } from 'uuid';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class FavoriteService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    private trackService: TrackService,
    private albumService: AlbumService,
  ) {}

  private favorites: Favorite = {
    artists: ['70c493fe-a584-41f6-af50-c71ead76ce63'],
    albums: ['4648a2ef-aa53-4363-87e6-c1af63f9e983'],
    tracks: [
      '187a93f2-adcb-4dc4-9958-6ff02cd2fc58',
      '9872bf42-f783-48d9-b62c-a9f787e8e7ca',
    ],
  };

  @OnEvent('track.deleted')
  handleTrackDelete(id: string) {
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }

  @OnEvent('album.deleted')
  handleAlbumDelete(id: string) {
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
  }

  @OnEvent('artist.deleted')
  handleArtistDelete(id: string) {
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
  }

  getFavs(): FavoritesResponse {
    const result = { artists: [], albums: [], tracks: [] };
    this.favorites.artists.forEach((id) => {
      try {
        result.artists.push(this.artistService.getArtist(id));
      } catch (err) {
        console.error(`Artist not found: ${id}`, err.message);
      }
    });
    this.favorites.albums.forEach((id) => {
      try {
        result.albums.push(this.albumService.getAlbum(id));
      } catch (err) {
        console.error(`Artist not found: ${id}`, err.message);
      }
    });
    this.favorites.tracks.forEach((id) => {
      try {
        result.tracks.push(this.trackService.getTrack(id));
      } catch (err) {
        console.error(`Artist not found: ${id}`, err.message);
      }
    });
    return result;
  }

  postTrack(id: string) {
    if (this.trackService.getTrack(id, 422)) this.favorites.tracks.push(id);
  }

  deleteTrack(id: string) {
    console.log(this.favorites.tracks, id);
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetTrack = this.favorites.tracks.findIndex(
      (track) => track === id,
    );
    if (targetTrack === -1)
      throw new NotFoundException("Track isn't in favorites");
    this.favorites.tracks.splice(targetTrack, 1);
  }

  postAlbum(id: string) {
    if (this.albumService.getAlbum(id, 422)) this.favorites.albums.push(id);
  }

  deleteAlbum(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetAlbum = this.favorites.albums.findIndex(
      (album) => album === id,
    );
    if (targetAlbum === -1)
      throw new NotFoundException("Album isn't in favorites");
    this.favorites.albums.splice(targetAlbum, 1);
  }

  postArtist(id: string) {
    this.artistService.getArtist(id, 422);
    this.favorites.artists.push(id);
    return { message: 'Artist added to favorites' };
  }

  deleteArtist(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetArtist = this.favorites.artists.findIndex(
      (artist) => artist === id,
    );
    if (targetArtist === -1)
      throw new NotFoundException("Artist isn't in favorites");
    this.favorites.artists.splice(targetArtist, 1);
  }
}
