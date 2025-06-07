import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Album, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @Column({ nullable: true })
  albumId: string | null;

  @ManyToOne(() => Artist, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId' })
  artist: Album;

  @Column({ nullable: true })
  artistId: string | null;

  @Column()
  duration: number;
}
