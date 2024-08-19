import { Type } from 'class-transformer';
import { IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { LogoUrl } from './common.dto';

export class UpdateCompanyDTO {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @ValidateNested()
  @Type(() => LogoUrl)
  logo_url?: LogoUrl;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;

  @IsOptional()
  size: string;

  @IsOptional()
  tax_code: string;

  @IsOptional()
  website?: string;
}
