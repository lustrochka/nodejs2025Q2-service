import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Track } from './track.interface';
import { validate } from 'uuid';
import { CreateTrackDto } from './create-track.dto';
import { v4 } from 'uuid';

@Injectable()
export class TrackService {
  private tracks = [
    {
      id: '187a93f2-adcb-4dc4-9958-6ff02cd2fc58',
      name: 'Lalala',
      artistId: '70c493fe-a584-41f6-af50-c71ead76ce63',
      albumId: '4648a2ef-aa53-4363-87e6-c1af63f9e983',
      duration: 185,
    },
    {
      id: '9872bf42-f783-48d9-b62c-a9f787e8e7ca',
      name: 'Pupupu',
      artistId: null,
      albumId: null,
      duration: 201,
    },
  ];

  getTracks(): Track[] {
    return this.tracks;
  }

  getTrack(id: string): Track {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetTrack = this.tracks.find((track) => track.id === id);
    if (!targetTrack) throw new NotFoundException('Track does not exist');

    return targetTrack;
  }

  createTrack(CreateTrackDto: CreateTrackDto): Track {
    const { name, artistId, albumId, duration } = CreateTrackDto;
    const newTrack: Track = {
      id: v4(),
      name,
      artistId: artistId ? artistId : null,
      albumId: albumId ? albumId : null,
      duration,
    };
    this.tracks.push(newTrack);

    return newTrack;
  }

  updateTrack(updateTrackDto: CreateTrackDto, id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetTrack = this.tracks.findIndex((user) => user.id === id);
    if (targetTrack === -1) throw new NotFoundException('User does not exist');

    const existingTrack = this.tracks[targetTrack];

    const updatedTrack: Track = {
      ...existingTrack,
      ...updateTrackDto,
    };

    return updatedTrack;
  }

  deleteTrack(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetUser = this.tracks.findIndex((user) => user.id === id);
    if (targetUser === -1) throw new NotFoundException('User does not exist');
    this.tracks.splice(targetUser, 1);
  }

  separateTrack(id: string, key) {
    this.tracks.forEach((track) => {
      if (track[key] === id) track[key] = null;
    });
  }
}
