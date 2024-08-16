export class UpdateUserDTO {
  email?: string;

  password?: string;

  name?: string;

  role?: string;

  age?: number;

  address?: string;

  avatar?: string;

  isVerifiedEmail?: boolean;

  updatedBy: Record<string, any>;
}
