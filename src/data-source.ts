import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './db/user.entity';
import { Artist } from './db/artist.entity';
import { Album } from './db/album.entity';
import { Track } from './db/track.entity';
import { Favorites } from './db/favorite.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Artist, Album, Track, Favorites],
  migrations: ['src/migrations/*.ts'],
});
