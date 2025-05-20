import { DataSource } from 'typeorm';
import { User } from './users/entities/users.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', 
  password: 'LDpc17578', 
  database: 'tfgdb', 
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;
