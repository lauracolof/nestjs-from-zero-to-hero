import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    //we can just use dependency injection to inject it
    //userRepository has been injected into our strategy
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    //constructor of the base class that we're extending from
    super({
      //provide the same secret from the req.
      secretOrKey: process.env.JWT_SECRET || configService.get('JWT_SECRET'),
      //we want to retrieve jwttoken from the req. and define how
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  //this payload is already verifying at this point,
  async validate(payload: JwtPayload): Promise<User> {
    //whatever that we return at this point is going to be injected into the request
    const { username } = payload;
    //recording from the DB based on the username from the payload of the JWT which is already verified, so it's legitimate
    const user: User = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
