import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDTO } from './dtos/signIn.dto';
import { Response } from 'express';
import { IUser } from 'src/user/user.interface';
import { KeyRepository } from './repositories/key.repo';

@Injectable()
export class AuthService {
  private accessTokenOptions: object;
  private refreshTokenOptions: object;

  constructor(
    private keyRepo: KeyRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    this.accessTokenOptions = {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE_INS'),
    };

    this.refreshTokenOptions = {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE_INS'),
    };
  }

  async signIn(authInfor: SignInDTO, response: Response) {
    const { email, password } = authInfor;
    /* Valdate user existance */
    const user: IUser = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    /* Sign token */
    const { accessToken, refreshToken } = await this.signTokenPair({
      _id: user._id,
      email,
      name: user.name,
    });

    /* Save token */
    await this.keyRepo.updatedRefreshToken(refreshToken, user._id);

    /* Sign cookies */
    response.cookie('refresh_token', refreshToken);

    /* Return */
    return {
      user,
      access_token: accessToken,
    };
  }

  async signAccessToken(payload: any): Promise<string> {
    try {
      /* Sign token */
      const accessToken = await this.jwtService.sign(
        payload,
        this.accessTokenOptions,
      );
      /* Verify token */
      await this.jwtService.verify(accessToken, this.accessTokenOptions);
      /* Return token */
      return accessToken;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async signRefreshToken(payload: any): Promise<string> {
    try {
      /* Sign token */
      const accessToken = await this.jwtService.sign(
        payload,
        this.refreshTokenOptions,
      );
      /* Verify token */
      await this.jwtService.verify(accessToken, this.refreshTokenOptions);
      /* Return token */
      return accessToken;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async signTokenPair(
    payload: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return {
      accessToken: await this.signAccessToken(payload),
      refreshToken: await this.signRefreshToken(payload),
    };
  }

  async verifyAccessToken(accessToken: string): Promise<unknown> {
    try {
      return await this.jwtService.verify(accessToken, this.accessTokenOptions);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async refreshTokenPair(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwtService.decode(
        refreshToken,
        this.accessTokenOptions,
      );
      return this.signTokenPair(payload);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
