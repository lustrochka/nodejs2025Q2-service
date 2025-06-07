import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { Track } from './track.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist)
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Album)
  @JoinTable()
  albums: Album[];

  @ManyToMany(() => Track)
  @JoinTable()
  tracks: Track[];
}
