import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SignInDTO } from './dtos/signIn.dto';
import { Response, Request } from 'express';
import { Public } from 'src/decorators/public.deco';
import { SignUpDTO } from './dtos/signUp.dto';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() authInfor: SignInDTO,
  ) {
    return await this.authService.signIn(authInfor, response);
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() authInfor: SignUpDTO) {
    return await this.authService.signUp(authInfor);
  }

  @Post('sign-out')
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.signOut(request, response);
  }

  /* marked */
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('infor')
  async getAuthInfor(@Req() request: Request) {
    /* Get userId */
    const userId: string = request['user']._id;

    /* Get user */
    const user = await this.userService.getUserInfor(
      userId,
      ['email', 'name', 'avatar_url', '_id', 'role', 'is_verified_email'],
      [],
    );

    /* Return data */
    return {
      user,
    };
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshTokenPair(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.refreshTokenPair(request, response);
  }
}
