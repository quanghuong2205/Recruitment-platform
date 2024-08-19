import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { LogoUrl } from './common.dto';

export class CreateCompnayDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
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
}
