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
import { KeyRepository } from './repositories/key.repo';
import { User } from 'src/user/schemas/user.schema';
import { ERRORCODES } from 'src/core/error/code';
import { ERRORMESSAGE } from 'src/core/error/message';
import ms from 'ms';

interface TokenOptions {
  secret: string;
  expiresIn: string;
}

@Injectable()
export class AuthService {
  private accessTokenOptions: TokenOptions;
  private refreshTokenOptions: TokenOptions;

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
    const user: User = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException({
        message: ERRORMESSAGE.AUTH_INVALID_CREDENTALS,
        errorCode: ERRORCODES.AUTH_INVALID_CREDENTALS,
      });
    }
    /* Convert _id to string */
    const userId = user._id.toString();

    /* Sign token */
    const { accessToken, refreshToken } = await this.signTokenPair({
      _id: userId,
      email,
      name: user.name,
    });

    /* Save token */
    await this.keyRepo.updatedRefreshToken(refreshToken, userId);

    /* Sign cookies */
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +ms(this.refreshTokenOptions.expiresIn),
    });

    /* Return data */
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
      await this.verifyAccessToken(accessToken);
      /* Return token */
      return accessToken;
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.AUTH_FAIL_SIGN_ACCESS_TOKEN,
      });
    }
  }

  async signRefreshToken(payload: any): Promise<string> {
    try {
      /* Sign token */
      const refreshToken = await this.jwtService.sign(
        payload,
        this.refreshTokenOptions,
      );
      /* Verify token */
      await this.verifyRefreshToken(refreshToken);
      /* Return token */
      return refreshToken;
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.AUTH_FAIL_SIGN_REFRESH_TOKEN,
      });
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
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.AUTH_FAIL_VERIFY_ACCESS_TOKEN,
      });
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<unknown> {
    try {
      return await this.jwtService.verify(
        refreshToken,
        this.refreshTokenOptions,
      );
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.AUTH_FAIL_VERIFY_REFRESH_TOKEN,
      });
    }
  }

  async refreshTokenPair(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwtService.decode(refreshToken);
      return this.signTokenPair(payload);
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.AUTH_FAIL_VERIFY_REFRESH_TOKEN,
      });
    }
  }
}
