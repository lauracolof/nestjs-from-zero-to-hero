import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    //we can just use dependency injection to inject it
    //userRepository has been injected into our strategy
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    //constructor of the base class that we're extending from
    super({
      //we want to retrieve jwttoken from the req. and define how
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //provide the same secret from the req.
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
    });
  }
  //this payload is already verifying at this point,
  async validate(payload: JwtPayload): Promise<User> {
    //whatever that we return at this point is going to be injected into the request
    const { username } = payload;
    //recording from the DB based on the username from the payload of the JWT which is already verified, so it's legitimate
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
