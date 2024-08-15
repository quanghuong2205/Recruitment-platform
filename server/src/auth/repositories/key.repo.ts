import { BaseRepository } from 'src/core/base/repository.base';
import { Key } from '../schemas/key.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

export class KeyRepository extends BaseRepository<Key> {
  constructor(@InjectModel(Key.name) private keyModel: Model<Key>) {
    super(keyModel);
  }

  async updateUsedTokens(
    accessToken: string,
    userId: string,
  ): Promise<unknown> {
    return await this.repo.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { $push: { used_access_token: accessToken } },
      { new: true, upsert: true },
    );
  }

  async updateRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<unknown> {
    return await this.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      {
        refresh_token: refreshToken,
      },
      { new: true, upsert: true },
    );
  }
}
