import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { IUser } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  hashPassword() {}

  validatePassword({ plain, hash }): boolean {
    return true;
  }

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user: IUser | null = await this.userModel
      .findOne({
        email,
      })
      .lean();
    if (!user) return null;

    const isMatched = this.validatePassword({
      plain: password,
      hash: user.password,
    });

    return isMatched ? user : null;
  }
}
