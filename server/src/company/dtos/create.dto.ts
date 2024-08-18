import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';

class LogoUrl {
  @IsNotEmpty()
  public_id: string;

  @IsNotEmpty()
  original_url: string;

  @IsNotEmpty()
  resized_url: string;
}

export class CreateCompnayDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  description: string;

  @ValidateNested()
  @Type(() => LogoUrl)
  logo_url?: LogoUrl;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  size: string;

  @IsNotEmpty()
  tax_code: string;

  website?: string;

  created_by: Record<string, any>;
}
