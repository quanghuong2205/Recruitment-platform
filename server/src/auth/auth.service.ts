import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDTO } from './dtos/signIn.dto';
import { Response, Request } from 'express';
import { KeyRepository } from './repositories/key.repo';
import { User } from 'src/user/schemas/user.schema';
import { ERRORCODES } from 'src/core/error/code';
import { ERRORMESSAGE } from 'src/core/error/message';
import ms from 'ms';
import { SignUpDTO } from './dtos/signUp.dto';
import { createObjectId } from 'src/utils/mongoose/createObjectId';

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
    await this.keyRepo.updateRefreshToken(refreshToken, userId);

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

  async signUp(authInfor: SignUpDTO) {
    const { email, password } = authInfor;
    /* Valdate email */
    const isExisted = await this.userService.validateEmail(email);
    if (isExisted) {
      throw new BadRequestException({
        message: ERRORMESSAGE.AUTH_USER_EXIST,
        errorCode: ERRORCODES.AUTH_USER_EXIST,
      });
    }

    /* Hash password */
    const hash = await this.userService.hashPassword(password);

    /* Create account */
    const newUser = await this.userService.create({
      ...authInfor,
      role: 'user',
      password: hash,
    });

    /* Return data */
    return {
      user: newUser,
    };
  }

  async signOut(request: Request, response: Response) {
    console.log(request['user']);
    const userId: string = request['user']._id;

    /* Clear token */
    await this.keyRepo.deleteOne({
      user_id: createObjectId(userId),
    });

    /* Clear cookie */
    response.clearCookie('refresh_token', {
      httpOnly: true,
      maxAge: +ms(this.refreshTokenOptions.expiresIn),
    });

    /* Return data */
    return {};
  }

  signAccessToken(payload: any): string {
    try {
      /* Sign token */
      const accessToken = this.jwtService.sign(
        payload,
        this.accessTokenOptions,
      );
      /* Verify token */
      this.verifyAccessToken(accessToken);
      /* Return token */
      return accessToken;
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.AUTH_FAIL_SIGN_ACCESS_TOKEN,
      });
    }
  }

  signRefreshToken(payload: any): string {
    try {
      /* Sign token */
      const refreshToken = this.jwtService.sign(
        payload,
        this.refreshTokenOptions,
      );
      /* Verify token */
      this.verifyRefreshToken(refreshToken);
      /* Return token */
      return refreshToken;
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.AUTH_FAIL_SIGN_REFRESH_TOKEN,
      });
    }
  }

  signTokenPair(payload: any): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.signAccessToken(payload),
      refreshToken: this.signRefreshToken(payload),
    };
  }

  verifyAccessToken(accessToken: string): unknown {
    try {
      return this.jwtService.verify(accessToken, this.accessTokenOptions);
    } catch (error) {
      throw new UnauthorizedException({
        errorCode: ERRORCODES.AUTH_FAIL_VERIFY_ACCESS_TOKEN,
        message: ERRORMESSAGE.AUTH_UNAUTHORIZED,
      });
    }
  }

  verifyRefreshToken(refreshToken: string): unknown {
    try {
      return this.jwtService.verify(refreshToken, this.refreshTokenOptions);
    } catch (error) {
      throw new UnauthorizedException({
        errorCode: ERRORCODES.AUTH_FAIL_VERIFY_REFRESH_TOKEN,
        message: ERRORMESSAGE.AUTH_UNAUTHORIZED,
      });
    }
  }

  refreshTokenPair(refreshToken: string): {
    accessToken: string;
    refreshToken: string;
  } {
    try {
      const payload = this.jwtService.decode(refreshToken);
      return this.signTokenPair(payload);
    } catch (error) {
      throw new UnauthorizedException({
        errorCode: ERRORCODES.AUTH_FAIL_VERIFY_ACCESS_TOKEN,
        message: ERRORMESSAGE.AUTH_UNAUTHORIZED,
      });
    }
  }
}
