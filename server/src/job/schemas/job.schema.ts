import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, trusted } from 'mongoose';
import { Types } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ _id: false })
class Location {
  @Prop({ required: true })
  province_id: number;

  @Prop([Object])
  addresses: {
    district_id: number;
    working_address: string;
  };
}

@Schema({ _id: false })
class ContactInfor {
  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [String] })
  email: string[];
}

@Schema({ _id: false })
export class WorkingTime {
  @Prop({ required: true })
  /* Thứ mấy? */
  start_date: number;

  @Prop({ required: true })
  end_date: number;

  /* Mấy giờ */
  @Prop({ required: trusted })
  start_time: string;

  @Prop({ required: true })
  end_time: string;
}

@Schema({ _id: false })
class BasedJobInfor {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  position: string;

  /* Nghành nghề */
  @Prop([String])
  categories: string[];

  @Prop({ required: true })
  min_salary: number;

  @Prop({ required: true })
  max_salary: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: 'VND' })
  salary_currency: string;

  @Prop([Location])
  locations: Location;

  @Prop({ required: true, enum: ['part-time', 'full-time'] })
  type: string;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop([String])
  shoule_have_skills: string;

  @Prop([String])
  must_have_skills: string;

  @Prop({ type: Object })
  experience: {
    min: number;
    max: number;
  };

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  requirements: string;

  @Prop({ required: true })
  benefits: string;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ required: true })
  contact_infor: ContactInfor;

  @Prop({ required: true, type: [WorkingTime] })
  working_time: WorkingTime[];
}

@Schema({ _id: false })
export class RequestForChange extends BasedJobInfor {
  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;
}

@Schema({ timestamps: true })
export class Job extends BasedJobInfor {
  @Prop({ default: null })
  request_for_change: RequestForChange;

  @Prop([Object])
  request_history: {
    data: RequestForChange;
    viewed_by: {
      _id: Types.ObjectId;
      email: string;
    };
    created_at: Date;
  };

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  company: Types.ObjectId;

  @Prop({ default: false })
  is_draft: boolean;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;

  @Prop({ default: false })
  is_active: boolean;

  @Prop({ default: false })
  is_deleted: boolean;

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

export const JobSchema = SchemaFactory.createForClass(Job);
