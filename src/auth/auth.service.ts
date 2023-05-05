import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dts';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(authCredendialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredendialsDto);
  }

  async signIn(authCredendialsDto: AuthCredentialsDto) {
    const username = await this.userRepository.validateUserPassword(
      authCredendialsDto,
    );
    if (!username) {
      //if user dosn't exists or the password is wrong, we always return the /same unauthorized exception, so the attackers don't know cannot have any clue if the user exists or the password is invalid
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
