import { BaseRepository } from 'src/core/base/repository.base';
import { Key } from '../schemas/key.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createObjectId } from 'src/utils/mongoose/createObjectId';

export class KeyRepository extends BaseRepository<Key> {
  constructor(@InjectModel(Key.name) private keyModel: Model<Key>) {
    super(keyModel);
  }

  async updateRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<unknown> {
    return await this.updateOne(
      { _id: new Types.ObjectId(userId) },
      {
        user_id: createObjectId(userId),
        refresh_token: refreshToken,
      },
      [],
      [],
      { new: true, upsert: true },
    );
  }
}
