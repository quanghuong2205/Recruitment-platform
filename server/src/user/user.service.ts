import { UserRepository } from './repositories/user.repo';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import bcrypt from 'bcrypt';
import { BaseCRUDService } from 'src/core/base/crudservice.base';
import { CreateUserDTO } from './dtos/create.dto';
import { UpdateUserDTO } from './dtos/update.dto';
import { ERRORMESSAGE } from 'src/core/error/message';
import { ERRORCODES } from 'src/core/error/code';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class UserService extends BaseCRUDService<
  User,
  CreateUserDTO,
  UpdateUserDTO
> {
  constructor(
    private userRepo: UserRepository,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
  ) {
    super(userRepo, 'user services');
  }

  async getUserInfor(
    userId: string,
    selectedProps?: string[],
    unSelectedProps?: string[],
  ) {
    return await this.userRepo.findOneById(
      userId,
      selectedProps,
      unSelectedProps,
    );
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
      created_by: createdBy,
    } as any);

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
    /* Update user */
    const updatedUser = await this.userRepo.updateOneById(userId, {
      ...userInfor,
      updated_by: updatedBy,
    } as any);

    /* Return data */
    return updatedUser;
  }

  async deleteUser(userId: string, deletedBy: Record<string, any>) {
    /* Get user */
    const user = await this.userRepo.findOneById(userId);

    /* User not existed */
    if (user.is_deleted) {
      throw new BadRequestException({
        message: ERRORMESSAGE.USER_NOT_EXISTED,
        errorCode: ERRORCODES.USER_NOT_EXISTED,
      });
    }

    /* Not delete admin */
    if (user.role === 'admin') {
      throw new BadRequestException({
        message: ERRORMESSAGE.AUTH_NOT_DELETE_ADMIN,
        errorCode: ERRORCODES.AUTH_NOT_DELETE_ADMIN,
      });
    }

    /* Unactive employee company */
    if (user.role === 'employee') {
      const companyId: string = user.company._id.toString();
      this.companyService.softDeleteById(companyId);
    }

    /* Delete user */
    return await this.softDeleteById(userId, { deleted_by: deletedBy });
  }

  async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plain, salt);
    return hash;
  }

  async updateUserCompany(userId: string, companyInfor: Record<string, any>) {
    return await this.userRepo.updateOneById(userId, {
      company: companyInfor,
    } as any);
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
