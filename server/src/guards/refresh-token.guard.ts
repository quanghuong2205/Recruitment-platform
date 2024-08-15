import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ERRORCODES } from 'src/core/error/code';
import { ERRORMESSAGE } from 'src/core/error/message';
import { UserService } from 'src/user/user.service';
import { createObjectId } from 'src/utils/mongoose/createObjectId';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /* Switch http context */
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest();

    /* Extract access token from header */
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        errorCode: ERRORCODES.AUTH_MISS_REFRESH_TOKEN,
        messsage: ERRORMESSAGE.AUTH_UNAUTHORIZED,
      });
    }

    /* Verify token */
    const payload = this.authService.verifyRefreshToken(token);

    /* Verify user */
    const isValidUser = await this.verifyUser(payload['_id']);
    if (!isValidUser) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyUser(userId: string): Promise<boolean> {
    const user = await this.userService.findOne({
      _id: createObjectId(userId),
    });
    return !!user;
  }
}
