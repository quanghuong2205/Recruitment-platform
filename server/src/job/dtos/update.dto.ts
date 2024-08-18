import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import {
  ContactInforDTO,
  ExperienceDTO,
  LocationDTO,
  WorkingTimeDTO,
} from './common.dto';

export class UpdateJobDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  position: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  categories: string[];

  @IsPositive()
  min_salary: number;

  @IsPositive()
  max_salary: number;

  @IsPositive()
  quantity: number;

  salary_currency?: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LocationDTO)
  @ArrayMinSize(1)
  locations: LocationDTO[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  shoule_have_skills: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  must_have_skills: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => ExperienceDTO)
  experience: ExperienceDTO;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  requirements: string;

  @IsNotEmpty()
  benefits: string;

  @IsNotEmpty()
  start_date: string;

  @IsNotEmpty()
  end_date: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ContactInforDTO)
  contact_infor: ContactInforDTO;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WorkingTimeDTO)
  working_time: WorkingTimeDTO[];
}
