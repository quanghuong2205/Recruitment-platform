import { IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { AvatarUrlDTO } from './common.dto';
import { Type } from 'class-transformer';

export class UpdateUserDTO {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsPositive()
  age?: number;

  @IsOptional()
  address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AvatarUrlDTO)
  avatar_url?: AvatarUrlDTO;
}
