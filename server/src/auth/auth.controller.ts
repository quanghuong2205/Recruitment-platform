import { AuthService } from './auth.service';
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SignInDTO } from './dtos/signIn.dto';
import { Response, Request } from 'express';
import { Public } from 'src/decorators/public.deco';
import { SignUpDTO } from './dtos/signUp.dto';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('infor')
  async getAuthInfor(@Req() request: Request) {
    return request['user'];
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
