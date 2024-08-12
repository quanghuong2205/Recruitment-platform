import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Key } from './schemas/key.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private accessTokenOptions;
  private refreshTokenOptions;

  constructor(
    @InjectModel(Key.name) private keyModel: Model<Key>,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  async saveToken(refreshToken: string, userID: string) {
    await this.keyModel.create({
      user_id: new Types.ObjectId(userID),
      refresh_token: refreshToken,
    });
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

  async verifyAccessToken(accessToken: string) {
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
