import { UserRepository } from './repositories/user.repo';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import bcrypt from 'bcrypt';
import { BaseCRUDService } from 'src/core/base/crudservice.base';
import { CreateUserDTO } from './dtos/create.dto';
import { UpdateUserDTO } from './dtos/update.dto';
import { ERRORMESSAGE } from 'src/core/error/message';
import { ERRORCODES } from 'src/core/error/code';
import { createObjectId } from 'src/utils/mongoose/createObjectId';

@Injectable()
export class UserService extends BaseCRUDService<
  User,
  CreateUserDTO,
  UpdateUserDTO
> {
  constructor(private userRepo: UserRepository) {
    super(userRepo, 'user');
  }

  async createUser(userInfor: CreateUserDTO, createdBy: Record<string, any>) {
    const { email, password } = userInfor;
    /* Valdate email */
    const isExisted = await this.validateEmail(email);
    if (isExisted) {
      throw new BadRequestException({
        message: ERRORMESSAGE.AUTH_USER_EXIST,
        errorCode: ERRORCODES.AUTH_USER_EXIST,
      });
    }

    /* Hash password */
    const hash = await this.hashPassword(password);

    /* Create user */
    const newUser = await super.create({
      ...userInfor,
      password: hash,
      role: userInfor?.role ?? 'user',
      createdBy,
    });

    /* Remove some fields from returned object */
    delete newUser['password'];

    /* Return data */
    return newUser;
  }

  async updateUser(
    userId: string,
    userInfor: UpdateUserDTO,
    updatedBy: Record<string, any>,
  ) {
    /* Valdate email */
    if (userInfor?.email) {
      const isExisted = await this.validateEmail(userInfor.email);
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
      userInfor.password = await this.hashPassword(userInfor.password);
    }

    /* Update user */
    const updatedUser = await this.updateOne(
      { _id: createObjectId(userId) },
      { ...userInfor, updatedBy },
      [],
      ['password', '__v'],
    );

    /* Return data */
    return updatedUser;
  }

  async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plain, salt);
    return hash;
  }

  async validatePassword(plain: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plain, hash);
    return isMatch;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findUserByEmail(email);
    if (!user) return null;

    const isMatched = await this.validatePassword(password, user.password);

    return isMatched ? user : null;
  }

  async validateEmail(email: string): Promise<boolean> {
    const user = await this.userRepo.findUserByEmail(email);
    return !!user;
  }
}
