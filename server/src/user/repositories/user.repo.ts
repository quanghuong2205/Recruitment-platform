import { BaseRepository } from 'src/core/base/repository.base';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.findOne({ email });
  }

  async findUserByEmailExcludingId(email: string, userId: string) {
    return await this.findOneExcludingId(userId, { email });
  }
}
