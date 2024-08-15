import { Types } from 'mongoose';

export const createObjectId = (id: string) => {
  return new Types.ObjectId(id);
};
