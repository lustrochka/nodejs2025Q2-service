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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album as AlbumEntity } from 'src/db/album.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepo: Repository<Album>,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('artist.deleted')
  async handleArtistDelete(id: string) {
    await this.albumRepo
      .createQueryBuilder()
      .update(AlbumEntity)
      .set({ artistId: null })
      .where('artistId = :id', { id })
      .execute();
  }

  async getAlbums(): Promise<Album[]> {
    return await this.albumRepo.find();
  }

  async getAlbum(id: string, errorCode = 404): Promise<Album> {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetAlbum = await this.albumRepo.findOne({ where: { id } });
    if (!targetAlbum)
      throw new HttpException('Album does not exist', errorCode);

    return targetAlbum;
  }

  async createAlbum(CreateTrackDto: CreateAlbumDto): Promise<Album> {
    const { name, year, artistId } = CreateTrackDto;
    const newAlbum = this.albumRepo.create({
      id: v4(),
      name,
      year,
      artistId,
    });

    const savedAlbum = await this.albumRepo.save(newAlbum);

    return savedAlbum;
  }

  async updateAlbum(updateAlbumDto: CreateAlbumDto, id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetAlbum = await this.albumRepo.findOne({ where: { id } });
    if (!targetAlbum) throw new NotFoundException('Album does not exist');

    const updatedAlbum: Album = {
      ...targetAlbum,
      ...updateAlbumDto,
    };

    return await this.albumRepo.save(updatedAlbum);
  }

  async deleteAlbum(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const res = await this.albumRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Album does not exist');

    this.eventEmitter.emit('album.deleted', id);
  }
}
