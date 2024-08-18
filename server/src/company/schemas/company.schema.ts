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

  @Prop({ type: Object })
  logo_url: {
    public_id: string;
    original_url: string;
    resized_url: string;
  };

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  tax_code: string;

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
  request_for_change: RequestForChange;

  @Prop([Object])
  request_history: {
    data: RequestForChange;
    viewed_by: {
      _id: Types.ObjectId;
      email: string;
    };
  };

  @Prop({ type: Object })
  created_by: {
    _id: Types.ObjectId;
    email: string;
  };

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

export const CompanySchema = SchemaFactory.createForClass(Company);
