import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dts';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredendialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredendialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredendialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredendialsDto);
  }
}
