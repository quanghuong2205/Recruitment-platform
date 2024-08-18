import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  name?: string;

  role: string;

  age?: number;

  address?: string;

  avatar_url?: Record<string, any>;

  created_by?: Record<string, any>;
}
