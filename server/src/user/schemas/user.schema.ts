import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { validateEmail } from 'src/utils/mongoose/validators';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    validate: validateEmail,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: ['admin', 'employer', 'employee', 'hr'],
  })
  role: string;

  @Prop({ type: Object })
  company: {
    _id: Types.ObjectId;
    email: string;
  };

  @Prop({ min: 0 })
  age: number;

  @Prop()
  address: string;

  @Prop({ type: Object })
  avatar_url: {
    public_id: string;
    original_url: string;
    resized_url: string;
  };

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ default: false })
  is_verified_email: boolean;

  @Prop({ default: false })
  is_verified_phone: boolean;

  @Prop({ type: Object })
  created_by: {
    _id: Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updated_by: {
    _id: Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deleted_by: {
    _id: Types.ObjectId;
    email: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
