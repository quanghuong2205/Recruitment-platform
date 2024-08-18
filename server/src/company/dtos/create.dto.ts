import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompnayDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  description: string;

  logo_url?: Record<string, any>;

  @IsNotEmpty()
  phone?: string;

  @IsNotEmpty()
  address?: string;

  @IsNotEmpty()
  size: string;

  @IsNotEmpty()
  tax_code?: string;

  website?: string;

  created_by: Record<string, any>;
}
