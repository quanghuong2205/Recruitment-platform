import { createObjectId } from 'src/utils/mongoose/createObjectId';
import { CreateUserDTO } from './dtos/create.dto';
import { UserService } from './user.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserInfor } from 'src/decorators/userinfor.deco';
import { UpdateUserDTO } from './dtos/update';
import { ITokenPayload } from 'src/auth/token-payload.interface';
import { ERRORMESSAGE } from 'src/core/error/message';
import { ERRORCODES } from 'src/core/error/code';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/many')
  async getUsers(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query() query: string,
  ) {
    /* Get users */
    const users = await this.userService.findMany(
      query,
      +page,
      +limit,
      [],
      ['password', '__v'],
    );

    /* Return data */
    return {
      users,
    };
  }

  @Get('/:id')
  async getUser(@Param('id') userId: string) {
    /* Get user */
    const user = await this.userService.findOne(
      { _id: createObjectId(userId) },
      [],
      ['password', '__v'],
    );

    /* Return data */
    return {
      user,
    };
  }

  @Post('/')
  async createUser(
    @Body() userInfor: CreateUserDTO,
    @UserInfor() user: ITokenPayload,
  ) {
    const { email, password } = userInfor;
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

    /* Create user */
    const createdBy = {
      _id: user._id,
      email: user.email,
    };
    const newUser = await this.userService.create({
      ...userInfor,
      password: hash,
      role: 'user',
      createdBy,
    });

    /* Remove some fields from returned object */
    delete newUser['password'];

    /* Return data */
    return {
      user: newUser,
    };
  }

  @Put('/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body() userInfor: UpdateUserDTO,
    @UserInfor() user: ITokenPayload,
  ) {
    /* Valdate email */
    if (userInfor?.email) {
      const isExisted = await this.userService.validateEmail(userInfor.email);
      if (isExisted) {
        throw new BadRequestException({
          message: ERRORMESSAGE.AUTH_USER_EXIST,
          errorCode: ERRORCODES.AUTH_USER_EXIST,
        });
      }
      userInfor.isVerifiedEmail = false;
    }

    /* Hash password */
    if (userInfor?.password) {
      userInfor.password = await this.userService.hashPassword(
        userInfor.password,
      );
    }

    /* Update user */
    const updatedBy = {
      _id: user._id,
      email: user.email,
    };
    const updatedUser = await this.userService.updateOne(
      { _id: createObjectId(userId) },
      { ...userInfor, updatedBy },
      [],
      ['password', '__v'],
    );

    /* Return data */
    return {
      user: updatedUser,
    };
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id') userId: string,
    @UserInfor() user: ITokenPayload,
  ) {
    /* Delete user */
    const deletedBy = {
      _id: user._id,
      email: user.email,
    };
    const deletedUser = await this.userService.softDelete(
      { _id: createObjectId(userId) },
      { deletedBy },
      [],
      ['password', '__v'],
    );

    /* Return data */
    return {
      user: deletedUser,
    };
  }
}
