import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './track.interface';
import { CreateTrackDto } from './create-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getTracks(): Promise<Track[]> {
    return this.trackService.getTracks();
  }

  @Get(':id')
  getTrack(@Param('id') id: string) {
    return this.trackService.getTrack(id);
  }

  @Post()
  createTrack(@Body() createUserDto: CreateTrackDto) {
    return this.trackService.createTrack(createUserDto);
  }

  @Put(':id')
  updateTrack(@Body() createTrackDto: CreateTrackDto, @Param('id') id: string) {
    return this.trackService.updateTrack(createTrackDto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    return this.trackService.deleteTrack(id);
  }
}
