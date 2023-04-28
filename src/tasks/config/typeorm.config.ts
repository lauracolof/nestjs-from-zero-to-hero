import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5321,
  username: 'postgres',
  database: 'taskmanagment',
  entities: [__dirname + '/../**/*.entity.ts'],
  synchronize: true,
};
