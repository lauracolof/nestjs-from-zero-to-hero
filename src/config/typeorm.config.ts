import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  database: 'taskmanagment',
  password: 'admin1234',
  //dirname is the path to the current directory, one step back, any folder, any file ending with entity.ts
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
};
