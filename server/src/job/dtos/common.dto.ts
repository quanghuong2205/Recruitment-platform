import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class LocationDTO {
  province_id: number;

  addresses?: {
    district_id: number;
    working_address: string;
  };
}

export class WorkingTimeDTO {
  @IsPositive()
  start_date: number;

  @IsPositive()
  end_date: number;

  @IsString()
  @IsNotEmpty()
  start_time: string;

  @IsString()
  @IsNotEmpty()
  end_time: string;
}

export class ExperienceDTO {
  @Min(0)
  min: number;

  @Min(0)
  max: number;
}

export class ContactInforDTO {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsEmail({}, { each: true })
  email: string[];
}
