import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';

class Company {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  name?: string;

  role: string;

  age?: number;

  address?: string;

  avatar?: string;

  @ValidateNested()
  @Type(() => Company)
  company?: Company;

  createdBy?: Record<string, any>;
}
