import { IsEmail, IsNotEmpty } from 'class-validator';
export class UpdateCompanyDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  description: string;

  logo_url?: string;

  @IsNotEmpty()
  phone?: string;

  @IsNotEmpty()
  address?: string;

  @IsNotEmpty()
  size: string;

  @IsNotEmpty()
  taxCode?: string;

  website?: string;

  status: string;

  updatedBy?: Record<string, any>;
}
