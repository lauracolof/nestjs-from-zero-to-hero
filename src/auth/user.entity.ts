import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
//check that username column it be unique
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  salt: string;
  //custom method to validate the password
  async validatePassword(password: string): Promise<boolean> {
    //input password with the correct salt to this user
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
