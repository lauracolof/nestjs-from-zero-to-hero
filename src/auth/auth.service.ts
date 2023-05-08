import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dts';
import { UsersRepository } from './users.repository';
import * as brycpt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredendialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredendialsDto);
  }

  async signIn(
    authCredendialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredendialsDto;
    const user = await this.usersRepository.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      //if user dosn't exists or the password is wrong, we always return the /same unauthorized exception, so the attackers don't know cannot have any clue if the user exists or the password is invalid
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
