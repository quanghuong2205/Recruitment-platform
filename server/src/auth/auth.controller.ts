import { UserService } from './../user/user.service';
import { AuthService } from './auth.service';
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { SignInDTO } from './dtos/signIn.dto';
import { IUser } from 'src/user/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('sign-in')
  async signIn(@Body() { email, password }: SignInDTO) {
    /* If user has alredy existed */
    const user: IUser = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    /* Sign token */
    const { accessToken, refreshToken } = await this.authService.signTokenPair({
      _id: user._id,
      email,
      name: user.name,
    });

    /* Save token */
    await this.authService.saveToken(refreshToken, user._id);

    /* Return */
    return {
      user,
      access_token: accessToken,
    };
  }
}
