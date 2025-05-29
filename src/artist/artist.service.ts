import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from './artist.interface';
import { v4, validate } from 'uuid';
import { CreateArtistDto } from './create-artist.dto';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    private trackService: TrackService,
    private albumService: AlbumService,
  ) {}

  private artists = [
    {
      id: 'f308395a-a406-4a19-8977-f5d0784715ff',
      name: 'Some mediocrity',
      grammy: false,
    },
    {
      id: '70c493fe-a584-41f6-af50-c71ead76ce63',
      name: 'Popular mediocrity',
      grammy: true,
    },
  ];

  getArtists(): Artist[] {
    return this.artists;
  }

  getArtist(id: string): Artist {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetArtist = this.artists.find((artist) => artist.id === id);
    if (!targetArtist) throw new NotFoundException('Artist does not exist');

    return targetArtist;
  }

  createArtist(CreateTrackDto: CreateArtistDto): Artist {
    const { name, grammy } = CreateTrackDto;
    const newArtist: Artist = {
      id: v4(),
      name,
      grammy,
    };
    this.artists.push(newArtist);

    return newArtist;
  }

  updateArtist(updateArtistDto: CreateArtistDto, id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetArtist = this.artists.findIndex((artist) => artist.id === id);
    if (targetArtist === -1)
      throw new NotFoundException('Artist does not exist');

    const existingArtist = this.artists[targetArtist];

    const updatedArtist: Artist = {
      ...existingArtist,
      ...updateArtistDto,
    };

    return updatedArtist;
  }

  deleteArtist(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const targetArtist = this.artists.findIndex((artist) => artist.id === id);
    if (targetArtist === -1)
      throw new NotFoundException('Artist does not exist');
    this.artists.splice(targetArtist, 1);
    this.trackService.separateTrack(id, 'artistId');
    this.albumService.separateTrack(id);
  }
}
