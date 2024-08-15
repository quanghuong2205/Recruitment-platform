import { AuthService } from './auth.service';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { SignInDTO } from './dtos/signIn.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/public.deco';
import { SignUpDTO } from './dtos/signUp.dto';

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
}
