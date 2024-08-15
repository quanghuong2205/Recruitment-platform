import { AuthService } from './auth.service';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { SignInDTO } from './dtos/signIn.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/public.deco';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() authInfor: SignInDTO,
  ) {
    console.log(authInfor);
    return await this.authService.signIn(authInfor, response);
  }
}
