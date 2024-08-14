import { UserRepository } from './repositories/user.repo';
import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plain, salt);
    return hash;
  }

  async validatePassword({ plain, hash }): Promise<boolean> {
    const isMatch = await bcrypt.compare(plain, hash);
    return isMatch;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ email });
    if (!user) return null;

    const isMatched = await this.validatePassword({
      plain: password,
      hash: user.password,
    });

    return isMatched ? user : null;
  }
}
