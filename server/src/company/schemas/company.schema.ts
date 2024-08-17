import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ id: false })
class BasedCompanyInfor {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  description: string;

  @Prop()
  logo_url: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  taxCode: string;

  @Prop()
  website: string;
}

export class RequestForChange extends BasedCompanyInfor {
  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;
}

@Schema({ timestamps: true })
export class Company extends BasedCompanyInfor {
  @Prop({ default: null })
  requestForChange: RequestForChange;

  @Prop([Object])
  requestHistory: {
    data: RequestForChange;
    viewedBy: {
      _id: Types.ObjectId;
      email: string;
    };
  };

  @Prop({ type: Object })
  createdBy: {
    _id: Types.ObjectId;
    email: string;
  };

  updatedBy: {
    _id: Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: Types.ObjectId;
    email: string;
  };
}

export const CompanySchema = SchemaFactory.createForClass(Company);
