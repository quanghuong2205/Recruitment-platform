import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AvatarUrlDTO } from './common.dto';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  age?: number;

  @IsOptional()
  address?: string;

  @IsNotEmpty()
  role: string;

  @ValidateNested()
  @Type(() => AvatarUrlDTO)
  avatar_url?: AvatarUrlDTO;
}
