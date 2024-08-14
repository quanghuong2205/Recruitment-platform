import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type KeyDocument = HydratedDocument<Key>;

@Schema()
export class Key {
  @Prop({ isRequired: true })
  user_id: Types.ObjectId;

  @Prop({ default: [] })
  used_access_token: string[];

  @Prop({ required: true })
  refresh_token: string;
}

export const KeySchema = SchemaFactory.createForClass(Key);
