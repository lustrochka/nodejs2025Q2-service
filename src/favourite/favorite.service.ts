import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { FavoritesResponse } from './favRes.interface';
import { validate } from 'uuid';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites } from 'src/db/favorite.entity';
import { Artist } from 'src/db/artist.entity';
import { Track } from 'src/db/track.entity';
import { Album } from 'src/db/album.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorites)
    private favRepo: Repository<Favorites>,
    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,
    @InjectRepository(Album)
    private albumRepo: Repository<Album>,
    @InjectRepository(Track)
    private trackRepo: Repository<Track>,
  ) {}

  @OnEvent('track.deleted')
  async handleTrackDelete(id: string) {
    try {
      await this.deleteTrack(id);
    } catch {}
  }

  @OnEvent('album.deleted')
  async handleAlbumDelete(id: string) {
    try {
      await this.deleteAlbum(id);
    } catch {}
  }

  @OnEvent('artist.deleted')
  async handleArtistDelete(id: string) {
    try {
      await this.deleteArtist(id);
    } catch {}
  }

  async getFavs(): Promise<FavoritesResponse> {
    let fav = await this.favRepo.findOne({
      where: {},
      relations: ['artists', 'albums', 'tracks'],
    });

    if (!fav) {
      fav = this.favRepo.create({ artists: [], albums: [], tracks: [] });
      await this.favRepo.save(fav);
    }
    return fav;
  }

  async postTrack(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const track = await this.trackRepo.findOneBy({ id });
    if (!track) throw new HttpException('Track not found', 422);

    const fav = await this.getFavs();
    if (!fav.tracks.find((t) => t.id === id)) {
      fav.tracks.push(track);
      await this.favRepo.save(fav);
    }
  }

  async deleteTrack(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const fav = await this.getFavs();
    fav.tracks = fav.tracks.filter((t) => t.id !== id);
    await this.favRepo.save(fav);
  }

  async postAlbum(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const album = await this.albumRepo.findOneBy({ id });
    if (!album) throw new HttpException('Album not found', 422);

    const fav = await this.getFavs();
    if (!fav.albums.find((a) => a.id === id)) {
      fav.albums.push(album);
      await this.favRepo.save(fav);
    }
  }

  async deleteAlbum(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const fav = await this.getFavs();
    fav.albums = fav.albums.filter((a) => a.id !== id);
    await this.favRepo.save(fav);
  }

  async postArtist(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const artist = await this.artistRepo.findOneBy({ id });
    if (!artist) throw new HttpException('Artist not found', 422);

    const fav = await this.getFavs();
    if (!fav.artists.find((a) => a.id === id)) {
      fav.artists.push(artist);
      await this.favRepo.save(fav);
    }
    return { message: 'Artist added to favorites' };
  }

  async deleteArtist(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const fav = await this.getFavs();
    fav.artists = fav.artists.filter((a) => a.id !== id);
    await this.favRepo.save(fav);
  }
}
