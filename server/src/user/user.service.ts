import { UserRepository } from './repositories/user.repo';
import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import bcrypt from 'bcrypt';
import { BaseCRUDService } from 'src/core/base/crudservice.base';
import { CreateUserDTO } from './dtos/create.dto';
import { UpdateUserDTO } from './dtos/update';

@Injectable()
export class UserService extends BaseCRUDService<
  User,
  CreateUserDTO,
  UpdateUserDTO
> {
  constructor(private userRepo: UserRepository) {
    super(userRepo, 'user');
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
