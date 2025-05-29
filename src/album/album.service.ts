import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { Album } from './album.interface';
import { v4, validate } from 'uuid';
import { CreateAlbumDto } from './create-album.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AlbumService {
  constructor(private eventEmitter: EventEmitter2) {}

  private albums = [
    {
      id: 'cd5253a2-c29f-49d9-9d88-a7b4f9094595',
      name: 'Album',
      year: 2000,
      artistId: null,
    },
    {
      id: '4648a2ef-aa53-4363-87e6-c1af63f9e983',
      name: 'New Album',
      year: 2025,
      artistId: '70c493fe-a584-41f6-af50-c71ead76ce63',
    },
  ];

  @OnEvent('artist.deleted')
  handleArtistDelete(id: string) {
    this.separateAlbum(id);
  }

  getAlbums(): Album[] {
    return this.albums;
  }

  getAlbum(id: string, errorCode = 404): Album {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetAlbum = this.albums.find((artist) => artist.id === id);
    if (!targetAlbum)
      throw new HttpException('Album does not exist', errorCode);

    return targetAlbum;
  }

  createAlbum(CreateTrackDto: CreateAlbumDto): Album {
    const { name, year, artistId } = CreateTrackDto;
    const newAlbum: Album = {
      id: v4(),
      name,
      year,
      artistId,
    };
    this.albums.push(newAlbum);

    return newAlbum;
  }

  updateAlbum(updateAlbumDto: CreateAlbumDto, id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetAlbum = this.albums.findIndex((album) => album.id === id);
    if (targetAlbum === -1) throw new NotFoundException('Album does not exist');

    const existingAlbum = this.albums[targetAlbum];

    const updatedAlbum: Album = {
      ...existingAlbum,
      ...updateAlbumDto,
    };

    return updatedAlbum;
  }

  deleteAlbum(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetAlbum = this.albums.findIndex((album) => album.id === id);
    if (targetAlbum === -1) throw new NotFoundException('Album does not exist');
    this.albums.splice(targetAlbum, 1);
    this.eventEmitter.emit('album.deleted', id);
  }

  separateAlbum(id: string) {
    this.albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
  }
}
