import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { Track } from './track.interface';
import { validate } from 'uuid';
import { CreateTrackDto } from './create-track.dto';
import { v4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnEvent } from '@nestjs/event-emitter';
import { Track as TrackEntity } from 'src/db/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepo: Repository<Track>,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('album.deleted')
  async handleAlbumDelete(id: string) {
    await this.trackRepo
      .createQueryBuilder()
      .update(TrackEntity)
      .set({ albumId: null })
      .where('albumId = :id', { id })
      .execute();
  }

  @OnEvent('artist.deleted')
  async handleArtistDelete(id: string) {
    await this.trackRepo
      .createQueryBuilder()
      .update(TrackEntity)
      .set({ artistId: null })
      .where('artistId = :id', { id })
      .execute();
  }

  async getTracks(): Promise<Track[]> {
    return await this.trackRepo.find();
  }

  async getTrack(id: string, errorCode = 404): Promise<Track> {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetTrack = await this.trackRepo.findOne({ where: { id } });
    if (!targetTrack)
      throw new HttpException('Track does not exist', errorCode);

    return targetTrack;
  }

  async createTrack(CreateTrackDto: CreateTrackDto): Promise<Track> {
    const { name, artistId, albumId, duration } = CreateTrackDto;
    const newTrack = this.trackRepo.create({
      id: v4(),
      name,
      artistId: artistId ? artistId : null,
      albumId: albumId ? albumId : null,
      duration,
    });

    const savedTrack = await this.trackRepo.save(newTrack);

    return savedTrack;
  }

  async updateTrack(updateTrackDto: CreateTrackDto, id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetTrack = await this.trackRepo.findOne({ where: { id } });
    if (!targetTrack) throw new NotFoundException('User does not exist');

    const updatedTrack: Track = {
      ...targetTrack,
      ...updateTrackDto,
    };

    return await this.trackRepo.save(updatedTrack);
  }

  async deleteTrack(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const res = await this.trackRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Track does not exist');

    this.eventEmitter.emit('track.deleted', id);
  }
}
