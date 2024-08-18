export class UpdateUserDTO {
  email?: string;

  password?: string;

  name?: string;

  role?: string;

  age?: number;

  address?: string;

  is_verified_email?: boolean;

  avatar_url?: Record<string, any>;

  updated_by: Record<string, any>;
}
