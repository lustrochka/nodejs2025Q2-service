import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { Artist } from './artist.interface';
import { v4, validate } from 'uuid';
import { CreateArtistDto } from './create-artist.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist as ArtistEntity } from 'src/db/artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepo: Repository<Artist>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getArtists(): Promise<Artist[]> {
    return await this.artistRepo.find();
  }

  async getArtist(id: string, errorCode = 404): Promise<Artist> {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetArtist = await this.artistRepo.findOne({ where: { id } });
    if (!targetArtist)
      throw new HttpException('Artist does not exist', errorCode);

    return targetArtist;
  }

  async createArtist(CreateTrackDto: CreateArtistDto): Promise<Artist> {
    const { name, grammy } = CreateTrackDto;
    const newArtist = this.artistRepo.create({
      id: v4(),
      name,
      grammy,
    });

    const savedArtist = await this.artistRepo.save(newArtist);

    return savedArtist;
  }

  async updateArtist(updateArtistDto: CreateArtistDto, id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetArtist = await this.artistRepo.findOne({ where: { id } });
    if (!targetArtist) throw new NotFoundException('Artist does not exist');

    const updatedArtist: Artist = {
      ...targetArtist,
      ...updateArtistDto,
    };

    return await this.artistRepo.save(updatedArtist);
  }

  async deleteArtist(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const res = await this.artistRepo.delete(id);
    if (res.affected === 0)
      throw new NotFoundException('Artist does not exist');
    this.eventEmitter.emit('artist.deleted', id);
  }
}
