import { UserRepository } from './repositories/user.repo';
import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  hashPassword() {}

  validatePassword({ plain, hash }): boolean {
    return true;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ email });
    if (!user) return null;

    const isMatched = this.validatePassword({
      plain: password,
      hash: user.password,
    });

    return isMatched ? user : null;
  }
}
