import { IsEmail, IsNotEmpty } from 'class-validator';
export class UpdateCompanyDTO {
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

  status: string;

  updated_by?: Record<string, any>;
}
