import { createObjectId } from 'src/utils/mongoose/createObjectId';
import { CreateUserDTO } from './dtos/create.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AuthInfor } from 'src/decorators/userinfor.deco';
import { UpdateUserDTO } from './dtos/update.dto';
import { ITokenPayload } from 'src/auth/token-payload.interface';

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
    @AuthInfor() auth: ITokenPayload,
  ) {
    /* Get auth */
    const createdBy = {
      _id: auth._id,
      email: auth.email,
    };

    /* Return data */
    return {
      user: await this.userService.createUser(userInfor, createdBy),
    };
  }

  @Put('/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body() userInfor: UpdateUserDTO,
    @AuthInfor() auth: ITokenPayload,
  ) {
    /* Get auth */
    const updatedBy = {
      _id: auth._id,
      email: auth.email,
    };

    /* Update user */
    const updatedUser = await this.userService.updateUser(
      userId,
      userInfor,
      updatedBy,
    );

    /* Return data */
    return {
      user: updatedUser,
    };
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id') userId: string,
    @AuthInfor() user: ITokenPayload,
  ) {
    /* Get auth */
    const deletedBy = {
      _id: user._id,
      email: user.email,
    };

    /* Delete user */
    const deletedUser = await this.userService.softDelete(
      { _id: createObjectId(userId) },
      { deleted_by: deletedBy },
      [],
      ['password', '__v'],
    );

    /* Return data */
    return {
      user: deletedUser,
    };
  }
}
